"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IconPencil } from "@/components/icons";
import { correctBirthDate } from "../../actions";
import { useConfirm } from "../../ConfirmDialog";
import { STROKE, btn, card, input } from "../../ui";

/*
 * Gimimo datos taisymas (BDAR 16 str., teisininkas; Gloumi `20261008204515`
 * `admin_correct_birth_date`). Žmogus paprašo ištaisyti netikslią datą, o
 * administratorius ją pataiso su priežastimi – sena ir nauja data lieka
 * žurnale.
 *
 * Kodėl griežčiau, kai žmogus daromas vyresnis: nuo amžiaus priklauso, ką
 * jis programėlėje gali (nepilnamečių apsauga), todėl toks taisymas turi turėti
 * pagrindimą (≥ 20 ženklų, pvz. kokiu dokumentu patikrinta) – bazė jį tikrina
 * pati (`reason_too_short`).
 */
export function BirthDateCorrection({ userId, birthDate }: { userId: string; birthDate: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(birthDate ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [dialog, ask] = useConfirm();

  const older = Boolean(birthDate && value && value < birthDate);

  const submit = async () => {
    setError(null);
    setDone(false);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setError("Įveskite datą.");
      return;
    }
    const answer = await ask({
      title: "Pataisyti gimimo datą?",
      body: [
        `Buvo: ${birthDate ?? "nenurodyta"}. Bus: ${value}. Sena ir nauja data įrašomos į administratorių žurnalą.`,
        older
          ? "Žmogus daromas vyresnis – tai keičia, ką jis gali programėlėje. Pagrindimas privalomas, bent 20 ženklų: kuo remiantis taisoma (pvz. kokiu dokumentu patikrinta)."
          : "Nurodykite, kuo remiantis taisoma (pvz. žmogaus prašymas).",
      ],
      confirmLabel: "Pataisyti",
      reasonRequired: true,
    });
    if (!answer) return;
    startTransition(async () => {
      const res = await correctBirthDate(userId, value, answer.reason);
      if (res.ok) {
        setDone(true);
        router.refresh();
      } else setError(res.error);
    });
  };

  return (
    <div className={`${card} p-5`}>
      {dialog}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="block min-w-0">
          <span className="text-sm font-semibold text-app-ink">Gimimo data</span>
          <span className="mt-0.5 block text-[13px] text-app-muted">Taisoma tik žmogaus prašymu ar patikrinus (BDAR 16 str.).</span>
          <input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`${input} mt-2 sm:w-56`}
          />
        </label>
        <button type="button" disabled={pending || !value || value === birthDate} onClick={submit} className={btn}>
          <IconPencil size={16} strokeWidth={STROKE} aria-hidden />
          Pataisyti gimimo datą
        </button>
      </div>
      {done ? <p className="mt-3 text-sm font-semibold text-app-body">Pataisyta; įrašyta žurnale.</p> : null}
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
