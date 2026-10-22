import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { legalPath, LEGAL_ROUTES, type LegalKey, type LegalLang } from "@/content/lang";
import { controllerLine, LEGAL_TITLES, slugify, type LegalSection } from "@/content/legal";
import { site } from "@/content/site";
import type { StatementBlock } from "@/content/statements";

/** `**bold**` in the legal role's statements, the only markup they use. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-espresso-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Paragraphs and lists in the order the text has them (DSA page, accessibility statement). */
export function Blocks({ blocks }: { blocks: StatementBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        "p" in block ? (
          <p key={i} className="mt-3 leading-relaxed text-espresso-700">
            <Inline text={block.p} />
          </p>
        ) : (
          <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-espresso-700 marker:text-terracotta-400">
            {block.ul.map((item) => (
              <li key={item}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

type Props = {
  /** Language of the page: its chrome and its text, which are never different. */
  lang: LegalLang;
  /** Which of the five documents this is. Decides the title and the "other documents" list. */
  docKey: LegalKey;
  updated: string;
  version?: string;
  intro?: ReactNode;
  /** Shown above the first section, e.g. which language prevails in a dispute. */
  note?: string;
  sections: (LegalSection & { blocks?: StatementBlock[] })[];
  /**
   * A translation into a language the site chrome does not speak (fr, de, …):
   * the text, its title, anchors and controller line are in that language,
   * the chrome stays in `lang`.
   */
  translation?: { lang: string; title: string; controller: string };
};

/**
 * One layout for every legal document: title block, table of contents, the
 * sections themselves and the controller/contact card. One language per page —
 * the other one is a switcher click away, at the matching path.
 */
export function LegalPage({ lang, docKey, updated, version, intro, note, sections, translation }: Props) {
  const copy = getCopy(lang);
  const title = translation?.title ?? LEGAL_TITLES[lang][docKey];
  const textLang = translation?.lang ?? lang;
  // The FAQ shares the routing, but it is not one of the documents.
  const others = LEGAL_ROUTES.filter((route) => route.key !== docKey && route.key !== "faq");

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">{copy.legal.eyebrow}</p>
          <h1 lang={textLang} className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-espresso-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-espresso-500">
            {copy.legal.updated} <time dateTime={updated}>{updated}</time>
            {version ? ` · ${copy.legal.version} ${version}` : null}
          </p>
        </header>

        {intro ? (
          <div className="mt-8 rounded-2xl bg-sand-100 px-5 py-4 text-sm leading-relaxed text-espresso-700">{intro}</div>
        ) : null}

        <nav aria-label={copy.legal.toc} lang={textLang} className="mt-10 rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.legal.toc}</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#${textLang}-${slugify(section.title)}`}
                  className="text-sm text-espresso-700 hover:text-terracotta-600"
                >
                  <span className="mr-2 font-serif text-espresso-400">{index + 1}.</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12" lang={textLang}>
          {note ? <p className="text-sm text-espresso-500">{note}</p> : null}
          {sections.map((section, index) => (
            <section key={section.title} id={`${textLang}-${slugify(section.title)}`} className="mt-10 scroll-mt-8">
              <h2 className="font-serif text-2xl font-medium text-espresso-900">
                <span className="mr-2 text-espresso-400">{index + 1}.</span>
                {section.title}
              </h2>
              {section.blocks ? <Blocks blocks={section.blocks} /> : null}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-espresso-700">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-espresso-700 marker:text-terracotta-400">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.legal.controller}</p>
          <p className="mt-2 text-espresso-900" lang={textLang}>
            {translation?.controller ?? controllerLine(lang)}
          </p>
          <p className="mt-4 text-sm text-espresso-500">
            {copy.legal.contactQuestion}{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-terracotta-600 hover:underline">
              {site.email}
            </a>
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.legal.otherDocs}</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {others.map((route) => (
              <li key={route.key}>
                <Link href={legalPath(lang, route.key)} className="font-medium text-terracotta-600 hover:underline">
                  {LEGAL_TITLES[lang][route.key]}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </article>
  );
}
