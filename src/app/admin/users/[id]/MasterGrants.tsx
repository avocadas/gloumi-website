"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "../../ConfirmDialog";
import { GrantRows, type GrantView } from "../../grants/GrantRows";
import { grantPlan, setCommissionWaiver } from "../../grants/actions";
import { SectionTitle, btn, card, eyebrow, input } from "../../ui";

/*
 * Meistro individualios sąlygos paskyros puslapyje (#179): kas jam galioja ir
 * dvi formos — neimti komisinio iki dienos, suteikti nemokamą Pro ar VIP iki
 * dienos. Abu sprendimai finansiniai, todėl prieš veiksmą langas pasako, kas
 * nutiks. Visų meistrų sąrašas — `/admin/grants`.
 *
 * `grants === null` — sąrašo gauti nepavyko (pvz. migracija dar
 * nepritaikyta): tada formų nerodome, nes jos vis tiek nepavyktų.
 */
export function MasterGrants({
  masterId,
  grants,
  minDay,
  maxDay,
}: {
  masterId: string;
  grants: GrantView[] | null;
  minDay: string;
  maxDay: string;
}) {
  const waiverActive = !!grants?.some((g) => g.kind === "commission_waiver" && g.active);

  return (
    <section>
      <SectionTitle
        accent="value"
        title="Individualios sąlygos"
        note="Komisinio atsisakymas ir nemokamas planas – su terminu ir priežastimi."
        aside={
          <a href="/admin/grants" className="text-xs font-semibold text-app-ink hover:underline">
            Visų sąrašas
          </a>
        }
      />

      {grants === null ? (
        <p className={`${card} p-5 text-sm text-app-muted`}>
          Individualių sąlygų gauti nepavyko – gal duomenų bazėje jų dar nėra (Gloumi #179).
        </p>
      ) : (
        <div className="space-y-4">
          {grants.length > 0 ? (
            <GrantRows grants={grants} showMaster={false} />
          ) : (
            <p className={`${card} p-5 text-sm text-app-muted`}>Šiam meistrui individualių sąlygų nėra.</p>
          )}
          <WaiverForm masterId={masterId} minDay={minDay} maxDay={maxDay} extending={waiverActive} />
          <PlanForm masterId={masterId} minDay={minDay} maxDay={maxDay} />
        </div>
      )}
    </section>
  );
}

function WaiverForm({
  masterId,
  minDay,
  maxDay,
  extending,
}: {
  masterId: string;
  minDay: string;
  maxDay: string;
  extending: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [day, setDay] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [dialog, ask] = useConfirm();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!day || !reason.trim()) return;
    const answer = await ask({
      title: extending ? "Pratęsti komisinio atsisakymą?" : "Neimti komisinio?",
      body: [
        extending
          ? `Gloumi neims komisinio iki ${day} imtinai; atsisakymo pradžia lieka ta pati.`
          : `Gloumi neims komisinio už šio meistro vizitus nuo dabar iki ${day} imtinai.`,
        "Veiksmas ir priežastis įrašomi į administratorių žurnalą.",
      ],
      confirmLabel: extending ? "Pratęsti" : "Neimti komisinio",
    });
    if (!answer) return;
    setError(null);
    setDone(false);
    startTransition(async () => {
      const res = await setCommissionWaiver(masterId, day, reason);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
      setReason("");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-3 p-4 sm:p-5`}>
      {dialog}
      <p className={`${eyebrow} text-app-muted`}>{extending ? "Pratęsti komisinio atsisakymą" : "Neimti komisinio"}</p>
      <label className="block">
        <span className="text-[13px] font-semibold text-app-ink">Iki (imtinai)</span>
        <input
          type="date"
          required
          min={minDay}
          max={maxDay}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className={`${input} mt-1.5`}
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-semibold text-app-ink">Priežastis</span>
        <input
          required
          maxLength={500}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Pvz. pirmieji meistrai, komandos narys"
          className={`${input} mt-1.5`}
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      {done ? <p className="text-sm font-semibold text-app-ink">Išsaugota.</p> : null}
      <div className="flex justify-end">
        <button type="submit" disabled={pending || !day || !reason.trim()} className={btn}>
          {extending ? "Pratęsti" : "Neimti komisinio"}
        </button>
      </div>
    </form>
  );
}

function PlanForm({ masterId, minDay, maxDay }: { masterId: string; minDay: string; maxDay: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [plan, setPlan] = useState<"pro" | "vip">("pro");
  const [day, setDay] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [dialog, ask] = useConfirm();
  const label = plan === "pro" ? "Pro" : "VIP";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!day || !reason.trim()) return;
    const answer = await ask({
      title: `Suteikti nemokamą ${label}?`,
      body: [
        `Meistras gaus ${label} nuo dabar iki ${day} imtinai, be mokėjimo parduotuvėje.`,
        "Atšaukti galima bet kada. Veiksmas ir priežastis įrašomi į administratorių žurnalą.",
      ],
      confirmLabel: `Suteikti ${label}`,
    });
    if (!answer) return;
    setError(null);
    setDone(false);
    startTransition(async () => {
      const res = await grantPlan(masterId, plan, day, reason);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
      setReason("");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-3 p-4 sm:p-5`}>
      {dialog}
      <p className={`${eyebrow} text-app-muted`}>Suteikti nemokamą planą</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold text-app-ink">Planas</span>
          <select value={plan} onChange={(e) => setPlan(e.target.value === "vip" ? "vip" : "pro")} className={`${input} mt-1.5`}>
            <option value="pro">Pro</option>
            <option value="vip">VIP</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-app-ink">Iki (imtinai)</span>
          <input
            type="date"
            required
            min={minDay}
            max={maxDay}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`${input} mt-1.5`}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[13px] font-semibold text-app-ink">Priežastis</span>
        <input
          required
          maxLength={500}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Pvz. pažįstamas meistras, bandymui"
          className={`${input} mt-1.5`}
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      {done ? <p className="text-sm font-semibold text-app-ink">Suteikta.</p> : null}
      <div className="flex justify-end">
        <button type="submit" disabled={pending || !day || !reason.trim()} className={btn}>
          Suteikti {label}
        </button>
      </div>
    </form>
  );
}
