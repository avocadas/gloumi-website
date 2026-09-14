import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "transparency" },
  {
    title: LEGAL_TITLES.lt.transparency,
    description: "Ką Gloumi kaip skaitmeninė platforma praneša mokesčių administratoriui pagal DAC7, kaip veikia pranešimai apie turinį pagal DSA ir kaip rikiuojami meistrai.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "transparency" })}>
      <LegalDocument lang="lt" docKey="transparency" />
    </SiteShell>
  );
}
