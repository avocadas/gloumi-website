import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/*
 * No `host`: it printed a non-standard `Host:` line that Google and Bing
 * ignore; the one address is already settled by the 308 from www and http
 * and by each page's canonical (web audit 2026-10-22).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
