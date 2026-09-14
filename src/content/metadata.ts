import type { Metadata } from "next";
import { getCopy } from "./copy";
import { alternates, LANG_LABELS, LANGS, type Lang, type LegalKey } from "./lang";
import { site } from "./site";

type Page = { kind: "home" } | { kind: "legal"; key: LegalKey };

/**
 * Metadata shared by every page, in one place.
 *
 * The `alternates` block is the part that matters for two languages: it tells
 * a search engine that the Lithuanian and English pages are the same document,
 * so they compete with each other in neither index. `x-default` points at the
 * Lithuanian one, which is the home market.
 */
export function buildMetadata(lang: Lang, page: Page, extra?: Metadata): Metadata {
  const paths = alternates(page);
  const languages = Object.fromEntries(LANGS.map((code) => [code, paths[code]]));

  /*
   * Deliberately no `openGraph` here, only `alternates`.
   *
   * The share card is a file-based metadata route, and Next attaches it to a
   * page only while that page does not declare an openGraph object of its own.
   * Declaring one here silently dropped og:image from every legal page; the
   * home pages kept theirs only because the image file sits in the same
   * segment. So the openGraph block lives on the layout and pages inherit it,
   * image included.
   */
  return {
    alternates: {
      canonical: paths[lang],
      languages: { ...languages, "x-default": paths.lt },
    },
    ...extra,
  };
}

/** The document-wide defaults, set on each root layout. */
export function rootMetadata(lang: Lang): Metadata {
  const copy = getCopy(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: copy.seo.title, template: copy.seo.titleTemplate },
    description: copy.seo.description,
    applicationName: site.name,
    keywords: [...copy.seo.keywords],
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "beauty",
    openGraph: {
      type: "website",
      locale: LANG_LABELS[lang].ogLocale,
      alternateLocale: LANGS.filter((c) => c !== lang).map((c) => LANG_LABELS[c].ogLocale),
      siteName: site.name,
      title: copy.seo.title,
      description: copy.seo.description,
    },
    twitter: { card: "summary_large_image", title: copy.seo.title, description: copy.seo.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { telephone: false },
  };
}
