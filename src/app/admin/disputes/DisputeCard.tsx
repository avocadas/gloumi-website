"use client";

import { useState, useTransition } from "react";
import { IconBuilding, IconCalendar, IconLandmark, IconProfile, IconReply, IconWallet } from "@/components/icons";
import { resolveDispute } from "../actions";
import { useConfirm, type ConfirmOptions } from "../ConfirmDialog";
import { formatMoney, formatWhen } from "../format";
import type { NoticeNote } from "../moderation-email";
import { ActionNote, STROKE, Tag, btn, card, eyebrow } from "../ui";

export type DisputeView = {
  bookingId: string;
  status: string;
  source: string;
  reason: string | null;
  createdAt: string;
  resolvedAt: string | null;
  clientId: string | null;
  clientName: string;
  masterId: string | null;
  masterName: string;
  startsAt: string | null;
  amountCents: number | null;
  transferredAt: string | null;
  stripeDisputeId: string | null;
  /* Kas nešė pralaimėto kortelės ginčo nuostolį (#164); `null` — dar nenuspręsta arba ne kortelės ginčas. */
  chargebackBearer: "gloumi" | "master" | null;
};

type Decision = "refund" | "release" | "gloumi_bears" | "master_bears";

export const STATUS_TAG: Record<string, { label: string; tone: "warn" | "ok" | "neutral" | "danger" | "peach" }> = {
  open: { label: "Atviras", tone: "warn" },
  refund: { label: "Grąžinama klientui", tone: "peach" },
  release: { label: "Išmokama meistrui", tone: "ok" },
  lost: { label: "Bankas: klientui", tone: "danger" },
  closed: { label: "Uždarytas", tone: "neutral" },
};

const SOURCE_TAG: Record<string, { label: string; tone: "rose" | "lavender" | "neutral" }> = {
  client: { label: "Klientas pranešė", tone: "rose" },
  chargeback: { label: "Kortelės ginčas", tone: "lavender" },
  admin: { label: "Administratorius", tone: "neutral" },
};

/** Kokią būseną ginčas gauna po sprendimo (Gloumi `admin_resolve_dispute`). */
const STATUS_AFTER: Record<Decision, string> = {
  refund: "refund",
  release: "release",
  gloumi_bears: "release",
  master_bears: "closed",
};

const BEARER_TAG: Record<"gloumi" | "master", string> = {
  gloumi: "Nuostolį nešė Gloumi",
  master: "Nuostolį nešė meistras",
};

/*
 * Stripe kortelės ginčo priežasties kodai (`dispute.reason`); `stripe-webhook`
 * juos saugo kaip `chargeback: <kodas>`. Kodas nepasako, kas kaltas
 * (`fraudulent` — ir svetima kortelė, ir meistro sukčiavimas), tad jis tik
 * padeda administratoriui, o nesprendžia už jį. Nežinomas kodas rodomas toks,
 * koks atėjo.
 */
const CHARGEBACK_REASONS: Record<string, string> = {
  fraudulent: "Kortelės savininkas teigia, kad mokėjimo nedarė",
  product_not_received: "Klientas teigia, kad paslaugos negavo",
  product_unacceptable: "Klientas teigia, kad paslauga neatitiko aprašymo",
  duplicate: "Klientas teigia, kad sumokėjo du kartus",
  credit_not_processed: "Klientas teigia, kad negavo pažadėto grąžinimo",
  unrecognized: "Klientas mokėjimo neatpažįsta",
  subscription_canceled: "Klientas teigia, kad prenumeratą atšaukė",
  general: "Bendra priežastis, be smulkesnės",
};

function bankReason(raw: string | null): string | null {
  if (!raw) return null;
  const match = /^chargeback: ?(.*)$/.exec(raw);
  if (!match) return raw;
  const code = match[1].trim();
  if (!code) return null;
  return CHARGEBACK_REASONS[code] ? `${CHARGEBACK_REASONS[code]} (${code})` : code;
}

