import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { adminFontVariables } from "./fonts";
import { moderationRules } from "./moderation-rules";
import { ModerationRulesProvider } from "./ModerationRules";
import { masterTerminationNotice } from "./termination-notice";

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
/*
 * Šriftai ir spalvos — programėlės, ne rinkodaros puslapio (`ui.tsx`): portalą
 * naudoja komanda, kuri kasdien mato programėlę, ir tas pats produktas turi
 * atrodyti kaip tas pats. Fokuso rėmelis — juodas akcentas, ne svetainės
 * terakota.
 */
export const metadata: Metadata = {
  title: "Gloumi · Administravimas",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F3F1",
  colorScheme: "light",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="lt" className={`${adminFontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-app-sheet font-app-sans text-app-ink [&_:focus-visible]:outline-app-accent">
        <ModerationRulesProvider groups={moderationRules()} terminationNotice={masterTerminationNotice()}>
          {children}
        </ModerationRulesProvider>
      </body>
    </html>
  );
}
