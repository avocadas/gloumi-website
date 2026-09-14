import { LegalPage } from "@/components/legal/LegalPage";
import { getCopy } from "@/content/copy";
import type { Lang, LegalKey } from "@/content/lang";
import { dac7Sections, LEGAL_DOCS, LEGAL_META, LEGAL_TITLES, refundSections } from "@/content/legal";

/**
 * Assembles one of the four legal documents for one language.
 *
 * Terms and Privacy come from the app's legal.js and exist in both languages
 * already; on the Lithuanian page the English translation is appended below,
 * because App Store Connect and Apple's reviewers read it there. The refund and
 * transparency pages are written for this site and carry one language each.
 */
export function LegalDocument({ lang, docKey }: { lang: Lang; docKey: LegalKey }) {
  const copy = getCopy(lang);
  const other: Lang = lang === "lt" ? "en" : "lt";

  if (docKey === "terms" || docKey === "privacy") {
    const doc = docKey === "terms" ? "terms" : "privacy";
    return (
      <LegalPage
        lang={lang}
        docKey={docKey}
        subtitle={LEGAL_TITLES[other][docKey]}
        updated={LEGAL_META.lastUpdated}
        version={LEGAL_META.version}
        groups={
          lang === "lt"
            ? [
                { lang: "lt", sections: LEGAL_DOCS.lt[doc] },
                { lang: "en", heading: LEGAL_TITLES.en[docKey], note: copy.legal.englishNote, sections: LEGAL_DOCS.en[doc] },
              ]
            : [{ lang: "en", note: copy.legal.englishNote, sections: LEGAL_DOCS.en[doc] }]
        }
      />
    );
  }

  const sections = docKey === "refunds" ? refundSections(lang) : dac7Sections(lang);

  return (
    <LegalPage
      lang={lang}
      docKey={docKey}
      subtitle={LEGAL_TITLES[other][docKey]}
      updated={LEGAL_META.lastUpdated}
      intro={docKey === "transparency" ? copy.legal.disclaimer : undefined}
      groups={[{ lang, sections }]}
    />
  );
}
