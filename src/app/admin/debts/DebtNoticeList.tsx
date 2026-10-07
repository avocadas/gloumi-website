"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { IconCheck, IconReceipt } from "@/components/icons";
import { markDebtNoticePaid } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { formatMoney, formatWhen } from "../format";
import { EmptyState, STROKE, Tag, btn, card } from "../ui";

export type DebtNoticeView = {
  id: string;
  number: string;
  amountCents: number;
  issuedAt: string;
  dueAt: string;
  remindedAt: string | null;
  paidAt: string | null;
  overdue: boolean;
  masterId: string | null;
  masterName: string;
  /**
   * Pradelsus mokėjimas vietoje išjungiamas tik išėjus laiškui (P2B 4 str.,
   * `20261005224404`): `email_pending` – laiškas eilėje, `blocked` – išjungta,
   * `email_failed` – laiškas neišėjo, todėl neišjungta; `null` – nieko nevyksta.
   */
  blockState: BlockState;
};

export type BlockState = "email_pending" | "email_failed" | "blocked" | "email_missing" | null;

/** Vienas prašymas – viena eilutė; mygtukas tik neapmokėtiems. */
export function DebtNoticeList({ notices }: { notices: DebtNoticeView[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dialog, ask] = useConfirm();

  const markPaid = async (n: DebtNoticeView) => {
    const answer = await ask({
      title: `Pažymėti ${n.number} apmokėtą?`,
      body: [
        `${n.masterName}: ${formatMoney(n.amountCents)}. Pažymėkite tik tada, kai pinigai jau gauti – čia jie nejudinami.`,
        "Jei meistrui nebeliks pradelstų prašymų, jam vėl įsijungs mokėjimas vietoje, ir jis gaus pranešimą.",
      ],
      confirmLabel: "Pažymėti apmokėtą",
    });
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = await markDebtNoticePaid(n.id);
      if (!res.ok) setError(res.error);
    });
  };

  if (notices.length === 0) {
    return (
      <EmptyState tone="peach" icon={<IconReceipt size={24} strokeWidth={STROKE} aria-hidden />} title="Prašymų nėra">
        Šioje būsenoje mokėjimo prašymų nėra.
      </EmptyState>
    );
  }

  return (
    <div>
      {dialog}
      {error ? (
        <p role="alert" className="mb-4 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ul className={`${card} divide-y divide-app-hairline`}>
        {notices.map((n) => (
          <li key={n.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-app-ink">
                {n.number} · {formatMoney(n.amountCents)}
              </p>
              <p className="mt-0.5 text-[13px] text-app-muted">
                {n.masterId ? (
                  <Link href={`/admin/users/${n.masterId}`} className="font-medium text-app-ink hover:underline">
                    {n.masterName}
                  </Link>
                ) : (
                  n.masterName
                )}{" "}
                · išrašyta {formatWhen(n.issuedAt)} · terminas {formatWhen(n.dueAt)}
                {n.remindedAt ? ` · priminta ${formatWhen(n.remindedAt)}` : ""}
              </p>
              {n.blockState === "email_failed" ? (
                <p role="alert" className="mt-2 rounded-[12px] bg-app-danger-bg px-3 py-2 text-[13px] font-semibold text-app-danger-text">
                  Laiškas apie mokėjimo vietoje išjungimą neišėjo (nepavyko arba paskyra be el. pašto), todėl mokėjimas
                  vietoje neišjungtas. Patikrinkite meistro el. pašto adresą ir susisiekite su juo.
                </p>
              ) : null}
              {n.blockState === "email_missing" ? (
                <p role="alert" className="mt-2 rounded-[12px] bg-app-danger-bg px-3 py-2 text-[13px] font-semibold text-app-danger-text">
                  Pradelsta, bet laiško apie išjungimą eilėje nėra – taip būti neturėtų. Praneškite programuotojui.
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {n.paidAt ? (
                <Tag tone="ok">Apmokėta {formatWhen(n.paidAt)}</Tag>
              ) : (
                <>
                  {n.overdue ? <Tag tone="danger">Pradelsta</Tag> : <Tag tone="warn">Laukia</Tag>}
                  {n.blockState === "blocked" ? <Tag tone="danger">Mokėjimas vietoje išjungtas</Tag> : null}
                  {n.blockState === "email_pending" ? <Tag tone="warn">Siunčiamas laiškas apie išjungimą</Tag> : null}
                  <button type="button" disabled={pending} onClick={() => markPaid(n)} className={btn}>
                    <IconCheck size={16} strokeWidth={STROKE} aria-hidden />
                    Pažymėti apmokėtą
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
