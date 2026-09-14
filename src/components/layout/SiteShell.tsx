import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { getCopy } from "@/content/copy";
import type { Lang } from "@/content/lang";

type Props = {
  lang: Lang;
  /** Where this same page lives in each language, for the switcher and hreflang. */
  alternates: Record<Lang, string>;
  children: ReactNode;
};

/**
 * Everything inside <body>, shared by both root layouts.
 *
 * The two languages need separate root layouts because only a root layout can
 * carry <html lang>, and that attribute has to be right: it is what a screen
 * reader picks a voice from and what a browser offers to translate. The markup
 * below is the same for both, so it lives here rather than being duplicated.
 */
export function SiteShell({ lang, alternates, children }: Props) {
  const copy = getCopy(lang);
  return (
    <>
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
        <Header lang={lang} alternates={alternates} />
        <main id="turinys" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
      </MotionProvider>
    </>
  );
}
