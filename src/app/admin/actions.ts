"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MODERATED_TABLES } from "./moderated-tables";
import { emailAuthorNotice, noticeEmailNote, type NoticeNote } from "./moderation-email";
import { ruleFor, type ModerationRule } from "./moderation-rules";

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

/** `note` — ką dar pasakyti administratoriui po pavykusio veiksmo (pvz. ar autoriui išsiųstas laiškas). */
type ActionResult = { ok: true; note?: NoticeNote } | { ok: false; error: string };

/** Po šalinimo ar taisymo: laiškas autoriui (#169 2 p.), jei bazė jam įrašė pranešimą. */
async function authorEmailNote(db: ReturnType<typeof createSupabaseAdminClient>, auditLogId: unknown) {
  return noticeEmailNote(await emailAuthorNotice(db, auditLogId)) ?? undefined;
}

const reasonOrNull = (reason: unknown) =>
  typeof reason === "string" && reason.trim() ? reason.trim() : null;

/*
 * #169: šalinant ar taisant turinį ir ribojant paskyrą reikia priežasties, o
 * kai tai kitiems matomas turinys ar paskyros ribojimas — ir taisyklių punkto:
 * Taisyklės žada juos nurodyti, o DSA 17 str. reikalauja jų sprendimo
 * pranešime, kurį db nusiunčia autoriui. Tikrinama čia, ne tik lange: veiksmas
 * yra viešas HTTP taškas. Punktas turi būti vienas iš dabartinių dokumentų
 * skyrių (`moderation-rules.ts`), ne bet koks tekstas; į db jis keliauja kaip
 * `jsonb` su abiem pavadinimais (Gloumi `20261004145806`).
 */
type Justified = { reason: string; rule: ModerationRule | null };

function justify(reason: unknown, rule: unknown, ruleRequired: boolean): Justified | { error: string } {
  const why = reasonOrNull(reason);
  if (!why) return { error: "Nurodykite priežastį." };
  if (why.length > 500) return { error: "Priežastis per ilga — daugiausia 500 ženklų." };
  if (rule === null || rule === undefined || rule === "") {
    return ruleRequired ? { error: "Pasirinkite taisyklių punktą." } : { reason: why, rule: null };
  }
  const parsed = ruleFor(rule);
  if (!parsed) return { error: "Taisyklių punktų sąrašas pasikeitė — atnaujinkite puslapį ir pasirinkite iš naujo." };
  return { reason: why, rule: parsed };
}

const DB_ERRORS: Record<string, string> = {
  row_not_found: "Šios eilutės nebėra — gal ją jau ištrynė kitas administratorius.",
  // Antras saugiklis duomenų bazėje (#169), jei kas nors kviestų RPC aplenkdamas šią patikrą.
  reason_required: "Nurodykite priežastį.",
  rule_required: "Pasirinkite taisyklių punktą.",
  bad_rule: "Duomenų bazė atmetė taisyklių punktą — atnaujinkite puslapį ir pasirinkite iš naujo.",
  "Per ilga priezastis": "Priežastis per ilga — daugiausia 500 ženklų.",
};

const dbError = (message: string) => DB_ERRORS[message] ?? message;

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

/**
 * Ištrina pažeidžiantį turinį arba uždaro pranešimą. Trinant — privalomi
 * priežastis ir punktas (#169); skundą uždarant — ne: pranešusiam sprendimą
 * paaiškina db šablonas („imtasi veiksmų" arba „pažeidimo nerasta").
 */
