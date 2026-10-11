import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Atsiliepimai viešame meistro puslapyje (#210, U-22, V-9). Duomenis atrenka
 * bazė (`public_master_reviews`, Gloumi `20261010212756`, tik `service_role`):
 * tik atsiliepimai su galiojančiu autoriaus sutikimu, autorius – vardas ir
 * pavardės pirmoji raidė, be nuotraukos, meistro atsakymas – tik prie jų;
 * vidurkis ir skaičius – iš visų atsiliepimų.
 *
 * Neišsaugoma podėlyje: puslapis dinaminis, tad atšauktas sutikimas dingsta
 * nuo kito atvėrimo (V-9 leidžia iki 24 val.).
 */

export type PublicReview = {
  id: string;
  author: string | null;
  rating: number;
  body: string | null;
  createdAt: string;
  reply: { body: string; createdAt: string } | null;
};

export type PublicReviews = {
  ratingAvg: number | null;
  ratingCount: number;
  shownCount: number;
  reviews: PublicReview[];
};

/** Nuo kiek atsiliepimų rodomas įvertinimas (U-22). */
export const MIN_REVIEWS_FOR_RATING = 3;

type RawReview = {
  id: string;
  author: string | null;
  rating: number;
  body: string | null;
  created_at: string;
  reply: { body: string; created_at: string } | null;
};

type Raw = { rating_avg: number | string | null; rating_count: number; shown_count: number; reviews: RawReview[] };

/** `null` – tokio meistro nėra (arba bazė neatsakė): puslapis tada atsiliepimų nerodo. */
export async function loadPublicReviews(masterId: string, limit = 20): Promise<PublicReviews | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("public_master_reviews", { _master_id: masterId, _limit: limit, _offset: 0 });
  if (error) {
    console.error("[public-reviews]", error.code ?? "error");
    return null;
  }
  const raw = data as Raw | null;
  if (!raw) return null;
  return {
    ratingAvg: raw.rating_avg === null ? null : Number(raw.rating_avg),
    ratingCount: raw.rating_count,
    shownCount: raw.shown_count,
    reviews: (raw.reviews ?? []).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      body: r.body,
      createdAt: r.created_at,
      reply: r.reply ? { body: r.reply.body, createdAt: r.reply.created_at } : null,
    })),
  };
}
