/*
 * Skubūs pagrindai nutraukti meistro paskyrą iš karto, be 30 d. įspėjimo –
 * P2B reglamento 4 str. 4 d. (Gloumi `20261008180946` `admin_delete_account`
 * `_urgent_ground`). Raktai – bazės, pavadinimai – administratoriui; meistrui
 * pranešimo tekstą su pagrindu įrašo pati bazė (teisininko žodžiai).
 */
export const URGENT_GROUNDS = [
  { value: "legal_obligation", label: "To reikalauja teisės aktai ar valdžios institucija" },
  { value: "imperative_reason", label: "Privalomoji priežastis pagal teisės aktus" },
  { value: "repeated_breach", label: "Pakartotinai pažeistos Sąlygos ar Taisyklės" },
] as const;

export type UrgentGround = (typeof URGENT_GROUNDS)[number]["value"];

export function isUrgentGround(value: unknown): value is UrgentGround {
  return URGENT_GROUNDS.some((g) => g.value === value);
}

/** Langas „Ištrinti“ meistrui: pirmas pasirinkimas – įprastas kelias, po 30 d. */
export const TERMINATE_AFTER_NOTICE = "after_30_days";
