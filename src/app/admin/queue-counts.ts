import "server-only";
import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Kiek kas laukia sprendimo – šoninei juostai ir Apžvalgai (design
 * `admin-portalas.md` 1.1, 2). Skaičiuojama tik ten, kur yra eilė. `head: true`
 * eilučių nesiunčia. Nepavykus (pvz. migracija nepritaikyta) – `null`, ir
 * skaičius tiesiog nerodomas: juosta neturi lūžti dėl vienos eilės.
 *
 * `cache` – per vieną užklausą skaičiuojama vieną kartą, nors juosta ir
 * Apžvalga klausia abi.
 */
export type QueueCounts = {
  reports: number | null;
  contentReview: number | null;
  support: number | null;
  disputes: number | null;
  debts: number | null;
  /** Rezervavimo įspėjimai, kuriuos grąžina `admin_list_booking_warnings` (paskutinės 30 d.). */
  warnings: number | null;
};

const count = (r: { count: number | null; error: unknown }) => (r.error ? null : (r.count ?? 0));

export const loadQueueCounts = cache(async (adminId: string): Promise<QueueCounts> => {
  const db = createSupabaseAdminClient();
  const head = { count: "exact" as const, head: true };
  const [reports, contentReview, support, disputes, debts, warnings] = await Promise.all([
    db.from("content_reports").select("id", head).eq("status", "open"),
    db.from("content_review_requests").select("id", head).eq("status", "open"),
    db.from("support_tickets").select("id", head).eq("status", "open"),
    db.from("booking_disputes").select("booking_id", head).eq("status", "open"),
    db.rpc("admin_list_debt_notices", { _admin_id: adminId, _status: "overdue" }),
    db.rpc("admin_list_booking_warnings", { _admin_id: adminId }),
  ]);
  return {
    reports: count(reports),
    contentReview: count(contentReview),
    support: count(support),
    disputes: count(disputes),
    debts: debts.error ? null : Array.isArray(debts.data) ? debts.data.length : 0,
    warnings: warnings.error ? null : Array.isArray(warnings.data) ? warnings.data.length : 0,
  };
});
