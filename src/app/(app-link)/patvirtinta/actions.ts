"use server";

import { createClient } from "@supabase/supabase-js";

export type ConfirmResult = "confirmed" | "expired" | "failed";

/** Supabase's `token_hash`: hex today; letters, digits, `-` and `_` allowed, nothing else is sent on. */
const TOKEN_HASH = /^[A-Za-z0-9_-]{20,200}$/;

/*
 * Confirms the address the email was sent to (db `office/db-signup-code`:
 * the template links to /patvirtinta with `token_hash`, type `email`).
 *
 * Called only from the button (a POST), never on opening the page: mail
 * scanners open links on their own and would use the token up (security).
 * The token arrives in the request body, not the address, and is never
 * logged – only GoTrue's error code is.
 *
 * The publishable key, a client that keeps nothing: no cookies, no storage,
 * no refresh. verifyOtp also signs the person in; that session is revoked at
 * once (`scope: "local"` – this one only, not their app's) and never reaches
 * the browser or the app (security).
 */
/*
 * The kinds this page verifies (db `office/db-email-links`): sign-up ("email")
 * and an email change ("email_change"). A whitelist checked here, on the
 * server – whatever else the link says is refused. A magic link is never
 * verified on the site: it signs in, and there is nothing to sign in to here
 * (the page tells the person to open it in the app instead).
 */
const VERIFIABLE = new Set(["email", "email_change"]);
export type ConfirmKind = "email" | "email_change";

export async function confirmEmail(tokenHash: unknown, kind: unknown = "email"): Promise<ConfirmResult> {
  if (typeof tokenHash !== "string" || !TOKEN_HASH.test(tokenHash)) return "expired";
  if (typeof kind !== "string" || !VERIFIABLE.has(kind)) return "expired";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "failed";

  try {
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await db.auth.verifyOtp({ token_hash: tokenHash, type: kind as ConfirmKind });
    if (error) {
      // otp_expired / 403: expired or already used – GoTrue does not tell the two apart.
      const expired = error.code === "otp_expired" || error.status === 403 || error.status === 400;
      if (!expired) console.warn("[confirm-email]", error.code ?? error.status ?? "error");
      return expired ? "expired" : "failed";
    }
    if (data.session) await db.auth.signOut({ scope: "local" }).catch(() => undefined);
    return "confirmed";
  } catch {
    console.warn("[confirm-email]", "exception");
    return "failed";
  }
}
