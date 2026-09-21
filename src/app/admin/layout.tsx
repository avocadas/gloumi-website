import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/app/fonts";

/**
 * Root layout for the admin portal.
 *
 * A third root layout, alongside the two language ones. It has to be its own
 * because only a root layout may set <html>, and /admin sits outside both
 * language route groups: it is not a translated page, it is a tool.
 *
 * `noindex, nofollow` is not decoration. The portal is reachable by URL, and
 * the only thing standing between a crawler and a login form should not be
 * obscurity — but there is no reason to help either.
 */
export const metadata: Metadata = {
  title: "Gloumi · Administravimas",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D2320",
  colorScheme: "light",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="lt" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">{children}</body>
    </html>
  );
}
