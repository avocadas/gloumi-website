import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { LANGS } from "@/content/lang";
import { LEGAL_META, LEGAL_TITLES } from "@/content/legal";
import { legalDocAlternates } from "@/content/legal-alternates";
import { LEGAL_TRANSLATIONS, type TranslatedLegal } from "@/content/legal-translations";
import { site } from "@/content/site";

type Doc = "terms" | "privacy";

function find(locale: string): TranslatedLegal {
  const t = LEGAL_TRANSLATIONS.find((x) => x.lang === locale);
  if (!t) notFound();
  return t;
}

/** The translation's own title when it states one; otherwise the English title with the language's name. */
function titleOf(t: TranslatedLegal, doc: Doc): string {
  return t.titles[doc] ?? `${LEGAL_TITLES.en[doc]} (${t.name})`;
}

export async function translatedMetadata(params: Promise<{ locale: string }>, doc: Doc): Promise<Metadata> {
  const t = find((await params).locale);
  const title = titleOf(t, doc);
  // The same language set as the Lithuanian and English pages list, so the hreflang group is reciprocal (SEO-3).
  const paths = legalDocAlternates(doc);
  const languages = Object.fromEntries(LANGS.filter((code) => paths[code]).map((code) => [code, paths[code]]));
  return {
    title,
    alternates: { canonical: `${site.url}/legal/${t.lang}/${doc}`, languages: { ...languages, "x-default": paths.lt } },
    openGraph: { title, locale: t.lang },
  };
}

export async function TranslatedLegal({ params, doc }: { params: Promise<{ locale: string }>; doc: Doc }) {
  const t = find((await params).locale);
  return (
    <SiteShell lang="en" alternates={legalDocAlternates(doc)}>
      <LegalPage
        lang="en"
        docKey={doc}
        updated={LEGAL_META.lastUpdated}
        version={t.version}
        note={t.notice ?? undefined}
        sections={t[doc]}
        translation={{ lang: t.lang, title: titleOf(t, doc), controller: t.controller }}
      />
    </SiteShell>
  );
}
