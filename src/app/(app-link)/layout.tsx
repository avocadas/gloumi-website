import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { LANG_LABELS } from "@/content/lang";
import { requestLang } from "./request-lang";

/**
 * Root layout for the pages the app's share links land on (#210):
 * https://gloumi.lt/profile/<id> and /ref.
 *
 * A fourth root layout, because these addresses are the same in both
 * languages – the app builds them without knowing who will open them – so the
 * language cannot come from the path the way it does for the rest of the
 * site. It comes from the browser instead, and <html lang> has to follow it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default async function AppLinkLayout({ children }: { children: ReactNode }) {
  const lang = await requestLang();
  return (
    <html lang={LANG_LABELS[lang].htmlLang} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">{children}</body>
    </html>
  );
}
