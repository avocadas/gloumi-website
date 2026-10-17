/**
 * No emoji anywhere in this repository's tracked text.
 *
 * The developer, 2026-10-17, word for word: "neturi niekur buti emoji, turi
 * visur buti svg ikonos. ... to buti grieztai neturi." Icons are SVG
 * (`src/components/icons`); a pictograph typed into a string renders in the
 * phone's own emoji font, differs from device to device and is not ours.
 *
 * Refused: every Extended_Pictographic code point (Unicode's emoji-capable
 * set), the stars U+2605, U+2606 and check marks U+2713, U+2714, U+2717,
 * U+2718 that read as icons though Unicode does not count them, the emoji
 * variation selector U+FE0F, the keycap U+20E3 and the regional indicators
 * that make flags (written as code points here, so this file passes its own
 * check). Allowed: the typographic U+00A9, U+00AE, U+2122 (copyright,
 * registered, trademark – text signs, never drawn as icons here) and arrows
 * such as U+2192 in prose ("Seitenmenu -> ..."), which are punctuation, not
 * pictures.
 *
 * The two legal files are generated from the app (`gen:app`) and are the
 * legal role's words (Gloumi AGENTS.md XII): a hit there is reported as a
 * warning to fix in the app's text, not failed here, so a regeneration
 * cannot be blocked by a character this repository may not change.
 *
 * Scans every file `git ls-files` returns, skipping binaries by content, as
 * check-cyrillic.mjs does.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PICTOGRAPHIC = /\p{Extended_Pictographic}/u;
const ALSO = new Set([0x2605, 0x2606, 0x2713, 0x2714, 0x2717, 0x2718, 0xfe0f, 0x20e3]);
const TYPOGRAPHIC = new Set([0x00a9, 0x00ae, 0x2122]);

const isEmoji = (ch) => {
  const c = ch.codePointAt(0);
  if (TYPOGRAPHIC.has(c)) return false;
  if (ALSO.has(c)) return true;
  if (c >= 0x1f1e6 && c <= 0x1f1ff) return true; // regional indicators (flags)
  return PICTOGRAPHIC.test(ch);
};

const SKIP = /(^|\/)(package-lock\.json)$/;
const GENERATED_LEGAL = /^src\/content\/legal-(source|translations)\.ts$/;
const isBinary = (buf) => buf.subarray(0, 8192).includes(0);
const hex = (ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;

function scanText(src) {
  const hits = [];
  src.split(/\r?\n/).forEach((text, i) => {
    const chars = [...new Set([...text].filter(isEmoji))];
    if (chars.length) hits.push({ line: i + 1, chars, text: text.trim() });
  });
  return hits;
}

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

let failed = 0;
let warned = 0;
let scanned = 0;
for (const file of files) {
  if (SKIP.test(file)) continue;
  let buf;
  try {
    buf = readFileSync(file);
  } catch {
    continue;
  }
  if (isBinary(buf)) continue;
  scanned++;

  const hits = scanText(buf.toString("utf8"));
  if (!hits.length) continue;
  const generated = GENERATED_LEGAL.test(file);
  for (const h of hits) {
    const label = generated ? "WARN" : "FAIL";
    console.log(`${label}  ${file}:${h.line}  ${h.chars.map(hex).join(" ")}  ${h.text.slice(0, 120)}`);
    if (generated) warned++;
    else failed++;
  }
}

if (warned) console.log(`WARN  ${warned} line(s) in the generated legal texts: change them in the app's legal source, then gen:app.`);
if (failed) {
  console.log(`FAIL  ${failed} line(s) with emoji. Use an SVG icon from src/components/icons, or drop it.`);
  process.exit(1);
}
console.log(`OK    no emoji (${scanned} tracked text files).`);
