"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RuleGroup } from "./moderation-rules";
import type { TerminationNotice } from "./termination-notice";

/*
 * Taisyklių punktų sąrašas patvirtinimo langui ir teksto taisymui (#169). Jį
 * sudaro serveris (`moderation-rules.ts`) ir perduoda maketas, tad kortelėms
 * nereikia jo nešti per savybes, o naršyklė gauna tik pavadinimus. Tuo pačiu
 * keliu keliauja ir viena Meistrų sąlygų pastraipa trynimo langui
 * (`termination-notice.ts`).
 */
const RulesContext = createContext<RuleGroup[]>([]);
const NoticeContext = createContext<TerminationNotice | null>(null);

export function ModerationRulesProvider({
  groups,
  terminationNotice,
  children,
}: {
  groups: RuleGroup[];
  terminationNotice: TerminationNotice;
  children: ReactNode;
}) {
  return (
    <RulesContext.Provider value={groups}>
      <NoticeContext.Provider value={terminationNotice}>{children}</NoticeContext.Provider>
    </RulesContext.Provider>
  );
}

/** Meistrų sąlygų pastraipa apie 30 dienų įspėjimą – meistro paskyros trynimo langui. */
export function useTerminationNotice(): TerminationNotice | null {
  return useContext(NoticeContext);
}

/**
 * Punkto pasirinkimas. Kai jis privalomas, tuščia eilutė tik kviečia
 * pasirinkti; kai ne — ją galima palikti („Nenurodyti").
 */
export function RuleSelect({
  value,
  onChange,
  required,
  autoFocus,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const groups = useContext(RulesContext);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      autoFocus={autoFocus}
      className={className}
    >
      <option value="" disabled={required}>
        {required ? "Pasirinkite punktą" : "Nenurodyti"}
      </option>
      {groups.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
