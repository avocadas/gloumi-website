import type { MetadataRoute } from "next";
import { LANGS, legalPath, homePath } from "@/content/lang";
import { LEGAL_META, LEGAL_ROUTES } from "@/content/legal";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_META.lastUpdated);
  const homes = LANGS.map((lang) => ({
    url: `${site.url}${homePath(lang)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: lang === "lt" ? 1 : 0.8,
  }));
  const docs = LANGS.flatMap((lang) =>
    LEGAL_ROUTES.map((route) => ({
      url: `${site.url}${legalPath(lang, route.key)}`,
      lastModified: legalDate,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }))
  );
  return [...homes, ...docs];
}
