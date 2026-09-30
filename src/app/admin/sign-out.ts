"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Sign out of the portal on this device (#129).
 *
 * WHY THIS ONE DOES NOT CALL checkAdmin
 * -------------------------------------
 * Every action in ./actions.ts re-checks the caller because it changes
 * somebody else's data. This one only ends the caller's own session, which
 * whoever holds it may do. An expired or password-only session has to be
 * endable too, and those are exactly the sessions checkAdmin refuses.
 *
 * WHY "local"
 * -----------
 * supabase-js signs out everywhere by default. Pressing "Atsijungti" on one
 * computer should not end the admin's session on their phone; revoking
 * every session at once is a separate, deliberate act.
 *
 * WHY THE COOKIES ARE CLEARED BY HAND AS WELL
 * -------------------------------------------
 * If Supabase answers the revoke with an error (a 5xx, a timeout),
 * supabase-js returns it and leaves the session where it was: the cookies
 * stay, and the button would appear to do nothing. So whatever Supabase
 * said, the auth cookies are removed here. The refresh token may then live
 * on at Supabase until it expires, but no browser holds it any more.
 */
export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.error("signOutAdmin:", error.message);

  const cookieStore = await cookies();
  for (const { name } of cookieStore.getAll()) {
    // `sb-<projektas>-auth-token`, o didelis — dalimis `.0`, `.1`.
    if (name.startsWith("sb-") && name.includes("-auth-token")) cookieStore.delete(name);
  }

  redirect("/admin/login");
}
