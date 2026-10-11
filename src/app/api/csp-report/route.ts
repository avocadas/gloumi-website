import { NextResponse } from "next/server";
import { cspViolations } from "@/lib/csp-report";

export const runtime = "nodejs";

/**
 * Portalo CSP pažeidimų ataskaitos (`src/lib/csp.ts`, Gloumi SECURITY_AUDIT L-10).
 *
 * Kol politika tik praneša, šis žurnalas yra vienintelis būdas pamatyti, ką ji
 * užblokuotų tikram administratoriui, prieš ją įjungiant. Eilutė `csp_report`
 * – Vercel runtime žurnale.
 *
 * Taškas viešas ir be sesijos: naršyklė ataskaitas siunčia pati, ir jos ateina
 * ir iš prisijungimo puslapio. Todėl kūnas ribojamas, iš vieno kvietimo
 * rašoma ne daugiau kaip 10 eilučių, o vienai instancijai – ne daugiau kaip
 * 200 per minutę, kad svetimas siuntėjas negalėtų užtvindyti žurnalo.
 */
const MAX_BODY = 16 * 1024;
const MAX_PER_REQUEST = 10;
const MAX_PER_MINUTE = 200;
const TYPES = new Set(["application/csp-report", "application/reports+json", "application/json"]);

let windowStart = 0;
let loggedInWindow = 0;

function budget(wanted: number): number {
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    loggedInWindow = 0;
  }
  const allowed = Math.max(0, Math.min(wanted, MAX_PER_MINUTE - loggedInWindow));
  loggedInWindow += allowed;
  return allowed;
}

/** `null`, kai kūnas didesnis už ribą: skaitymas nutraukiamas, o ne baigiamas. */
async function readCapped(request: Request, limit: number): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? "0") > limit) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function POST(request: Request) {
  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!TYPES.has(type)) return new NextResponse(null, { status: 415 });

  const text = await readCapped(request, MAX_BODY);
  if (text === null) return new NextResponse(null, { status: 413 });

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const violations = cspViolations(payload, MAX_PER_REQUEST);
  for (const v of violations.slice(0, budget(violations.length))) {
    console.log(`csp_report ${JSON.stringify(v)}`);
  }
  return new NextResponse(null, { status: 204 });
}
