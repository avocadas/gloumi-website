import { getCopy } from "@/content/copy";
import { LANGS, LANG_LABELS, type Lang } from "@/content/lang";
import { site } from "@/content/site";

/**
 * Organization + WebSite + MobileApplication as one @graph. Rendered as a
 * plain <script>: structured data is data, not code to be scheduled.
 */
export function JsonLd({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  const orgId = `${site.url}/#organization`;
  const installUrl = [site.stores.appStore, site.stores.googlePlay].filter((value): value is string => Boolean(value));
  // The brand's own profiles and store pages: Google ties them to the brand (the knowledge panel), so each one set counts.
  const sameAs = [...Object.values(site.social), ...installUrl].filter((value): value is string => Boolean(value));

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      // The name people search for is the brand; the registered name is legalName (developer, 2026-10-18: "Gloumi" did not find the site).
      name: site.name,
      legalName: site.legalName,
      alternateName: ["Gloumi LT", "gloumi.lt"],
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
      alternateName: ["Gloumi LT", "gloumi.lt"],
      // Every language the site is in, not only Lithuanian: /en said "lt" (web audit 2026-10-22).
      inLanguage: LANGS.map((code) => LANG_LABELS[code].htmlLang),
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

  // Keičiama į šešių simbolių seką (atgalinis brūkšnys ir u003c), ne į patį `<`:
  // JS eilutėje viengubas brūkšnys su u003c ir yra `<`, tad keitimas nieko
  // nekeisdavo. Kol duomenys pastovūs, žalos nėra, bet pirma vartotojo eilutė
  // su `</script>` uždarytų žymę (SECURITY_AUDIT.md I-6, avocadas/Gloumi).
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
