import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { chip, chipActive } from "../ui";
import { DebtNoticeList, type BlockState, type DebtNoticeView } from "./DebtNoticeList";

/*
 * Meistrų mokėjimo prašymai (Gloumi `20261005214547`, K-U24-3): klientams
 * grąžintos sumos, kurių nepavyko išskaičiuoti iš išmokų. Prašymą ir priminimą
 * bazė siunčia pati; pradelsus – išjungia meistrui mokėjimą vietoje, bet tik
 * išėjus laiškui (P2B 4 str., `20261005224404`). Laiškas neišėjo – mokėjimas
 * neišjungiamas, ir čia tai rodoma kaip įspėjimas (`email_failed`). Čia
 * administratorius mato prašymus ir pažymi apmokėtą, kai pinigai gauti
 * (`admin_mark_debt_notice_paid`): jei pradelstų nebelieka, mokėjimas vietoje
 * vėl įjungiamas, ir meistrui pranešama.
 *
 * Sąrašas – `admin_list_debt_notices` (`20261005224404`, ≤ 200 naujausių;
 * vardas – verslo, rodomas arba iš prašymo, jei paskyra ištrinta). Kaip
 * ginčuose – vienas kvietimas `all`, iš jo skaičiai ir filtrai; tik pasiekus
 * ribą pasirinkta būsena skaitoma atskirai, o prie skaičių rodomas „+“.
 *
 * Skirtukas – „Ginčai“: tai pinigų darbo vieta, o atskiras skirtukas telefono
 * juostoje nebetilptų.
 */
export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "open", label: "Neapmokėti" },
  { key: "overdue", label: "Pradelsti" },
  { key: "paid", label: "Apmokėti" },
  { key: "all", label: "Visi" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

/** Daugiau RPC negrąžina. */
const LIMIT = 200;

type Row = {
  id: string;
  number: string;
  amount_cents: number;
  issued_at: string;
  due_at: string;
  reminded_at: string | null;
  paid_at: string | null;
  master_id: string | null;
  master_name: string | null;
  block_state: string | null;
};

const BLOCK_STATES = ["email_pending", "email_failed", "blocked", "email_missing"] as const;
const blockStateOf = (v: string | null): BlockState =>
  BLOCK_STATES.find((s) => s === v) ?? null;
/** Šioms būsenoms reikia žmogaus: mokėjimas vietoje neišjungtas, nes laiškas neišėjo. */
const needsAttention = (r: Row) => r.block_state === "email_failed" || r.block_state === "email_missing";

/** Kaip RPC `overdue`: neapmokėtas, ir terminas jau atėjo. */
const isOverdue = (r: Row) => !r.paid_at && new Date(r.due_at).getTime() <= Date.now();

export default async function DebtsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }
  const { status } = await searchParams;
  const wanted: FilterKey = FILTERS.some((f) => f.key === status) ? (status as FilterKey) : "open";

  const db = createSupabaseAdminClient();
  const list = (status: FilterKey) => db.rpc("admin_list_debt_notices", { _admin_id: check.userId, _status: status });
  const all = await list("all");
  const rows = (all.data ?? []) as Row[];
  const inFilter: Record<FilterKey, (r: Row) => boolean> = {
    open: (r) => !r.paid_at,
    overdue: isOverdue,
    paid: (r) => !!r.paid_at,
    all: () => true,
  };
  const full = rows.length >= LIMIT;
  const counts = Object.fromEntries(FILTERS.map(({ key }) => [key, rows.filter(inFilter[key]).length]));
  // Pasiekus ribą seniausi neapmokėti galėjo likti už 200 naujausių – tada būsena atskirai.
  const picked = full && wanted !== "all" ? await list(wanted) : null;
  const error = all.error ?? picked?.error;

  const views: DebtNoticeView[] = ((picked?.data as Row[] | null) ?? rows.filter(inFilter[wanted])).map((r) => ({
    id: r.id,
    number: r.number,
    amountCents: r.amount_cents,
    issuedAt: r.issued_at,
    dueAt: r.due_at,
    remindedAt: r.reminded_at,
    paidAt: r.paid_at,
    overdue: isOverdue(r),
    masterId: r.master_id,
    masterName: r.master_name || (r.master_id ? "Be vardo" : "Paskyra ištrinta"),
    blockState: blockStateOf(r.block_state),
  }));
  const attention = rows.filter(needsAttention).length;

  return (
    <AdminShell
      section="disputes"
      title="Mokėjimo prašymai"
      subtitle="Meistrams išsiųsti prašymai sumokėti klientams grąžintas sumas. Pažymėkite apmokėtą, kai pinigai gauti."
      username={check.username ?? check.userId}
      back={{ href: "/admin/disputes", label: "Ginčai" }}
    >
      {error ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Prašymų gauti nepavyko: {error.message}
        </p>
      ) : (
        <>
          {attention > 0 ? (
            <p role="alert" className="mb-5 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
              Reikia dėmesio: {attention}. Pradelstų prašymų laiškai meistrams neišėjo, todėl mokėjimas vietoje jiems
              neišjungtas. Jie pažymėti sąraše{" "}
              <a href="/admin/debts?status=overdue" className="underline">
                „Pradelsti“
              </a>
              .
            </p>
          ) : null}
          <nav aria-label="Prašymų būsena" className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map(({ key, label }) => (
              <a
                key={key}
                href={key === "open" ? "/admin/debts" : `/admin/debts?status=${key}`}
                aria-current={key === wanted ? "page" : undefined}
                className={key === wanted ? chipActive : chip}
              >
                {label}
                <span className="rounded-full bg-app-band px-2 py-0.5 text-xs font-bold tabular-nums text-app-ink">
                  {counts[key] ?? 0}
                  {full ? "+" : ""}
                </span>
              </a>
            ))}
          </nav>
          <DebtNoticeList notices={views} />
        </>
      )}
    </AdminShell>
  );
}
