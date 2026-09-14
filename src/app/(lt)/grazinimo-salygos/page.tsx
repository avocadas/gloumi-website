import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "refunds" },
  {
    title: LEGAL_TITLES.lt.refunds,
    description: "Kada ir kaip Gloumi grąžina avansą ar užstatą už vizitą, kaip veikia meistro prenumeratos grąžinimai ir kur kreiptis kilus nesutarimui.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "refunds" })}>
      <LegalDocument lang="lt" docKey="refunds" />
    </SiteShell>
  );
}
