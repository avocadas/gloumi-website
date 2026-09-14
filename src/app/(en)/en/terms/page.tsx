import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "terms" },
  {
    title: LEGAL_TITLES.en.terms,
    description: "Gloumi's terms of service: the platform's role, accounts, bookings and deposits, the professional subscription, content rules and liability.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "terms" })}>
      <LegalDocument lang="en" docKey="terms" />
    </SiteShell>
  );
}
