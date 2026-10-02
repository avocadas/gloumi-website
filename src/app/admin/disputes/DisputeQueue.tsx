import { Scale, UserRound } from "lucide-react";
import { EmptyState, STROKE, SectionTitle, card, chip, chipActive } from "../ui";
import { DisputeCard, type DisputeView } from "./DisputeCard";

/** Būsenų mygtukai; `all` — visi, kitos — `booking_disputes.status`. */
export const DISPUTE_FILTERS: { key: string; label: string }[] = [
  { key: "open", label: "Atviri" },
  { key: "refund", label: "Grąžinama" },
  { key: "release", label: "Išmokama" },
  { key: "lost", label: "Bankas: klientui" },
  { key: "closed", label: "Uždaryti" },
  { key: "all", label: "Visi" },
];

const EMPTY_TEXT: Record<string, string> = {
  open: "Atvirų ginčų nėra",
  all: "Ginčų dar nebuvo",
};

export type HeldMaster = { id: string; name: string };

/*
 * Ginčų eilė (#147): būsenos su skaičiais, kortelės, o apačioje meistrai,
 * kurių išmokos sulaikytos dėl DAC7. Pastarųjų administratorius nesprendžia —
 * įvedus duomenis sulaikymas baigiasi kitą naktį pats, — todėl tai tik
 * sąrašas, be mygtukų.
 */
export function DisputeQueue({
  wanted,
  counts,
  disputes,
  held,
}: {
  wanted: string;
  counts: Record<string, number>;
  disputes: DisputeView[];
  held: HeldMaster[] | null;
}) {
  return (
    <div className="space-y-10">
      <div>
        <nav aria-label="Ginčų būsena" className="mb-6 flex flex-wrap gap-2">
          {DISPUTE_FILTERS.map(({ key, label }) => (
            <a
              key={key}
              href={key === "open" ? "/admin/disputes" : `/admin/disputes?status=${key}`}
              aria-current={key === wanted ? "page" : undefined}
              className={key === wanted ? chipActive : chip}
            >
              {label}
              <span className="rounded-full bg-app-band px-2 py-0.5 text-xs font-bold tabular-nums text-app-ink">
                {counts[key] ?? 0}
              </span>
            </a>
          ))}
        </nav>

        {disputes.length === 0 ? (
          <EmptyState
            tone="peach"
            icon={<Scale size={24} strokeWidth={STROKE} aria-hidden />}
            title={EMPTY_TEXT[wanted] ?? "Šioje būsenoje ginčų nėra"}
          >
            Ginčas atsiranda, kai klientas per 3 dienas po vizito paspaudžia „Vizitas neįvyko?“ arba bankas praneša
            apie kortelės ginčą. Kol jis atviras, išmoka meistrui neperverama.
          </EmptyState>
        ) : (
          <ul className="space-y-4">
            {disputes.map((d) => (
              <li key={d.bookingId}>
                <DisputeCard dispute={d} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {held ? (
        <section>
          <SectionTitle
            accent="value"
            title="Išmokos sulaikytos dėl DAC7"
            note="Meistrai, kurie po dviejų priminimų ir 60 dienų nepateikė DAC7 duomenų. Įvedus duomenis, sulaikymas baigiasi kitą naktį pats."
          />
          {held.length === 0 ? (
            <p className={`${card} p-5 text-sm text-app-muted`}>Nė vieno.</p>
          ) : (
            <ul className={`${card} divide-y divide-app-hairline overflow-hidden`}>
              {held.map((m) => (
                <li key={m.id}>
                  <a
                    href={`/admin/users/${m.id}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-app-ink transition-colors hover:bg-app-surface"
                  >
                    <UserRound size={16} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
                    {m.name || m.id}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
