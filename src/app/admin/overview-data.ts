import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QueueCounts } from "./queue-counts";

/*
 * Apžvalgos papildymai (design `admin-portalas.md` 2 sk., D13): kiek seniai
 * laukia seniausias kiekvienos eilės įrašas ir 5 paskutiniai administratorių
 * veiksmai. Atskirai nuo `queue-counts.ts`, nes skaičius rodo kiekvieno
 * puslapio navigacija, o šie duomenys reikalingi tik Apžvalgai.
 *
 * Nepavykus – `null`: kortelė lieka su skaičiumi, be „seniausias“, o
 * veiksmų skiltis nerodoma.
 */

export type QueueOldest = Partial<Record<keyof QueueCounts, string | null>>;

const firstAt = (r: { data: unknown; error: unknown }, field: string): string | null => {
  if (r.error || !Array.isArray(r.data) || r.data.length === 0) return null;
  const v = (r.data[0] as Record<string, unknown>)[field];
  return typeof v === "string" ? v : null;
};

const minOf = (r: { data: unknown; error: unknown }, field: string): string | null => {
  if (r.error || !Array.isArray(r.data)) return null;
  const all = r.data
    .map((row) => (row as Record<string, unknown>)[field])
    .filter((v): v is string => typeof v === "string")
    .sort();
  return all[0] ?? null;
};

export async function loadQueueOldest(adminId: string): Promise<QueueOldest> {
  const db = createSupabaseAdminClient();
  const oldestOpen = (table: string) =>
    db.from(table).select("created_at").eq("status", "open").order("created_at", { ascending: true }).limit(1);
  const [reports, contentReview, support, disputes, debts, warnings] = await Promise.all([
    oldestOpen("content_reports"),
    oldestOpen("content_review_requests"),
    oldestOpen("support_tickets"),
    oldestOpen("booking_disputes"),
    db.rpc("admin_list_debt_notices", { _admin_id: adminId, _status: "overdue" }),
    db.rpc("admin_list_booking_warnings", { _admin_id: adminId }),
  ]);
  return {
    reports: firstAt(reports, "created_at"),
    contentReview: firstAt(contentReview, "created_at"),
    support: firstAt(support, "created_at"),
    disputes: firstAt(disputes, "created_at"),
    // Skoloms – nuo apmokėjimo termino, įspėjimams – nuo įspėjimo.
    debts: minOf(debts, "due_at"),
    warnings: minOf(warnings, "warned_at"),
  };
}

/** „seniausias – prieš 3 d.“ / „seniausias – šiandien“; `null`, jei data nežinoma. */
export function oldestNote(at: string | null | undefined, now = Date.now()): string | null {
  if (!at) return null;
  const t = new Date(at).getTime();
  if (Number.isNaN(t)) return null;
  const days = Math.floor((now - t) / (24 * 60 * 60 * 1000));
  return days <= 0 ? "seniausias – šiandien" : `seniausias – prieš ${days} d.`;
}

export type RecentAction = {
  id: number;
  who: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  at: string;
};

/** 5 naujausi `admin_audit_logs` įrašai: kas, ką, kada. */
export async function loadRecentActions(): Promise<RecentAction[] | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("admin_audit_logs")
    .select("id, admin_label, action, target_type, target_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error || !Array.isArray(data)) return null;
  return data.map((r) => ({
    id: r.id as number,
    who: (r.admin_label as string | null) ?? null,
    action: String(r.action),
    targetType: (r.target_type as string | null) ?? null,
    targetId: r.target_id === null || r.target_id === undefined ? null : String(r.target_id),
    at: String(r.created_at),
  }));
}

/* Žurnalo veiksmų pavadinimai žmonėms; nežinomi rodomi kodu be pabraukimų. */
const ACTION_LABEL: Record<string, string> = {
  review_report: "išsprendė skundą",
  dismiss_report: "atmetė skundą",
  remove: "ištrynė turinį",
  edit_text: "pataisė tekstą",
  set_review_reply_hidden: "paslėpė ar grąžino atsakymą",
  suspend_user: "sustabdė paskyrą",
  unsuspend_user: "atkūrė prieigą",
  restrict_bookings: "apribojo rezervavimą",
  unrestrict_bookings: "panaikino rezervavimo apribojimą",
  delete_account: "ištrynė paskyrą",
  schedule_master_termination: "suplanavo meistro paskyros nutraukimą",
  cancel_master_termination: "atšaukė meistro paskyros nutraukimą",
  correct_birth_date: "pataisė gimimo datą",
  reveal_phone: "peržiūrėjo telefono numerį",
  grant_plan: "suteikė planą",
  revoke_plan_grant: "atšaukė suteiktą planą",
  set_commission_waiver: "atleido nuo komisinio",
  clear_commission_waiver: "panaikino komisinio atleidimą",
  open_dispute: "atidarė ginčą",
  resolve_dispute: "išsprendė ginčą",
  debt_notice_paid: "pažymėjo skolą apmokėta",
  support_ticket_closed: "pažymėjo pagalbos užklausą išspręsta",
  support_ticket_reopened: "vėl atidarė pagalbos užklausą",
  content_review_approve: "leido skelbti",
  content_review_reject: "atmetė peržiūrą",
  mfa_reset_open: "atidarė 2FA prašymą",
  mfa_reset_execute: "nuėmė 2FA",
  set_app_build: "pakeitė programėlės versiją",
  set_test_account: "pakeitė testinės paskyros žymą",
  set_hide_name_in_salons: "pakeitė vardo rodymą salonuose",
  view_report_copy: "peržiūrėjo skundo kopiją",
  admin_password_changed: "pasikeitė slaptažodį",
  gift_credit_refund_set_bank: "nurodė grąžinimo sąskaitą",
  gift_credit_refund_bank_paid: "pažymėjo grąžinimą pervestu",
};

export const actionLabel = (action: string) => ACTION_LABEL[action] ?? action.replace(/_/g, " ");
