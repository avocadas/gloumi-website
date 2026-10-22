import { IconStar } from "@/components/icons";
import { getCopy } from "@/content/copy";
import type { LegalLang } from "@/content/lang";
import { reviewCheckHref } from "@/content/legal";
import { site } from "@/content/site";
import { MIN_REVIEWS_FOR_RATING, type PublicReviews } from "@/lib/public-reviews";

/*
 * Atsiliepimų skiltis viešame meistro puslapyje (#210, U-22, V-9): įvertinimas
 * – tik nuo 3 atsiliepimų ir su nuoroda į „Kaip tikriname atsiliepimus“;
 * šalia – V-9 sakinys, nes vidurkis skaičiuojamas iš visų, o rodomi tik tie,
 * kurių autoriai sutiko. Autoriaus nuotraukos ir nuorodos į jo profilį nėra.
 * „Pranešti apie turinį“ – laiškas su puslapio adresu (DSA 16 str., Taisyklių 17 sk.).
 */

/** Lietuvių kalbos skaičiaus forma: 1 atsiliepimas, 2 atsiliepimai, 10 atsiliepimų. */
function countForm(lang: LegalLang, n: number, forms: string[]): string {
  if (lang !== "lt") return n === 1 ? forms[0] : forms[1];
  const tens = n % 100;
  const ones = n % 10;
  if (ones === 1 && tens !== 11) return forms[0];
  if (ones >= 2 && (tens < 10 || tens >= 20)) return forms[1];
  return forms[2];
}

const LOCALE: Record<LegalLang, string> = { lt: "lt-LT", en: "en-GB" };

function formatDate(lang: LegalLang, iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Vilnius",
  });
}

/** Penkios SVG žvaigždutės (developeris 2026-10-17: jokių emoji, tik SVG ikonos), kaip programėlės įvertinimuose. */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span aria-hidden className="inline-flex items-center gap-0.5 align-[-2px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar
          key={i}
          filled
          className={i < full ? "h-3.5 w-3.5 text-terracotta-600" : "h-3.5 w-3.5 text-espresso-900/15"}
        />
      ))}
    </span>
  );
}

export function MasterReviews({ lang, data, pageUrl }: { lang: LegalLang; data: PublicReviews; pageUrl: string }) {
  const copy = getCopy(lang).masterReviews;
  const showRating = data.ratingAvg !== null && data.ratingCount >= MIN_REVIEWS_FOR_RATING;
  const avg = data.ratingAvg?.toLocaleString(LOCALE[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  // The DSA Art. 16 notice items as blanks to fill in; the page address is the location.
  const reportBody = [
    `${copy.reportBody.where}: ${pageUrl} – `,
    "",
    `${copy.reportBody.why}: `,
    "",
    `${copy.reportBody.name}: `,
    "",
    copy.reportBody.confirm,
  ].join("\r\n");
  const report = `mailto:${site.email}?subject=${encodeURIComponent(`${copy.reportSubject}: ${pageUrl}`)}&body=${encodeURIComponent(reportBody)}`;

  return (
    <section aria-labelledby="reviews-title" className="mx-auto mt-16 max-w-2xl text-left">
      <h2 id="reviews-title" className="font-serif text-3xl font-medium text-espresso-900">
        {copy.title}
      </h2>

      {showRating ? (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-espresso-900">
          <Stars rating={data.ratingAvg ?? 0} />
          <span className="text-xl font-semibold tabular-nums">{avg}</span>
          <span className="text-espresso-500">
            {copy.outOf} · {data.ratingCount} {countForm(lang, data.ratingCount, copy.count)}
          </span>
        </p>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-espresso-500 text-pretty">
        {copy.consentNote}{" "}
        <a href={reviewCheckHref(lang)} className="font-medium text-terracotta-600 underline-offset-2 hover:underline">
          {copy.howWeCheck}
        </a>
      </p>

      {data.reviews.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white px-6 py-5 text-espresso-500 shadow-card ring-1 ring-espresso-900/5">
          {copy.empty}
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {data.reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white px-6 py-5 shadow-card ring-1 ring-espresso-900/5">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-semibold text-espresso-900">{r.author ?? copy.noName}</span>
                <span className="text-sm text-espresso-500">
                  <time dateTime={r.createdAt}>{formatDate(lang, r.createdAt)}</time>
                </span>
              </p>
              <p className="mt-1" aria-label={`${r.rating} ${copy.outOf}`}>
                <Stars rating={r.rating} />
              </p>
              {r.body ? <p className="mt-3 leading-relaxed whitespace-pre-line text-espresso-700">{r.body}</p> : null}
              {r.reply ? (
                <div className="mt-4 rounded-xl bg-cream-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-600">{copy.reply}</p>
                  <p className="mt-1 leading-relaxed whitespace-pre-line text-espresso-700">{r.reply.body}</p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm">
        <a href={report} className="font-medium text-espresso-500 underline-offset-2 hover:underline">
          {copy.report}
        </a>
      </p>
    </section>
  );
}
