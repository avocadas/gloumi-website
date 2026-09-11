import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { copy } from "@/content/copy";
import { LEGAL_DOCS, LEGAL_META } from "@/content/legal";

export const metadata: Metadata = {
  title: "Naudojimosi taisyklės",
  description:
    "Gloumi programėlės naudojimosi taisyklės: platformos vaidmuo, paskyra, rezervacijos ir avansas, meistro prenumerata, turinys ir atsakomybė.",
  alternates: { canonical: "/taisykles" },
};

export default function TermsPage() {
  return (
    <LegalPage
      slug="taisykles"
      title="Naudojimosi taisyklės"
      titleEn="Terms of Service"
      updated={LEGAL_META.lastUpdated}
      version={LEGAL_META.version}
      groups={[
        { lang: "lt", sections: LEGAL_DOCS.lt.terms },
        { lang: "en", heading: "Terms of Service", note: copy.legal.englishNote, sections: LEGAL_DOCS.en.terms },
      ]}
    />
  );
}