/*
 * Vienas ginčas (#147). Kortelės tvarka ta pati, kaip skundų: kas ir kada →
 * kokį vizitą ir kiek pinigų liečia → ką parašė klientas ar bankas → kieno
 * jis → ką daryti.
 *
 * Kliento pranešimui — „Grąžinti klientui" arba „Išmokėti meistrui". Kortelės
 * ginčą sprendžia bankas (`chargeback_decided_by_bank`): kol jis atviras,
 * mygtukų nėra. Bankui ginčą išsprendus kliento naudai (`lost`), lieka
 * nuspręsti, kas neša nuostolį (#164): Meistrų sąlygos jį palieka meistrui tik
 * tada, kai ginčą sukėlė jo paslauga ar elgesys, o kitaip neša Gloumi.
 *
 * Visi sprendimai negrįžtami, o pinigus perkelia tik kitą naktį
 * (`stripe-settle`), todėl langas tai sako, o kortelė po sprendimo rodo, kas
 * laukia.
 */
export function DisputeCard({ dispute }: { dispute: DisputeView }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [decided, setDecided] = useState<Decision | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [dialog, ask] = useConfirm();

  const isChargeback = dispute.source === "chargeback";
  const statusKey = decided ? STATUS_AFTER[decided] : dispute.status;
  const bearer =
    decided === "gloumi_bears" ? "gloumi" : decided === "master_bears" ? "master" : dispute.chargebackBearer;
  const status = STATUS_TAG[statusKey];
  const source = SOURCE_TAG[dispute.source];
  const canDecide = dispute.status === "open" && !isChargeback && !decided;
  const canSplitLoss = isChargeback && dispute.status === "lost" && !dispute.chargebackBearer && !decided;
  const amount = formatMoney(dispute.amountCents);
  const reasonText = isChargeback ? bankReason(dispute.reason) : dispute.reason;
  /*
   * Gloumi atidarytas ginčas (K-U24-4): sprendimą ir jo motyvus meistras gauna
   * programėlėje ir el. paštu (Meistrų sąlygų 15–16 sk.), tad pastaba privaloma.
   */
  const byGloumi = dispute.source === "admin";
  const motive: Partial<ConfirmOptions> = byGloumi
    ? { reasonRequired: true, reasonLabel: "Sprendimo motyvai" }
    : { reason: true, reasonLabel: "Pastaba" };
  const tellsMaster = byGloumi ? "Meistras gaus pranešimą su sprendimu ir motyvais – programėlėje ir el. paštu." : null;

  const dialogs: Record<Decision, ConfirmOptions> = {
    refund: {
      title: "Grąžinti pinigus klientui?",
      body: [
        `Kitą naktį klientui bus grąžinta visa suma (${amount}), o meistras už šį vizitą išmokos negaus.`,
        tellsMaster,
        "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
      ],
      confirmLabel: "Grąžinti klientui",
      ...motive,
    },
    release: {
      title: "Išmokėti meistrui?",
      body: [
        "Kitą naktį išmoka bus pervesta meistrui, nelaukiant 3 dienų. Klientui pinigai negrąžinami.",
        tellsMaster,
        "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
      ],
      confirmLabel: "Išmokėti meistrui",
      ...motive,
    },
    gloumi_bears: {
      title: "Nuostolį neša Gloumi?",
      body: [
        `Bankas klientui jau grąžino ${amount}.`,
        // `stripe-settle` perveda tik dar nepervestus vizitus (`transferred_at is null`).
        dispute.transferredAt
          ? "Išmoka meistrui jau pervesta, tad papildomai nieko nepervedama."
          : "Kitą naktį meistrui bus pervesta išmoka iš Gloumi lėšų.",
        "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
      ],
      confirmLabel: "Nuostolį neša Gloumi",
      reason: true,
      reasonLabel: "Pastaba",
    },
    master_bears: {
      title: "Nuostolį neša meistras?",
      body: [
        "Vizitas bus pažymėtas grąžintu, ginčas uždarytas, o meistras už šį vizitą išmokos negaus.",
        "Stripe grąžinimo nebus: pinigus klientui jau grąžino bankas.",
        dispute.transferredAt
          ? "Dėmesio: išmoka meistrui jau pervesta, ir jos atsiimti nepavyko. Kol nėra meistrų skolų apskaitos, ši suma liks meistrui — patikrinkite Stripe skydelyje."
          : null,
        "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
      ],
      confirmLabel: "Nuostolį neša meistras",
      reason: true,
      reasonLabel: "Pastaba",
    },
  };

  const decide = async (decision: Decision) => {
    const answer = await ask(dialogs[decision]);
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = await resolveDispute(dispute.bookingId, decision, answer.reason);
      if (res.ok) {
        setDecided(decision);
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  return (
    <article className={`${card} p-5 sm:p-6`}>
      {dialog}
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {source ? <Tag tone={source.tone}>{source.label}</Tag> : <Tag>{dispute.source}</Tag>}
          {status ? <Tag tone={status.tone}>{status.label}</Tag> : <Tag>{statusKey}</Tag>}
          {bearer ? <Tag>{BEARER_TAG[bearer]}</Tag> : null}
        </div>
        <time dateTime={dispute.createdAt} className="text-xs tabular-nums text-app-muted">
          {formatWhen(dispute.createdAt)}
        </time>
      </header>

      {/* Skaičių juosta, kaip programėlės profilyje: vizitas, suma, išmoka. */}
      <dl className="mt-4 grid grid-cols-1 divide-y divide-app-band-line overflow-hidden rounded-[14px] bg-app-band sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
          <dt className="text-[11px] text-app-muted">Vizitas</dt>
          <dd className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-app-ink">
            <IconCalendar size={14} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
            {formatWhen(dispute.startsAt)}
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
          <dt className="text-[11px] text-app-muted">Sumokėta</dt>
          <dd className="text-sm font-semibold tabular-nums text-app-ink">{amount}</dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5 px-4 py-3">
          <dt className="text-[11px] text-app-muted">Išmoka meistrui</dt>
          <dd className="text-sm font-semibold tabular-nums text-app-ink">
            {dispute.transferredAt ? `Pervesta ${formatWhen(dispute.transferredAt)}` : "Dar nepervesta"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-[14px] bg-app-sheet p-4">
        <p className={`${eyebrow} text-app-muted`}>{isChargeback ? "Banko priežastis" : "Ką parašė klientas"}</p>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-app-ink">
          {reasonText || (
            <span className="italic text-app-muted">{isChargeback ? "Bankas priežasties nenurodė." : "Nieko neparašė."}</span>
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-app-muted">
        <PersonLink label="Klientas" id={dispute.clientId} name={dispute.clientName} />
        <PersonLink label="Meistras" id={dispute.masterId} name={dispute.masterName} />
        {dispute.stripeDisputeId ? (
          <span className="inline-flex items-center gap-1">
            <IconLandmark size={13} strokeWidth={STROKE} aria-hidden />
            Stripe: <code className="text-app-ink">{dispute.stripeDisputeId}</code>
          </span>
        ) : null}
        {dispute.resolvedAt ? <span>Išspręsta {formatWhen(dispute.resolvedAt)}</span> : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ActionNote note={note} />

      {canDecide ? (
        <footer className="mt-5 flex flex-col gap-3 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-app-muted">Pinigai pajudės kitą naktį.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => decide("refund")} className={btn}>
              <IconReply size={16} strokeWidth={STROKE} aria-hidden />
              Grąžinti klientui
            </button>
            <button type="button" disabled={pending} onClick={() => decide("release")} className={btn}>
              <IconWallet size={16} strokeWidth={STROKE} aria-hidden />
              Išmokėti meistrui
            </button>
          </div>
        </footer>
      ) : canSplitLoss ? (
        <footer className="mt-5 flex flex-col gap-3 border-t border-app-hairline pt-4">
          <p className="text-[13px] text-app-muted">
            Bankas ginčą išsprendė kliento naudai ir grąžino jam {amount}. Kas neša nuostolį, lemia ne banko priežastis, o
            tai, ar ginčą sukėlė meistro paslauga ar elgesys (Meistrų sąlygos). Kol nenuspręsta, išmoka meistrui sulaikyta.
          </p>
          {dispute.transferredAt ? (
            <p className="rounded-[14px] bg-app-warn-bg px-4 py-3 text-[13px] font-semibold text-app-warn">
              Išmoka meistrui vis dar pervesta: jos atsiimti automatiškai nepavyko. Patikrinkite Stripe skydelyje.
            </p>
          ) : null}
          {/* Ilgas tekstas: telefone mygtukas lūžta į dvi eilutes, o ne išlenda už kortelės. */}
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={() => decide("gloumi_bears")}
              className={`${btn} h-auto min-h-10 max-w-full py-2 text-left`}
            >
              <IconBuilding size={16} strokeWidth={STROKE} aria-hidden className="shrink-0" />
              Nuostolį neša Gloumi – išmokėti meistrui
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => decide("master_bears")}
              className={`${btn} h-auto min-h-10 max-w-full py-2 text-left`}
            >
              <IconProfile size={16} strokeWidth={STROKE} aria-hidden className="shrink-0" />
              Nuostolį neša meistras
            </button>
          </div>
        </footer>
      ) : isChargeback && statusKey === "open" ? (
        /*
         * `stripe-webhook` gavęs ginčą pervestą išmoką atsiima iš meistro
         * (`createReversal`) ir `transferred_at` nuima. Jei ji vis dar
         * pervesta, atsiimti nepavyko (`chargeback_reversal_failed` žurnale) —
         * tai vienintelis atvejis, kai čia reikia žmogaus.
         */
        dispute.transferredAt ? (
          <p className="mt-5 rounded-[14px] bg-app-warn-bg px-4 py-3 text-[13px] font-semibold text-app-warn">
            Išmoka meistrui vis dar pervesta: jos atsiimti automatiškai nepavyko. Patikrinkite Stripe skydelyje.
          </p>
        ) : (
          <p className="mt-5 border-t border-app-hairline pt-4 text-[13px] text-app-muted">
            Kortelės ginčą sprendžia bankas. Kol jis atviras, išmoka meistrui sulaikyta; laimėjus ginčą, ji bus
            pervesta kitą naktį.
          </p>
        )
      ) : isChargeback && bearer ? (
        <p className="mt-5 border-t border-app-hairline pt-4 text-[13px] text-app-muted">
          {bearer === "master"
            ? "Nuostolį neša meistras: vizitas pažymėtas grąžintu, išmokos už jį nebus."
            : statusKey !== "release"
              ? "Nuostolį nešė Gloumi."
              : dispute.transferredAt
                ? "Nuostolį neša Gloumi. Išmoka meistrui jau pervesta."
                : "Nuostolį neša Gloumi. Išmoka meistrui bus pervesta kitą naktį, tada ginčas bus uždarytas."}
        </p>
      ) : decided || dispute.status === "refund" || dispute.status === "release" ? (
        <p className="mt-5 border-t border-app-hairline pt-4 text-[13px] text-app-muted">
          Sprendimas priimtas. Pinigai pajudės kitą naktį, tada ginčas bus uždarytas.
        </p>
      ) : null}
    </article>
  );
}

function PersonLink({ label, id, name }: { label: string; id: string | null; name: string }) {
  if (!id) return <span>{label}: ištrinta paskyra</span>;
  return (
    <a href={`/admin/users/${id}`} className="inline-flex items-center gap-1 hover:underline">
      <IconProfile size={13} strokeWidth={STROKE} aria-hidden />
      {label}: <span className="font-semibold text-app-ink">{name || "be vardo"}</span>
    </a>
  );
}
