"use client";

import { Fragment, useState, useTransition } from "react";
import type { CatalogKind, DataRow, SignedMedia } from "@/lib/admin-data";
import { editText, removeRow } from "../actions";
import { formatValue, UUID_PATTERN } from "../format";

type Props = {
  table: string;
  kind: CatalogKind;
  editCols: string[];
  owners: string[];
  highlightCols: string[];
  entry: DataRow;
  mediaIds: string[];
  media: Record<string, SignedMedia>;
  cascadeNote: string | null;
};

/*
 * Viena naršyklės eilutė (#129): nuotraukos, svarbiausi tekstai, visi laukai
 * ir veiksmai.
 *
 * Kodėl trynimas klausia du kartus — patvirtinimo ir priežasties: kortelių
 * sąrašas skaitomas greitai, o būtent tokioje vietoje ir pataikoma ne ten.
 * Atšaukus priežasties langą, trynimas atšaukiamas: tai paskutinė proga
 * apsigalvoti, ne formalumas.
 *
 * Nepavykęs veiksmas rodomas, ne nutylimas: `row_not_found` reiškia, kad
 * mygtukas nieko nepadarė, ir administratorius turi tai žinoti.
 */
export function RowCard({
  table,
  kind,
  editCols,
  owners,
  highlightCols,
  entry,
  mediaIds,
  media,
  cascadeNote,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [reason, setReason] = useState("");

  const { row, key } = entry;
  const canRemove = kind === "content";
  const canEdit = kind !== "view";
  const stamp = row.created_at ?? row.updated_at;
  const texts = highlightCols.filter((c) => c in row);
  const ownerLinks = owners.filter((c) => typeof row[c] === "string" && UUID_PATTERN.test(row[c] as string));

  const remove = () => {
    const warning = [
      "Ištrinti šią eilutę visam laikui?",
      cascadeNote,
      "Ištrinta eilutė įrašoma į administratorių žurnalą.",
    ]
      .filter(Boolean)
      .join("\n\n");
    if (!window.confirm(warning)) return;
    const why = window.prompt("Priežastis (nebūtina, matys tik administratoriai):", "");
    if (why === null) return;

    setError(null);
    startTransition(async () => {
      const res = await removeRow(table, key, why);
      if (res.ok) setRemoved(true);
      else setError(res.error);
    });
  };

  const startEdit = (column: string) => {
    setEditing(column);
    setDraft(typeof row[column] === "string" ? (row[column] as string) : "");
    setReason("");
    setError(null);
  };

  const save = () => {
    if (!editing) return;
    const column = editing;
    setError(null);
    startTransition(async () => {
      const res = await editText(table, key, column, draft, reason);
      if (res.ok) setEditing(null);
      else setError(res.error);
    });
  };

  return (
    <article className={`rounded-2xl border border-sand-300 bg-cream-50 p-5 ${removed ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-espresso-500">
        {stamp ? <span>{formatValue(stamp)}</span> : null}
        {ownerLinks.map((c) => (
          <a
            key={c}
            href={`/admin/users/${row[c] as string}`}
            className="font-semibold text-terracotta-600 hover:underline"
          >
            {c} → paskyra
          </a>
        ))}
      </div>

      {mediaIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {mediaIds.map((id) => (
            <MediaPreview key={id} signed={media[id]} />
          ))}
        </div>
      ) : null}

      {texts.length > 0 ? (
        <dl className="mt-3 space-y-3">
          {texts.map((c) => (
            <div key={c}>
              <dt className="text-xs font-bold uppercase tracking-wide text-espresso-500">{c}</dt>
              {editing === c ? (
                <dd className="mt-1 space-y-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={5000}
                    rows={4}
                    aria-label={`Naujas ${c} tekstas`}
                    className="w-full rounded-xl border border-sand-300 bg-white p-3 text-sm text-espresso-900"
                  />
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={500}
                    placeholder="Priežastis (nebūtina)"
                    aria-label="Taisymo priežastis"
                    className="w-full rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-espresso-900 placeholder:text-espresso-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={save}
                      className="rounded-full bg-espresso-900 px-4 py-2 text-sm font-semibold text-cream-50 disabled:opacity-50"
                    >
                      Išsaugoti
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => setEditing(null)}
                      className="rounded-full border border-sand-400 px-4 py-2 text-sm font-semibold text-espresso-700 disabled:opacity-50"
                    >
                      Atšaukti
                    </button>
                  </div>
                </dd>
              ) : (
                <dd className="mt-1 flex items-start justify-between gap-3">
                  <span className="max-h-48 min-w-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words text-sm text-espresso-900">
                    {formatValue(row[c])}
                  </span>
                  {canEdit && editCols.includes(c) && !removed ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => startEdit(c)}
                      className="shrink-0 text-sm font-semibold text-terracotta-600 hover:underline disabled:opacity-50"
                    >
                      Taisyti
                    </button>
                  ) : null}
                </dd>
              )}
            </div>
          ))}
        </dl>
      ) : null}

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-espresso-600">
          Visi laukai ({Object.keys(row).length})
        </summary>
        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-[minmax(0,12rem)_1fr]">
          {Object.entries(row).map(([col, value]) => (
            <Fragment key={col}>
              <dt className="font-semibold text-espresso-600">{col}</dt>
              <dd className="min-w-0 whitespace-pre-wrap break-words text-espresso-900">{formatValue(value)}</dd>
            </Fragment>
          ))}
        </dl>
      </details>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-terracotta-500">
          {error}
        </p>
      ) : null}

      {removed ? (
        <p className="mt-3 text-sm font-semibold text-espresso-600">Ištrinta.</p>
      ) : canRemove ? (
        <div className="mt-4">
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="rounded-full bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-700 disabled:opacity-50"
          >
            Ištrinti
          </button>
        </div>
      ) : null}
    </article>
  );
}

function MediaPreview({ signed }: { signed: SignedMedia | undefined }) {
  if (!signed) {
    return (
      <span className="flex h-32 w-32 items-center justify-center rounded-xl bg-sand-200 p-2 text-center text-xs text-espresso-600">
        Peržiūra nepasiekiama
      </span>
    );
  }
  if (signed.contentType.startsWith("video/")) {
    return <video src={signed.url} controls preload="metadata" className="h-48 max-w-full rounded-xl bg-sand-200" />;
  }
  if (signed.contentType.startsWith("audio/")) {
    return <audio src={signed.url} controls preload="none" className="max-w-full" />;
  }
  return (
    <a href={signed.url} target="_blank" rel="noopener noreferrer" title="Atidaryti visą">
      {/* eslint-disable-next-line @next/next/no-img-element -- naudotojų failai neturi eiti per Vercel optimizatorių, o parašas galioja tik valandą */}
      <img
        src={signed.url}
        alt="Naudotojo įkelta nuotrauka"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-48 w-auto max-w-full rounded-xl bg-sand-200 object-cover"
      />
    </a>
  );
}
