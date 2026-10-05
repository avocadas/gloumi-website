"use client";

import { useState, useTransition } from "react";
import { CalendarDays, CircleCheck, Mail, RotateCcw, UserRound } from "lucide-react";
import { formatWhen } from "../format";
import { STROKE, Tag, btn, btnQuiet, card, eyebrow } from "../ui";
import { setSupportTicketStatus } from "./actions";

export type TicketView = {
  id: string;
  authorId: string;
  authorRole: "client" | "master";
  authorName: string | null;
  authorHandle: string | null;
  /** Tik atviroms užklausoms: atsakymo mygtukui. */
  authorEmail: string | null;
  bookingId: string | null;
  subject: string;
  message: string;
  status: "open" | "closed";
  createdAt: string;
  closedAt: string | null;
};

/*
 * Viena užklausa (#209): kas ir kada → tema ir tekstas → kieno ir dėl kurio
 * vizito → veiksmai. „Išspręsta“ — be patvirtinimo lango: tai grąžinama tuo
 * pačiu mygtuku („Atidaryti vėl“), o patvirtinimas čia tik lėtintų eilę.
 *
 * Atsakymas — iš administratoriaus pašto programos (`mailto:`), nes atsakome
 * iš info@gloumi.lt, kaip žada Taisyklės, o ne iš portalo.
 */
export function TicketCard({ ticket }: { ticket: TicketView }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(ticket.status);
  const [closedAt, setClosedAt] = useState(ticket.closedAt);
  const [error, setError] = useState<string | null>(null);

  const change = (next: "open" | "closed") => {
    setError(null);
    startTransition(async () => {
      const res = await setSupportTicketStatus(ticket.id, next);
      if (res.ok) {
        setStatus(next);
        setClosedAt(next === "closed" ? new Date().toISOString() : null);
      }
      else setError(res.error);
    });
  };

  const who = ticket.authorName ?? (ticket.authorHandle ? `@${ticket.authorHandle}` : "Paskyra be vardo");
  const reply = ticket.authorEmail
    ? `mailto:${ticket.authorEmail}?subject=${encodeURIComponent(`Re: ${ticket.subject || "Gloumi pagalba"}`)}`
    : null;

  return (
    <article className={`${card} p-5 transition-opacity sm:p-6 ${status === "closed" ? "opacity-70" : ""}`}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={ticket.authorRole === "master" ? "lavender" : "neutral"}>
            {ticket.authorRole === "master" ? "Meistras" : "Klientas"}
          </Tag>
          {status === "open" ? <Tag tone="warn">Atvira</Tag> : <Tag tone="ok">{closedAt ? `Išspręsta ${formatWhen(closedAt)}` : "Išspręsta"}</Tag>}
        </div>
        <time dateTime={ticket.createdAt} className="text-xs tabular-nums text-app-muted">
          {formatWhen(ticket.createdAt)}
        </time>
      </header>

      <h3 className="mt-3 text-[15px] font-bold text-app-ink">{ticket.subject || "Be temos"}</h3>
      <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap break-words text-app-body">{ticket.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-app-muted">
        <a
          href={`/admin/users/${ticket.authorId}`}
          className="inline-flex items-center gap-1 font-semibold text-app-ink hover:underline"
        >
          <UserRound size={13} strokeWidth={STROKE} aria-hidden />
          {who}
        </a>
        {ticket.bookingId ? (
          <a
            href={`/admin/data?table=bookings&owner=${ticket.authorId}`}
            title={`Vizitas ${ticket.bookingId}`}
            className="inline-flex items-center gap-1 font-semibold text-app-ink hover:underline"
          >
            <CalendarDays size={13} strokeWidth={STROKE} aria-hidden />
            Dėl vizito <span className="font-mono font-normal">{ticket.bookingId.slice(0, 8)}</span>
          </a>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}

      <footer className="mt-5 flex flex-col gap-2 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={`${eyebrow} text-app-faint`}>Atsakome iš info@gloumi.lt</p>
        <div className="flex flex-wrap gap-2">
          {reply && status === "open" ? (
            <a href={reply} className={btnQuiet}>
              <Mail size={16} strokeWidth={STROKE} aria-hidden />
              Atsakyti el. paštu
            </a>
          ) : null}
          {status === "open" ? (
            <button type="button" disabled={pending} onClick={() => change("closed")} className={btn}>
              <CircleCheck size={16} strokeWidth={STROKE} aria-hidden />
              Išspręsta
            </button>
          ) : (
            <button type="button" disabled={pending} onClick={() => change("open")} className={btnQuiet}>
              <RotateCcw size={16} strokeWidth={STROKE} aria-hidden />
              Atidaryti vėl
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
