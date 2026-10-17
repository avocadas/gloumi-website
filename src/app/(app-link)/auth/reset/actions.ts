"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { seal, unseal } from "@/lib/sealed-step";
import { isStrongPassword } from "./password";

/**
 * - `done` – changed, every session of the account signed out;
 * - `need_code` – the account has a verified TOTP factor: ask for the code;
 * - `bad_code` – the code did not match, try again with the same step;
 * - `weak` / `pwned` / `same` – GoTrue refused the password; try another
 *   with the same step (the link itself is already used);
 * - `expired` – the link (or the step) no longer works;
 * - `failed` – anything else.
 */
export type ResetResult = "done" | "need_code" | "bad_code" | "weak" | "pwned" | "same" | "expired" | "failed";
export type ResetAnswer = { result: ResetResult; step?: string };

/** Supabase's `token_hash`: letters, digits, `-` and `_`; nothing else is sent on. */
const TOKEN_HASH = /^[A-Za-z0-9_-]{20,200}$/;
const TOTP_CODE = /^\d{6}$/;
/** bcrypt's limit is 72 BYTES, not characters: Lithuanian letters take two each in UTF-8 (security). */
const MAX_PASSWORD_BYTES = 72;
const STEP_PURPOSE = "reset";
const tooLong = (password: string) => Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES;
/** How long the sealed step lives: long enough to type a code or a new password. */
const STEP_SECONDS = 300;

type Step = { a: string; r: string; f: string | null };

function freshClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

/** GoTrue's refusal of the new password, by code (security: show the reason by code). */
function passwordRefusal(error: { code?: string; reasons?: unknown }): ResetResult {
  if (error.code === "same_password") return "same";
  if (error.code === "weak_password") {
    const reasons = Array.isArray(error.reasons) ? error.reasons : [];
    return reasons.includes("pwned") ? "pwned" : "weak";
  }
  if (error.code === "insufficient_aal") return "need_code";
  return "failed";
}

/*
 * Sets the password in a session that already passed the link (and the
 * second factor, if any). Success signs out every session of the account
 * (`scope: "global"`, security); a refusal keeps the step for another try.
 */
async function setPassword(db: SupabaseClient, password: string, step: string): Promise<ResetAnswer> {
  const { error } = await db.auth.updateUser({ password });
  if (error) {
    const result = passwordRefusal(error as { code?: string; reasons?: unknown });
    if (result === "failed") console.warn("[reset-password] update", error.code ?? error.status ?? "error");
    return { result, step };
  }
  await db.auth.signOut({ scope: "global" }).catch(() => undefined);
  return { result: "done" };
}

/*
 * First POST, from the button – never on opening the page (mail scanners).
 * Recovery email (db `office/db-email-report`): /auth/reset#token_hash=…
 *
 * verifyOtp with type "recovery" (fixed here, never from the link). The
 * link is single-use, so the session it opens is sealed (`sealed-step.ts`)
 * and handed to the browser as an opaque, five-minute step: with it the
 * person can enter a TOTP code or another password without a new link, and
 * the browser can neither read nor use it. No cookies, no storage, nothing
 * to the app; the token, the password and the code are never logged.
 */
/** Recovery or an invitation (db `office/db-email-links`) – a whitelist checked here, never taken as is from the link. */
const RESET_KINDS = new Set(["recovery", "invite"]);
export type ResetKind = "recovery" | "invite";

export async function resetPassword(tokenHash: unknown, password: unknown, kind: unknown = "recovery"): Promise<ResetAnswer> {
  if (typeof tokenHash !== "string" || !TOKEN_HASH.test(tokenHash)) return { result: "expired" };
  if (typeof kind !== "string" || !RESET_KINDS.has(kind)) return { result: "expired" };
  if (typeof password !== "string" || tooLong(password) || !isStrongPassword(password)) return { result: "weak" };
  const db = freshClient();
  if (!db) return { result: "failed" };

  try {
    const { data, error } = await db.auth.verifyOtp({ token_hash: tokenHash, type: kind as ResetKind });
    if (error || !data.session) {
      const expired = !error || error.code === "otp_expired" || error.status === 403 || error.status === 400;
      if (!expired) console.warn("[reset-password] verify", error?.code ?? error?.status ?? "error");
      return { result: expired ? "expired" : "failed" };
    }

    const { data: factors } = await db.auth.mfa.listFactors();
    const totp = factors?.totp?.find((f) => f.status === "verified") ?? null;
    const step = seal(STEP_PURPOSE, { a: data.session.access_token, r: data.session.refresh_token, f: totp?.id ?? null }, STEP_SECONDS);
    if (!step) return { result: "failed" };
    if (totp) return { result: "need_code", step };
    return await setPassword(db, password, step);
  } catch {
    console.warn("[reset-password]", "exception");
    return { result: "failed" };
  }
}

/*
 * Second POST: the sealed step with the TOTP code (challengeAndVerify lifts
 * the session to aal2, which updateUser then needs) and/or another password.
 */
export async function finishReset(step: unknown, password: unknown, code: unknown): Promise<ResetAnswer> {
  const opened = unseal<Step>(STEP_PURPOSE, step);
  if (!opened || typeof opened.a !== "string" || typeof opened.r !== "string") return { result: "expired" };
  if (typeof password !== "string" || tooLong(password) || !isStrongPassword(password)) {
    return { result: "weak", step: step as string };
  }
  const db = freshClient();
  if (!db) return { result: "failed", step: step as string };

  try {
    const { error: sessionError } = await db.auth.setSession({ access_token: opened.a, refresh_token: opened.r });
    if (sessionError) return { result: "expired" };

    if (opened.f) {
      if (typeof code !== "string" || !TOTP_CODE.test(code)) return { result: "bad_code", step: step as string };
      const { error: mfaError } = await db.auth.mfa.challengeAndVerify({ factorId: opened.f, code });
      if (mfaError) {
        if (mfaError.code !== "mfa_verification_failed") console.warn("[reset-password] mfa", mfaError.code ?? "error");
        return { result: mfaError.code === "mfa_verification_failed" ? "bad_code" : "failed", step: step as string };
      }
    }
    return await setPassword(db, password, step as string);
  } catch {
    console.warn("[reset-password]", "exception");
    return { result: "failed", step: step as string };
  }
}
