#!/usr/bin/env node
/*
 * Regenerates src/content/statements.ts – the DSA page and the accessibility
 * statement – from the legal role's drafts in the Gloumi repository
 * (docs/teisine-analize/svetaine/dsa-puslapis.md, prieinamumo-pareiskimas.md).
 *
 *   node scripts/gen-statements.mjs <folder with the two .md files> <DSA page date> [<accessibility statement date>]
 *
 * Dates are YYYY-MM-DD; each document keeps its own, so republishing one does
 * not move the other's date (the second defaults to the first).
 *
 * The words are the legal role's (Gloumi AGENTS.md XII); this script only
 * reshapes them. Each file has "## LT" and "## EN" halves: "# Title", an
 * introduction, then "## Section" blocks of paragraphs and "- " lists, with
 * **bold** kept. Left out on purpose:
 *   - "## Pastabos" (the legal role's notes, never published);
 *   - a section whose title carries [K-T4] (DSA transparency reports – waits
 *     for the company size to be signed);
 *   - the lines in FIXED_BY_WEB – shortcomings the site has fixed since the
 *     draft, which the legal role asked to drop once fixed.
 * `{data}` / `{date}` become that document's date. The run fails if a
 * FIXED_BY_WEB line is no longer in the draft, so a reworded draft is noticed.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [dir, dsaDate, accessibilityDate = dsaDate] = process.argv.slice(2);
const DAY = /^\d{4}-\d{2}-\d{2}$/;
if (!dir || !DAY.test(dsaDate ?? "") || !DAY.test(accessibilityDate ?? "")) {
  console.error("Usage: node scripts/gen-statements.mjs <folder> <DSA YYYY-MM-DD> [<accessibility YYYY-MM-DD>]");
  process.exit(1);
}
const DATES = { dsa: dsaDate, accessibility: accessibilityDate };
/** The date of the document being parsed: it replaces `{data}` / `{date}`. */
let date;

/*
 * Shortcomings the site has fixed, dropped until the legal role removes them
 * from the draft. Empty since 2026-10-18: the carousel's pause button and the
 * form errors tied to fields left the draft in Gloumi 25bbcc0c.
 */
const FIXED_BY_WEB = [];

const FILES = { dsa: "dsa-puslapis.md", accessibility: "prieinamumo-pareiskimas.md" };
const seenFixed = new Set();

function half(text, heading, next) {
  const start = text.indexOf(`\n## ${heading}\n`);
  if (start < 0) throw new Error(`"## ${heading}" not found`);
  const end = next ? text.indexOf(`\n## ${next}\n`, start + 1) : -1;
  return text.slice(start + heading.length + 5, end < 0 ? undefined : end);
}

function blocksOf(lines) {
  const blocks = [];
  let para = null;
  let list = null;
  const flush = () => {
    if (para) blocks.push({ p: para.join(" ") });
    para = null;
  };
  const flushList = () => {
    if (list) blocks.push({ ul: list });
    list = null;
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      flush();
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      flush();
      list ??= [];
      list.push(line.slice(2).trim());
    } else if (list && /^\s{2,}\S/.test(line)) {
      list[list.length - 1] += ` ${line.trim()}`;
    } else {
      flushList();
      para ??= [];
      para.push(line.trim());
    }
  }
  flush();
  flushList();
  // Drop the fixed shortcomings, remembering which were found.
  return blocks
    .map((b) => {
      if (!b.ul) return b;
      const kept = b.ul.filter((item) => {
        const hit = FIXED_BY_WEB.find((prefix) => item.startsWith(prefix));
        if (hit) seenFixed.add(hit);
        return !hit;
      });
      return kept.length ? { ul: kept } : null;
    })
    .filter(Boolean)
    .map((b) => (b.p ? { p: b.p.replace(/\{data\}|\{date\}/g, date) } : { ul: b.ul.map((i) => i.replace(/\{data\}|\{date\}/g, date)) }));
}

function parse(text) {
  const lines = text.split("\n");
  const titleIndex = lines.findIndex((l) => /^# /.test(l));
  if (titleIndex < 0) throw new Error("no # title");
  const title = lines[titleIndex].slice(2).trim();
  const sections = [];
  let current = { title: null, lines: [] };
  for (const line of lines.slice(titleIndex + 1)) {
    const h = /^## (.+)$/.exec(line);
    if (h) {
      sections.push(current);
      current = { title: h[1].trim(), lines: [] };
    } else current.lines.push(line);
  }
  sections.push(current);
  const [intro, ...rest] = sections;
  return {
    title,
    intro: blocksOf(intro.lines),
    sections: rest
      .filter((s) => !s.title.includes("[K-T4]"))
      .map((s) => ({ title: s.title.replace(/\*\*/g, "").trim(), blocks: blocksOf(s.lines) })),
  };
}

const out = {};
for (const [key, file] of Object.entries(FILES)) {
  date = DATES[key];
  const text = readFileSync(resolve(dir, file), "utf8").replace(/\r\n/g, "\n");
  out[key] = { lt: parse(half(text, "LT", "EN")), en: parse(half(text, "EN", "Pastabos")) };
}
const missing = FIXED_BY_WEB.filter((prefix) => !seenFixed.has(prefix));
if (missing.length) throw new Error(`FIXED_BY_WEB lines not in the draft any more:\n${missing.join("\n")}`);

const ts = `// GENERATED by scripts/gen-statements.mjs from the legal role's drafts
// (Gloumi docs/teisine-analize/svetaine). The words are the legal role's;
// change the draft, then regenerate. Published: DSA page ${DATES.dsa},
// accessibility statement ${DATES.accessibility}.

export type StatementBlock = { p: string } | { ul: string[] };
export type StatementSection = { title: string; blocks: StatementBlock[] };
export type Statement = { title: string; intro: StatementBlock[]; sections: StatementSection[] };

/** Each document's own date: its page header and the sitemap show it. */
export const STATEMENT_DATES: Record<"dsa" | "accessibility", string> = ${JSON.stringify(DATES)};

export const STATEMENTS: Record<"dsa" | "accessibility", Record<"lt" | "en", Statement>> = ${JSON.stringify(out, null, 2)};
`;
writeFileSync(resolve("src/content/statements.ts"), ts);
for (const [k, v] of Object.entries(out)) console.log(k, "lt", v.lt.sections.length, "sections; en", v.en.sections.length);
