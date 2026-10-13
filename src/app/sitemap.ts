import type { MetadataRoute } from "next";
import { LANGS, legalPath, homePath, pageLangs } from "@/content/lang";
import { FAQ_UPDATED } from "@/content/faq";
import { LEGAL_META, LEGAL_ROUTES, PARTNER_META } from "@/content/legal";
import { LEGAL_TRANSLATIONS } from "@/content/legal-translations";
import { site } from "@/content/site";
import { STATEMENT_DATE } from "@/content/statements";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_META.lastUpdated);
  // The Terms for Masters and Salons have their own date; the transparency page quotes them.
  const partnerDate = new Date(PARTNER_META.lastUpdated);
  const faqDate = new Date(FAQ_UPDATED);
  const statementDate = new Date(STATEMENT_DATE);
  const dateFor = (key: (typeof LEGAL_ROUTES)[number]["key"]) =>
    key === "dsa" || key === "accessibility"
      ? statementDate
      : key === "faq"
      ? faqDate
      : key === "partner"
        ? partnerDate
        : key === "transparency" && partnerDate > legalDate
          ? partnerDate
          : legalDate;
  const homes = LANGS.map((lang) => ({
    url: `${site.url}${homePath(lang)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: lang === "lt" ? 1 : lang === "en" ? 0.8 : 0.6,
  }));
  // Each page in the languages it is written in: the FAQ in all of them, a document in Lithuanian and English.
  const docs = LEGAL_ROUTES.flatMap((route) =>
    pageLangs({ kind: "legal", key: route.key }).map((lang) => ({
      url: `${site.url}${legalPath(lang, route.key)}`,
      lastModified: dateFor(route.key),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }))
  );
  // The Terms and Privacy Policy translations (K-ES2): /legal/<lang>/terms and /privacy, same date as the originals.
  const translations = LEGAL_TRANSLATIONS.flatMap((t) =>
    (["terms", "privacy"] as const).map((doc) => ({
      url: `${site.url}/legal/${t.lang}/${doc}`,
      lastModified: legalDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }))
  );
  return [...homes, ...docs, ...translations];
}
