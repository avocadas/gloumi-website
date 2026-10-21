"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LANGS, LANG_LABELS, switchTarget, type Lang } from "@/content/lang";
import { cn } from "@/lib/cn";

type Props = {
  lang: Lang;
  /** Where this same page lives in each language; a language without it gets its home page. */
  alternates: Partial<Record<Lang, string>>;
  /** Accessible name for the group, in the current language. */
  label: string;
  className?: string;
};

/**
 * A small menu of the eight languages.
 *
 * Two languages fitted side by side as two links; eight do not fit a phone's
 * header. A native `<details>` keeps it working without JavaScript, and every
 * entry is still a real link a crawler follows. Script only closes it on a
 * click outside or Escape.
 *
 * Each language is named in itself ("Deutsch", not "German"), with `hrefLang`
 * and `lang` on the link, so a reader finds theirs and a screen reader says it
 * in the right voice. A page that exists in fewer languages (a legal document)
 * sends the others to their home page.
 */
export function LanguageSwitcher({ lang, alternates, label, className }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (event: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !el.contains(event.target as Node)) el.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className={cn("group relative", className)}>
      {/*
        The name starts with what the button shows ("LT"), so a voice-control
        user who says what they see reaches it (WCAG 2.5.3, web audit 2026-10-22);
        the rest says what it is and which language is on.
      */}
      <summary
        aria-label={`${LANG_LABELS[lang].short}, ${label}: ${LANG_LABELS[lang].label}`}
        className="flex cursor-pointer list-none items-center gap-1 rounded-full bg-espresso-900/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-espresso-900 transition-colors hover:bg-espresso-900/10 [&::-webkit-details-marker]:hidden"
      >
        {LANG_LABELS[lang].short}
        <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 transition-transform group-open:rotate-180">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <nav
        aria-label={label}
        className="absolute right-0 z-50 mt-2 w-44 rounded-2xl bg-white p-1.5 shadow-[0_8px_24px_rgba(45,35,32,0.14)] ring-1 ring-espresso-900/8"
      >
        <ul>
          {LANGS.map((code) => {
            const current = code === lang;
            return (
              <li key={code}>
                <Link
                  href={switchTarget(alternates, code)}
                  hrefLang={code}
                  lang={LANG_LABELS[code].htmlLang}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                    current ? "bg-sand-100 font-semibold text-espresso-900" : "text-espresso-700 hover:bg-cream-100 hover:text-espresso-900"
                  )}
                >
                  {LANG_LABELS[code].label}
                  <span aria-hidden="true" className="text-xs font-semibold text-espresso-500">
                    {LANG_LABELS[code].short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}
