"use client";

import { useId, useState, useTransition } from "react";
import { IconEye, IconLock } from "@/components/icons";
import type { SignedMedia } from "@/lib/admin-data";
import { readChat } from "./actions";
import { CHAT_READ_BASES, type ChatMessage, type ChatReadBasis, type ChatTarget } from "./chat-read";
import { MediaPreview } from "./MediaPreview";
import { formatWhen } from "./format";
import { Alert, Field, STROKE, btn, btnPrimary, btnQuiet, eyebrow, input } from "./ui";

const ROLE_LABEL: Record<string, string> = { client: "Klientas", master: "Meistras" };

/*
 * „Skaityti (reikia pagrindo)“ (teisininko A-16; db `admin_read_chat`).
 * Pokalbio tekstas į puslapį patenka tik paspaudus „Skaityti“ su pagrindu ir
 * nuoroda, o skaitymą bazė įrašo į žurnalą. Iš skundo ar ginčo kortelės
 * pagrindas ir nuoroda jau užpildyti (`preset`), bet juos galima pakeisti.
 * Rodomas tik tada, kai bazėje funkcija jau yra (`chatReadAvailable`).
 */
export function ChatReader({
  target,
  preset,
}: {
  target: ChatTarget;
  preset?: { basis: ChatReadBasis; ref: string };
}) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [basis, setBasis] = useState<ChatReadBasis | "">(preset?.basis ?? "");
  const [ref, setRef] = useState(preset?.ref ?? "");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ messages: ChatMessage[]; media: Record<string, SignedMedia>; basis: string; ref: string } | null>(
    null,
  );
  const chosen = CHAT_READ_BASES.find((b) => b.value === basis);
  const ready = basis !== "" && ref.trim() !== "" && ref.trim().length <= 200;

  const read = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setError(null);
    startTransition(async () => {
      const res = await readChat(target, basis, ref);
      if (res.ok) setResult({ messages: res.messages, media: res.media, basis: chosen?.label ?? basis, ref: ref.trim() });
      else setError(res.error);
    });
  };

  if (result) {
    return (
      <section aria-label="Pokalbio žinutės" className="rounded-[14px] bg-app-sheet p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={`${eyebrow} text-app-muted`}>
            Pokalbis · {result.messages.length} {result.messages.length === 1 ? "žinutė" : "žinutės"}
          </p>
          {/* Back to the button, not to the filled form: another read is logged, so it takes a deliberate second step (design 2026-10-22). */}
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setOpen(false);
            }}
            className={btnQuiet}
          >
            Slėpti
          </button>
        </div>
        <p className="mt-1 text-[12px] text-app-faint">
          Skaitymas įrašytas į žurnalą: {result.basis}, {result.ref}.
        </p>
        {result.messages.length === 0 ? (
          <p className="mt-3 text-sm italic text-app-muted">Pokalbyje žinučių nėra.</p>
        ) : (
          <ol className="mt-3 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {result.messages.map((m) => (
              <li key={m.id} className="rounded-[12px] bg-white p-3 shadow-app-card">
                <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-app-muted">
                  <span className="font-semibold text-app-ink">
                    {(m.senderRole && ROLE_LABEL[m.senderRole]) ?? m.senderRole ?? "Siuntėjas"}
                  </span>
                  {m.senderId ? (
                    // Underlined without a pointer too: in the grey meta line colour alone would not mark it (WCAG 1.4.1, design 2026-10-22).
                    <a href={`/admin/users/${m.senderId}`} className="text-app-ink underline underline-offset-2 hover:no-underline">
                      paskyra
                    </a>
                  ) : null}
                  <span className="tabular-nums">{formatWhen(m.createdAt)}</span>
                  {m.editedAt ? <span>(redaguota {formatWhen(m.editedAt)})</span> : null}
                  {m.replyToId ? <span>– atsakymas į ankstesnę žinutę</span> : null}
                </p>
                {m.body ? (
                  <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-app-ink">{m.body}</p>
                ) : null}
                {m.mediaId ? (
                  <div className="mt-2">
                    <MediaPreview signed={result.media[m.mediaId]} />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={btn}>
        <IconLock size={16} strokeWidth={STROKE} aria-hidden />
        Skaityti (reikia pagrindo)
      </button>
    );
  }

  return (
    <form onSubmit={read} className="w-full space-y-4 rounded-[14px] bg-app-sheet p-4">
      <p className="text-[13px] leading-relaxed text-app-body">
        Pokalbio žinutės – privatus susirašinėjimas. Jos rodomos tik nurodžius pagrindą, ir kiekvienas skaitymas įrašomas į
        administratorių žurnalą.
      </p>
      <Field label="Pagrindas" htmlFor={`${id}-basis`}>
        <select
          id={`${id}-basis`}
          value={basis}
          onChange={(e) => setBasis(e.target.value as ChatReadBasis)}
          required
          className={input}
        >
          <option value="" disabled>
            Pasirinkite
          </option>
          {CHAT_READ_BASES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label={chosen?.refLabel ?? "Nuoroda"} htmlFor={`${id}-ref`} hint={chosen?.refHint}>
        <input
          id={`${id}-ref`}
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          maxLength={200}
          required
          autoComplete="off"
          spellCheck={false}
          className={input}
        />
      </Field>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" disabled={pending} onClick={() => setOpen(false)} className={btnQuiet}>
          Atšaukti
        </button>
        <button type="submit" disabled={pending || !ready} className={btnPrimary}>
          <IconEye size={16} strokeWidth={STROKE} aria-hidden />
          Skaityti
        </button>
      </div>
    </form>
  );
}
