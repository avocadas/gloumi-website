import { renderOgImage, size, contentType } from "@/components/seo/ogImage";
import { getCopy } from "@/content/copy";
import { isExtraLang } from "@/content/lang";

/*
 * One card per language, generated at build time for each language the
 * layout prerenders. The alt text is the language's own, so it comes from
 * `generateImageMetadata` rather than a fixed `alt` export.
 */
export function generateImageMetadata({ params }: { params: { lang: string } }) {
  return [{ id: "card", alt: getCopy(isExtraLang(params.lang) ? params.lang : "en").seo.ogAlt, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return renderOgImage(isExtraLang(lang) ? lang : "en");
}
