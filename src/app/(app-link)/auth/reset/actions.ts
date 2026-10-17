"use server";

import { createClient } from "@supabase/supabase-js";
import { isStrongPassword } from "./password";

export type ResetResult = "done" | "expired" | "weak" | "same" | "failed";

/** Supabase's `token_hash`: letters, digits, `-` and `_`; nothing else is sent on. */
const TOKEN_HASH = /^[A-Za-z0-9_-]{20,200}$/;
/** GoTrue refuses longer ones anyway; a cap keeps a huge body from reaching it. */
const MAX_PASSWORD = 72;

/*
 * Sets a new password from the recovery email (db `office/db-email-report`:
 * the template links to /auth/reset#token_hash=…&type=recovery).
 *
 * One POST from the button, never on opening the page (mail scanners open
 * links): verifyOtp with type "recovery" – fixed here, never taken from the
 * link – then updateUser({ password }) in that fresh session, then the
 * session is revoked (`scope: "local"`, this one only). A client that keeps
 * nothing: no cookies on gloumi.lt, no storage, nothing handed to the app.
 * The token arrives in the request body and is never logged; neither is
 * the password. Only GoTrue's error code is.
 */
export async function resetPassword(tokenHash: unknown, password: unknown): Promise<ResetResult> {
  if (typeof tokenHash !== "string" || !TOKEN_HASH.test(tokenHash)) return "expired";
  if (typeof password !== "string" || password.length > MAX_PASSWORD || !isStrongPassword(password)) return "weak";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "failed";

  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  try {
    const { data, error } = await db.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error || !data.session) {
      const expired = !error || error.code === "otp_expired" || error.status === 403 || error.status === 400;
      if (!expired) console.warn("[reset-password] verify", error?.code ?? error?.status ?? "error");
      return expired ? "expired" : "failed";
    }

    const { error: updateError } = await db.auth.updateUser({ password });
    if (updateError) {
      if (updateError.code === "weak_password") return "weak";
      if (updateError.code === "same_password") return "same";
      console.warn("[reset-password] update", updateError.code ?? updateError.status ?? "error");
      return "failed";
    }
    return "done";
  } catch {
    console.warn("[reset-password]", "exception");
    return "failed";
  } finally {
    await db.auth.signOut({ scope: "local" }).catch(() => undefined);
  }
}
