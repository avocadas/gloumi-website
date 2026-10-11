import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../../../globals.css";
import { fontVariables } from "@/app/fonts";
import { rootMetadata } from "@/content/metadata";
import { LEGAL_TRANSLATIONS } from "@/content/legal-translations";

/**
 * Root layout for the Terms and Privacy Policy in further languages (K-ES2):
 * /legal/<lang>/terms and /legal/<lang>/privacy.
 *
 * A root layout of its own because only a root layout sets <html lang>, and a
 * German text must say it is German. The site's chrome stays English: the
 * site itself is Lithuanian and English, only these two documents are
 * translated. Under the fixed /legal prefix, so the language segment never
 * catches a top-level path. Only languages the generator wrote exist; any
 * other code is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_TRANSLATIONS.map((t) => ({ locale: t.lang }));
}

export const metadata: Metadata = rootMetadata("en");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default async function TranslatedLegalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LEGAL_TRANSLATIONS.some((t) => t.lang === locale)) notFound();
  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">{children}</body>
    </html>
  );
}
