import Link from "next/link";
import { LANGS, LANG_LABELS, type Lang } from "@/content/lang";
import { cn } from "@/lib/cn";

type Props = {
  lang: Lang;
  /** Where this same page lives in each language. */
  alternates: Record<Lang, string>;
  /** Accessible name for the group, in the current language. */
  label: string;
  className?: string;
};

/**
 * Two links, not a dropdown.
 *
 * With two languages a menu costs a click and a hidden state to show one
 * option. Each side is a real link to the same page in the other language, so
 * it works without JavaScript, and a crawler follows it.
 *
 * `hrefLang` tells the browser and search engines what sits on the other end;
 * the pair of pages also declares its alternates in the page metadata.
 */
export function LanguageSwitcher({ lang, alternates, label, className }: Props) {
  return (
    <nav aria-label={label} className={cn("flex items-center rounded-full bg-espresso-900/5 p-0.5", className)}>
      {LANGS.map((code) => {
        const current = code === lang;
        return (
          <Link
            key={code}
            href={alternates[code]}
            hrefLang={code}
            aria-current={current ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
              current ? "bg-white text-espresso-900 shadow-[0_1px_2px_rgba(45,35,32,0.12)]" : "text-espresso-500 hover:text-espresso-900"
            )}
          >
            <span aria-hidden="true">{LANG_LABELS[code].short}</span>
            <span className="sr-only">{LANG_LABELS[code].label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
