"use client";

import { Fragment, useState, useTransition } from "react";
import { IconChevronDown, IconChevronRight, IconClock, IconPencil, IconProfile, IconTrash } from "@/components/icons";
import type { CatalogKind, DataRow, LockedMedia, SignedMedia } from "@/lib/admin-data";
import { editText, removeRow } from "../actions";
import { ChatReader } from "../ChatReader";
import type { ChatTarget } from "../chat-read";
import { useConfirm } from "../ConfirmDialog";
import { HoldBooking, canHold } from "../disputes/HoldBooking";
import { ReplyVisibility } from "../ReplyVisibility";
import { MediaPreview } from "../MediaPreview";
import { MODERATED_TABLES } from "../moderated-tables";
import type { NoticeNote } from "../moderation-email";
import { RuleSelect } from "../ModerationRules";
import { UUID_PATTERN, columnLabel, formatValue, formatWhen, ownerLabel } from "../format";
import { ActionNote, Alert, btn, btnDanger, btnPrimary, btnQuiet, card, eyebrow, Field, input, STROKE, Tag } from "../ui";

type Props = {
  table: string;
  kind: CatalogKind;
  editCols: string[];
  owners: string[];
  highlightCols: string[];
  entry: DataRow;
  mediaIds: string[];
  media: Record<string, SignedMedia>;
  /** Pokalbio priedai, kurių šis administratorius dar neskaitė su pagrindu (A-16). */
  lockedMedia?: Record<string, LockedMedia>;
  cascadeNote: string | null;
  /** Ar bazėje jau yra `admin_read_chat` (A-16): tik tada pokalbių eilutėse – „Skaityti (reikia pagrindo)“. */
  chatRead?: boolean;
};

