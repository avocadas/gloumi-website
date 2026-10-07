import { IconInbox } from "@/components/icons";
import { ReportCard, type ReportView } from "./ReportCard";
import { EmptyState, STROKE, chip, chipActive } from "./ui";

export const STATUS_LABEL: Record<string, string> = {
  open: "Atviri",
  reviewed: "Peržiūrėti",
  dismissed: "Atmesti",
};

const EMPTY_TEXT: Record<string, string> = {
  open: "Atvirų skundų nėra",
  reviewed: "Peržiūrėtų skundų nėra",
  dismissed: "Atmestų skundų nėra",
};

/*
 * Skundų eilė: būsenos su skaičiais viršuje (be jų tektų atidaryti kiekvieną,
 * kad sužinotum, ar ten kas nors yra), po jomis — kortelės arba tuščia būsena.
 */
export function ReportQueue({
  wanted,
  counts,
  views,
}: {
  wanted: string;
  counts: Record<string, number | null>;
  views: ReportView[];
}) {
  return (
    <>
      <nav aria-label="Skundų būsena" className="mb-6 flex flex-wrap gap-2">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <a
            key={key}
            href={`/admin?status=${key}`}
            aria-current={key === wanted ? "page" : undefined}
            className={key === wanted ? chipActive : chip}
          >
            {label}
            {counts[key] !== null && counts[key] !== undefined ? (
              <span className="rounded-full bg-app-band px-2 py-0.5 text-xs font-bold tabular-nums text-app-ink">
                {counts[key]}
              </span>
            ) : null}
          </a>
        ))}
      </nav>

      {views.length === 0 ? (
        <EmptyState tone="rose" icon={<IconInbox size={24} strokeWidth={STROKE} aria-hidden />} title={EMPTY_TEXT[wanted]}>
          Naujas skundas atsiras čia, kai kas nors programėlėje paspaus „Pranešti“.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {views.map((v) => (
            <li key={v.id}>
              <ReportCard report={v} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
