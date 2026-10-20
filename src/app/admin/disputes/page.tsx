import Link from "next/link";
import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { Alert } from "../ui";
import type { DisputeView } from "./DisputeCard";
import { DISPUTE_FILTERS, DisputeQueue, type HeldMaster } from "./DisputeQueue";

/*
 * Ginčai (#147, Gloumi `20261001233134`). Išmoka meistrui laukia 3 dienas po
 * vizito; per tą laiką klientas gali pranešti „Vizitas neįvyko?", o bankas —
 * atsiųsti kortelės ginčą. Kol ginčas `open`, naktinis `stripe-settle`
 * išmokos neperveda — kliento ar administratoriaus ginčo ne ilgiau 30 d.
 * (`autoReleaseDays`). Kliento pranešimą sprendžia administratorius čia.
 *
 * Skaitoma VIENU kvietimu su `_status = null` (iki 200 eilučių): iš jo ir
 * skaičiai prie būsenų, ir filtruotas sąrašas. Ginčų mažai, o penki
 * kvietimai skaičiams būtų penkis kartus lėtesnis puslapis už nieką.
 *
 * Šis failas tik gauna duomenis; išdėstymas — `DisputeQueue`.
 */
export const dynamic = "force-dynamic";

type Row = {
  booking_id: string;
  status: string;
  source: string;
  reason: string | null;
  created_at: string;
  resolved_at: string | null;
  client_id: string | null;
  client_name: string | null;
  master_id: string | null;
  master_name: string | null;
  starts_at: string | null;
  amount_total_cents: number | null;
  transferred_at: string | null;
  stripe_dispute_id: string | null;
  /* Sąrašą su šiuo stulpeliu grąžina Gloumi `20261004191736` (#164); iki jos — `undefined`. */
  chargeback_bearer?: string | null;
};

/*
 * Sulaikymas ne ilgiau 30 d. (#223 P0-12; developeris 2026-10-11, K-P2: „A – po
 * 30 d. išmokama automatiškai"): atviras kliento ar administratoriaus ginčas,
 * kurio niekas neišsprendė per 30 d. nuo atidarymo, naktinis `stripe-settle`
 * išsprendžia kaip `release` (Gloumi `055c3f3a`). Kortelės ginčo — ne, jį
 * sprendžia bankas, tad jam `null`. Grąžina likusias dienas, suapvalintas į
 * viršų; 0 — riba praėjo, išmokės artimiausią naktį. Laikrodis čia, ne
 * komponente (react-hooks/purity).
 */
const DISPUTE_HOLD_MAX_MS = 30 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
function autoReleaseDays(r: Row): number | null {
  if (r.status !== "open" || (r.source !== "client" && r.source !== "admin")) return null;
  const openedMs = Date.parse(r.created_at);
  if (!Number.isFinite(openedMs)) return null;
  return Math.max(0, Math.ceil((openedMs + DISPUTE_HOLD_MAX_MS - Date.now()) / DAY_MS));
}

export default async function DisputesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { status = "open" } = await searchParams;
  const wanted = DISPUTE_FILTERS.some((f) => f.key === status) ? status : "open";

  const db = createSupabaseAdminClient();
  const [{ data, error }, heldRes, debtsRes] = await Promise.all([
    db.rpc("admin_list_disputes", { _admin_id: check.userId, _status: null }),
    db.rpc("dac7_held_masters"),
    db.rpc("admin_list_debt_notices", { _admin_id: check.userId, _status: "overdue" }),
  ]);
  // Mokėjimo prašymai, kurių laiškas neišėjo (`20261005224404`): įspėjimas matomas jau čia,
  // nes be laiško mokėjimas vietoje neišjungiamas. Nepavykus gauti – tiesiog be skaičiaus.
  const debtAttention = ((debtsRes.error ? [] : (debtsRes.data ?? [])) as { block_state: string | null }[]).filter(
    (d) => d.block_state === "email_failed" || d.block_state === "email_missing",
  ).length;

  const rows = (error ? [] : (data ?? [])) as Row[];
  const counts: Record<string, number> = { all: rows.length };
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;

  const disputes: DisputeView[] = rows
    .filter((r) => wanted === "all" || r.status === wanted)
    .map((r) => ({
      bookingId: r.booking_id,
      status: r.status,
      source: r.source,
      reason: r.reason,
      createdAt: r.created_at,
      resolvedAt: r.resolved_at,
      clientId: r.client_id,
      clientName: r.client_name ?? "",
      masterId: r.master_id,
      masterName: r.master_name ?? "",
      startsAt: r.starts_at,
      amountCents: r.amount_total_cents,
      transferredAt: r.transferred_at,
      stripeDisputeId: r.stripe_dispute_id,
      chargebackBearer: r.chargeback_bearer === "gloumi" || r.chargeback_bearer === "master" ? r.chargeback_bearer : null,
      autoReleaseDays: autoReleaseDays(r),
    }));

  /*
   * DAC7 sąrašas — papildoma informacija: nepavykus jį gauti, ginčai vis
   * tiek rodomi, o sąrašo tiesiog nėra (`null`), ne „nė vieno".
   */
  let held: HeldMaster[] | null = null;
  if (!heldRes.error) {
    const ids = ((heldRes.data ?? []) as { master_id: string }[]).map((h) => h.master_id);
    held = [];
    if (ids.length > 0) {
      const [{ data: masters }, { data: profiles }] = await Promise.all([
        db.from("master_profiles").select("profile_id, display_name").in("profile_id", ids),
        db.from("profiles").select("id, display_name").in("id", ids),
      ]);
      const name = new Map<string, string>();
      for (const p of profiles ?? []) if (p.display_name) name.set(p.id, p.display_name);
      for (const m of masters ?? []) if (m.display_name) name.set(m.profile_id, m.display_name);
      held = ids.map((id) => ({ id, name: name.get(id) ?? "" }));
    }
  }

  return (
    <AdminShell
      section="disputes"
      title="Ginčai"
      subtitle="Pranešimai „Vizitas neįvyko?“ ir kortelių ginčai; kol ginčas atviras, išmoka meistrui laukia (iki 30 d.)."
      username={check.username ?? check.userId}
    >
      {/* Skolos – šoninėje juostoje su skaičiumi (design 7.4); čia lieka tik perspėjimas, kai laiškas neišėjo. */}
      {debtAttention > 0 ? (
        <Alert tone="warn" className="mb-5">
          {debtAttention} mokėjimo prašymų laiškas neišėjo, todėl mokėjimas vietoje neišjungtas.{" "}
          <Link href="/admin/debts" className="underline">
            Atidaryti Skolas
          </Link>
        </Alert>
      ) : null}
      {error ? (
        <p role="alert" className="mb-6 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Ginčų gauti nepavyko: {error.message}
        </p>
      ) : null}
      <DisputeQueue wanted={wanted} counts={counts} disputes={disputes} held={held} />
    </AdminShell>
  );
}
