"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Ban, Trash2, Undo2 } from "lucide-react";
import { deleteAccount, setSuspended } from "../../actions";
import { useConfirm } from "../../ConfirmDialog";
import { STROKE, SectionTitle, btn, btnDanger, card } from "../../ui";

/*
 * Paskyros blokavimas ir trynimas (#129, developerio sprendimas: abu).
 *
 * Blokavimas atšaukiamas tuo pačiu mygtuku. Trynimas — ne, todėl jis prašo
 * įrašyti paskyros vardą: patvirtinimas paspaudžiamas iš įpročio, o vardo iš
 * įpročio niekas neįrašo. Abu prašymai — ir vardas, ir priežastis — dabar
 * viename lange, kad žmogus matytų, ką patvirtina, kol rašo.
 *
 * Kiekvienas veiksmas — atskira eilutė su paaiškinimu, ką jis padarys:
 * mygtukas be paaiškinimo verčia spėlioti, o čia spėlioti brangu.
 */
export function AccountActions({
  userId,
  banned,
  confirmName,
}: {
  userId: string;
  banned: boolean;
  confirmName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [dialog, ask] = useConfirm();

  const toggleBan = async () => {
    const answer = await ask(
      banned
        ? {
            title: "Atblokuoti paskyrą?",
            body: ["Žmogus vėl galės prisijungti."],
            confirmLabel: "Atblokuoti",
          }
        : {
            title: "Užblokuoti paskyrą?",
            body: [
              "Žmogus nebegalės prisijungti, o esami seansai nustos galioti.",
              "Atblokuoti galima bet kada, tuo pačiu mygtuku.",
            ],
            confirmLabel: "Užblokuoti",
            danger: true,
          },
    );
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = await setSuspended(userId, !banned);
      if (!res.ok) setError(res.error);
    });
  };

  const remove = async () => {
    const answer = await ask({
      title: "Ištrinti paskyrą visam laikui?",
      body: [
        "Kartu dings profilis ir viskas, kas duomenų bazėje priklauso šiai paskyrai, taip pat jos pateikti skundai, lojalumo taškai, rekomendacijos ir prenumeratos įrašai.",
        "Vizitai, sąskaitos ir dovanų kortelės lieka, tik be nuorodos į paskyrą. Failai iš saugyklos ištrinami naktį. Atšaukti negalima.",
      ],
      confirmLabel: "Ištrinti paskyrą",
      danger: true,
      reason: true,
      typeToConfirm: confirmName,
    });
    if (!answer) return;

    setError(null);
    startTransition(async () => {
      const res = await deleteAccount(userId, answer.reason);
      if (res.ok) {
        setDeleted(true);
        router.replace("/admin/data?table=profiles");
      } else {
        setError(res.error);
      }
    });
  };

  if (deleted) {
    return <p className={`${card} p-5 text-sm font-semibold text-app-body`}>Paskyra ištrinta.</p>;
  }

  return (
    <section>
      {dialog}
      <SectionTitle title="Veiksmai" />
      <div className={`${card} divide-y divide-app-hairline`}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-ink">{banned ? "Atblokuoti paskyrą" : "Užblokuoti paskyrą"}</p>
            <p className="mt-0.5 text-[13px] text-app-muted">
              {banned ? "Žmogus vėl galės prisijungti." : "Negalės prisijungti; atšaukiama bet kada."}
            </p>
          </div>
          <button type="button" disabled={pending} onClick={toggleBan} className={banned ? btn : btnDanger}>
            {banned ? <Undo2 size={16} strokeWidth={STROKE} aria-hidden /> : <Ban size={16} strokeWidth={STROKE} aria-hidden />}
            {banned ? "Atblokuoti" : "Užblokuoti"}
          </button>
        </div>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-ink">Ištrinti paskyrą</p>
            <p className="mt-0.5 text-[13px] text-app-muted">Visam laikui, su viskuo, kas jai priklauso.</p>
          </div>
          <button type="button" disabled={pending} onClick={remove} className={btnDanger}>
            <Trash2 size={16} strokeWidth={STROKE} aria-hidden />
            Ištrinti
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
    </section>
  );
}
