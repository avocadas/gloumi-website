import { LegalPage } from "@/components/legal/LegalPage";
import { getCopy } from "@/content/copy";
import type { Lang, LegalKey } from "@/content/lang";
import { dac7Sections, LEGAL_DOCS, LEGAL_META, refundSections } from "@/content/legal";

/**
 * Assembles one of the four legal documents for one language.
 *
 * One page carries one language: the Lithuanian path shows the Lithuanian text,
 * `/en` shows the English one, and the switcher in the header moves between them
 * without leaving the document. The Lithuanian page used to append the English
 * translation below its own text, behind an "English version ↓" link; that made
 * the page twice as long and left its table of contents describing only the top
 * half of it.
 */
export function LegalDocument({ lang, docKey }: { lang: Lang; docKey: LegalKey }) {
  const copy = getCopy(lang);

  if (docKey === "terms" || docKey === "privacy") {
    const doc = docKey === "terms" ? "terms" : "privacy";
    return (
      <LegalPage
        lang={lang}
        docKey={docKey}
        updated={LEGAL_META.lastUpdated}
        version={LEGAL_META.version}
        /* The precedence note belongs on the translation, not on the original. */
        note={lang === "en" ? copy.legal.englishNote : undefined}
        sections={LEGAL_DOCS[lang][doc]}
      />
    );
  }

  const sections = docKey === "refunds" ? refundSections(lang) : dac7Sections(lang);

  return (
    <LegalPage
      lang={lang}
      docKey={docKey}
      updated={LEGAL_META.lastUpdated}
      intro={docKey === "transparency" ? copy.legal.disclaimer : undefined}
      sections={sections}
    />
  );
}
