import "server-only";
import { isIP } from "node:net";
import { headers } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Administratoriaus slaptažodžio ir kodo tikrinimas, bendras prisijungimui
 * (`admin/login/actions.ts`) ir slaptažodžio keitimui (`admin/password`).
 * Kodėl viskas vyksta serveryje ir kodėl adresas atsitiktinis – žr.
 * `admin/login/actions.ts` antraštę. Čia – tik tai, kas abiem bendra: kiekvienas
 * bandymas pirma suskaičiuojamas `admin_login_begin`, o slaptažodžio sesija
 * naršyklės nepasiekia.
 */

export const ADMIN_USERNAME = /^admin\.[a-z0-9._]{2,24}$/;
export const TOTP_CODE = /^\d{6}$/;
export const MAX_PASSWORD_LENGTH = 1024;

export const UNAVAILABLE = "Prisijungimas laikinai nepasiekiamas. Bandykite po minutės.";
export const CAPTCHA_FAILED =
  "Patikra, kad nesate robotas, nepavyko. Palaukite, kol ji vėl pasirodys, ir bandykite dar kartą.";

export type Failure = { ok: false; error: string };

export type Gate =
  | { allowed: true; attemptId: number; email: string | null }
  | { allowed: false; retryAfter: number };

type Outcome = "ok" | "fail" | "error";

export type Db = ReturnType<typeof createSupabaseAdminClient>;

/*
 * Cloudflare Turnstile (developeris 2026-10-16). Įjungus Supabase Auth CAPTCHA,
 * `signInWithPassword` be žetono atsako `captcha_failed`. Netinkamas (ne
 * eilutė, per ilgas) neperduodamas visai.
 */
export const captchaOrUndefined = (token: unknown) =>
  typeof token === "string" && token.length > 0 && token.length <= 2048 ? token : undefined;

export function locked(seconds: number): Failure {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return { ok: false, error: `Per daug bandymų. Bandykite po ${minutes} min.` };
}

export function normaliseName(raw: unknown): string {
  // Slaptažodžių tvarkyklė gali įrašyti visą adresą — domeną nuimame, o ne
  // atmetame žmogų, kuris įvedė teisingą dalyką.
  return String(raw ?? "").trim().toLowerCase().replace(/@gloumi\.lt$/, "");
}

export async function clientIp(): Promise<string | null> {
  const h = await headers();
  const raw = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? "";
  const ip = raw.trim();
  // `isIP`, ne reguliarioji išraiška: netinkamas adresas `inet` tipui numestų
  // visą RPC, ir prisijungimas lūžtų dėl antraštės, kurios žmogus nemato.
  return isIP(ip) ? ip : null;
}

export async function begin(db: Db, name: string, ip: string | null, stage: "password" | "totp"): Promise<Gate> {
  const { data, error } = await db.rpc("admin_login_begin", {
    _username: name,
    _ip: ip,
    _stage: stage,
  });
  if (error || !data) throw new Error(`admin_login_begin: ${error?.message ?? "no data"}`);
  if (!data.allowed) return { allowed: false, retryAfter: Number(data.retry_after) || 3600 };
  return { allowed: true, attemptId: Number(data.attempt_id), email: data.email ?? null };
}

export async function finish(db: Db, attemptId: number, outcome: Outcome) {
  const { error } = await db.rpc("admin_login_finish", { _attempt_id: attemptId, _outcome: outcome });
  // Neišmetama: bandymas jau atliktas, ir žmogui rezultatą parodyti svarbiau
  // nei nukristi dėl žurnalo. Bet tylėti irgi negalima — be šios eilutės
  // neįrašyta klaida atrodytų kaip bandymas, kurio nebuvo.
  if (error) console.error("admin_login_finish:", error.message);
}

// 429 ir 5xx reiškia, kad Supabase slaptažodžio ar kodo net nepatikrino.
// Toks bandymas neskaičiuojamas, kitaip Supabase apkrova užrakintų žmogų.
export function unchecked(status: number | undefined): boolean {
  return status === 429 || (status ?? 500) >= 500;
}

export function freshAuthClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  );
}

export async function revoke(auth: SupabaseClient) {
  await auth.auth.signOut({ scope: "local" }).catch(() => undefined);
}

/**
 * Slaptažodis per skaitiklį: suskaičiuojama, tada tikrinama Supabase. Pavykus
 * grąžinamas šviežias, tik šiame serveryje gyvas `aal1` klientas – jį
 * kviečiantysis turi atšaukti (`revoke`) arba perduoti. `wrong` – ką sakyti
 * neteisingam slaptažodžiui (prisijungime vardo ir slaptažodžio neatskiriame).
 */
export async function passwordStep(
  db: Db,
  name: string,
  password: string,
  ip: string | null,
  captchaToken: string | undefined,
  wrong: string,
): Promise<{ ok: true; auth: SupabaseClient } | Failure> {
  const gate = await begin(db, name, ip, "password");
  if (!gate.allowed) return locked(gate.retryAfter);

  if (!gate.email) {
    await finish(db, gate.attemptId, "fail");
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 250));
    return { ok: false, error: wrong };
  }

  const auth = freshAuthClient();
  const { error } = await auth.auth.signInWithPassword({
    email: gate.email,
    password,
    options: captchaToken ? { captchaToken } : undefined,
  });
  if (error) {
    // CAPTCHA nepraėjo: slaptažodis nepatikrintas, tad ir bandymas neskaičiuojamas.
    if (error.code === "captcha_failed") {
      await finish(db, gate.attemptId, "error");
      return { ok: false, error: CAPTCHA_FAILED };
    }
    const skip = unchecked(error.status);
    await finish(db, gate.attemptId, skip ? "error" : "fail");
    return { ok: false, error: skip ? UNAVAILABLE : wrong };
  }

  await finish(db, gate.attemptId, "ok");
  return { ok: true, auth };
}
