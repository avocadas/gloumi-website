import type { Metadata } from "next";
import { LegalDocument } from "@/components/pages/LegalDocument";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "partner" },
  {
    title: LEGAL_TITLES.en.partner,
    description: "Gloumi's terms for masters and salons: who may be a master, bookings, payments and payouts, commission and subscriptions, salons, tax information (DAC7) and termination.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "partner" })}>
      <LegalDocument lang="en" docKey="partner" />
    </SiteShell>
  );
}
