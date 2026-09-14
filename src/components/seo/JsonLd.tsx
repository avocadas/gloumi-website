import { getCopy } from "@/content/copy";
import type { Lang } from "@/content/lang";
import { site } from "@/content/site";

/**
 * Organization + WebSite + MobileApplication as one @graph. Rendered as a
 * plain <script>: structured data is data, not code to be scheduled.
 */
export function JsonLd({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  const orgId = `${site.url}/#organization`;
  const sameAs = Object.values(site.social).filter((value): value is string => Boolean(value));
  const installUrl = [site.stores.appStore, site.stores.googlePlay].filter((value): value is string => Boolean(value));

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.legalName,
      alternateName: site.name,
      url: site.url,
      logo: `${site.url}/icons/icon-512.png`,
      email: site.email,
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: site.language,
      publisher: { "@id": orgId },
    },
    {
      "@type": "MobileApplication",
      name: site.name,
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      description: copy.seo.description,
      inLanguage: site.language,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": orgId },
      ...(installUrl.length ? { installUrl } : {}),
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
