import type { MetadataRoute } from "next";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";

/** The manifest and the share card are single files, so they carry the home market's language. */
const copy = getCopy("lt");

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: copy.seo.title,
    short_name: site.name,
    description: copy.seo.description,
    lang: site.language,
    start_url: "/",
    display: "browser",
    background_color: "#F9F6F0",
    theme_color: "#F9F6F0",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
