import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { mfaResetEnabled } from "@/lib/mfa-reset";
import { AdminShell } from "./AdminShell";
import { SearchField } from "./data/SearchField";
import { MfaNotice } from "./MfaNotice";
import { ALL_ITEMS, type NavItem } from "./nav";
import { formatWhen } from "./format";
import { actionLabel, loadQueueOldest, loadRecentActions, oldestNote } from "./overview-data";
import { loadQueueCounts, type QueueCounts } from "./queue-counts";
import { STROKE, SectionTitle, btn, card } from "./ui";

/*
 * Apžvalga (design `admin-portalas.md` 2): kas šiandien laukia. Eilių
 * kortelės – visa kortelė yra nuoroda; 0 – „Viskas sutvarkyta“. Po jomis –
 * greita naudotojo paieška (ta pati, kaip Duomenyse).
 *
 * Skundai anksčiau gyveno čia; senos nuorodos `/admin?status=…` nukreipiamos
 * į `/admin/reports?status=…`.
 */
export const dynamic = "force-dynamic";

type Card = { key: NavItem["key"]; label: string; count?: keyof QueueCounts; note?: string };

const CARDS: Card[] = [
  { key: "reports", label: "Skundai", count: "reports" },
  { key: "contentReview", label: "Turinio peržiūra", count: "contentReview" },
  { key: "support", label: "Pagalba", count: "support" },
  { key: "disputes", label: "Ginčai", count: "disputes" },
  { key: "warnings", label: "Rezervavimo įspėjimai", count: "warnings", note: "Įspėjimai per 90 dienų" },
  { key: "debts", label: "Skolos", count: "debts", note: "Pradelsti mokėjimo prašymai" },
  // 2FA prašymus skaito Edge su administratoriaus sesija – skaičiaus čia nėra, rodoma „—“.
  { key: "mfaReset", label: "2FA atstatymas", note: "Prašymus matysite atidarę eilę" },
];

function weekday(now: Date): string {
  const text = new Intl.DateTimeFormat("lt-LT", {
    timeZone: "Europe/Vilnius",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  const { status } = await searchParams;
  if (typeof status === "string" && status) redirect(`/admin/reports?status=${encodeURIComponent(status)}`);

  const [counts, oldest, recent] = await Promise.all([
    loadQueueCounts(check.userId),
    loadQueueOldest(check.userId),
    loadRecentActions(),
  ]);

  return (
    <AdminShell section="overview" title="Apžvalga" subtitle={weekday(new Date())} username={check.username ?? check.userId}>
      <section>
        <SectionTitle accent="content" title="Laukia sprendimo" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.filter((c) => c.key !== "mfaReset" || mfaResetEnabled()).map((c) => {
            const item = ALL_ITEMS.find((i) => i.key === c.key)!;
            const n = c.count ? counts[c.count] : undefined;
            const { Icon } = item;
            return (
              <li key={c.key}>
                <Link prefetch={false}
                  href={item.href}
                  className={`${card} flex h-full flex-col gap-2 p-5 transition-colors hover:bg-app-input focus-visible:ring-2 focus-visible:ring-app-accent/40 focus-visible:outline-none`}
                >
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-app-ink">
                    <Icon size={18} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
                    {c.label}
                  </span>
                  {/* Visos kortelės – to paties pavidalo: skaičius (0 ir „—“ – faint), po juo sakinys. */}
                  <span
                    className={`text-[32px] leading-none font-bold tabular-nums ${typeof n === "number" && n > 0 ? "text-app-ink" : "text-app-faint"}`}
                  >
                    {typeof n === "number" ? n : "—"}
                  </span>
                  <span className="text-[13px] text-app-muted">
                    {n === null
                      ? "Skaičiaus gauti nepavyko – atidarykite eilę."
                      : n === undefined
                        ? c.note
                        : n > 0
                          ? // „seniausias – prieš N d.“ (design 2 sk.); nežinant – ankstesnis sakinys.
                            ((c.count ? oldestNote(oldest[c.count]) : null) ?? c.note ?? "Laukia sprendimo")
                          : "Viskas sutvarkyta"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${card} mt-8 p-5 sm:p-6`}>
        <SectionTitle accent="account" title="Rasti naudotoją" note="Pagal vardą, @vardą ar telefono numerį." />
        <form action="/admin/data" className="flex flex-wrap gap-2">
          <input type="hidden" name="table" value="profiles" />
          <SearchField name="q" required placeholder="Vardas, @vardas ar telefonas" label="Ieškoti naudotojo" icon="search" />
          <button type="submit" className={`${btn} max-sm:w-full`}>
            Ieškoti
          </button>
        </form>
      </section>

      {/* Paskutiniai veiksmai (design 2 sk.) – 5 eilutės iš žurnalo: kas, ką, kada. Nepavykus – skilties nėra. */}
      {recent && recent.length > 0 ? (
        <section className={`${card} mt-8 p-5 sm:p-6`}>
          <SectionTitle title="Paskutiniai veiksmai" note="Iš administratorių žurnalo." />
          <ul className="divide-y divide-app-hairline">
            {recent.map((a) => (
              <li key={a.id} className="flex flex-col gap-0.5 py-2.5 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="min-w-0 break-words text-app-ink">
                  <span className="font-semibold">{a.who ?? "Administratorius"}</span> {actionLabel(a.action)}
                  {a.targetType === "profile" && a.targetId ? (
                    <>
                      {" · "}
                      <Link prefetch={false} href={`/admin/users/${a.targetId}`} className="font-medium text-app-accent hover:underline">
                        paskyra
                      </Link>
                    </>
                  ) : null}
                </span>
                <span className="shrink-0 text-[13px] text-app-muted tabular-nums">{formatWhen(a.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AdminShell>
  );
}
