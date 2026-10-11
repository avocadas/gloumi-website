import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Viešas meistro puslapis (#210, U-22; developeris K-W1, K-W2 2026-10-05).
 * Ką rodyti, sprendžia bazė (`public_master_page`, tik `service_role`): tik
 * U-22 lentelės „Rodo“ laukai ir tik meistrui, kuris yra viešas
 * (`master_publicly_listed` – ne testinis, nesustabdytas, netrinamas).
 * Tikslaus adreso, koordinačių, kontaktų, plano ir pinigų laukų bazė negrąžina.
 *
 * Neišsaugoma podėlyje: paslėptas ar sustabdytas meistras turi dingti nuo
 * kito atvėrimo (U-22: „nedelsiant“).
 */

export type PublicService = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  durationMinutes: number | null;
  depositKind: string | null;
  depositValue: number | null;
  category: string | null;
};

export type PublicHours = { weekday: number; start: string | null; end: string | null; off: boolean };

export type PublicWork = { id: string; mediaId: string | null; title: string | null; price: number | null };

export type PublicMaster = {
  name: string;
  /** `female` → „Meistrė“, kita → „Meistras“ (`master_title_gender`); tekstas – svetainės. */
  titleGender: "female" | "male";
  specialty: string | null;
  bio: string | null;
  styleTags: string[];
  workFormats: string[];
  amenities: string[];
  paymentMethods: string[];
  city: string | null;
  district: string | null;
  avatarMediaId: string | null;
  services: PublicService[];
  cancellationPolicy: string | null;
  rules: string | null;
  bookingLeadHours: number | null;
  hours: PublicHours[];
  portfolio: PublicWork[];
};

type Raw = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && v.trim() && !isNaN(Number(v)) ? Number(v) : null);
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()) : []);
const rows = (v: unknown) => (Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as Raw[]) : []);

/** Bazės atsakymas → puslapio forma. Atskirai nuo kvietimo, kad būtų galima patikrinti be bazės. */
export function toPublicMaster(raw: Raw): PublicMaster | null {
  const name = str(raw.name);
  if (!name) return null;
  return {
    name,
    titleGender: raw.title_gender === "female" ? "female" : "male",
    specialty: str(raw.specialty),
    bio: str(raw.bio),
    styleTags: strings(raw.style_tags),
    workFormats: strings(raw.work_formats),
    amenities: strings(raw.amenities),
    paymentMethods: strings(raw.accepted_payment_methods),
    city: str(raw.city),
    district: str(raw.district),
    avatarMediaId: str(raw.avatar_media_id),
    services: rows(raw.services)
      .map((s) => ({
        id: String(s.id ?? ""),
        title: str(s.title) ?? "",
        description: str(s.description),
        price: num(s.price),
        durationMinutes: num(s.duration_minutes),
        depositKind: str(s.deposit_kind),
        depositValue: num(s.deposit_value),
        category: str(s.category_title) ?? str(s.category),
      }))
      .filter((s) => s.id && s.title),
    cancellationPolicy: str(raw.cancellation_policy),
    rules: str(raw.rules),
    bookingLeadHours: num(raw.booking_lead_hours),
    hours: rows(raw.hours)
      .map((h) => ({ weekday: num(h.weekday) ?? -1, start: str(h.start_time), end: str(h.end_time), off: h.is_off === true }))
      .filter((h) => h.weekday >= 0 && h.weekday <= 6),
    portfolio: rows(raw.portfolio)
      .map((p) => ({ id: String(p.id ?? ""), mediaId: str(p.media_id), title: str(p.service_title), price: num(p.price) }))
      .filter((p) => p.id),
  };
}

/** `null` – meistras neviešas, jo nėra arba bazė neatsakė: puslapis tada lieka nuoroda į programėlę. */
export async function loadPublicMaster(masterId: string): Promise<PublicMaster | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("public_master_page", { _master_id: masterId });
  if (error) {
    console.error("[public-master]", error.code ?? "error");
    return null;
  }
  return data && typeof data === "object" ? toPublicMaster(data as Raw) : null;
}
