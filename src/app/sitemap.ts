import type { MetadataRoute } from "next";
import { LANGS, legalPath, homePath } from "@/content/lang";
import { LEGAL_META, LEGAL_ROUTES, PARTNER_META } from "@/content/legal";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_META.lastUpdated);
  // The Terms for Masters and Salons have their own date; the transparency page quotes them.
  const partnerDate = new Date(PARTNER_META.lastUpdated);
  const dateFor = (key: (typeof LEGAL_ROUTES)[number]["key"]) =>
    key === "partner" ? partnerDate : key === "transparency" && partnerDate > legalDate ? partnerDate : legalDate;
  const homes = LANGS.map((lang) => ({
    url: `${site.url}${homePath(lang)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: lang === "lt" ? 1 : 0.8,
  }));
  const docs = LANGS.flatMap((lang) =>
    LEGAL_ROUTES.map((route) => ({
      url: `${site.url}${legalPath(lang, route.key)}`,
      lastModified: dateFor(route.key),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }))
  );
  return [...homes, ...docs];
}
