import { LifeBuoy } from "lucide-react";
import { EmptyState, STROKE, chip, chipActive } from "../ui";
import { TicketCard, type TicketView } from "./TicketCard";

/** Būsenų mygtukai; `all` — visos, kitos — `support_tickets.status`. */
export const SUPPORT_FILTERS: { key: string; label: string }[] = [
  { key: "open", label: "Atviros" },
  { key: "closed", label: "Išspręstos" },
  { key: "all", label: "Visos" },
];

const EMPTY_TEXT: Record<string, string> = {
  open: "Atvirų užklausų nėra",
  closed: "Išspręstų užklausų dar nėra",
  all: "Užklausų dar nebuvo",
};

/* Pagalbos eilė (#209): būsenos su skaičiais ir kortelės, kaip ginčų eilėje. */
export function SupportQueue({
  wanted,
  counts,
  tickets,
}: {
  wanted: string;
  counts: Record<string, number>;
  tickets: TicketView[];
}) {
  return (
    <div>
      <nav aria-label="Užklausų būsena" className="mb-6 flex flex-wrap gap-2">
        {SUPPORT_FILTERS.map(({ key, label }) => (
          <a
            key={key}
            href={key === "open" ? "/admin/support" : `/admin/support?status=${key}`}
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

      {tickets.length === 0 ? (
        <EmptyState
          tone="mint"
          icon={<LifeBuoy size={24} strokeWidth={STROKE} aria-hidden />}
          title={EMPTY_TEXT[wanted] ?? "Užklausų nėra"}
        >
          Užklausa atsiranda, kai žmogus programėlėje parašo „Pagalba → Neradote atsakymo?“ arba vizite paspaudžia
          „Pranešti apie problemą“.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {tickets.map((t) => (
            <li key={t.id}>
              <TicketCard ticket={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
