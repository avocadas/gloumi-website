import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../../globals.css";
import { fontVariables } from "@/app/fonts";
import { EXTRA_LANGS, isExtraLang, LANG_LABELS } from "@/content/lang";
import { rootMetadata } from "@/content/metadata";

/**
 * Root layout for the six extra languages, /pl … /it.
 *
 * Like the Lithuanian and English trees, it is a root layout of its own so
 * that <html lang> is right. Unlike them it is one tree for six languages: they
 * carry the home page and the FAQ only, the same pages with a different
 * dictionary. Every language is prerendered (`generateStaticParams`) and any
 * other first segment is a 404 (`dynamicParams = false`), so /xyz cannot turn
 * into a page with an unknown language.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return EXTRA_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isExtraLang(lang) ? rootMetadata(lang) : {};
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default async function ExtraLangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isExtraLang(lang)) notFound();
  return (
    <html lang={LANG_LABELS[lang].htmlLang} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">{children}</body>
    </html>
  );
}
