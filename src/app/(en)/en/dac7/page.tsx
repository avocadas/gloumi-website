import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "transparency" },
  {
    title: LEGAL_TITLES.en.transparency,
    description: "What Gloumi reports to the tax authority under DAC7, how content reports work under the DSA, and how professionals are ranked in search.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "transparency" })}>
      <LegalDocument lang="en" docKey="transparency" />
    </SiteShell>
  );
}
