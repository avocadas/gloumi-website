"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RuleGroup } from "./moderation-rules";

/*
 * Taisyklių punktų sąrašas patvirtinimo langui (#169). Jį sudaro serveris
 * (`moderation-rules.ts`) ir perduoda maketas, tad kortelėms nereikia jo nešti
 * per savybes, o naršyklė gauna tik pavadinimus.
 */
const RulesContext = createContext<RuleGroup[]>([]);

export function ModerationRulesProvider({ groups, children }: { groups: RuleGroup[]; children: ReactNode }) {
  return <RulesContext.Provider value={groups}>{children}</RulesContext.Provider>;
}

export const useModerationRules = () => useContext(RulesContext);
