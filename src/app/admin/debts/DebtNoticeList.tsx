"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IconCheck, IconReceipt } from "@/components/icons";
import { markDebtNoticePaid } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { formatMoney, formatWhen } from "../format";
import { Alert, btn, card, EmptyState, STROKE, Tag } from "../ui";

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
  const router = useRouter();
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
      // Eilutė pasikeičia į „Apmokėta …“ iš karto (design 7.5).
      else router.refresh();
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
        <Alert className="mb-4">
          {error}
        </Alert>
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
                  <Link prefetch={false} href={`/admin/users/${n.masterId}`} className="font-medium text-app-ink hover:underline">
                    {n.masterName}
                  </Link>
                ) : (
                  n.masterName
                )}{" "}
                · išrašyta {formatWhen(n.issuedAt)} · terminas {formatWhen(n.dueAt)}
                {n.remindedAt ? ` · priminta ${formatWhen(n.remindedAt)}` : ""}
              </p>
              {n.blockState === "email_failed" ? (
                <Alert className="mt-2">
                  Laiškas apie mokėjimo vietoje išjungimą neišėjo (nepavyko arba paskyra be el. pašto), todėl mokėjimas
                  vietoje neišjungtas. Patikrinkite meistro el. pašto adresą ir susisiekite su juo.
                </Alert>
              ) : null}
              {/* Ilgi sakiniai – ne žymos, o eilutė po pavadinimu (design 7.5). */}
              {!n.paidAt && n.blockState === "blocked" ? (
                <p className="mt-1 text-[13px] text-app-muted">Mokėjimas vietoje išjungtas.</p>
              ) : null}
              {!n.paidAt && n.blockState === "email_pending" ? (
                <p className="mt-1 text-[13px] text-app-muted">Siunčiamas laiškas apie mokėjimo vietoje išjungimą.</p>
              ) : null}
              {n.blockState === "email_missing" ? (
                <Alert className="mt-2">
                  Pradelsta, bet laiško apie išjungimą eilėje nėra – taip būti neturėtų. Praneškite programuotojui.
                </Alert>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {n.paidAt ? (
                <Tag tone="ok">Apmokėta {formatWhen(n.paidAt)}</Tag>
              ) : (
                <>
                  {n.overdue ? <Tag tone="danger">Pradelsta</Tag> : <Tag tone="warn">Laukia</Tag>}

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
