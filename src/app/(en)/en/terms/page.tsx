import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { legalDocAlternates } from "@/content/legal-alternates";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "terms" },
  {
    title: LEGAL_TITLES.en.terms,
    description: "Gloumi's terms of service: the platform's role, accounts, bookings and deposits, the subscription for masters, content rules and liability.",
  },
  legalDocAlternates("terms")
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={legalDocAlternates("terms")}>
      <LegalDocument lang="en" docKey="terms" />
    </SiteShell>
  );
}
