/*
 * Reikšmių rodymas portalo kortelėse (#129). Atskirai nuo `lib/admin-data.ts`,
 * nes tas modulis `server-only`, o šį naudoja ir kliento komponentai.
 *
 * Laiko juosta nurodoma aiškiai: kortelė piešiama serveryje (Vercel, UTC) ir
 * vėl naršyklėje (Vilnius), ir be juostos tekstas abiejose vietose skirtųsi.
 */
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("lt-LT", { timeZone: "Europe/Vilnius" });
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "taip" : "ne";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return ISO_TIMESTAMP.test(value) ? formatDate(value) : value;
  return JSON.stringify(value);
}
