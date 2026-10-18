import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "dsa" },
  {
    title: LEGAL_TITLES.lt.dsa,
    description: "Gloumi kontaktiniai taškai pagal Skaitmeninių paslaugų aktą, kaip pranešti apie neteisėtą turinį, kaip priimame sprendimus ir kaip juos apskųsti.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "dsa" })}>
      <LegalDocument lang="lt" docKey="dsa" />
    </SiteShell>
  );
}
