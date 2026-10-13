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
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Not published now: waiting for a fix (K-9, #171) or a check (K-28). K-40,
 * K-43 and K-54 waited for Terms 1.13 and came out with it (2026-10-07, the
 * legal role's wording in the draft).
 */
const HOLD = ["K-9", "K-28", "K-55"];
/**
 * Items already on the page whose new draft text waits: the page keeps the
 * question and answer it has now (read from the current src/content/faq.ts)
 * until the reason is gone. K-8's new sentence names an Android setting that
 * ships with build 17; K-31's hygiene-passport sentence and the new K-55 wait
 * for the legal role (office manager, 2026-10-13). The run fails if such an
 * item is not on the page yet: then it belongs in HOLD instead.
 */
const KEEP_PUBLISHED = ["K-8", "K-31"];
/** Markers whose text starts like this cut the answer there: what follows waits for a feature. */
const CUT = /^(Skelbti tik su|Publish only with)/;
/**
 * The question to show while its answer is cut, when the full question asks
 * about the part that waits. K-46 asks about replying to a review too, which
 * the app cannot do yet (U-19, #207); the developer chose to ask only about
 * removal until it can (2026-10-05, through the office manager). The run
 * fails if such an item is no longer cut, so the full question comes back
 * with the feature instead of staying short by accident.
 */
const QUESTION_WHILE_CUT = {
  "K-46": { lt: "Ar galima pašalinti atsiliepimą?", en: "Can a review be removed?" },
};
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
  console.error("Usage: node scripts/gen-faq.mjs <path to DUK.md> [<folder with <lang>/faq-<lang>.md>]");
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

/** What the page shows now, by language and item: the source for KEEP_PUBLISHED. */
const current = (() => {
  const ts = readFileSync(resolve("src/content/faq.ts"), "utf8");
  const marker = "export const FAQ: Record<Lang, FaqSection[]> = ";
  const start = ts.indexOf(marker);
  if (start < 0) throw new Error("src/content/faq.ts: FAQ object not found");
  const faq = JSON.parse(ts.slice(start + marker.length).trim().replace(/;\s*$/, ""));
  const byLang = {};
  for (const [lang, sections] of Object.entries(faq)) {
    byLang[lang] = new Map(sections.flatMap((s) => s.items.map((i) => [i.id, i])));
  }
  return byLang;
})();

/*
 * Labels the draft marks as "old {→ new}" and the app has since shipped under
 * the new name (app `origin/main`, renamed in `fd7afcea`, checked 2026-10-12
 * for #223 G-13: the old labels are gone from lt.js and en.js). These are
 * swapped to the new label; any other "{→ …}" note is still dropped with the
 * old label kept, and named on the console so it is not forgotten.
 */
const SHIPPED_RENAMES = [
  ["Programos nustatymai", "Programėlės nustatymai"],
  ["Atliktos procedūros", "Įvykę vizitai"],
  ["Atšaukti rezervaciją", "Atšaukti vizitą"],
  ["Patvirtinti rezervaciją", "Patvirtinti vizitą"],
  ["Priima rezervacijas", "Leisti rezervuoti"],
  ["Užsakymai", "Vizitai"],
  ["Completed procedures", "Completed visits"],
  ["Invite specialists", "Invite masters"],
];

function applyShippedRenames(a) {
  for (const [from, to] of SHIPPED_RENAMES) {
    a = a.split(`„${from}“ {→ ${to}}`).join(`„${to}“`).split(`${from} {→ ${to}}`).join(to);
  }
  for (const m of a.matchAll(/\{→\s*([^}]*)\}/g)) console.warn(`unapplied rename note: {→ ${m[1]}}`);
  return a;
}

function clean(answer, item, lang) {
  let a = answer;
  // A cutting marker drops itself and everything after it.
  const markers = [...a.matchAll(/\*\*\[(.*?)\]\*\*/g)];
  const cut = markers.find((m) => CUT.test(m[1]));
  if (cut) a = a.slice(0, cut.index);
  const short = QUESTION_WHILE_CUT[item.id];
  if (short && !short[lang]) {
    // An extra language: until it has its own short question, its cut item cannot be shown.
    if (cut) throw new Error(`${item.id} (${lang}) is cut: add its short question to QUESTION_WHILE_CUT`);
  } else {
    if (short && !cut) throw new Error(`${item.id} is no longer cut: drop it from QUESTION_WHILE_CUT`);
    if (short) item.q = short[lang];
  }
  a = applyShippedRenames(a);
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

function parse(source, lang) {
  const sections = [];
  let section = null;
  let item = null;
  const flush = () => {
    if (item) {
      item.a = clean(item.lines.join(" "), item, lang);
      delete item.lines;
      if (KEEP_PUBLISHED.includes(item.id) && (lang === "lt" || lang === "en")) {
        const live = current[lang]?.get(item.id);
        if (!live) throw new Error(`${item.id} is in KEEP_PUBLISHED but not on the page: put it in HOLD`);
        item.q = live.q;
        item.a = live.a;
      }
      if (!HOLD.includes(item.id)) section.items.push(item);
      item = null;
    }
  };
  for (const line of source.split("\n")) {
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

const lt = parse(block("LIETUVIŠKAI"), "lt");
const en = parse(block("ENGLISH"), "en");
const ids = (doc) => doc.flatMap((s) => s.items.map((i) => i.id)).join(",");
if (ids(lt) !== ids(en)) throw new Error(`LT and EN items differ:\n${ids(lt)}\n${ids(en)}`);
if (lt.length !== en.length) throw new Error("LT and EN sections differ");
lt.forEach((section, index) => {
  const key = SECTION_KEYS[section.title];
  if (!key) throw new Error(`section "${section.title}" has no key in SECTION_KEYS`);
  for (const doc of [lt, en]) doc[index] = { key, ...doc[index] };
});

/*
 * The six extra languages (content role's drafts, 2026-10-13): one file per
 * language, `faq-<lang>.md`, in the same form as the English half of DUK.md.
 *
 * - They publish exactly the items LT and EN publish, in the same sections.
 * - An item the legal role keeps untranslated says "(teisininkas – neverčiama)"
 *   instead of an answer; the page shows the English question and answer
 *   there, marked as English, rather than nothing.
 * - The drafts carry no "publish later" markers. Where a part of an answer
 *   waits (WAITS_WITHOUT_MARKER), the English published item is shown instead
 *   until the draft marks the waiting part the way DUK.md does.
 * - Without the folder argument the extra languages stay as the page has them,
 *   so a routine LT/EN run does not drop them.
 */
const EXTRA = ["pl", "lv", "de", "fr", "es", "it"];
const UNTRANSLATED = "(teisininkas – neverčiama)";
/** K-8: the theme sentence waits for Android build 17; K-46: the reply sentence waits for U-19 (#207). */
const WAITS_WITHOUT_MARKER = ["K-8", "K-46"];
const extraDir = process.argv[3];

function extraLang(lang) {
  if (!extraDir) {
    const kept = current[lang];
    if (!kept) throw new Error(`${lang}: not on the page yet – pass the drafts folder`);
    console.warn(`${lang}: no drafts folder given – kept as published`);
    const ts = readFileSync(resolve("src/content/faq.ts"), "utf8");
    const marker = "export const FAQ: Record<Lang, FaqSection[]> = ";
    return JSON.parse(ts.slice(ts.indexOf(marker) + marker.length).trim().replace(/;\s*$/, ""))[lang];
  }
  const candidates = [resolve(extraDir, lang, `faq-${lang}.md`), resolve(extraDir, `faq-${lang}.md`)];
  const file = candidates.find((f) => existsSync(f));
  if (!file) throw new Error(`${lang}: faq-${lang}.md not found in ${extraDir}`);
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const start = raw.indexOf("\n## ");
  if (start < 0) throw new Error(`${lang}: no sections in ${file}`);

  // Read the answers before `clean()` drops the markers, to know which waiting items are marked.
  const marked = new Set();
  for (const m of raw.matchAll(/^\*\*(K-\d+)\.[^\n]*\n((?:.+\n?)*)/gm)) if (/\*\*\[/.test(m[2])) marked.add(m[1]);

  const doc = parse(raw.slice(start), lang);
  const enItems = new Map(en.flatMap((s) => s.items.map((i) => [i.id, i])));
  if (doc.length !== en.length) throw new Error(`${lang}: ${doc.length} sections, EN has ${en.length}`);
  if (ids(doc) !== ids(en)) throw new Error(`${lang} and EN items differ:\n${ids(doc)}\n${ids(en)}`);
  return doc.map((section, index) => ({
    key: en[index].key,
    title: section.title,
    items: section.items.map((item) => {
      const english = enItems.get(item.id);
      if (item.a === UNTRANSLATED) return { ...english, lang: "en" };
      if (WAITS_WITHOUT_MARKER.includes(item.id) && !marked.has(item.id)) {
        console.warn(`${lang} ${item.id}: no marker on the waiting part – English shown`);
        return { ...english, lang: "en" };
      }
      if (item.a.includes("teisininkas")) throw new Error(`${lang} ${item.id}: an editor note reached the answer`);
      return item;
    }),
  }));
}

const extra = Object.fromEntries(EXTRA.map((lang) => [lang, extraLang(lang)]));

// Every reference left must point at a published item.
const published = new Set(lt.flatMap((s) => s.items.map((i) => i.id)));
for (const doc of [lt, en, ...Object.values(extra)]) {
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
// Published now: what holds under Terms 1.13 (Gloumi #209). Held back: ${HOLD.join(", ")}.
// Kept as published while their new text waits: ${KEEP_PUBLISHED.join(", ")}.
// Answers may refer to another item as "K-n"; the page turns that into a link.
import type { Lang } from "./lang";

/** \`lang\` is set when an extra language shows the English item (untranslated or waiting). */
export type FaqItem = { id: string; q: string; a: string; lang?: "en" };
export type FaqSection = { key: string; title: string; items: FaqItem[] };

export const FAQ_UPDATED = "${process.env.FAQ_UPDATED ?? new Date().toISOString().slice(0, 10)}";

export const FAQ: Record<Lang, FaqSection[]> = ${JSON.stringify({ lt, en, ...extra }, null, 2)};
`;
writeFileSync(resolve("src/content/faq.ts"), out);
const count = lt.reduce((n, s) => n + s.items.length, 0);
console.log(`faq.ts: ${count} items in ${lt.length} sections per language; held: ${HOLD.join(", ")}`);
