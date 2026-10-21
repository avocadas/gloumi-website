"use client";

import { useState, useTransition } from "react";
import { IconCalendar, IconCheck, IconMail, IconProfile, IconUndo } from "@/components/icons";
import { formatWhen } from "../format";
import { site } from "@/content/site";
import { Alert, btn, btnPrimary, card, STROKE, Tag } from "../ui";
import { useToast } from "../Toaster";
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
  /**
   * Iš kokios programėlės parašyta (#209, db `20261007164539`): be jų
   * „neveikia“ tenka klausti atgal. Senesni kreipimai ir senesnės versijos
   * jų neturi – tada nerodoma nieko.
   */
  appVersion: string | null;
  platform: "ios" | "android" | "web" | null;
};

const PLATFORM_LABEL = { ios: "iOS", android: "Android", web: "Naršyklė" } as const;

/*
 * Viena užklausa (#209): kas ir kada → tema ir tekstas → kieno ir dėl kurio
 * vizito → veiksmai. „Išspręsta“ — be patvirtinimo lango: tai grąžinama tuo
 * pačiu mygtuku („Atidaryti vėl“), o patvirtinimas čia tik lėtintų eilę.
 *
 * Atsakymas — iš administratoriaus pašto programos (`mailto:`), ne iš portalo.
 * Pagalbos dėžutė – support@gloumi.lt (`site.supportEmail`, ją duoda
 * programėlės „Pagalba“ ir DUK; developeris 2026-10-20), ne bendras info@.
 */
export function TicketCard({ ticket }: { ticket: TicketView }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(ticket.status);
  const [closedAt, setClosedAt] = useState(ticket.closedAt);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const change = (next: "open" | "closed") => {
    setError(null);
    startTransition(async () => {
      const res = await setSupportTicketStatus(ticket.id, next);
      if (res.ok) {
        setStatus(next);
        setClosedAt(next === "closed" ? new Date().toISOString() : null);
        toast(next === "closed" ? "Pažymėta išspręsta" : "Užklausa vėl atidaryta");
      }
      else setError(res.error);
    });
  };

  const who = ticket.authorName ?? (ticket.authorHandle ? `@${ticket.authorHandle}` : "Paskyra be vardo");
  const reply = ticket.authorEmail
    ? `mailto:${ticket.authorEmail}?subject=${encodeURIComponent(`Re: ${ticket.subject || "Gloumi pagalba"}`)}`
    : null;

  return (
    <article className={`${card} p-5 sm:p-6`}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={ticket.authorRole === "master" ? "lavender" : "neutral"}>
            {ticket.authorRole === "master" ? "Meistras" : "Klientas"}
          </Tag>
          {status === "open" ? <Tag tone="warn">Atvira</Tag> : <Tag tone="neutral">{closedAt ? `Išspręsta ${formatWhen(closedAt)}` : "Išspręsta"}</Tag>}
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
          <IconProfile size={13} strokeWidth={STROKE} aria-hidden />
          {who}
        </a>
        {ticket.bookingId ? (
          <a
            href={`/admin/data?table=bookings&owner=${ticket.authorId}`}
            title={`Vizitas ${ticket.bookingId}`}
            className="inline-flex items-center gap-1 font-semibold text-app-ink hover:underline"
          >
            <IconCalendar size={13} strokeWidth={STROKE} aria-hidden />
            Dėl vizito <span className="font-mono font-normal">{ticket.bookingId.slice(0, 8)}</span>
          </a>
        ) : null}
        {ticket.platform || ticket.appVersion ? (
          <span title="Programėlė, iš kurios parašyta">
            {[ticket.platform ? PLATFORM_LABEL[ticket.platform] : null, ticket.appVersion ? `v${ticket.appVersion}` : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
        ) : null}
      </div>

      {error ? (
        <Alert className="mt-4">
          {error}
        </Alert>
      ) : null}

      <footer className="mt-5 flex flex-col gap-2 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-app-faint">Atsakome iš {site.supportEmail}</p>
        <div className="flex flex-wrap gap-2">
          {reply && status === "open" ? (
            <a href={reply} className={btnPrimary}>
              <IconMail size={16} strokeWidth={STROKE} aria-hidden />
              Atsakyti el. paštu
            </a>
          ) : null}
          {status === "open" ? (
            <button type="button" disabled={pending} onClick={() => change("closed")} className={btn}>
              <IconCheck size={16} strokeWidth={STROKE} aria-hidden />
              Pažymėti išspręsta
            </button>
          ) : (
            <button type="button" disabled={pending} onClick={() => change("open")} className={btn}>
              <IconUndo size={16} strokeWidth={STROKE} aria-hidden />
              Atidaryti vėl
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
