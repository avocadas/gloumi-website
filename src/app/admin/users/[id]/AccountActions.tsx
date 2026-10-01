"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAccount, setSuspended } from "../../actions";

/*
 * Paskyros blokavimas ir trynimas (#129, developerio sprendimas: abu).
 *
 * Blokavimas atšaukiamas tuo pačiu mygtuku. Trynimas — ne, todėl jis prašo
 * įrašyti paskyros vardą: `confirm` paspaudžiamas iš įpročio, o vardo iš
 * įpročio niekas neįrašo.
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

  const toggleBan = () => {
    const text = banned
      ? "Atblokuoti šią paskyrą? Žmogus vėl galės prisijungti."
      : "Užblokuoti šią paskyrą? Žmogus nebegalės prisijungti, o esami seansai nustos galioti.";
    if (!window.confirm(text)) return;
    setError(null);
    startTransition(async () => {
      const res = await setSuspended(userId, !banned);
      if (!res.ok) setError(res.error);
    });
  };

  const remove = () => {
    const warning = [
      "Ištrinti paskyrą visam laikui?",
      "Kartu dings profilis ir viskas, kas duomenų bazėje priklauso šiai paskyrai, taip pat jos pateikti skundai, lojalumo taškai, rekomendacijos ir prenumeratos įrašai. Vizitai, sąskaitos ir dovanų kortelės lieka, tik be nuorodos į paskyrą. Failai iš saugyklos ištrinami naktį.",
      "Atšaukti negalima.",
    ].join("\n\n");
    if (!window.confirm(warning)) return;

    const typed = window.prompt(`Patvirtinkite: įrašykite „${confirmName}“.`, "");
    if (typed === null) return;
    if (typed.trim() !== confirmName) {
      setError("Įrašytas tekstas nesutampa — paskyra neištrinta.");
      return;
    }
    const why = window.prompt("Priežastis (nebūtina, matys tik administratoriai):", "");
    if (why === null) return;

    setError(null);
    startTransition(async () => {
      const res = await deleteAccount(userId, why);
      if (res.ok) {
        setDeleted(true);
        router.replace("/admin/data?table=profiles");
      } else {
        setError(res.error);
      }
    });
  };

  if (deleted) {
    return <p className="mt-8 text-sm font-semibold text-espresso-600">Paskyra ištrinta.</p>;
  }

  return (
    <section className="mt-8 rounded-2xl border border-sand-300 bg-cream-50 p-5">
      <h2 className="font-serif text-xl text-espresso-900">Veiksmai</h2>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-terracotta-500">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={toggleBan}
          className="rounded-full border border-terracotta-400 px-4 py-2 text-sm font-semibold text-terracotta-500 disabled:opacity-50"
        >
          {banned ? "Atblokuoti" : "Užblokuoti"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="rounded-full bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-700 disabled:opacity-50"
        >
          Ištrinti paskyrą
        </button>
      </div>
    </section>
  );
}
