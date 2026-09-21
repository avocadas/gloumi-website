"use client";

import { useState, useTransition } from "react";
import { moderate, setSuspended } from "./actions";

export type ReportView = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  details: string | null;
  createdAt: string;
  status: string;
  reporterName: string | null;
  preview: string | null;
  authorId: string | null;
};

const TARGET_LABEL: Record<string, string> = {
  post: "Įrašas",
  comment: "Komentaras",
  story: "Story",
  message: "Žinutė",
  profile: "Profilis",
};

/**
 * One report, with the actions that close it.
 *
 * WHY EVERY DESTRUCTIVE BUTTON ASKS FIRST
 * ---------------------------------------
 * Deleting someone's work and suspending an account are both irreversible
 * from this screen. A moderation queue is a list of near-identical cards read
 * quickly, which is exactly the shape where a misplaced click happens — so
 * the confirmation is not politeness, it is the thing that makes a fast queue
 * safe.
 *
 * WHY FAILURES ARE SHOWN AND NOT SWALLOWED
 * ----------------------------------------
 * `admin_moderate()` treats "zero rows affected" as an error on purpose: if
 * the content was already gone, the operator has to know that the button did
 * nothing. Hiding that would leave them believing they cleaned something up.
 */
export function ReportCard({ report }: { report: ReportView }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  const canDelete = report.targetType === "post" || report.targetType === "comment";
  const deleteAction = report.targetType === "post" ? "delete_post" : "delete_comment";

  return (
    <article
      className={`rounded-2xl border border-sand-300 bg-cream-50 p-5 ${done ? "opacity-50" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-espresso-500">
        <span className="rounded bg-sand-200 px-2 py-1 font-bold uppercase tracking-wide text-espresso-700">
          {TARGET_LABEL[report.targetType] ?? report.targetType}
        </span>
        <span>{new Date(report.createdAt).toLocaleString("lt-LT")}</span>
        {report.reporterName ? <span>· pranešė {report.reporterName}</span> : null}
      </div>

      {report.reason ? (
        <p className="mt-3 text-sm font-semibold text-espresso-900">{report.reason}</p>
      ) : null}
      {report.details ? (
        <p className="mt-1 text-sm text-espresso-600">{report.details}</p>
      ) : null}

      <p className="mt-3 rounded-xl bg-cream-200 p-3 text-sm text-espresso-700">
        {report.preview ?? "Turinio nebėra — jis jau ištrintas."}
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-terracotta-500">
          {error}
        </p>
      ) : null}

      {done ? (
        <p className="mt-3 text-sm font-semibold text-espresso-600">Atlikta.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {canDelete && report.preview !== null ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(
                  () => moderate(deleteAction, report.targetId),
                  "Ištrinti šį turinį? Jis bus pašalintas visiems, ir atšaukti negalima.",
                )
              }
              className="rounded-full bg-espresso-900 px-4 py-2 text-sm font-semibold text-cream-50 disabled:opacity-50"
            >
              Ištrinti turinį
            </button>
          ) : null}

          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => moderate("review_report", report.id))}
            className="rounded-full border border-sand-400 px-4 py-2 text-sm font-semibold text-espresso-700 disabled:opacity-50"
          >
            Pažymėti peržiūrėtu
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => moderate("dismiss_report", report.id))}
            className="rounded-full border border-sand-400 px-4 py-2 text-sm font-semibold text-espresso-700 disabled:opacity-50"
          >
            Atmesti pranešimą
          </button>

          {report.authorId ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                run(
                  () => setSuspended(report.authorId!, true),
                  "Sustabdyti šią paskyrą? Žmogus nebegalės prisijungti, o esami seansai nustos galioti.",
                )
              }
              className="rounded-full border border-terracotta-400 px-4 py-2 text-sm font-semibold text-terracotta-500 disabled:opacity-50"
            >
              Sustabdyti autorių
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}
