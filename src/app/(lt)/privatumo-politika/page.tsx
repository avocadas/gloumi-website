import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { legalDocAlternates } from "@/content/legal-alternates";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "privacy" },
  {
    title: LEGAL_TITLES.lt.privacy,
    description: "Kokius duomenis Gloumi renka, kodėl ir kokiu pagrindu, kam jie perduodami, kiek laiko saugomi ir kokias teises turite pagal BDAR.",
  },
  legalDocAlternates("privacy")
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={legalDocAlternates("privacy")}>
      <LegalDocument lang="lt" docKey="privacy" />
    </SiteShell>
  );
}
