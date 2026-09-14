import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";
import { rootMetadata } from "@/content/metadata";

/**
 * Root layout for the Lithuanian tree, which lives at the site root.
 *
 * There are two root layouts, one per language, because only a root layout can
 * set <html lang> and that attribute has to be right. Route groups keep both
 * out of the URL. Moving between them is a full page load rather than a client
 * navigation, which for a language switch is what you want anyway.
 */
export const metadata: Metadata = rootMetadata("lt");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default function LithuanianLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="lt" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">{children}</body>
    </html>
  );
}
