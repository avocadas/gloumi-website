/*
 * Paskyros sustabdymo pasirinkimai (Gloumi #169 3 p.; developeris 2026-10-05:
 * ne ilgiau 30 d., data pranešime, pasibaigus – atkuriama automatiškai).
 * Bendri langui ir serverio veiksmui (`actions.ts`): serveris tikrina, kad
 * reikšmė – viena iš šių, ir terminą skaičiuoja pats.
 */
export const SUSPEND_DAYS = [1, 7, 14, 30] as const;

/** Šaltinis nurodomas pranešime: gavus pranešimą (DSA 16 str.) ar mūsų iniciatyva. */
export const SUSPEND_SOURCES = [
  { value: "report", label: "Gavus pranešimą apie turinį" },
  { value: "own", label: "Mūsų iniciatyva" },
] as const;

export const isSuspendDays = (v: unknown): v is (typeof SUSPEND_DAYS)[number] =>
  SUSPEND_DAYS.includes(v as (typeof SUSPEND_DAYS)[number]);

export const isSuspendSource = (v: unknown): v is (typeof SUSPEND_SOURCES)[number]["value"] =>
  SUSPEND_SOURCES.some((s) => s.value === v);
