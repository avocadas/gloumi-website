/**
 * The two languages, their URLs, and the anchors inside a page.
 *
 * Lithuanian stays at the root and English lives under /en. Lithuanian is the
 * home market and its paths are already public: https://gloumi.lt/privatumo-politika
 * is the address App Store Connect is given, so moving it behind a /lt prefix
 * to gain symmetry would cost more than the symmetry is worth.
 */
export const LANGS = ["lt", "en"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "lt";

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** What the language switcher shows. `label` is written in the language it switches to. */
export const LANG_LABELS: Record<Lang, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  lt: { label: "Lietuvių", short: "LT", htmlLang: "lt", ogLocale: "lt_LT" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_GB" },
};

/**
 * Section anchors, per language.
 *
 * Both the `id` on the section and the `href` in a menu come from here, so a
 * menu item cannot point at an anchor that does not exist. English pages get
 * English anchors: an English reader clicking "For professionals" should not
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
    masters: "for-professionals",
    join: "join",
    contact: "contact",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type SectionKey = keyof (typeof SECTION_IDS)["lt"];

/** The id to put on a section element. */
export const sectionId = (lang: Lang, key: SectionKey): string => SECTION_IDS[lang][key];

/** A link to a section of the home page in that language. */
export const sectionHref = (lang: Lang, key: SectionKey): string =>
  `${homePath(lang)}#${SECTION_IDS[lang][key]}`;

/** The home page of a language. */
export const homePath = (lang: Lang): string => (lang === DEFAULT_LANG ? "/" : `/${lang}`);

/**
 * The four legal documents, with the slug each language uses.
 *
 * The Lithuanian slugs are the ones already published and must not change.
 */
export const LEGAL_ROUTES = [
  { key: "terms", lt: "taisykles", en: "terms" },
  { key: "privacy", lt: "privatumo-politika", en: "privacy" },
  { key: "refunds", lt: "grazinimo-salygos", en: "refunds" },
  { key: "transparency", lt: "dac7", en: "dac7" },
] as const;

export type LegalKey = (typeof LEGAL_ROUTES)[number]["key"];

/** Path to a legal document in a language, e.g. ("en","terms") -> /en/terms */
export function legalPath(lang: Lang, key: LegalKey): string {
  const route = LEGAL_ROUTES.find((r) => r.key === key);
  if (!route) throw new Error(`Unknown legal document "${key}"`);
  return lang === DEFAULT_LANG ? `/${route[lang]}` : `/${lang}/${route[lang]}`;
}

/** The same page in the other language, for the switcher and for hreflang. */
export function translatedPath(lang: Lang, page: { kind: "home" } | { kind: "legal"; key: LegalKey }): string {
  return page.kind === "home" ? homePath(lang) : legalPath(lang, page.key);
}

/** All paths a page exists at, keyed by language – used for alternates and the switcher. */
export function alternates(page: { kind: "home" } | { kind: "legal"; key: LegalKey }): Record<Lang, string> {
  return { lt: translatedPath("lt", page), en: translatedPath("en", page) };
}
