import "server-only";
import { headers } from "next/headers";
import { DEFAULT_LANG, type Lang } from "@/content/lang";

/**
 * Lithuanian unless the browser prefers English over it.
 *
 * Only the order of the two languages we have matters: a phone set to German
 * with English as its second language gets English, one with Lithuanian
 * anywhere before English gets Lithuanian, and anything else gets the home
 * market's language.
 */
export async function requestLang(): Promise<Lang> {
  const accept = (await headers()).get("accept-language") ?? "";
  const ranked = accept
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return { base: tag.split("-")[0], weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  const first = ranked.find((entry) => entry.base === "lt" || entry.base === "en");
  return first?.base === "en" ? "en" : DEFAULT_LANG;
}
