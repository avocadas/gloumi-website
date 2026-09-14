import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "refunds" },
  {
    title: LEGAL_TITLES.en.refunds,
    description: "When and how Gloumi refunds a deposit for an appointment, how subscription refunds work, and where to turn if you disagree.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "refunds" })}>
      <LegalDocument lang="en" docKey="refunds" />
    </SiteShell>
  );
}
