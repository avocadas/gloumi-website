"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server actions for every destructive admin operation.
 *
 * WHY EVERY ONE OF THEM RE-CHECKS
 * -------------------------------
 * The page already checked that the caller is an admin before rendering. That
 * check protects the *view*, not these functions: a server action is a real
 * HTTP endpoint that anyone can call with its action id, whatever the page
 * decided to render. So each one asks again, on the server, before touching
 * anything. The duplication is the point.
 *
 * WHY THE DATABASE IS ASKED TO DO BOTH HALVES
 * -------------------------------------------
 * These never delete and then log. `admin_moderate()` does the deletion and
 * the audit row in one transaction (20260921221148), so an audit trail with
 * a hole in it cannot happen — not through a crash, not through a dropped
 * connection, not through someone later adding a fifth action and forgetting
 * the logging line.
 */

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const check = await checkAdmin();
  if (!check.ok) {
    throw new Error(
      check.reason === "mfa-required"
        ? "Reikalingas antras veiksnys."
        : "Neturite teisės atlikti šio veiksmo.",
    );
  }
  return check;
}

/** Ištrina pažeidžiantį turinį arba uždaro pranešimą. */
export async function moderate(
  action: "delete_post" | "delete_comment" | "review_report" | "dismiss_report",
  targetId: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_moderate", {
      _admin_id: admin.userId,
      _action: action,
      _target_id: targetId,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

/**
 * Sustabdo arba atstato vartotoją.
 *
 * WHY GoTrue AND NOT A COLUMN
 * ---------------------------
 * `auth.users.banned_until` is checked by GoTrue itself: the account cannot
 * sign in and its existing tokens stop working. A `suspended` flag on
 * `profiles` would have needed every content table's write policy changed,
 * and a half-enforced ban is worse than none — the portal would say
 * "suspended" while the person kept posting.
 *
 * The duration is "forever" in practice (100 years) rather than a real
 * infinity, because GoTrue takes a duration string. Lifting it is
 * `ban_duration: "none"`, which is why unsuspending is the same call.
 */
export async function setSuspended(userId: string, suspended: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const db = createSupabaseAdminClient();

    const { error } = await db.auth.admin.updateUserById(userId, {
      ban_duration: suspended ? "876000h" : "none",
    });
    if (error) return { ok: false, error: error.message };

    /*
     * Logged SEPARATELY, and that is the one place where the two-step problem
     * described above genuinely exists: the ban lives in GoTrue, not in a
     * table this transaction can reach. If this call fails, the person is
     * banned and the log does not say so — so the failure is returned rather
     * than swallowed, and the operator sees it.
     */
    const { error: logError } = await db.rpc("log_admin_action", {
      _admin_id: admin.userId,
      _action: suspended ? "suspend_user" : "unsuspend_user",
      _target_type: "profile",
      _target_id: userId,
      _details: null,
    });
    if (logError) {
      return {
        ok: false,
        error: `Veiksmas atliktas, bet į žurnalą neįrašytas: ${logError.message}`,
      };
    }

    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}
