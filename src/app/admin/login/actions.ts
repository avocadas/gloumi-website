"use server";

import { isIP } from "node:net";
import { headers } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Admin sign-in, done entirely on this server (#105, 20260930210151).
 *
 * WHY NOT IN THE BROWSER ANY MORE
 * -------------------------------
 * Supabase Auth accepts a password from anybody holding the public anon key
 * and an address, and the admin address pattern is in this public
 * repository. A limit in the form would have protected nothing, because an
 * attacker would never use the form. So an admin's address is random
 * (`admin_register`), known to nobody, the admin included, and only this
 * file turns a name into it. With no address to aim at, Supabase Auth
 * cannot be attacked directly, and every attempt has to come through here,
 * where `admin_login_begin` counts it first.
 *
 * WHY THE PASSWORD-ONLY SESSION NEVER LEAVES THIS SERVER
 * ------------------------------------------------------
 * If the browser held the aal1 session between the two steps, anyone who had
 * the password could take its tokens and try TOTP codes against Supabase
 * directly, outside any counter. So each step signs in again with the
 * password, uses the session for exactly one thing and revokes it; the only
 * session a browser ever receives is the aal2 one, after the code. The
 * password stays in the form's memory between the steps and is sent to this
 * server twice, over the same HTTPS as once.
 *
 * WHY AN UNKNOWN NAME NEVER REACHES SUPABASE AUTH
 * -----------------------------------------------
 * Supabase limits sign-ins per IP, and every call from here comes from this
 * server's IP. Spraying unknown names from many addresses would use up that
 * limit for all three admins at once. An unknown name is therefore answered
 * here, after a short pause, and still counted against the caller's IP.
 * Admin names are not a secret to begin with; the password and the code are.
 */

const ADMIN_USERNAME = /^admin\.[a-z0-9._]{2,24}$/;
const TOTP_CODE = /^\d{6}$/;
const MAX_PASSWORD_LENGTH = 1024;

const WRONG_PASSWORD = "Neteisingas vardas arba slaptažodis.";
const WRONG_CODE = "Neteisingas kodas.";
const START_OVER = "Pradėkite iš naujo.";
const UNAVAILABLE = "Prisijungimas laikinai nepasiekiamas. Bandykite po minutės.";

type Failure = { ok: false; error: string };

export type StartResult =
  | { ok: true; next: "code" }
  | { ok: true; next: "enroll"; factorId: string; qr: string; secret: string }
  | Failure;

export type FinishResult = { ok: true } | Failure;

type Gate =
  | { allowed: true; attemptId: number; email: string | null }
  | { allowed: false; retryAfter: number };

type Outcome = "ok" | "fail" | "error";

type Db = ReturnType<typeof createSupabaseAdminClient>;

function locked(seconds: number): Failure {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return { ok: false, error: `Per daug bandymų. Bandykite po ${minutes} min.` };
}

function normaliseName(raw: unknown): string {
  // Slaptažodžių tvarkyklė gali įrašyti visą adresą — domeną nuimame, o ne
  // atmetame žmogų, kuris įvedė teisingą dalyką.
  return String(raw ?? "").trim().toLowerCase().replace(/@gloumi\.lt$/, "");
}

async function clientIp(): Promise<string | null> {
  const h = await headers();
  const raw = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0] ?? "";
  const ip = raw.trim();
  // `isIP`, ne reguliarioji išraiška: netinkamas adresas `inet` tipui numestų
  // visą RPC, ir prisijungimas lūžtų dėl antraštės, kurios žmogus nemato.
  return isIP(ip) ? ip : null;
}

async function begin(db: Db, name: string, ip: string | null, stage: "password" | "totp"): Promise<Gate> {
  const { data, error } = await db.rpc("admin_login_begin", {
    _username: name,
    _ip: ip,
    _stage: stage,
  });
  if (error || !data) throw new Error(`admin_login_begin: ${error?.message ?? "no data"}`);
  if (!data.allowed) return { allowed: false, retryAfter: Number(data.retry_after) || 3600 };
  return { allowed: true, attemptId: Number(data.attempt_id), email: data.email ?? null };
}

async function finish(db: Db, attemptId: number, outcome: Outcome) {
  const { error } = await db.rpc("admin_login_finish", { _attempt_id: attemptId, _outcome: outcome });
  // Neišmetama: bandymas jau atliktas, ir žmogui rezultatą parodyti svarbiau
  // nei nukristi dėl žurnalo. Bet tylėti irgi negalima — be šios eilutės
  // neįrašyta klaida atrodytų kaip bandymas, kurio nebuvo.
  if (error) console.error("admin_login_finish:", error.message);
}

// 429 ir 5xx reiškia, kad Supabase slaptažodžio ar kodo net nepatikrino.
// Toks bandymas neskaičiuojamas, kitaip Supabase apkrova užrakintų žmogų.
function unchecked(status: number | undefined): boolean {
  return status === 429 || (status ?? 500) >= 500;
}

function freshAuthClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  );
}

async function revoke(auth: SupabaseClient) {
  await auth.auth.signOut({ scope: "local" }).catch(() => undefined);
}

