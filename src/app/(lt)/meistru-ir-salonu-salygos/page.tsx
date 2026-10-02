import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "partner" },
  {
    title: LEGAL_TITLES.lt.partner,
    description: "Gloumi meistrų ir salonų sąlygos: kas gali būti meistras, rezervacijos, mokėjimai ir išmokos, komisinis ir prenumerata, salonai, mokestiniai duomenys (DAC7) ir sutarties nutraukimas.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "partner" })}>
      <LegalDocument lang="lt" docKey="partner" />
    </SiteShell>
  );
}
