import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Home } from "@/components/pages/Home";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates, isExtraLang } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isExtraLang(lang) ? buildMetadata(lang, { kind: "home" }) : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isExtraLang(lang)) notFound();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Home lang={lang} />
    </SiteShell>
  );
}
