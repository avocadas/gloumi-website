"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { homePath, sectionHref, type Lang } from "@/content/lang";
import { cn } from "@/lib/cn";

type HeaderProps = {
  lang: Lang;
  /** Where this same page lives in each language, for the switcher. */
  alternates: Record<Lang, string>;
};

export function Header({ lang, alternates }: HeaderProps) {
  const copy = getCopy(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        solid ? "bg-cream-100/85 shadow-[0_1px_0_0_rgba(45,35,32,0.08)] backdrop-blur-md" : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href={homePath(lang)}
          className="flex shrink-0 items-center rounded-md text-plum-700"
          aria-label={copy.nav.home}
          onClick={close}
        >
          <Wordmark title="" className="h-7 w-auto sm:h-8" />
        </Link>

        <nav aria-label={copy.nav.ariaLabel} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {copy.nav.links.map((link) => (
              <li key={link.key}>
                <Link
                  href={sectionHref(lang, link.key)}
                  className="text-sm font-medium text-espresso-700 transition-colors hover:text-espresso-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} alternates={alternates} label={copy.nav.language} />
          <ButtonLink href={sectionHref(lang, "download")} size="sm" className="hidden sm:inline-flex">
            {copy.nav.cta}
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-espresso-900 transition-colors hover:bg-espresso-900/5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? copy.nav.close : copy.nav.open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-espresso-900/8 md:hidden"
          >
            <Container>
              <ul className="flex flex-col py-3">
                {copy.nav.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={sectionHref(lang, link.key)}
                      onClick={close}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-espresso-900 hover:bg-white/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="px-3 pb-3 pt-2">
                  <ButtonLink href={sectionHref(lang, "download")} onClick={close} className="w-full">
                    {copy.nav.cta}
                  </ButtonLink>
                </li>
              </ul>
            </Container>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