/** Kurį pokalbį skaityti iš šios eilutės: `chats` – ji pati, `messages` – jos pokalbis. */
function chatTargetOf(table: string, row: Record<string, unknown>): ChatTarget | null {
  if (table === "chats" && typeof row.id === "string") return { chatId: row.id };
  if (table === "messages") {
    if (typeof row.chat_id === "string") return { chatId: row.chat_id };
    if (typeof row.id === "string") return { messageId: row.id };
  }
  return null;
}

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
  lockedMedia = {},
  cascadeNote,
  chatRead = false,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
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
  // Užrakintas priedas (A-16) – jo pokalbį galima perskaityti su pagrindu, kaip ir pokalbio eilutę.
  const lockedChat = Object.values(lockedMedia)[0]?.chatId;
  const chatTarget = chatRead ? (chatTargetOf(table, row) ?? (lockedChat ? { chatId: lockedChat } : null)) : null;

  const remove = async () => {
    const answer = await ask({
      title: "Ištrinti šią eilutę?",
      body: [
        cascadeNote,
        "Ištrinta eilutė įrašoma į administratorių žurnalą, bet atstatyti jos negalima.",
        moderated
          ? "Autorius gaus pranešimą su priežastimi ir punktu — programėlėje ir, jei leidžia laiškų riba, el. paštu."
          : null,
      ],
      confirmLabel: "Ištrinti",
      danger: true,
      rule: moderated ? true : "optional",
      reasonRequired: true,
    });
    if (!answer) return;

    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await removeRow(table, key, answer.reason, answer.rule);
      if (res.ok) {
        setRemoved(true);
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  const startEdit = (column: string) => {
    setEditing(column);
    setDraft(typeof row[column] === "string" ? (row[column] as string) : "");
    setReason("");
    setRule("");
    setSaved(null);
    setError(null);
    setNote(null);
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
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  return (
    <article className={`${card} p-5 sm:p-6`}>
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
              <IconProfile size={13} strokeWidth={STROKE} aria-hidden />
              {ownerLabel(c)}
            </a>
          ))}
          {/* Galutinė būsena – neutrali žyma, ne išblukusi kortelė (design §6). */}
          {removed ? <Tag tone="neutral">Ištrinta</Tag> : null}
        </div>
        {stamp ? (
          <span className="inline-flex items-center gap-1 text-xs tabular-nums text-app-muted">
            <IconClock size={13} strokeWidth={STROKE} aria-hidden />
            {formatWhen(stamp)}
          </span>
        ) : null}
      </header>

      {mediaIds.length > 0 || texts.length > 0 ? (
        <div className="mt-4 flex flex-col gap-5 sm:flex-row">
          {mediaIds.length > 0 ? (
            <div className="flex shrink-0 flex-wrap gap-2 sm:w-[136px]">
              {mediaIds.map((id) => (
                <MediaPreview key={id} signed={media[id]} locked={id in lockedMedia} />
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
                        className={btn}
                      >
                        <IconPencil size={16} strokeWidth={STROKE} aria-hidden />
                        Taisyti
                      </button>
                    ) : saved === c ? (
                      <Tag tone="ok">Išsaugota</Tag>
                    ) : null}
                  </dt>
                  {editing === c ? (
                    <dd className="mt-2 space-y-3">
                      {/* Matomi užrašai virš kiekvieno lauko (design 7.7), ne tik `aria-label` ar placeholder. */}
                      <Field label="Naujas tekstas" htmlFor={`edit-${c}`}>
                        <textarea
                          id={`edit-${c}`}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          maxLength={5000}
                          rows={4}
                          autoFocus
                          className={`${input} h-auto resize-y py-3 leading-relaxed`}
                        />
                      </Field>
                      <Field
                        label="Pagrindas"
                        htmlFor={`rule-${c}`}
                        hint={moderated ? "Pažeistas taisyklių punktas – privaloma." : "Nebūtina."}
                      >
                        <RuleSelect id={`rule-${c}`} value={rule} onChange={setRule} required={moderated} className={input} />
                      </Field>
                      <Field
                        label="Priežastis"
                        htmlFor={`reason-${c}`}
                        hint={moderated ? "Privaloma; ją matys ir autorius." : "Privaloma; matys tik administratoriai."}
                      >
                        <input
                          id={`reason-${c}`}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          maxLength={500}
                          required
                          className={input}
                        />
                      </Field>
                      <div className="flex justify-end gap-2">
                        <button type="button" disabled={pending} onClick={() => setEditing(null)} className={btnQuiet}>
                          Atšaukti
                        </button>
                        <button type="button" disabled={pending || !canSave} onClick={save} className={btnPrimary}>
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
          <IconChevronDown
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
        <Alert className="mt-4">
          {error}
        </Alert>
      ) : null}
      <ActionNote note={note} />

      {/* A-16: pokalbio tekstas naršyklėje nerodomas – tik su pagrindu, ir skaitymas įrašomas į žurnalą. */}
      {chatTarget && !removed ? (
        <div className="mt-4 border-t border-app-hairline pt-4">
          <ChatReader target={chatTarget} />
        </div>
      ) : null}

      {/* K-U24-4: vizitą, kurio pinigai dar Gloumi rankose, galima sulaikyti ginču. */}
      {table === "bookings" && typeof row.id === "string" && canHold(row) ? <HoldBooking bookingId={row.id} /> : null}

      {/* U-19: meistro atsakymą galima paslėpti ir vėl rodyti, ne tik ištrinti. */}
      {table === "review_replies" && typeof row.id === "string" && !removed ? (
        <div className="mt-4 flex justify-end border-t border-app-hairline pt-4">
          <ReplyVisibility replyId={row.id} hiddenAt={typeof row.hidden_at === "string" ? row.hidden_at : null} />
        </div>
      ) : null}

      {canRemove && !removed ? (
        <footer className="mt-4 flex justify-end border-t border-app-hairline pt-4">
          <button type="button" disabled={pending} onClick={remove} className={btnDanger}>
            <IconTrash size={16} strokeWidth={STROKE} aria-hidden />
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
          <p className="text-[13px] text-app-muted">Sustabdyti ir ištrinti galima paskyros puslapyje.</p>
          <a href={`/admin/users/${row[ownerLinks[0]] as string}`} className={btn}>
            <IconProfile size={16} strokeWidth={STROKE} aria-hidden />
            Atidaryti paskyrą
            <IconChevronRight size={16} strokeWidth={STROKE} aria-hidden />
          </a>
        </footer>
      ) : null}
    </article>
  );
}
