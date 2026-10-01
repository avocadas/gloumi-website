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

/** Kortelės viršui: be sekundžių, jos ten tik triukšmas. */
export function formatWhen(value: unknown): string {
  if (typeof value !== "string" || !value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("lt-LT", {
        timeZone: "Europe/Vilnius",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "taip" : "ne";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return ISO_TIMESTAMP.test(value) ? formatDate(value) : value;
  return JSON.stringify(value);
}

/*
 * Žmogiški stulpelių vardai kortelėms. Tikrasis vardas lieka „Visi laukai"
 * sąraše ir užuominoje, nes apie duomenis kalbamasi būtent juo. Nežinomas
 * stulpelis rodomas savo vardu: nauja katalogo lentelė neturi laukti, kol
 * kas nors papildys šį sąrašą.
 */
const COLUMN_LABEL: Record<string, string> = {
  service_title: "Pavadinimas",
  title: "Pavadinimas",
  title_snapshot: "Paslauga",
  label: "Pavadinimas",
  description: "Aprašymas",
  body: "Tekstas",
  caption: "Prierašas",
  category: "Kategorija",
  category_id: "Kategorija",
  note: "Pastaba",
  subject: "Tema",
  message: "Žinutė",
  kind: "Rūšis",
  r2_key: "Failas",
  content_type: "Tipas",
  emoji: "Reakcija",
  color: "Spalva",
  last_message_preview: "Paskutinė žinutė",
  username: "Naudotojo vardas",
  display_name: "Vardas",
  bio: "Aprašas",
  phone_number: "Telefonas",
  phone_verified: "Telefonas patvirtintas",
  deletion_requested_at: "Paprašė ištrinti",
  specialty: "Specialybė",
  city: "Miestas",
  rules: "Taisyklės",
  vibe: "Nuotaika",
  website: "Svetainė",
  business_name: "Įmonė",
  business_email: "Įmonės el. paštas",
  verified: "Patvirtintas",
  subscribed_plan: "Planas",
  reason: "Priežastis",
  details: "Smulkiau",
  target_type: "Kam pranešta",
  expectations: "Kliento lūkesčiai",
  status: "Būsena",
  code: "Kodas",
  recipient_name: "Gavėjas",
  recipient_email: "Gavėjo el. paštas",
  plan: "Planas",
  product_id: "Produktas",
  number: "Numeris",
  action: "Veiksmas",
  admin_label: "Administratorius",
};

export const columnLabel = (column: string) => COLUMN_LABEL[column] ?? column;

/** Kieno eilutė: katalogo `owners` stulpelis → kas tas žmogus šioje eilutėje. */
const OWNER_LABEL: Record<string, string> = {
  id: "Paskyra",
  profile_id: "Naudotojas",
  master_id: "Meistras",
  client_id: "Klientas",
  author_id: "Autorius",
  owner_id: "Savininkas",
  sender_id: "Siuntėjas",
  recipient_id: "Gavėjas",
  reporter_id: "Pranešė",
  follower_id: "Sekėjas",
  blocker_id: "Užblokavo",
  blocked_id: "Užblokuotas",
  subject_id: "Apie ką",
  purchaser_id: "Pirko",
  redeemed_by: "Panaudojo",
  referrer_id: "Rekomendavo",
  referred_id: "Rekomenduotas",
  admin_id: "Administratorius",
};

export const ownerLabel = (column: string) => OWNER_LABEL[column] ?? column;
