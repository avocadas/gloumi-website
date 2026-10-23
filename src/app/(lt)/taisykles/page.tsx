import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { legalDocAlternates } from "@/content/legal-alternates";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "terms" },
  {
    title: LEGAL_TITLES.lt.terms,
    description: "Gloumi programėlės naudojimosi taisyklės: platformos vaidmuo, paskyra, rezervacijos ir avansas, meistro prenumerata, turinys ir atsakomybė.",
  },
  legalDocAlternates("terms")
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={legalDocAlternates("terms")}>
      <LegalDocument lang="lt" docKey="terms" />
    </SiteShell>
  );
}
