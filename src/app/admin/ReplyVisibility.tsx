"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { setReviewReplyHidden } from "./actions";
import { useConfirm } from "./ConfirmDialog";
import type { NoticeNote } from "./moderation-email";
import { ActionNote, STROKE, btn, btnDanger } from "./ui";

/*
 * Meistro atsakymo į atsiliepimą „Paslėpti“ / „Rodyti“ (U-19, #207). Tas pats
 * mygtukas skundo kortelėje ir duomenų naršyklėje (`review_replies`).
 *
 * Paslėpimas — ribojimas, kaip turinio šalinimas (#169): priežastis ir
 * taisyklių punktas privalomi, o meistras juos gauna programėlėje ir el. paštu.
 * Grąžinimas — tik priežastis žurnalui; meistrui pranešimo nėra.
 */
export function ReplyVisibility({ replyId, hiddenAt }: { replyId: string; hiddenAt: string | null }) {
  const [pending, startTransition] = useTransition();
  const [hidden, setHidden] = useState(Boolean(hiddenAt));
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [dialog, ask] = useConfirm();

  const toggle = async () => {
    const next = !hidden;
    const answer = await ask(
      next
        ? {
            title: "Paslėpti atsakymą į atsiliepimą?",
            body: [
              "Atsakymas nebebus rodomas po atsiliepimu; pats atsiliepimas lieka.",
              "Meistras gaus pranešimą su priežastimi ir punktu – programėlėje ir el. paštu. Rodyti vėl galima tuo pačiu mygtuku.",
            ],
            confirmLabel: "Paslėpti",
            danger: true,
            rule: true,
            ruleNoRequest: true,
            reasonRequired: true,
          }
        : {
            title: "Vėl rodyti atsakymą?",
            body: ["Atsakymas vėl bus matomas po atsiliepimu. Meistrui pranešimo nebus; veiksmas įrašomas į žurnalą."],
            confirmLabel: "Rodyti",
            reasonRequired: true,
          },
    );
    if (!answer) return;
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await setReviewReplyHidden(replyId, next, answer.reason, answer.rule);
      if (res.ok) {
        setHidden(next);
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  return (
    <div>
      {dialog}
      <button type="button" disabled={pending} onClick={toggle} className={hidden ? btn : btnDanger}>
        {hidden ? <Eye size={16} strokeWidth={STROKE} aria-hidden /> : <EyeOff size={16} strokeWidth={STROKE} aria-hidden />}
        {hidden ? "Rodyti atsakymą" : "Paslėpti atsakymą"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ActionNote note={note} />
    </div>
  );
}
