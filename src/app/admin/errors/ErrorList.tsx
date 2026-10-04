import { Bug, ExternalLink } from "lucide-react";
import {
  ERROR_PERIODS,
  type ErrorEvent,
  type ErrorIssue,
  type ErrorPeriod,
  type SentryFailure,
  type SentryResult,
} from "@/lib/sentry";
import { formatWhen } from "../format";
import { EmptyState, STROKE, Tag, card, chip, chipActive, eyebrow } from "../ui";

/*
 * Programėlės klaidos portale (Gloumi #29). Abu komponentai tik piešia tai, ką
 * puslapis gavo iš `src/lib/sentry.ts`: jokių veiksmų, jokios būsenos, todėl
 * juos galima parodyti ir su netikrais duomenimis.
 *
 * Mygtukų „Išspręsta" ar „Nutildyti" nėra tyčia: jiems raktui reikėtų rašymo
 * teisės, o portalas Sentry tik skaito.
 */

export type ErrorState = "unresolved" | "all";

const PERIOD_LABEL: Record<ErrorPeriod, string> = { "24h": "24 val.", "7d": "7 d.", "30d": "30 d." };
const STATE_LABEL: Record<ErrorState, string> = { unresolved: "Neišspręstos", all: "Visos" };

const LEVEL_TAG: Record<string, { label: string; tone: "danger" | "warn" | "neutral" }> = {
  fatal: { label: "Lūžis", tone: "danger" },
  error: { label: "Klaida", tone: "danger" },
  warning: { label: "Įspėjimas", tone: "warn" },
  info: { label: "Informacija", tone: "neutral" },
  debug: { label: "Derinimas", tone: "neutral" },
};

const STATUS_TAG: Record<string, { label: string; tone: "ok" | "neutral" }> = {
  resolved: { label: "Išspręsta", tone: "ok" },
  ignored: { label: "Nutildyta", tone: "neutral" },
};

const FAILURE: Record<SentryFailure, { title: string; text: string }> = {
  not_configured: {
    title: "Sentry neprijungtas",
    text: "Vercel'yje dar nėra rakto SENTRY_READ_TOKEN. Kai jis bus įrašytas, čia atsiras programėlės klaidos.",
  },
  unauthorized: {
    title: "Sentry raktas atmestas",
    text: "Raktas gal atšauktas arba neturi teisės „Issue & Event: Read“. Naują raktą Vercel'yje įrašo developeris.",
  },
  rate_limited: { title: "Sentry laikinai riboja užklausas", text: "Pabandykite po minutės." },
  not_found: { title: "Tokios klaidos nėra", text: "Galbūt ji jau ištrinta: Sentry klaidas laiko 30 dienų." },
  unavailable: {
    title: "Sentry dabar nepasiekiamas",
    text: "Pabandykite vėliau. Jei kartojasi, priežastis – Vercel žurnale (sentry_api).",
  },
};

/** „1 kartas", „3 kartai", „12 kartų". */
function times(n: number): string {
  const tens = n % 100;
  const ones = n % 10;
  if (ones === 1 && tens !== 11) return `${n} kartas`;
  if (ones >= 2 && (tens < 12 || tens > 19)) return `${n} kartai`;
  return `${n} kartų`;
}

function IssueTags({ issue }: { issue: ErrorIssue }) {
  const level = LEVEL_TAG[issue.level];
  const status = STATUS_TAG[issue.status];
  return (
    <>
      {level ? <Tag tone={level.tone}>{level.label}</Tag> : <Tag>{issue.level}</Tag>}
      {issue.isUnhandled ? <Tag tone="rose">Nepagauta</Tag> : null}
      {status ? <Tag tone={status.tone}>{status.label}</Tag> : null}
    </>
  );
}

export function SentryNotice({ failure }: { failure: SentryFailure }) {
  const { title, text } = FAILURE[failure];
  return (
    <EmptyState tone="neutral" icon={<Bug size={24} strokeWidth={STROKE} aria-hidden />} title={title}>
      {text}
    </EmptyState>
  );
}

