/**
 * The languages, their URLs, and the anchors inside a page.
 *
 * Lithuanian stays at the root and English lives under /en. Lithuanian is the
 * home market and its paths are already public: https://gloumi.lt/privatumo-politika
 * is the address App Store Connect is given, so moving it behind a /lt prefix
 * to gain symmetry would cost more than the symmetry is worth.
 *
 * The other six (the app's own language packs, #189) get the home page and the
 * FAQ under /<code>. The legal documents exist in Lithuanian and English only
 * (`LegalLang`); their links from those pages go to the English text.
 */
export const LANGS = ["lt", "en", "pl", "lv", "de", "fr", "es", "it"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "lt";

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** The languages the legal documents are written in. */
export const LEGAL_LANGS = ["lt", "en"] as const;
export type LegalLang = (typeof LEGAL_LANGS)[number];

/** The languages served from the `[lang]` route: everything except the two with trees of their own. */
export const EXTRA_LANGS = LANGS.filter((l): l is Exclude<Lang, LegalLang> => l !== "lt" && l !== "en");
export type ExtraLang = (typeof EXTRA_LANGS)[number];

export const isExtraLang = (value: string): value is ExtraLang => (EXTRA_LANGS as readonly string[]).includes(value);

/** The legal text a reader of `lang` is sent to. */
export const legalLangOf = (lang: Lang): LegalLang => (lang === "lt" ? "lt" : "en");

/** What the language switcher shows. `label` is written in the language it switches to. */
export const LANG_LABELS: Record<Lang, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  lt: { label: "Lietuvių", short: "LT", htmlLang: "lt", ogLocale: "lt_LT" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_GB" },
  pl: { label: "Polski", short: "PL", htmlLang: "pl", ogLocale: "pl_PL" },
  lv: { label: "Latviešu", short: "LV", htmlLang: "lv", ogLocale: "lv_LV" },
  de: { label: "Deutsch", short: "DE", htmlLang: "de", ogLocale: "de_DE" },
  fr: { label: "Français", short: "FR", htmlLang: "fr", ogLocale: "fr_FR" },
  es: { label: "Español", short: "ES", htmlLang: "es", ogLocale: "es_ES" },
  it: { label: "Italiano", short: "IT", htmlLang: "it", ogLocale: "it_IT" },
};

/**
 * Section anchors, per language.
 *
 * Both the `id` on the section and the `href` in a menu come from here, so a
 * menu item cannot point at an anchor that does not exist. English pages get
 * English anchors: an English reader clicking "For masters" should not
 * land on #meistrams.
 */
export const SECTION_IDS = {
  lt: {
    download: "atsisiusti",
    categories: "kategorijos",
    why: "kodel-gloumi",
    masters: "meistrams",
    join: "tapti-meistru",
    contact: "kontaktai",
  },
  en: {
    download: "download",
    categories: "categories",
    why: "why-gloumi",
    masters: "for-masters",
    join: "join",
    contact: "contact",
  },
} as const satisfies Record<LegalLang, Record<string, string>>;

export type SectionKey = keyof (typeof SECTION_IDS)["lt"];

/** The anchors a language's home page uses: the other six share the English ones. */
const sectionIdsOf = (lang: Lang): Record<SectionKey, string> => SECTION_IDS[lang === "lt" ? "lt" : "en"];

/** The id to put on a section element. */
export const sectionId = (lang: Lang, key: SectionKey): string => sectionIdsOf(lang)[key];

/** A link to a section of the home page in that language. */
export const sectionHref = (lang: Lang, key: SectionKey): string => `${homePath(lang)}#${sectionIdsOf(lang)[key]}`;

/** The home page of a language. */
export const homePath = (lang: Lang): string => (lang === DEFAULT_LANG ? "/" : `/${lang}`);

/**
 * The legal documents, with the slug each language uses.
 *
 * The Lithuanian slugs are the ones already published and must not change.
 * `deletion` is the page Google Play's data safety form links to (Gloumi #171):
 * once given to the store, its slugs are as fixed as the others.
 */
export const LEGAL_ROUTES = [
  { key: "terms", lt: "taisykles", en: "terms" },
  { key: "privacy", lt: "privatumo-politika", en: "privacy" },
  { key: "partner", lt: "meistru-ir-salonu-salygos", en: "master-and-salon-terms" },
  { key: "refunds", lt: "grazinimo-salygos", en: "refunds" },
  { key: "transparency", lt: "dac7", en: "dac7" },
  { key: "deletion", lt: "paskyros-trynimas", en: "account-deletion" },
  // The legal role's DSA page and accessibility statement (2026-10-18, statements.ts).
  { key: "dsa", lt: "dsa", en: "dsa" },
  { key: "accessibility", lt: "prieinamumas", en: "accessibility" },
  // Not a legal document, but a page with the same routing: one path per language, alternates, sitemap (#209).
  { key: "faq", lt: "duk", en: "faq" },
] as const;

export type LegalKey = (typeof LEGAL_ROUTES)[number]["key"];

/** The FAQ slug of the six extra languages: one word every one of them reads. */
export const EXTRA_FAQ_SLUG = "faq";

/**
 * Path to a legal document as linked from a page in `lang`, e.g. ("en","terms")
 * -> /en/terms. From the six extra languages a document leads to its English
 * text, while the FAQ is their own: ("de","faq") -> /de/faq.
 */
export function legalPath(lang: Lang, key: LegalKey): string {
  const route = LEGAL_ROUTES.find((r) => r.key === key);
  if (!route) throw new Error(`Unknown legal document "${key}"`);
  if (isExtraLang(lang)) return key === "faq" ? `/${lang}/${EXTRA_FAQ_SLUG}` : legalPath("en", key);
  return lang === DEFAULT_LANG ? `/${route.lt}` : `/${lang}/${route.en}`;
}

export type Page = { kind: "home" } | { kind: "legal"; key: LegalKey };

/** The languages a page is written in: every one for the home page and the FAQ, Lithuanian and English for a document. */
export const pageLangs = (page: Page): readonly Lang[] =>
  page.kind === "home" || page.key === "faq" ? LANGS : LEGAL_LANGS;

/**
 * Every path a page really exists at, keyed by language – for hreflang. A
 * document has no German version, so it lists none rather than pointing
 * "de" at the English text.
 */
export function alternates(page: Page): Partial<Record<Lang, string>> {
  return Object.fromEntries(
    pageLangs(page).map((lang) => [lang, page.kind === "home" ? homePath(lang) : legalPath(lang, page.key)]),
  );
}

/** Where the switcher sends a reader of another language: the same page if it exists, else that language's home. */
export const switchTarget = (paths: Partial<Record<Lang, string>>, lang: Lang): string => paths[lang] ?? homePath(lang);
