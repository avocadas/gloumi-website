#!/usr/bin/env node
/*
 * Regenerates src/content/faq.ts from the support role's FAQ draft
 * (Gloumi office: pagalba/DUK.md, Lithuanian and English, outside git).
 *
 *   node scripts/gen-faq.mjs <path to DUK.md>
 *
 * What is published is only what holds today (Gloumi #209; the developer,
 * through the office manager, 2026-10-05): the items in HOLD wait for Terms
 * 1.13 or for a feature, K-46 keeps only what comes before its "publish only
 * with the feature" marker, and a sentence or bracket that points at a held
 * item goes with it. Markers like **[1.13]** or **[#208]** mean "change this
 * later" – the text holds now, so only the marker is dropped. Editor notes
 * in {braces} never reach the page.
 *
 * The script refuses to write when the two languages disagree on which items
 * exist, or when a held item is still referred to – a page that quietly says
 * less in one language is worse than a failed run.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/** Not published now: waiting for Terms 1.13 (K-40, K-43, K-54), a fix (K-9, #171) or a check (K-28). */
const HOLD = ["K-9", "K-28", "K-40", "K-43", "K-54"];
/** Markers whose text starts like this cut the answer there: what follows waits for a feature. */
const CUT = /^(Skelbti tik su|Publish only with)/;
/**
 * Stable section keys (the page's anchors, the footer's "for masters" link),
 * by the Lithuanian title; the English sections follow in the same order. A
 * new or renamed section stops the run until it gets a key here.
 */
const SECTION_KEYS = {
  "Apie Gloumi": "about",
  Paskyra: "account",
  Vizitai: "visits",
  Mokėjimai: "payments",
  Meistrams: "masters",
  "Turinys, pranešimai ir saugumas": "content",
};

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/gen-faq.mjs <path to DUK.md>");
  process.exit(1);
}
const text = readFileSync(resolve(source), "utf8").replace(/\r\n/g, "\n");

/** The two language blocks: from their H1 to the next H1. */
function block(heading) {
  const start = text.indexOf(`\n# ${heading}\n`);
  if (start < 0) throw new Error(`"# ${heading}" not found`);
  const next = text.indexOf("\n# ", start + 1);
  return text.slice(start, next < 0 ? undefined : next);
}

const heldRef = new RegExp(`\\b(${HOLD.join("|")})\\b`);

function clean(answer) {
  let a = answer;
  // A cutting marker drops itself and everything after it.
  const markers = [...a.matchAll(/\*\*\[(.*?)\]\*\*/g)];
  const cut = markers.find((m) => CUT.test(m[1]));
  if (cut) a = a.slice(0, cut.index);
  a = a.replace(/\*\*\[.*?\]\*\*/g, ""); // "change later" markers
  a = a.replace(/\s*\{[^}]*\}/g, ""); // editor notes, incl. {→ new label}
  a = a.replace(/\s*\((K-\d+)\)/g, (m, k) => (HOLD.includes(k) ? "" : m)); // "(K-40)"
  // A sentence that only points at a held item: "Kaip rikiuojama – K-54."
  a = a.replace(/(^|\.\s+)([^.]*\bK-\d+\b[^.]*\.)/g, (m, lead, sentence) =>
    heldRef.test(sentence) ? lead.replace(/\s+$/, "") : m,
  );
  a = a.replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
  if (heldRef.test(a)) throw new Error(`a held item is still referred to: ${a}`);
  return a;
}

function parse(heading) {
  const sections = [];
  let section = null;
  let item = null;
  const flush = () => {
    if (item) {
      item.a = clean(item.lines.join(" "));
      delete item.lines;
      if (!HOLD.includes(item.id)) section.items.push(item);
      item = null;
    }
  };
  for (const line of block(heading).split("\n")) {
    const h2 = /^## (.+)$/.exec(line);
    const q = /^\*\*(K-\d+)\. (.+?)\*\*(\s+\*\(.*\)\*)?\s*$/.exec(line);
    if (h2) {
      flush();
      section = { title: h2[1].trim(), items: [] };
      sections.push(section);
    } else if (q) {
      flush();
      if (!section) throw new Error(`${q[1]} outside a section`);
      item = { id: q[1], q: q[2].trim(), lines: [] };
    } else if (item && line.trim()) {
      item.lines.push(line.trim());
    } else if (item && !line.trim() && item.lines.length) {
      flush();
    }
  }
  flush();
  return sections.filter((s) => s.items.length);
}

const lt = parse("LIETUVIŠKAI");
const en = parse("ENGLISH");
const ids = (doc) => doc.flatMap((s) => s.items.map((i) => i.id)).join(",");
if (ids(lt) !== ids(en)) throw new Error(`LT and EN items differ:\n${ids(lt)}\n${ids(en)}`);
if (lt.length !== en.length) throw new Error("LT and EN sections differ");
lt.forEach((section, index) => {
  const key = SECTION_KEYS[section.title];
  if (!key) throw new Error(`section "${section.title}" has no key in SECTION_KEYS`);
  for (const doc of [lt, en]) doc[index] = { key, ...doc[index] };
});

// Every reference left must point at a published item.
const published = new Set(lt.flatMap((s) => s.items.map((i) => i.id)));
for (const doc of [lt, en]) {
  for (const i of doc.flatMap((s) => s.items)) {
    for (const [ref] of i.a.matchAll(/\bK-\d+\b/g)) {
      if (!published.has(ref)) throw new Error(`${i.id} refers to ${ref}, which is not published`);
    }
  }
}

const out = `// GENERATED by scripts/gen-faq.mjs from the support role's FAQ draft
// (Gloumi office pagalba/DUK.md). Do not edit by hand: change the draft or
// the script's HOLD list, then regenerate.
//
// Published now: what holds under Terms 1.12 (Gloumi #209). Held back: ${HOLD.join(", ")}.
// Answers may refer to another item as "K-n"; the page turns that into a link.
import type { Lang } from "./lang";

export type FaqItem = { id: string; q: string; a: string };
export type FaqSection = { key: string; title: string; items: FaqItem[] };

export const FAQ_UPDATED = "${process.env.FAQ_UPDATED ?? new Date().toISOString().slice(0, 10)}";

export const FAQ: Record<Lang, FaqSection[]> = ${JSON.stringify({ lt, en }, null, 2)};
`;
writeFileSync(resolve("src/content/faq.ts"), out);
const count = lt.reduce((n, s) => n + s.items.length, 0);
console.log(`faq.ts: ${count} items in ${lt.length} sections per language; held: ${HOLD.join(", ")}`);
