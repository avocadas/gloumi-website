import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "accessibility" },
  {
    title: LEGAL_TITLES.lt.accessibility,
    description: "Kiek Gloumi programėlė ir svetainė prieinamos žmonėms su negalia, kas dar tobulinama ir kaip pranešti apie kliūtį.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "accessibility" })}>
      <LegalDocument lang="lt" docKey="accessibility" />
    </SiteShell>
  );
}
