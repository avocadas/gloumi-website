"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RuleGroup } from "./moderation-rules";

/*
 * Taisyklių punktų sąrašas patvirtinimo langui ir teksto taisymui (#169). Jį
 * sudaro serveris (`moderation-rules.ts`) ir perduoda maketas, tad kortelėms
 * nereikia jo nešti per savybes, o naršyklė gauna tik pavadinimus.
 */
const RulesContext = createContext<RuleGroup[]>([]);

export function ModerationRulesProvider({ groups, children }: { groups: RuleGroup[]; children: ReactNode }) {
  return <RulesContext.Provider value={groups}>{children}</RulesContext.Provider>;
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
