import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "deletion" },
  {
    title: LEGAL_TITLES.en.deletion,
    description: "How to delete your Gloumi account in the app or by email, what is deleted and what is kept longer.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "deletion" })}>
      <LegalDocument lang="en" docKey="deletion" />
    </SiteShell>
  );
}
