import "server-only";
import { alternates, type Lang } from "./lang";
import { LEGAL_TRANSLATIONS } from "./legal-translations";

/**
 * Where the Terms or the Privacy Policy exist, by language: Lithuanian and
 * English, plus the translations under /legal/<lang>/ (K-ES2). For hreflang
 * on all of them and for the language switcher, so a German reader of the
 * Terms is sent to the German Terms, not to the German home page (web audit
 * 2026-10-22, SEO-3).
 *
 * Server only, and kept out of lang.ts on purpose: lang.ts is imported by
 * client components, and LEGAL_TRANSLATIONS carries the full translated
 * texts – importing it there would ship them to every visitor.
 */
export function legalDocAlternates(doc: "terms" | "privacy"): Partial<Record<Lang, string>> {
  return {
    ...alternates({ kind: "legal", key: doc }),
    ...Object.fromEntries(LEGAL_TRANSLATIONS.map((t) => [t.lang, `/legal/${t.lang}/${doc}`])),
  };
}
