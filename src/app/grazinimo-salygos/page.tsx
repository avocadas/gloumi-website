import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_META, refundSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Grąžinimo sąlygos",
  description:
    "Kada ir kaip Gloumi grąžina avansą ar užstatą už vizitą, kaip veikia meistro prenumeratos grąžinimai ir kur kreiptis kilus nesutarimui.",
  alternates: { canonical: "/grazinimo-salygos" },
};

export default function RefundPage() {
  return (
    <LegalPage
      slug="grazinimo-salygos"
      title="Grąžinimo sąlygos"
      titleEn="Refund Policy"
      updated={LEGAL_META.lastUpdated}
      groups={[{ lang: "lt", sections: refundSections() }]}
    />
  );
}
