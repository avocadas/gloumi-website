import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqPage } from "@/components/faq/FaqPage";
import { SiteShell } from "@/components/layout/SiteShell";
import { getCopy } from "@/content/copy";
import { alternates, isExtraLang } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";

/*
 * The FAQ of an extra language. Its title is the footer's link label, which
 * each draft translates; the description is the site's own, since the drafts
 * carry no FAQ-specific one.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isExtraLang(lang)) return {};
  const copy = getCopy(lang);
  return buildMetadata(lang, { kind: "legal", key: "faq" }, { title: copy.footer.faq, description: copy.seo.description });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isExtraLang(lang)) notFound();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "legal", key: "faq" })}>
      <FaqPage lang={lang} />
    </SiteShell>
  );
}
