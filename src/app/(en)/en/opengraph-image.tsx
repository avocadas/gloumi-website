import { renderOgImage, size, contentType } from "@/components/seo/ogImage";
import { getCopy } from "@/content/copy";

/* One card per language, generated at build time. */
export const alt = getCopy("en").seo.ogAlt;
export { size, contentType };

export default function Image() {
  return renderOgImage("en");
}
