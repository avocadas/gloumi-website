import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "en",
  { kind: "legal", key: "faq" },
  {
    title: LEGAL_TITLES.en.faq,
    description:
      "Frequently asked questions about Gloumi: your account, booking and cancelling visits, payments and refunds, and for masters – the profile, payouts and salons.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "legal", key: "faq" })}>
      <FaqPage lang="en" />
    </SiteShell>
  );
}
