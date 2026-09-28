/**
 * No Cyrillic letter anywhere in this repository's tracked text.
 *
 * A Cyrillic look-alike (U+043E vs Latin `o`) is the same pixels on screen,
 * so a word with one swapped in still reads correctly - and a text search for
 * it comes back empty, because the letter isn't what it looks like. It never
 * gets typed on purpose; it arrives with pasted text. The Gloumi app repo's
 * AGENTS.md (Article X) bans Russian outright, in any form, anywhere this
 * project writes - the whole Cyrillic block is refused rather than a list of
 * look-alikes, because a code point can't tell a Russian letter from any
 * other, and a Latin-alphabet site has no business carrying any of it.
 *
 * Scans every file `git ls-files` returns (whatever git already tracks,
 * `node_modules` and build output excluded by definition), skipping binaries
 * by content (a null byte in the first chunk) rather than by extension list -
 * an extension list goes stale the moment a new file type shows up.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const FIRST = 0x0400;
const LAST = 0x04ff;
const isCyrillic = (ch) => {
  const c = ch.codePointAt(0);
  return c >= FIRST && c <= LAST;
};

const SKIP = /(^|\/)(package-lock\.json)$/;
const isBinary = (buf) => buf.subarray(0, 8192).includes(0);

function scanText(src) {
  const hits = [];
  src.split(/\r?\n/).forEach((text, i) => {
    const chars = [...new Set([...text].filter(isCyrillic))];
    if (chars.length) hits.push({ line: i + 1, chars, text: text.trim() });
  });
  return hits;
}

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

let total = 0;
let scanned = 0;
for (const file of files) {
  if (SKIP.test(file)) continue;
  let buf;
  try {
    buf = readFileSync(file);
  } catch {
    continue; // removed on disk but still in the index - not this script's concern
  }
  if (isBinary(buf)) continue;
  scanned++;

  const hits = scanText(buf.toString("utf8"));
  if (!hits.length) continue;
  if (!total) console.log("FAIL  Cyrillic letters in Latin text:");
  for (const h of hits) {
    total++;
    const codes = h.chars.map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(", ");
    console.log(`      ${file}:${h.line}  [${codes}]`);
    console.log(`        ${h.text.slice(0, 100)}`);
  }
}

if (total) {
  console.log("      They look Latin, so a text search won't find them.");
  process.exit(1);
}
console.log(`OK    no Cyrillic letters (${scanned} tracked text files).`);
