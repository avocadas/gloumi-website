import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { copy } from "@/content/copy";
import { dac7Sections, LEGAL_META } from "@/content/legal";

export const metadata: Metadata = {
  title: "DAC7 ir platformos skaidrumas",
  description:
    "Ką Gloumi kaip skaitmeninė platforma praneša mokesčių administratoriui pagal DAC7, kaip veikia pranešimai apie turinį pagal DSA ir kaip rikiuojami meistrai.",
  alternates: { canonical: "/dac7" },
};

export default function Dac7Page() {
  return (
    <LegalPage
      slug="dac7"
      title="DAC7 ir platformos skaidrumas"
      titleEn="DAC7 and platform transparency"
      updated={LEGAL_META.lastUpdated}
      intro={copy.legal.disclaimer}
      groups={[{ lang: "lt", sections: dac7Sections() }]}
    />
  );
}
