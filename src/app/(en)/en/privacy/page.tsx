import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "privacy" },
  {
    title: LEGAL_TITLES.en.privacy,
    description: "What data Gloumi collects, why and on what legal basis, who it is shared with, how long it is kept and what rights you have under the GDPR.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "privacy" })}>
      <LegalDocument lang="en" docKey="privacy" />
    </SiteShell>
  );
}
