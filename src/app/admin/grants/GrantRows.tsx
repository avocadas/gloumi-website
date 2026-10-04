"use client";

import { useState, useTransition } from "react";
import { BadgePercent, Crown, UserRound } from "lucide-react";
import { useConfirm } from "../ConfirmDialog";
import { STROKE, Tag, btnQuiet, card } from "../ui";
import { clearCommissionWaiver, revokePlanGrant } from "./actions";

export type GrantView = {
  kind: "commission_waiver" | "plan_grant";
  masterId: string;
  masterName: string;
  plan: "pro" | "vip" | null;
  validFrom: string | null;
  until: string | null;
  reason: string;
  grantedAt: string | null;
  subscriptionId: string | null;
  active: boolean;
};

/** Tik data: terminai renkami dienomis (`dates.ts`). */
function formatDay(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("lt-LT", { timeZone: "Europe/Vilnius" });
}

const PLAN_LABEL = { pro: "Pro", vip: "VIP" } as const;

/*
 * Individualių sąlygų eilutės (#179). Galiojančią sąlygą galima baigti:
 * komisinio atsisakymą — „Baigti dabar“ (pabaiga nustatoma į dabar, jau įvykę
 * vizitai lieka be komisinio), nemokamą planą — „Atšaukti planą“
 * (parduotuvės prenumeratos tai neliečia). Pasibaigusios lieka sąraše
 * istorijai, be mygtukų.
 */
export function GrantRows({ grants, showMaster }: { grants: GrantView[]; showMaster: boolean }) {
  return (
    <ul className="space-y-3">
      {grants.map((g) => (
        <li key={g.kind === "plan_grant" ? `p:${g.subscriptionId}` : `w:${g.masterId}`}>
          <GrantRow grant={g} showMaster={showMaster} />
        </li>
      ))}
    </ul>
  );
}

function GrantRow({ grant, showMaster }: { grant: GrantView; showMaster: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [dialog, ask] = useConfirm();

  const active = grant.active && !ended;
  const isWaiver = grant.kind === "commission_waiver";
  const planLabel = grant.plan ? PLAN_LABEL[grant.plan] : "planas";

  const end = async () => {
    const answer = await ask(
      isWaiver
        ? {
            title: "Baigti komisinio atsisakymą dabar?",
            body: [
              "Komisinis vėl bus imamas už vizitus nuo šios akimirkos.",
              "Jau įvykę vizitai lieka be komisinio, net jei bus apmokėti vėliau.",
              "Veiksmas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Baigti dabar",
            danger: true,
          }
        : {
            title: `Atšaukti nemokamą ${planLabel}?`,
            body: [
              "Meistras neteks šio plano iš karto. Jei jis turi parduotuvės prenumeratą, ji lieka.",
              "Veiksmas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Atšaukti planą",
            danger: true,
          },
    );
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = isWaiver
        ? await clearCommissionWaiver(grant.masterId)
        : await revokePlanGrant(grant.subscriptionId ?? "");
      if (res.ok) setEnded(true);
      else setError(res.error);
    });
  };

  return (
    <article className={`${card} p-4 sm:p-5 ${active ? "" : "opacity-70"}`}>
      {dialog}
      <div className="flex flex-wrap items-center gap-2">
        {isWaiver ? (
          <Tag tone="lavender">Komisinis neimamas</Tag>
        ) : (
          <Tag tone="mint">Nemokamas {planLabel}</Tag>
        )}
        {active ? <Tag tone="ok">Galioja</Tag> : <Tag>{ended ? "Baigta dabar" : "Negalioja"}</Tag>}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold tabular-nums text-app-ink">
        {isWaiver ? (
          <BadgePercent size={15} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
        ) : (
          <Crown size={15} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
        )}
        Nuo {formatDay(grant.validFrom)} iki {ended ? "dabar" : formatDay(grant.until)}
      </p>
      {grant.reason ? <p className="mt-1 text-sm break-words text-app-body">{grant.reason}</p> : null}

      {showMaster ? (
        <a
          href={`/admin/users/${grant.masterId}`}
          className="mt-2 inline-flex items-center gap-1 text-xs text-app-muted hover:underline"
        >
          <UserRound size={13} strokeWidth={STROKE} aria-hidden />
          Meistras: <span className="font-semibold text-app-ink">{grant.masterName || "be vardo"}</span>
        </a>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}

      {active ? (
        <div className="mt-3 flex justify-end border-t border-app-hairline pt-3">
          <button type="button" disabled={pending} onClick={end} className={btnQuiet}>
            {isWaiver ? "Baigti dabar" : "Atšaukti planą"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
