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

export type PublicWork = { id: string; mediaId: string | null; title: string | null; price: number | null; category: string | null };

/*
 * Kurių darbų nuotraukas galima rodyti viešai (developeris 2026-10-11: „Taip,
 * nerodyti“ – jokių odos ar kūno būklės nuotraukų). Leidžiamų sąrašas, ne
 * draudžiamų: „other“ ir be kategorijos gali būti bet kas, o pedikiūras
 * laikomas tarp nagų, tad jis atpažįstamas pagal pavadinimą. Pirmasis sargas –
 * bazė (`public_master_page` ir `public-media-urls`); šis – jei ji praleistų.
 */
const SHOWABLE_WORK = new Set(["hair", "nails", "brows_lashes", "makeup"]);
const FOOT_WORK = /pedik|pedic|pėd|foot|feet/i;

export function isShowableWork(w: PublicWork): boolean {
  return !!w.category && SHOWABLE_WORK.has(w.category) && !FOOT_WORK.test(w.title ?? "");
}

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
    // Bazė (`72a7bea1`) grąžina `title` „Meistrė“ / „Meistras“; toliau eina tik female/male, tekstą renka svetainė pagal kalbą.
    titleGender:
      raw.title === "Meistrė" || raw.title_feminine === true || raw.title_gender === "female" ? "female" : "male",
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
      .map((p) => ({ id: String(p.id ?? ""), mediaId: str(p.media_id), title: str(p.service_title), price: num(p.price), category: str(p.category) }))
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

/*
 * Viešo puslapio nuotraukos (`public-media-urls`, Gloumi `3a752a77`; security A).
 * Įvestis – tik meistro id: kurias medijas pasirašyti, renkasi funkcija pati
 * (avataras ir darbai iš `public_master_page`, tik vaizdai, ne privatus kibiras),
 * adresas galioja ~20 min. Bet kokia klaida – tuščias atsakymas, o puslapis
 * rodomas be nuotraukų; žurnale – tik būsena, ne adresai.
 */
/** Tik R2 pasirašytas adresas: kitas serveris matytų lankytojų IP (security, gynyba gilyn). */
function isR2Url(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".r2.cloudflarestorage.com");
  } catch {
    return false;
  }
}

export async function loadPublicMedia(masterId: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  try {
    const db = createSupabaseAdminClient();
    const { data, error } = await db.functions.invoke("public-media-urls", { body: { masterId } });
    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;
      if (status !== 404) console.warn("[public-media]", status ?? "error");
      return out;
    }
    const items = Array.isArray((data as { items?: unknown })?.items) ? (data as { items: unknown[] }).items : [];
    for (const item of items as Array<{ mediaId?: unknown; url?: unknown; contentType?: unknown }>) {
      if (
        typeof item.mediaId === "string" &&
        typeof item.url === "string" &&
        isR2Url(item.url) &&
        typeof item.contentType === "string" &&
        item.contentType.startsWith("image/")
      ) {
        out[item.mediaId] = item.url;
      }
    }
  } catch {
    console.warn("[public-media]", "exception");
  }
  return out;
}
