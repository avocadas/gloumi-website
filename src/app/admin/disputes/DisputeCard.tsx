"use client";

import { useState, useTransition } from "react";
import { CalendarClock, HandCoins, Landmark, Undo2, UserRound } from "lucide-react";
import { resolveDispute } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { formatMoney, formatWhen } from "../format";
import { STROKE, Tag, btn, card, eyebrow } from "../ui";

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
};

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

/*
 * Vienas ginčas (#147). Kortelės tvarka ta pati, kaip skundų: kas ir kada →
 * kokį vizitą ir kiek pinigų liečia → ką parašė klientas → kieno jis → ką
 * daryti.
 *
 * Sprendimai tik kliento pranešimams. Kortelės ginčą sprendžia bankas
 * (`chargeback_decided_by_bank`), tad jam mygtukų nėra — tik būsena ir
 * Stripe ginčo ID, pagal kurį jį rasti Stripe skydelyje.
 *
 * Abu sprendimai negrįžtami ir pinigus perkelia tik kitą naktį
 * (`stripe-settle`), todėl langas tai sako, o kortelė po sprendimo rodo, kas
 * laukia.
 */
export function DisputeCard({ dispute }: { dispute: DisputeView }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [decided, setDecided] = useState<"refund" | "release" | null>(null);
  const [dialog, ask] = useConfirm();

  const status = STATUS_TAG[decided ?? dispute.status];
  const source = SOURCE_TAG[dispute.source];
  const canDecide = dispute.status === "open" && dispute.source !== "chargeback" && !decided;
  const amount = formatMoney(dispute.amountCents);

  const decide = async (decision: "refund" | "release") => {
    const answer = await ask(
      decision === "refund"
        ? {
            title: "Grąžinti pinigus klientui?",
            body: [
              `Kitą naktį klientui bus grąžinta visa suma (${amount}), o meistras už šį vizitą išmokos negaus.`,
              "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Grąžinti klientui",
            reason: true,
            reasonLabel: "Pastaba",
          }
        : {
            title: "Išmokėti meistrui?",
            body: [
              "Kitą naktį išmoka bus pervesta meistrui, nelaukiant 3 dienų. Klientui pinigai negrąžinami.",
              "Atšaukti negalima. Sprendimas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Išmokėti meistrui",
            reason: true,
            reasonLabel: "Pastaba",
          },
    );
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = await resolveDispute(dispute.bookingId, decision, answer.reason);
      if (res.ok) setDecided(decision);
      else setError(res.error);
    });
  };

  return (
    <article className={`${card} p-5 sm:p-6`}>
      {dialog}
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {source ? <Tag tone={source.tone}>{source.label}</Tag> : <Tag>{dispute.source}</Tag>}
          {status ? <Tag tone={status.tone}>{status.label}</Tag> : <Tag>{dispute.status}</Tag>}
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
            <CalendarClock size={14} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
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
        <p className={`${eyebrow} text-app-muted`}>{dispute.source === "chargeback" ? "Banko priežastis" : "Ką parašė klientas"}</p>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-app-ink">
          {dispute.reason || <span className="italic text-app-muted">Nieko neparašė.</span>}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-app-muted">
        <PersonLink label="Klientas" id={dispute.clientId} name={dispute.clientName} />
        <PersonLink label="Meistras" id={dispute.masterId} name={dispute.masterName} />
        {dispute.stripeDisputeId ? (
          <span className="inline-flex items-center gap-1">
            <Landmark size={13} strokeWidth={STROKE} aria-hidden />
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

      {canDecide ? (
        <footer className="mt-5 flex flex-col gap-3 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-app-muted">Pinigai pajudės kitą naktį.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => decide("refund")} className={btn}>
              <Undo2 size={16} strokeWidth={STROKE} aria-hidden />
              Grąžinti klientui
            </button>
            <button type="button" disabled={pending} onClick={() => decide("release")} className={btn}>
              <HandCoins size={16} strokeWidth={STROKE} aria-hidden />
              Išmokėti meistrui
            </button>
          </div>
        </footer>
      ) : dispute.source === "chargeback" && dispute.status === "open" ? (
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
      <UserRound size={13} strokeWidth={STROKE} aria-hidden />
      {label}: <span className="font-semibold text-app-ink">{name || "be vardo"}</span>
    </a>
  );
}
