"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { UUID_PATTERN } from "../format";
import { vilniusEndOfDay } from "./dates";

/*
 * Individualios meistro sąlygos (#179, Gloumi `20261006203804`): komisinio
 * atsisakymas ir nemokamas Pro ar VIP, abu su terminu ir priežastimi.
 *
 * Kaip ir `../actions.ts`: kiekvienas veiksmas iš naujo tikrina administratorių
 * (serverio veiksmas — viešas HTTP taškas), o pakeitimą daro vienas RPC, kuris
 * toje pačioje transakcijoje rašo ir `admin_audit_logs`. Atskiras failas tam,
 * kad šis darbas neliestų kitų portalo šakų failo.
 *
 * „Baigti“ atsisakymą jo neištrina: RPC nustato pabaigą į dabar, tad jau
 * įvykę vizitai lieka be komisinio, net jei bus apmokėti vėliau.
 */

type ActionResult = { ok: true } | { ok: false; error: string };

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

const ERRORS: Record<string, string> = {
  master_not_found: "Tokio meistro nėra — gal paskyra jau ištrinta.",
  bad_until: "Terminas turi būti ateityje ir ne vėliau kaip po 5 metų.",
  bad_reason: "Priežastis privaloma — iki 500 ženklų.",
  bad_plan: "Galima suteikti tik Pro arba VIP.",
};

const rpcError = (message: string) => ERRORS[message] ?? message;

/** Priežastis — 1–500 ženklų, kaip bazėje; tikrinama ir čia, kad klaida būtų aiški iš karto. */
function cleanReason(reason: unknown): string | null {
  const text = typeof reason === "string" ? reason.trim() : "";
  return text.length >= 1 && text.length <= 500 ? text : null;
}

const fail = (error: string): ActionResult => ({ ok: false, error });

/** Neimti komisinio iki dienos (imtinai). Dar galiojantį — pratęsia; pradžia lieka sena. */
export async function setCommissionWaiver(masterId: string, day: string, reason: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof masterId !== "string" || !UUID_PATTERN.test(masterId)) return fail("Netinkamas prašymas.");
    const until = vilniusEndOfDay(day);
    if (!until) return fail("Pasirinkite terminą.");
    const why = cleanReason(reason);
    if (!why) return fail(ERRORS.bad_reason);

    const db = createSupabaseAdminClient();
    const { error } = await db.rpc("admin_set_commission_waiver", {
      _admin_id: admin.userId,
      _master: masterId,
      _until: until,
      _reason: why,
    });
    if (error) return fail(rpcError(error.message));

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Nepavyko.");
  }
}

/** Baigia galiojantį komisinio atsisakymą dabar. */
export async function clearCommissionWaiver(masterId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof masterId !== "string" || !UUID_PATTERN.test(masterId)) return fail("Netinkamas prašymas.");

    const db = createSupabaseAdminClient();
    const { data, error } = await db.rpc("admin_clear_commission_waiver", {
      _admin_id: admin.userId,
      _master: masterId,
    });
    if (error) return fail(rpcError(error.message));
    if (data !== true) return fail("Galiojančio atsisakymo nebėra — gal jį jau baigė kitas administratorius.");

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Nepavyko.");
  }
}

/** Nemokamas Pro ar VIP iki dienos (imtinai). */
export async function grantPlan(
  masterId: string,
  plan: "pro" | "vip",
  day: string,
  reason: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof masterId !== "string" || !UUID_PATTERN.test(masterId)) return fail("Netinkamas prašymas.");
    if (plan !== "pro" && plan !== "vip") return fail(ERRORS.bad_plan);
    const until = vilniusEndOfDay(day);
    if (!until) return fail("Pasirinkite terminą.");
    const why = cleanReason(reason);
    if (!why) return fail(ERRORS.bad_reason);

    const db = createSupabaseAdminClient();
    const { error } = await db.rpc("admin_grant_plan", {
      _admin_id: admin.userId,
      _master: masterId,
      _plan: plan,
      _until: until,
      _reason: why,
    });
    if (error) return fail(rpcError(error.message));

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Nepavyko.");
  }
}

/** Atšaukia administratoriaus suteiktą planą; parduotuvės prenumeratų neliečia. */
export async function revokePlanGrant(subscriptionId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof subscriptionId !== "string" || !UUID_PATTERN.test(subscriptionId)) return fail("Netinkamas prašymas.");

    const db = createSupabaseAdminClient();
    const { data, error } = await db.rpc("admin_revoke_plan_grant", {
      _admin_id: admin.userId,
      _subscription: subscriptionId,
    });
    if (error) return fail(rpcError(error.message));
    if (data !== true) return fail("Šis planas jau atšauktas arba jo nebėra.");

    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Nepavyko.");
  }
}
