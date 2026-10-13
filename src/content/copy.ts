import { lt } from "./copy.lt";
import { en } from "./copy.en";
import { pl } from "./copy.pl";
import { lv } from "./copy.lv";
import { de } from "./copy.de";
import { fr } from "./copy.fr";
import { es } from "./copy.es";
import { it } from "./copy.it";
import type { Lang } from "./lang";

/**
 * Every visible string, in every language.
 *
 * Components take a `lang` prop and call `getCopy(lang)` rather than importing
 * a dictionary directly. That keeps the choice of language in one place, the
 * route, instead of spread through the tree.
 *
 * The six extra dictionaries come from the content role's drafts (2026-10-13);
 * the keys the legal role keeps in English are English there too.
 */
export type Copy = typeof lt;

const dictionaries: Record<Lang, Copy> = { lt, en, pl, lv, de, fr, es, it };

export function getCopy(lang: Lang): Copy {
  return dictionaries[lang];
}
