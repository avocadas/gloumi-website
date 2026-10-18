import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "dsa" },
  {
    title: LEGAL_TITLES.en.dsa,
    description: "Gloumi points of contact under the Digital Services Act, how to report illegal content, how we make decisions and how to appeal them.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "dsa" })}>
      <LegalDocument lang="en" docKey="dsa" />
    </SiteShell>
  );
}
