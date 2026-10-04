"use client";

import { Fragment, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, Clock, ImageOff, Pencil, Trash2, UserRound } from "lucide-react";
import type { CatalogKind, DataRow, SignedMedia } from "@/lib/admin-data";
import { editText, removeRow } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { MODERATED_TABLES } from "../moderated-tables";
import { RuleSelect } from "../ModerationRules";
import { UUID_PATTERN, columnLabel, formatValue, formatWhen, ownerLabel } from "../format";
import { STROKE, Tag, btn, btnDanger, btnQuiet, card, eyebrow, input } from "../ui";

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
 * Viena naršyklės eilutė (#129). Sandara visada ta pati, kad keliasdešimt
 * kortelių iš eilės būtų skaitomos akimis, ne perskaitomos:
 * kada ir kieno → nuotraukos ir svarbiausi tekstai → visi laukai → veiksmai.
 *
 * Trynimas klausia viename lange (`useConfirm`): ką trinsi, kas dingsta
 * kartu ir kodėl — atšaukus langą, trynimas atšaukiamas. Nepavykęs veiksmas
 * rodomas, ne nutylimas: `row_not_found` reiškia, kad mygtukas nieko
 * nepadarė, ir administratorius turi tai žinoti.
 *
 * Ir trynimas, ir taisymas prašo priežasties, o kitiems matomam turiniui
 * (`MODERATED_TABLES`) — ir taisyklių punkto (#169): tada db autoriui
 * nusiunčia pranešimą su abiem.
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
  const [saved, setSaved] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [reason, setReason] = useState("");
  const [rule, setRule] = useState("");
  const [dialog, ask] = useConfirm();

  const { row, key } = entry;
  const canRemove = kind === "content";
  const canEdit = kind !== "view";
  const moderated = MODERATED_TABLES.has(table);
  const canSave = reason.trim() !== "" && (!moderated || rule !== "");
  const stamp = row.created_at ?? row.updated_at;
  const texts = highlightCols.filter((c) => c in row);
  const ownerLinks = owners.filter((c) => typeof row[c] === "string" && UUID_PATTERN.test(row[c] as string));
  const fields = Object.entries(row);

  const remove = async () => {
    const answer = await ask({
      title: "Ištrinti šią eilutę?",
      body: [
        cascadeNote,
        "Ištrinta eilutė įrašoma į administratorių žurnalą, bet atstatyti jos negalima.",
        moderated ? "Autorius programėlėje gaus pranešimą su priežastimi ir punktu." : null,
      ],
      confirmLabel: "Ištrinti",
      danger: true,
      rule: moderated ? true : "optional",
      reasonRequired: true,
    });
    if (!answer) return;

    setError(null);
    startTransition(async () => {
      const res = await removeRow(table, key, answer.reason, answer.rule);
      if (res.ok) setRemoved(true);
      else setError(res.error);
    });
  };

  const startEdit = (column: string) => {
    setEditing(column);
    setDraft(typeof row[column] === "string" ? (row[column] as string) : "");
    setReason("");
    setRule("");
    setSaved(null);
    setError(null);
  };

  const save = () => {
    if (!editing || !canSave) return;
    const column = editing;
    setError(null);
    startTransition(async () => {
      const res = await editText(table, key, column, draft, reason, rule || null);
      if (res.ok) {
        setEditing(null);
        setSaved(column);
      } else setError(res.error);
    });
  };

  return (
    <article className={`${card} p-5 transition-opacity sm:p-6 ${removed ? "opacity-60" : ""}`}>
      {dialog}
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {ownerLinks.map((c) => (
            <a
              key={c}
              href={`/admin/users/${row[c] as string}`}
              title="Atidaryti paskyrą"
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-app-sheet px-2.5 text-xs font-semibold text-app-ink transition-colors hover:bg-app-input"
            >
              <UserRound size={13} strokeWidth={STROKE} aria-hidden />
              {ownerLabel(c)}
            </a>
          ))}
          {removed ? <Tag tone="danger">Ištrinta</Tag> : null}
        </div>
        {stamp ? (
          <span className="inline-flex items-center gap-1 text-xs tabular-nums text-app-muted">
            <Clock size={13} strokeWidth={STROKE} aria-hidden />
            {formatWhen(stamp)}
          </span>
        ) : null}
      </header>

      {mediaIds.length > 0 || texts.length > 0 ? (
        <div className="mt-4 flex flex-col gap-5 sm:flex-row">
          {mediaIds.length > 0 ? (
            <div className="flex shrink-0 flex-wrap gap-2 sm:w-[136px]">
              {mediaIds.map((id) => (
                <MediaPreview key={id} signed={media[id]} />
              ))}
            </div>
          ) : null}

          {texts.length > 0 ? (
            <dl className="min-w-0 flex-1 space-y-4">
              {texts.map((c) => (
                <div key={c}>
                  <dt className="flex items-center justify-between gap-3">
                    <span className={`${eyebrow} text-app-muted`} title={c}>
                      {columnLabel(c)}
                    </span>
                    {canEdit && editCols.includes(c) && !removed && editing !== c ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => startEdit(c)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-app-body transition-colors hover:bg-app-input disabled:opacity-40"
                      >
                        <Pencil size={13} strokeWidth={STROKE} aria-hidden />
                        Taisyti
                      </button>
                    ) : saved === c ? (
                      <Tag tone="ok">Išsaugota</Tag>
                    ) : null}
                  </dt>
                  {editing === c ? (
                    <dd className="mt-2 space-y-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        maxLength={5000}
                        rows={4}
                        autoFocus
                        aria-label={`Naujas tekstas: ${columnLabel(c)}`}
                        className={`${input} h-auto resize-y py-3 leading-relaxed`}
                      />
                      <label className="block pt-1">
                        <span className="text-[13px] font-semibold text-app-ink">
                          Pagrindas{" "}
                          <span className="font-normal text-app-muted">
                            {moderated ? "— pažeistas taisyklių punktas" : "— nebūtina"}
                          </span>
                        </span>
                        <RuleSelect value={rule} onChange={setRule} required={moderated} className={`${input} mt-2`} />
                      </label>
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={500}
                        required
                        placeholder={
                          moderated
                            ? "Priežastis — privaloma; ją matys ir autorius"
                            : "Priežastis — privaloma, matys tik administratoriai"
                        }
                        aria-label="Taisymo priežastis"
                        className={input}
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" disabled={pending} onClick={() => setEditing(null)} className={btnQuiet}>
                          Atšaukti
                        </button>
                        <button type="button" disabled={pending || !canSave} onClick={save} className={btn}>
                          Išsaugoti
                        </button>
                      </div>
                    </dd>
                  ) : (
                    <dd className="mt-1 max-h-48 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap break-words text-app-ink">
                      {formatValue(row[c])}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      <details className="group mt-4 rounded-[14px] bg-app-surface">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-app-body [&::-webkit-details-marker]:hidden">
          <span>Visi laukai</span>
          <span className="tabular-nums text-app-faint">({fields.length})</span>
          <ChevronDown
            size={16}
            strokeWidth={STROKE}
            aria-hidden
            className="ml-auto text-app-faint transition-transform group-open:rotate-180"
          />
        </summary>
        <dl className="grid grid-cols-1 border-t border-app-hairline px-4 py-3 text-xs sm:grid-cols-[minmax(0,11rem)_1fr]">
          {fields.map(([col, value]) => (
            <Fragment key={col}>
              <dt className="pt-2 font-mono text-[11px] text-app-faint sm:border-b sm:border-app-hairline sm:pb-2 sm:last-of-type:border-0">
                {col}
              </dt>
              <dd className="min-w-0 border-b border-app-hairline pb-2 whitespace-pre-wrap break-words text-app-ink last-of-type:border-0 sm:pt-2">
                {formatValue(value)}
              </dd>
            </Fragment>
          ))}
        </dl>
      </details>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}

      {canRemove && !removed ? (
        <footer className="mt-4 flex justify-end border-t border-app-hairline pt-4">
          <button type="button" disabled={pending} onClick={remove} className={btnDanger}>
            <Trash2 size={16} strokeWidth={STROKE} aria-hidden />
            Ištrinti
          </button>
        </footer>
      ) : null}

      {/* Paskyros eilutės čia netrinamos — tik visa paskyra, jos puslapyje. Be
          aiškaus mygtuko kortelė atrodė kaip aklavietė: į tą puslapį vedė tik
          mažas ženkliukas viršuje (developeris 2026-10-02, ieškodamas, kaip
          ištrinti testinę paskyrą). */}
      {kind === "account" && ownerLinks.length > 0 ? (
        <footer className="mt-4 flex flex-col gap-3 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-app-muted">Užblokuoti ir ištrinti galima paskyros puslapyje.</p>
          <a href={`/admin/users/${row[ownerLinks[0]] as string}`} className={btn}>
            <UserRound size={16} strokeWidth={STROKE} aria-hidden />
            Atidaryti paskyrą
            <ChevronRight size={16} strokeWidth={STROKE} aria-hidden />
          </a>
        </footer>
      ) : null}
    </article>
  );
}

/** Įrašo kadras 4:5 (`theme.js` `POST_ASPECT`) — tas pats, kurį mato programėlė. */
function MediaPreview({ signed }: { signed: SignedMedia | undefined }) {
  const box = "aspect-[4/5] w-[136px] rounded-[14px] bg-app-input";
  if (!signed) {
    return (
      <span className={`${box} flex flex-col items-center justify-center gap-1.5 p-3 text-center text-[11px] text-app-muted`}>
        <ImageOff size={20} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
        Peržiūra nepasiekiama
      </span>
    );
  }
  if (signed.contentType.startsWith("video/")) {
    return <video src={signed.url} controls preload="metadata" className={`${box} object-cover`} />;
  }
  if (signed.contentType.startsWith("audio/")) {
    return <audio src={signed.url} controls preload="none" className="w-full" />;
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
        className={`${box} object-cover transition-opacity hover:opacity-90`}
      />
    </a>
  );
}
