import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { site } from "@/content/site";

/*
 * Laiškas moderatoriui apie naują pranešimą apie turinį (Gloumi #170 4 p.).
 *
 * Kviečia ne naršyklė, o duomenų bazė: `content_reports` AFTER INSERT trigeris
 * per `pg_net` siunčia čia POST su paslaptimi antraštėje `x-gloumi-hook-secret`
 * (Vercel `REPORT_HOOK_SECRET`, bazėje — Vault). Be teisingos paslapties
 * atsakymas 401, ir laiškas nesiunčiamas: kitaip bet kas galėtų siuntinėti
 * laiškus mūsų vardu ir išnaudoti Resend dienos ribą.
 *
 * Laiške — tik tai, kad pranešimas yra, jo priežastis, kam jis skirtas ir
 * nuoroda į portalą (developeris 2026-10-04). Turinio, vardų ir ID nėra
 * tyčia: laiškas keliauja per pašto tiekėjus ir gyvena pašto dėžutėje, o
 * portalas saugomas antru veiksniu. Todėl iš kūno imami tik du kodai; žinomi
 * verčiami į lietuviškus pavadinimus, o nauji (pvz. #170 1 ir 3 p. priežastys)
 * rodomi tokie, kokie atėjo — tik jei tai mažosios raidės ir pabraukimai.
 */

/** Tie patys pavadinimai, kaip programėlėje (`translations.js` `reportReason*`). */
const REASON_LABEL: Record<string, string> = {
  spam: "Šlamštas arba reklama",
  harassment: "Priekabiavimas arba grasinimai",
  inappropriate: "Netinkamas turinys",
  impersonation: "Apsimetama kitu žmogumi",
  copyright: "Autorių teisių pažeidimas",
  other: "Kita",
};

/** Kaip portale (`ReportCard.tsx` `TARGET_LABEL`); `review` — #170 2 p. leis pranešti ir apie atsiliepimus. */
const TARGET_LABEL: Record<string, string> = {
  post: "įrašas",
  comment: "komentaras",
  story: "Story",
  message: "žinutė",
  profile: "profilis",
  review: "atsiliepimas",
};

/** Kodas, kurį galima saugiai parodyti: tik mažosios raidės ir pabraukimai, iki 40 ženklų. */
const code = (value: unknown): string | null =>
  typeof value === "string" && /^[a-z_]{1,40}$/.test(value) ? value : null;

function authorised(request: Request, secret: string): boolean {
  const given = Buffer.from(request.headers.get("x-gloumi-hook-secret") ?? "");
  const expected = Buffer.from(secret);
  // Ilgis išduoda tik ilgį; turinys lyginamas pastoviu laiku.
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = process.env.REPORT_HOOK_SECRET?.trim();
  if (!secret) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (!authorised(request, secret)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await request.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const reasonCode = code(body.reason);
  const targetCode = code(body.target_type);
  const reason = reasonCode ? (REASON_LABEL[reasonCode] ?? reasonCode) : "nenurodyta";
  const target = targetCode ? (TARGET_LABEL[targetCode] ?? targetCode) : "turinys";
  const portal = `${site.url}/admin`;

  const text = [
    "Gautas naujas pranešimas apie turinį.",
    "",
    `Priežastis: ${reason}`,
    `Kam: ${target}`,
    "",
    `Peržiūrėti ir nuspręsti: ${portal}`,
    "",
    "Turinio ir vardų šiame laiške nėra tyčia – jie matomi tik portale.",
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[report-hook] no RESEND_API_KEY – would send:\n" + text);
      return NextResponse.json({ ok: true, delivered: [] });
    }
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Gloumi <no-reply@${site.sendingDomain}>`,
      to: [process.env.MODERATION_ALERT_TO?.trim() || site.email],
      subject: `Naujas pranešimas apie turinį: ${reason}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[report-hook] resend answered", res.status);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: ["email"] });
}
