/*
 * Skubūs pagrindai nutraukti meistro paskyrą iš karto, be 30 d. įspėjimo –
 * P2B reglamento 4 str. 4 d. (Gloumi `20261008180946` `admin_delete_account`
 * `_urgent_ground`). Raktai – bazės, pavadinimai – administratoriui; meistrui
 * pranešimo tekstą su pagrindu įrašo pati bazė (teisininko žodžiai).
 *
 * Meistrų ir salonų sąlygos skubiems pagrindams priskiria ir nustatytą
 * sukčiavimą bei realią grėsmę Klientų sveikatai ar saugumui. Tai P2B 4 str.
 * 4 d. b p. „privalomoji priežastis“ (teisininko G10, variantas C,
 * 2026-10-22): bazė gauna `imperative_reason`, o konkretus pagrindas su
 * punktu įrašomas priežasties pradžioje – jį meistras mato pranešime.
 */
const TERMS_CLAUSE = "Meistrų ir salonų sąlygos, „Ribojimas, sustabdymas ir nutraukimas“; P2B 4 str. 4 d. b p.";

export const URGENT_GROUNDS = [
  { value: "legal_obligation", label: "To reikalauja teisės aktai ar valdžios institucija" },
  { value: "imperative_reason", label: "Privalomoji priežastis pagal teisės aktus" },
  { value: "repeated_breach", label: "Pakartotinai pažeistos Sąlygos ar Taisyklės" },
  {
    value: "fraud",
    label: "Nustatytas sukčiavimas",
    dbGround: "imperative_reason",
    reasonLead: `Nustatytas sukčiavimas (${TERMS_CLAUSE})`,
  },
  {
    value: "safety_risk",
    label: "Reali grėsmė Klientų sveikatai ar saugumui",
    dbGround: "imperative_reason",
    reasonLead: `Reali grėsmė Klientų sveikatai ar saugumui (${TERMS_CLAUSE})`,
  },
] as const;

export type UrgentGround = (typeof URGENT_GROUNDS)[number]["value"];

export function isUrgentGround(value: unknown): value is UrgentGround {
  return URGENT_GROUNDS.some((g) => g.value === value);
}

/** Bazės raktas (`_urgent_ground`) ir, jei reikia, pagrindas, kuriuo prasideda priežastis. */
export function urgentGroundForDb(value: UrgentGround): {
  ground: "legal_obligation" | "imperative_reason" | "repeated_breach";
  lead: string | null;
} {
  const g = URGENT_GROUNDS.find((x) => x.value === value)!;
  return "dbGround" in g ? { ground: g.dbGround, lead: g.reasonLead } : { ground: g.value as "legal_obligation" | "imperative_reason" | "repeated_breach", lead: null };
}

/** Langas „Ištrinti“ meistrui: pirmas pasirinkimas – įprastas kelias, po 30 d. */
export const TERMINATE_AFTER_NOTICE = "after_30_days";
