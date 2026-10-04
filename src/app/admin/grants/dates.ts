/*
 * Individualių sąlygų terminai (#179) renkami kaip diena, o saugomi kaip tos
 * dienos pabaiga Vilniaus laiku: „iki spalio 31“ reiškia ir spalio 31-ąją.
 *
 * Bazė leidžia ne ilgiau kaip 5 metus nuo DABAR (`bad_until`), todėl
 * vėliausia siūloma diena — viena diena mažiau: kitaip tos dienos pabaiga
 * vakare būtų keliomis valandomis per toli.
 */

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Šiandiena Vilniuje, `YYYY-MM-DD`. */
export function vilniusToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Vėliausia leidžiama diena: po 5 metų, viena diena mažiau. */
export function latestDay(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  return new Date(Date.UTC(y + 5, m - 1, d - 1)).toISOString().slice(0, 10);
}

/** Dienos pabaiga Vilniaus laiku ISO formatu; `null`, jei tai ne tikra data. */
export function vilniusEndOfDay(day: unknown): string | null {
  if (typeof day !== "string" || !DAY.test(day)) return null;
  const noon = new Date(`${day}T12:00:00Z`);
  // `2026-02-30` JavaScript'e tampa kovo 2-ąja — tokia data atmetama.
  if (Number.isNaN(noon.getTime()) || noon.toISOString().slice(0, 10) !== day) return null;
  // Vasaros ir žiemos laikas skiriasi (+03:00 / +02:00): poslinkis imamas tai dienai.
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Vilnius", timeZoneName: "longOffset" })
      .formatToParts(noon)
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+02:00";
  return `${day}T23:59:59${offset}`;
}
