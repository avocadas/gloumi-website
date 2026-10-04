import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "deletion" },
  {
    title: LEGAL_TITLES.lt.deletion,
    description: "Kaip ištrinti Gloumi paskyrą programėlėje arba el. paštu, kas ištrinama ir kas saugoma ilgiau.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "deletion" })}>
      <LegalDocument lang="lt" docKey="deletion" />
    </SiteShell>
  );
}