async function passwordStep(
  db: Db,
  name: string,
  password: string,
  ip: string | null,
): Promise<{ ok: true; auth: SupabaseClient } | Failure> {
  const gate = await begin(db, name, ip, "password");
  if (!gate.allowed) return locked(gate.retryAfter);

  if (!gate.email) {
    await finish(db, gate.attemptId, "fail");
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 250));
    return { ok: false, error: WRONG_PASSWORD };
  }

  const auth = freshAuthClient();
  const { error } = await auth.auth.signInWithPassword({ email: gate.email, password });
  if (error) {
    const skip = unchecked(error.status);
    await finish(db, gate.attemptId, skip ? "error" : "fail");
    return { ok: false, error: skip ? UNAVAILABLE : WRONG_PASSWORD };
  }

  await finish(db, gate.attemptId, "ok");
  return { ok: true, auth };
}

function validInput(name: string, password: unknown): password is string {
  return (
    ADMIN_USERNAME.test(name) &&
    typeof password === "string" &&
    password.length > 0 &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

/** Pirmas žingsnis: slaptažodis. Grąžina, ar reikia kodo, ar įjungti antrą veiksnį. */
export async function startAdminLogin(username: string, password: string): Promise<StartResult> {
  const name = normaliseName(username);
  if (!validInput(name, password)) return { ok: false, error: WRONG_PASSWORD };

  try {
    const db = createSupabaseAdminClient();
    const step = await passwordStep(db, name, password, await clientIp());
    if (!step.ok) return step;

    const { auth } = step;
    try {
      const { data: factors, error: listError } = await auth.auth.mfa.listFactors();
      if (listError || !factors) return { ok: false, error: UNAVAILABLE };

      if (factors.totp.length > 0) return { ok: true, next: "code" };

      /*
       * Nebaigti įsijungimai (QR nuskenuotas, langas uždarytas) nieko
       * neatrakina, bet Supabase jų laiko ribotą skaičių, ir juos pasiekus
       * įjungti antro veiksnio nebeleistų. Todėl prieš naują — senieji
       * išvalomi.
       */
      for (const factor of factors.all) {
        if (factor.status === "unverified") {
          await auth.auth.mfa.unenroll({ factorId: factor.id }).catch(() => undefined);
        }
      }

      const { data: enrolled, error: enrollError } = await auth.auth.mfa.enroll({
        factorType: "totp",
        // Be `issuer` Supabase ima Site URL domeną, o jis `gloumi://` — be
        // domeno. Išmatuota 2026-09-30: 500 „Issuer must be set".
        issuer: "Gloumi",
        friendlyName: `Gloumi admin ${new Date().toISOString().slice(0, 16)}`,
      });
      if (enrollError || !enrolled) return { ok: false, error: UNAVAILABLE };

      return {
        ok: true,
        next: "enroll",
        factorId: enrolled.id,
        qr: enrolled.totp.qr_code,
        secret: enrolled.totp.secret,
      };
    } finally {
      await revoke(auth);
    }
  } catch (e) {
    console.error("startAdminLogin:", e instanceof Error ? e.message : e);
    return { ok: false, error: UNAVAILABLE };
  }
}

/** Antras žingsnis: slaptažodis dar kartą ir kodas. Tik čia naršyklė gauna sesiją. */
export async function finishAdminLogin(
  username: string,
  password: string,
  code: string,
  factorId: string | null,
): Promise<FinishResult> {
  const name = normaliseName(username);
  if (!validInput(name, password)) return { ok: false, error: WRONG_PASSWORD };
  if (typeof code !== "string" || !TOTP_CODE.test(code.trim())) return { ok: false, error: WRONG_CODE };

  try {
    const db = createSupabaseAdminClient();
    const ip = await clientIp();
    const step = await passwordStep(db, name, password, ip);
    if (!step.ok) return step;

    const { auth } = step;
    let handedOver = false;
    try {
      const { data: factors, error: listError } = await auth.auth.mfa.listFactors();
      if (listError || !factors) return { ok: false, error: UNAVAILABLE };

      // Įsijungiant ką tik sukurtas faktorius dar nepatvirtintas, tad jo ieškoma
      // tarp visų; kitu atveju imamas patvirtintas.
      const factor = factorId
        ? factors.all.find((f) => f.id === factorId && f.factor_type === "totp")
        : factors.totp[0];
      if (!factor) return { ok: false, error: START_OVER };

      const gate = await begin(db, name, ip, "totp");
      if (!gate.allowed) return locked(gate.retryAfter);

      const { error: verifyError } = await auth.auth.mfa.challengeAndVerify({
        factorId: factor.id,
        code: code.trim(),
      });
      if (verifyError) {
        const skip = unchecked(verifyError.status);
        await finish(db, gate.attemptId, skip ? "error" : "fail");
        return { ok: false, error: skip ? UNAVAILABLE : WRONG_CODE };
      }
      await finish(db, gate.attemptId, "ok");

      const {
        data: { session },
      } = await auth.auth.getSession();
      if (!session) return { ok: false, error: UNAVAILABLE };

      const cookieClient = await createSupabaseServerClient();
      const { error: setError } = await cookieClient.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      if (setError) return { ok: false, error: UNAVAILABLE };

      handedOver = true;
      return { ok: true };
    } finally {
      // Perduota sesija lieka gyva — ji dabar naršyklės slapukuose. Visos kitos
      // atšaukiamos, kad slaptažodžio sesija nepergyventų šio kvietimo.
      if (!handedOver) await revoke(auth);
    }
  } catch (e) {
    console.error("finishAdminLogin:", e instanceof Error ? e.message : e);
    return { ok: false, error: UNAVAILABLE };
  }
}
