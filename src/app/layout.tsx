import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { copy } from "@/content/copy";
import { site } from "@/content/site";

/*
 * Cormorant Garamond is the face the app's design canvas asks for (its
 * wordmark is set in it); DM Sans carries the body. Both self-hosted by
 * next/font with latin-ext, so ą č ę ė į š ų ū ž render in the real face.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: copy.seo.title,
    template: copy.seo.titleTemplate,
  },
  description: copy.seo.description,
  applicationName: site.name,
  keywords: [...copy.seo.keywords],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "beauty",
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: copy.seo.title,
    description: copy.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: copy.seo.title,
    description: copy.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">
        {/* Without JavaScript the scroll-reveal blocks would stay at opacity 0. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#turinys"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-espresso-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-cream-100"
        >
          {copy.a11y.skip}
        </a>
        <MotionProvider>
          <Header />
          <main id="turinys" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
