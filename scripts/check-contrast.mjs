/**
 * WCAG 2.1 contrast check for every text/background pairing the design uses.
 *
 * The palette is warm and low-contrast by taste, which is exactly how muted
 * body copy quietly slips under 4.5:1. This fails `npm run check` rather than
 * trusting an eye. Keep PAIRS in step with src/app/globals.css. The category
 * colours are read from src/content/categories.ts itself (below), so the
 * check cannot drift from what the page paints.
 */
import { readFileSync } from "node:fs";

const palette = {
  white: "#FFFFFF",
  "cream-100": "#F9F6F0",
  "cream-200": "#F7F2EC",
  "sand-100": "#F4ECE6",
  "sand-200": "#EFE6DD",
  "sand-400": "#D8C6B6",
  "espresso-950": "#1F1715",
  "espresso-900": "#2D2320",
  "espresso-800": "#3E322E",
  "espresso-700": "#4F423D",
  "espresso-600": "#5E5049",
  "espresso-500": "#6B5D57",
  "espresso-400": "#776A63",
  "terracotta-300": "#D9A48C",
  "terracotta-600": "#8F3D26",
  "terracotta-700": "#73301E",
  "plum-700": "#55223A",
  "sage-500": "#4C6552",
};

/*
 * The six categories' `ink` and `tint` – the app's own colours (#20). The ink
 * is text in the panel eyebrow (4.5:1 on white) and the icon on the disc
 * (3:1 on the tint: a graphic, WCAG 1.4.11, not text).
 */
const CATEGORY = /^\s+(\w+): \{ icon: \w+, ink: "(#[0-9A-Fa-f]{6})", tint: "(#[0-9A-Fa-f]{6})" \},?$/gm;
const categorySource = readFileSync(new URL("../src/content/categories.ts", import.meta.url), "utf8");
const categories = [...categorySource.matchAll(CATEGORY)].map(([, id, ink, tint]) => ({ id, ink, tint }));
if (categories.length !== 6) {
  console.error(`Expected 6 category colour lines in src/content/categories.ts, found ${categories.length}.`);
  process.exit(1);
}
for (const { id, ink, tint } of categories) {
  palette[`ink-${id}`] = ink;
  palette[`tint-${id}`] = tint;
}

/** [foreground, background, minimum ratio, where it is used] */
const PAIRS = [
  ["espresso-900", "cream-100", 4.5, "headings and strong copy on the page ground"],
  ["espresso-500", "cream-100", 4.5, "body copy on the page ground"],
  ["espresso-500", "cream-200", 4.5, "body copy on the categories band"],
  ["espresso-500", "white", 4.5, "body copy inside white cards"],
  ["espresso-600", "cream-200", 4.5, "unselected category labels"],
  ["espresso-400", "cream-100", 4.5, "muted metadata on the page ground"],
  ["espresso-400", "white", 4.5, "placeholders and helper text in the form"],
  ["espresso-700", "cream-100", 4.5, "navigation links"],
  ["espresso-700", "sand-100", 4.5, "chips on sand"],
  ["terracotta-600", "cream-100", 4.5, "eyebrows, prices and text links"],
  ["terracotta-600", "white", 4.5, "links inside cards"],
  ["terracotta-600", "sand-100", 4.5, "links in a sand note, e.g. the FAQ intro"],
  ["white", "terracotta-600", 4.5, "primary button label"],
  ["white", "terracotta-700", 4.5, "primary button label on hover"],
  ["cream-100", "espresso-900", 4.5, "dark section body copy"],
  ["sand-400", "espresso-900", 4.5, "dark section muted copy"],
  ["terracotta-300", "espresso-900", 4.5, "dark section eyebrow"],
  ["white", "espresso-950", 4.5, "store badge label"],
  ["espresso-900", "sand-200", 4.5, "chips"],
  ["sage-500", "white", 4.5, "trust ticks and success icons"],
  ["espresso-900", "cream-200", 3, "selected category border (graphic)"],
  ...categories.flatMap(({ id }) => [
    [`ink-${id}`, "white", 4.5, `category eyebrow – ${id}`],
    [`ink-${id}`, `tint-${id}`, 3, `category icon on its disc – ${id} (graphic)`],
  ]),
  ["plum-700", "cream-100", 3, "wordmark (graphic)"],
];

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
for (const [fg, bg, min, where] of PAIRS) {
  const r = ratio(palette[fg], palette[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} ${r.toFixed(2)}:1 (min ${min}) ${fg} on ${bg} – ${where}`);
}
if (failed) {
  console.error(`\n${failed} pairing(s) below the WCAG threshold.`);
  process.exit(1);
}
console.log(`\nAll ${PAIRS.length} pairings pass.`);
