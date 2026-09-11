import type { MetadataRoute } from "next";
import { legalPages, LEGAL_META } from "@/content/legal";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(LEGAL_META.lastUpdated);
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...legalPages.map((page) => ({
      url: `${site.url}/${page.slug}`,
      lastModified: legalDate,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
