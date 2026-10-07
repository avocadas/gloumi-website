"use client";

import { useState, useTransition } from "react";
import { IconChevronRight, IconWallet } from "@/components/icons";
import { useConfirm } from "../ConfirmDialog";
import type { NoticeNote } from "../moderation-email";
import { ActionNote, STROKE, btn, btnDanger } from "../ui";
import { openDispute } from "./actions";

/** Vizitai, kurių pinigai dar Gloumi rankose (Gloumi `admin_open_dispute` sąlyga). */
const HOLDABLE = new Set(["paid", "authorized", "card_saved"]);

/** Ar šiam vizitui galima atidaryti ginčą: apmokėtas ar rezervuotas programėlėje ir dar nepervestas. */
export function canHold(row: Record<string, unknown>): boolean {
  return typeof row.payment_status === "string" && HOLDABLE.has(row.payment_status) && !row.transferred_at;
}

/*
 * „Sulaikyti“ (K-U24-4): administratorius, įtaręs sukčiavimą, atidaro ginčą
 * vizitui, ir nurašymas bei išmoka meistrui sustoja, kol ginčas išspręstas
 * „Ginčuose“. Kaip ir kiti ribojimai (#169), langas prašo priežasties (faktų)
 * ir taisyklių punkto — juos meistras gauna programėlėje ir el. paštu. Ar faktus
 * galima atskleisti, klausiama atskirai: neatskleisti leidžiama tik tada, kai
 * to reikalauja institucija ar teisės aktas (teisininkas 2026-10-06).
 *
 * Duomenų bazė tikrina tą patį dar kartą (`visit_not_paid_in_app`,
 * `visit_already_paid_out`, `dispute_exists`); čia sąlyga tik tam, kad mygtukas
 * nebūtų rodomas ten, kur jis vis tiek nieko nepadarytų.
 */
export function HoldBooking({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [held, setHeld] = useState(false);
  const [dialog, ask] = useConfirm();

  const hold = async () => {
    const answer = await ask({
      title: "Sulaikyti šį vizitą?",
      body: [
        "Atidaromas ginčas: kortelė nenurašoma ir išmoka meistrui nepervedama, kol jo neišspręsite skiltyje „Ginčai“ – grąžindami pinigus klientui arba išmokėdami meistrui.",
        "Meistras iš karto gaus pranešimą su priežastimi ir punktu – programėlėje ir el. paštu; išsprendus – antrą, su sprendimu.",
      ],
      confirmLabel: "Sulaikyti",
      danger: true,
      reasonRequired: true,
      rule: true,
      ruleNoRequest: true,
      choices: [
        {
          key: "disclose",
          label: "Ar meistrui galima nurodyti faktus?",
          hint: "neatskleisti – tik kai to reikalauja institucija ar teisės aktas",
          options: [
            { value: "show", label: "Taip – pranešime bus priežastis" },
            { value: "withhold", label: "Ne – to reikalauja institucija ar teisės aktas" },
          ],
        },
      ],
    });
    if (!answer) return;
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await openDispute(bookingId, answer.reason, answer.rule, answer.choices.disclose === "withhold");
      if (res.ok) {
        setHeld(true);
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  return (
    <div className="mt-4 border-t border-app-hairline pt-4">
      {dialog}
      {held ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-app-ink">Ginčas atidarytas – nurašymas ir išmoka sustabdyti.</p>
          <a href="/admin/disputes" className={btn}>
            Į ginčus
            <IconChevronRight size={16} strokeWidth={STROKE} aria-hidden />
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-app-muted">Įtariate sukčiavimą? Sustabdykite nurašymą ir išmoką.</p>
          <button type="button" disabled={pending} onClick={hold} className={btnDanger}>
            <IconWallet size={16} strokeWidth={STROKE} aria-hidden />
            Sulaikyti
          </button>
        </div>
      )}
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ActionNote note={note} />
    </div>
  );
}
