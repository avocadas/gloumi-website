import { lt } from "./copy.lt";
import { en } from "./copy.en";
import type { Lang } from "./lang";

/**
 * Every visible string, in both languages.
 *
 * Components take a `lang` prop and call `getCopy(lang)` rather than importing
 * a dictionary directly. That keeps the choice of language in one place, the
 * route, instead of spread through the tree.
 */
export type Copy = typeof lt;

const dictionaries: Record<Lang, Copy> = { lt, en };

export function getCopy(lang: Lang): Copy {
  return dictionaries[lang];
}
