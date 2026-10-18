import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "accessibility" },
  {
    title: LEGAL_TITLES.en.accessibility,
    description: "How accessible the Gloumi app and website are to people with disabilities, what is still being improved and how to report a barrier.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "accessibility" })}>
      <LegalDocument lang="en" docKey="accessibility" />
    </SiteShell>
  );
}
