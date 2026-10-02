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

const reasonOrNull = (reason: unknown) =>
  typeof reason === "string" && reason.trim() ? reason.trim() : null;

async function requireAdmin() {
  const check = await checkAdmin();
  if (!check.ok) {
    throw new Error(
      check.reason === "mfa-required"
        ? "Reikalingas antras veiksnys."
        : check.reason === "expired"
          ? "Sesija baigėsi — prisijunkite iš naujo."
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
/*
 * Priežastis — kaip trynimo (#129, developeris 2026-10-02: „reikia ir
 * blokavimui notes"). `log_admin_action` ilgio neriboja, o trynimo RPC
 * atmeta ilgesnę nei 500 ženklų, tad ta pati riba tikrinama čia — PRIEŠ
 * blokuojant, kitaip žmogus liktų užblokuotas be įrašo žurnale.
 */
export async function setSuspended(userId: string, suspended: boolean, reason?: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const why = reasonOrNull(reason);
    if (why && why.length > 500) return { ok: false, error: "Priežastis per ilga — daugiausia 500 ženklų." };
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
      _details: why ? { reason: why } : null,
    });
    if (logError) {
      return {
        ok: false,
        error: `Veiksmas atliktas, bet į žurnalą neįrašytas: ${logError.message}`,
      };
    }

    // Visas `/admin`, ne tik skundai: būseną rodo ir paskyros puslapis (#129).
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

/*
 * Duomenų naršyklės veiksmai (#129). Kiekvienas yra vienas RPC, kuris ir
 * pakeičia, ir įrašo į žurnalą toje pačioje transakcijoje (`admin_remove`,
 * `admin_edit_text`, `admin_delete_account`, 20261001012855) — tas pats
 * principas, kaip `moderate()`. Ką galima trinti ir taisyti, sprendžia
 * duomenų bazės katalogas, ne šis failas: čia tikrinama tik prašymo forma.
 */

const DB_ERRORS: Record<string, string> = {
  row_not_found: "Šios eilutės nebėra — gal ją jau ištrynė kitas administratorius.",
};

const dbError = (message: string) => DB_ERRORS[message] ?? message;

const isKey = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Ištrina vieną turinio eilutę; ištrinta eilutė lieka žurnale. */
export async function removeRow(
  table: string,
  key: Record<string, unknown>,
  reason: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof table !== "string" || !isKey(key)) {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_remove", {
      _admin_id: admin.userId,
      _table: table,
      _key: key,
      _reason: reasonOrNull(reason),
    });
    if (error) return { ok: false, error: dbError(error.message) };

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

/** Pataiso vieną tekstą; ankstesnis tekstas lieka žurnale. */
export async function editText(
  table: string,
  key: Record<string, unknown>,
  column: string,
  value: string,
  reason: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof table !== "string" || !isKey(key) || typeof column !== "string" || typeof value !== "string") {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_edit_text", {
      _admin_id: admin.userId,
      _table: table,
      _key: key,
      _column: column,
      _value: value,
      _reason: reasonOrNull(reason),
    });
    if (error) return { ok: false, error: dbError(error.message) };

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

/*
 * Ištrina paskyrą iškart, tais pačiais žingsniais kaip naktinis valymas
 * (`purge_accounts`). Ne „pažymėti ir laukti": pažymėtą paskyrą naudotojas
 * atstatytų pats (`cancel_account_deletion`).
 *
 * Be `revalidatePath`: puslapis, iš kurio kviečiama, yra ištrintos paskyros
 * puslapis, ir jo perpiešimas tik parodytų „naudotojo nėra" — klientas iš
 * jo išeina pats.
 */
export async function deleteAccount(userId: string, reason: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof userId !== "string") return { ok: false, error: "Netinkamas prašymas." };
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_delete_account", {
      _admin_id: admin.userId,
      _user_id: userId,
      _reason: reasonOrNull(reason),
    });
    if (error) return { ok: false, error: dbError(error.message) };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

/*
 * Kliento pranešimo „Vizitas neįvyko?" sprendimas (#147, Gloumi
 * `20261001233134` `admin_resolve_dispute`). Pinigai nejuda čia: RPC tik
 * pažymi sprendimą ir įrašo jį į žurnalą toje pačioje transakcijoje, o
 * grąžinimą ar išmoką kitą naktį įvykdo `stripe-settle`.
 *
 * Kortelės ginčą (`source = 'chargeback'`) sprendžia bankas — RPC jį atmeta
 * pats, o puslapis tokiam mygtukų ir nerodo.
 */
const DISPUTE_ERRORS: Record<string, string> = {
  bad_decision: "Nežinomas sprendimas.",
  dispute_not_found: "Šio ginčo nebėra.",
  chargeback_decided_by_bank: "Kortelės ginčą sprendžia bankas, ne portalas.",
};

const disputeError = (message: string) => {
  const notOpen = /^dispute_not_open: (.+)$/.exec(message);
  if (notOpen) return `Ginčas jau išspręstas (būsena: ${notOpen[1]}) — gal tai padarė kitas administratorius.`;
  return DISPUTE_ERRORS[message] ?? message;
};

export async function resolveDispute(
  bookingId: string,
  decision: "refund" | "release",
  note: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof bookingId !== "string" || (decision !== "refund" && decision !== "release")) {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    // RPC pastabą nukerpa iki 500 tyliai; čia sakome aiškiai, kaip ir kitur portale.
    const why = reasonOrNull(note);
    if (why && why.length > 500) return { ok: false, error: "Pastaba per ilga — daugiausia 500 ženklų." };
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_resolve_dispute", {
      _admin_id: admin.userId,
      _booking: bookingId,
      _decision: decision,
      _note: why,
    });
    if (error) return { ok: false, error: disputeError(error.message) };

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}
