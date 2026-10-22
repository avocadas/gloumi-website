/*
 * Paskyros sustabdymo pasirinkimai (Gloumi #169 3 p.; developeris 2026-10-05:
 * ne ilgiau 30 d., data pranešime, pasibaigus – atkuriama automatiškai).
 * Bendri langui ir serverio veiksmui (`actions.ts`): serveris tikrina, kad
 * reikšmė – viena iš šių, ir terminą skaičiuoja pats.
 */
export const SUSPEND_DAYS = [1, 7, 14, 30] as const;

/**
 * Kai sprendimą lėmė pranešimas, žmogui reikia žinoti ir jo turinį (Meistrų
 * sąlygos, DSA 17 str. 3 d. b p.; teisininko G11, 2026-10-22). Bazė pranešimo
 * teksto į sprendimą neįrašo – jį perpasakoja administratorius priežastyje.
 */
export const REPORT_SOURCE_NOTE =
  "Priežastyje nurodykite ir pranešimo turinį – kas ir kodėl pranešta, be pranešėjo vardo ir kontaktų.";

/** Šaltinis nurodomas pranešime: gavus pranešimą (DSA 16 str.) ar mūsų iniciatyva. */
export const SUSPEND_SOURCES = [
  { value: "report", label: "Gavus pranešimą apie turinį", note: REPORT_SOURCE_NOTE },
  { value: "own", label: "Mūsų iniciatyva" },
] as const;

export const isSuspendDays = (v: unknown): v is (typeof SUSPEND_DAYS)[number] =>
  SUSPEND_DAYS.includes(v as (typeof SUSPEND_DAYS)[number]);

export const isSuspendSource = (v: unknown): v is (typeof SUSPEND_SOURCES)[number]["value"] =>
  SUSPEND_SOURCES.some((s) => s.value === v);
