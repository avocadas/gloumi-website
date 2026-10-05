import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";
import { LEGAL_TITLES } from "@/content/legal";

export const metadata: Metadata = buildMetadata(
  "lt",
  { kind: "legal", key: "faq" },
  {
    title: LEGAL_TITLES.lt.faq,
    description:
      "Dažniausi klausimai apie Gloumi: paskyra, vizitų rezervavimas ir atšaukimas, mokėjimai ir grąžinimai, meistrams – profilis, išmokos ir salonai.",
  }
);

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "legal", key: "faq" })}>
      <FaqPage lang="lt" />
    </SiteShell>
  );
}
