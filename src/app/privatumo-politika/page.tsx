import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { copy } from "@/content/copy";
import { LEGAL_DOCS, LEGAL_META } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description:
    "Kokius duomenis Gloumi renka, kodėl ir kokiu pagrindu, kam jie perduodami, kiek laiko saugomi ir kokias teises turite pagal BDAR.",
  alternates: { canonical: "/privatumo-politika" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      slug="privatumo-politika"
      title="Privatumo politika"
      titleEn="Privacy Policy"
      updated={LEGAL_META.lastUpdated}
      version={LEGAL_META.version}
      groups={[
        { lang: "lt", sections: LEGAL_DOCS.lt.privacy },
        { lang: "en", heading: "Privacy Policy", note: copy.legal.englishNote, sections: LEGAL_DOCS.en.privacy },
      ]}
    />
  );
}