export function ErrorList({
  period,
  state,
  result,
}: {
  period: ErrorPeriod;
  state: ErrorState;
  result: SentryResult<ErrorIssue[]>;
}) {
  const href = (p: ErrorPeriod, s: ErrorState) => {
    const q = new URLSearchParams();
    if (s !== "unresolved") q.set("state", s);
    if (p !== "7d") q.set("period", p);
    const qs = q.toString();
    return qs ? `/admin/errors?${qs}` : "/admin/errors";
  };

  return (
    <div>
      <nav aria-label="Klaidų filtras" className="mb-6 flex flex-wrap items-center gap-2">
        {(Object.keys(STATE_LABEL) as ErrorState[]).map((s) => (
          <a key={s} href={href(period, s)} aria-current={s === state ? "page" : undefined} className={s === state ? chipActive : chip}>
            {STATE_LABEL[s]}
          </a>
        ))}
        <span aria-hidden className="mx-1 h-5 w-px bg-app-hairline" />
        {ERROR_PERIODS.map((p) => (
          <a key={p} href={href(p, state)} aria-current={p === period ? "page" : undefined} className={p === period ? chipActive : chip}>
            {PERIOD_LABEL[p]}
          </a>
        ))}
      </nav>

      {!result.ok ? (
        <SentryNotice failure={result.failure} />
      ) : result.data.length === 0 ? (
        <EmptyState tone="neutral" icon={<Bug size={24} strokeWidth={STROKE} aria-hidden />} title="Klaidų nėra">
          {"Per šį laikotarpį Sentry klaidų negavo. Programėlė jas siunčia tik iš production build'ų."}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {result.data.map((issue) => (
            <li key={issue.id}>
              <a href={`/admin/errors/${issue.id}`} className={`${card} block p-4 transition-colors hover:bg-app-surface sm:p-5`}>
                <div className="flex flex-wrap items-center gap-2">
                  <IssueTags issue={issue} />
                  <span className="ml-auto text-xs tabular-nums text-app-muted">{issue.shortId}</span>
                </div>
                <p className="mt-2 text-sm font-semibold break-words text-app-ink">{issue.title}</p>
                {issue.culprit ? <p className="mt-0.5 font-mono text-xs break-words text-app-muted">{issue.culprit}</p> : null}
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-app-muted">
                  <span className="font-semibold tabular-nums text-app-ink">{times(issue.count)}</span>
                  <span>Paskutinį kartą {formatWhen(issue.lastSeen)}</span>
                  <span>Pirmą kartą {formatWhen(issue.firstSeen)}</span>
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ErrorDetail({ issue, event }: { issue: ErrorIssue; event: ErrorEvent | null }) {
  const facts: [string, string | null][] = event
    ? [
        ["Programėlės versija", event.appVersion ?? event.release],
        ["Sistema", event.os],
        ["Įrenginys", event.device],
        ["Aplinka", event.environment],
      ]
    : [];

  return (
    <div className="space-y-4">
      <article className={`${card} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center gap-2">
          <IssueTags issue={issue} />
        </div>
        <p className="mt-3 text-base font-semibold break-words text-app-ink">{issue.title}</p>
        {issue.culprit ? <p className="mt-1 font-mono text-xs break-words text-app-muted">{issue.culprit}</p> : null}

        <dl className="mt-4 grid grid-cols-1 divide-y divide-app-band-line overflow-hidden rounded-[14px] bg-app-band sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
            <dt className="text-[11px] text-app-muted">Kiek kartų</dt>
            <dd className="text-sm font-semibold tabular-nums text-app-ink">{times(issue.count)}</dd>
          </div>
          <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
            <dt className="text-[11px] text-app-muted">Pirmą kartą</dt>
            <dd className="text-sm font-semibold tabular-nums text-app-ink">{formatWhen(issue.firstSeen)}</dd>
          </div>
          <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
            <dt className="text-[11px] text-app-muted">Paskutinį kartą</dt>
            <dd className="text-sm font-semibold tabular-nums text-app-ink">{formatWhen(issue.lastSeen)}</dd>
          </div>
        </dl>

        {issue.permalink ? (
          <p className="mt-4 text-xs text-app-muted">
            <a
              href={issue.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-app-ink hover:underline"
            >
              Atidaryti Sentry
              <ExternalLink size={13} strokeWidth={STROKE} aria-hidden />
            </a>{" "}
            — tik su Sentry paskyra.
          </p>
        ) : null}
      </article>

      {event ? (
        <article className={`${card} p-5 sm:p-6`}>
          <p className={`${eyebrow} text-app-muted`}>Naujausias įvykis · {formatWhen(event.dateCreated)}</p>

          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <dt className="text-app-muted">{label}:</dt>
                <dd className="font-semibold break-words text-app-ink">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>

          {event.message ? (
            <p className="mt-4 rounded-[14px] bg-app-sheet p-4 text-sm whitespace-pre-wrap break-words text-app-ink">
              {event.message}
            </p>
          ) : null}

          {event.exceptions.map((e, i) => (
            <div key={i} className="mt-4 rounded-[14px] bg-app-sheet p-4">
              <p className={`${eyebrow} text-app-muted`}>{i === 0 ? e.type : `Priežastis: ${e.type}`}</p>
              <p className="mt-1.5 text-sm whitespace-pre-wrap break-words text-app-ink">{e.value || "—"}</p>
              {e.frames.length > 0 ? (
                <ol className="mt-3 space-y-1 font-mono text-xs break-words">
                  {e.frames.map((f, j) => (
                    <li key={j}>
                      <span className="text-app-ink">{f.fn}</span>{" "}
                      <span className="text-app-muted">
                        {f.file}
                        {f.line !== null ? `:${f.line}` : ""}
                        {f.col !== null ? `:${f.col}` : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
          ))}
        </article>
      ) : (
        <p className={`${card} p-5 text-sm text-app-muted`}>Naujausio įvykio gauti nepavyko – rodoma tik santrauka.</p>
      )}
    </div>
  );
}