export async function moderate(
  action: "delete_post" | "delete_comment" | "review_report" | "dismiss_report",
  targetId: string,
  reason?: string,
  rule?: string | null,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const removes = action === "delete_post" || action === "delete_comment";
    const why = removes ? justify(reason, rule, true) : null;
    if (why && "error" in why) return { ok: false, error: why.error };
    const db = createSupabaseAdminClient();

    const { data: auditLogId, error } = await db.rpc("admin_moderate", {
      _admin_id: admin.userId,
      _action: action,
      _target_id: targetId,
      ...(why ? { _reason: why.reason, _rule: why.rule } : {}),
    });
    if (error) return { ok: false, error: dbError(error.message) };

    const note = removes ? await authorEmailNote(db, auditLogId) : undefined;
    revalidatePath("/admin");
    return { ok: true, note };
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
 *
 * Blokuojant priežastis ir punktas privalomi (#169), ir žurnale abu atsiranda
 * `details` tokiu pat pavidalu, kaip kitų veiksmų (`rule` — db `jsonb`): iš
 * ten juos ims sprendimo pranešimas, kai db jį prijungs. Atblokuojant
 * priežastis lieka nebūtina.
 */
export async function setSuspended(
  userId: string,
  suspended: boolean,
  reason?: string,
  rule?: string | null,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    let details: Justified | { reason: string } | null;
    if (suspended) {
      const why = justify(reason, rule, true);
      if ("error" in why) return { ok: false, error: why.error };
      details = why;
    } else {
      const why = reasonOrNull(reason);
      if (why && why.length > 500) return { ok: false, error: "Priežastis per ilga — daugiausia 500 ženklų." };
      details = why ? { reason: why } : null;
    }
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
      _details: details,
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
 *
 * #169: priežastis — visada; punktas — kai lentelė yra kitiems matomas
 * turinys (`MODERATED_TABLES`, db `moderation_noun_of`), nes tada db praneša
 * autoriui. Kitur jis nebūtinas, bet jei nurodytas, turi būti tikras.
 */

const isKey = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Ištrina vieną turinio eilutę; ištrinta eilutė lieka žurnale. */
export async function removeRow(
  table: string,
  key: Record<string, unknown>,
  reason: string,
  rule: string | null,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof table !== "string" || !isKey(key)) {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const why = justify(reason, rule, MODERATED_TABLES.has(table));
    if ("error" in why) return { ok: false, error: why.error };
    const db = createSupabaseAdminClient();

    const { data: auditLogId, error } = await db.rpc("admin_remove", {
      _admin_id: admin.userId,
      _table: table,
      _key: key,
      _reason: why.reason,
      _rule: why.rule,
    });
    if (error) return { ok: false, error: dbError(error.message) };

    const note = MODERATED_TABLES.has(table) ? await authorEmailNote(db, auditLogId) : undefined;
    revalidatePath("/admin", "layout");
    return { ok: true, note };
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
  rule: string | null,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof table !== "string" || !isKey(key) || typeof column !== "string" || typeof value !== "string") {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const why = justify(reason, rule, MODERATED_TABLES.has(table));
    if ("error" in why) return { ok: false, error: why.error };
    const db = createSupabaseAdminClient();

    const { data: auditLogId, error } = await db.rpc("admin_edit_text", {
      _admin_id: admin.userId,
      _table: table,
      _key: key,
      _column: column,
      _value: value,
      _reason: why.reason,
      _rule: why.rule,
    });
    if (error) return { ok: false, error: dbError(error.message) };

    const note = MODERATED_TABLES.has(table) ? await authorEmailNote(db, auditLogId) : undefined;
    revalidatePath("/admin", "layout");
    return { ok: true, note };
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
 *
 * Punktas nebūtinas (#169, db sutartis): paskyra dažniausiai trinama paties
 * žmogaus prašymu arba testinė, o pranešimo po trynimo nebūtų kur parodyti.
 */
export async function deleteAccount(userId: string, reason: string, rule: string | null): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof userId !== "string") return { ok: false, error: "Netinkamas prašymas." };
    const why = justify(reason, rule, false);
    if ("error" in why) return { ok: false, error: why.error };
    const db = createSupabaseAdminClient();

    const { error } = await db.rpc("admin_delete_account", {
      _admin_id: admin.userId,
      _user_id: userId,
      _reason: why.reason,
      _rule: why.rule,
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
 * Kortelės ginčą (`source = 'chargeback'`) sprendžia bankas: `refund` ir
 * `release` jam RPC atmeta. Pralaimėjus (`lost`) lieka nuspręsti tik, kas neša
 * nuostolį (#164, Gloumi `20261004174851`): `gloumi_bears` → `release`,
 * `master_bears` → vizitas `refunded`, ginčas `closed`. Stripe grąžinimo nėra
 * nė vienu atveju — pinigus klientui jau grąžino bankas.
 */
const DISPUTE_DECISIONS = ["refund", "release", "gloumi_bears", "master_bears"] as const;

const DISPUTE_ERRORS: Record<string, string> = {
  bad_decision: "Nežinomas sprendimas.",
  dispute_not_found: "Šio ginčo nebėra.",
  chargeback_decided_by_bank: "Kortelės ginčo pinigus grąžina bankas, ne portalas.",
  decision_not_for_source: "Kas neša nuostolį, sprendžiama tik pralaimėtam kortelės ginčui.",
  already_resolved: "Kas neša nuostolį, jau nuspręsta — gal tai padarė kitas administratorius.",
};

const disputeError = (message: string) => {
  const notOpen = /^dispute_not_open: (.+)$/.exec(message);
  if (notOpen) return `Ginčas jau išspręstas (būsena: ${notOpen[1]}) — gal tai padarė kitas administratorius.`;
  const notLost = /^chargeback_not_lost: (.+)$/.exec(message);
  if (notLost) return `Bankas ginčo dar nepralaimėjo (būsena: ${notLost[1]}) — nuostolį skirstyti dar nėra ko.`;
  return DISPUTE_ERRORS[message] ?? message;
};

export async function resolveDispute(
  bookingId: string,
  decision: (typeof DISPUTE_DECISIONS)[number],
  note: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof bookingId !== "string" || !DISPUTE_DECISIONS.includes(decision)) {
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
