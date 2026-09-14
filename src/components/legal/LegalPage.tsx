import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { legalPath, LEGAL_ROUTES, type Lang, type LegalKey } from "@/content/lang";
import { controllerLine, LEGAL_TITLES, slugify, type LegalSection } from "@/content/legal";
import { site } from "@/content/site";

type Props = {
  /** Language of the page: its chrome and its text, which are never different. */
  lang: Lang;
  /** Which of the four documents this is. Decides the title and the "other documents" list. */
  docKey: LegalKey;
  /** Shown under the title when the document also exists in the other language. */
  subtitle?: string;
  updated: string;
  version?: string;
  intro?: ReactNode;
  /** Shown above the first section, e.g. which language prevails in a dispute. */
  note?: string;
  sections: LegalSection[];
};

/**
 * One layout for every legal document: title block, table of contents, the
 * sections themselves and the controller/contact card. One language per page —
 * the other one is a switcher click away, at the matching path.
 */
export function LegalPage({ lang, docKey, subtitle, updated, version, intro, note, sections }: Props) {
  const copy = getCopy(lang);
  const title = LEGAL_TITLES[lang][docKey];
  const others = LEGAL_ROUTES.filter((route) => route.key !== docKey);

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">{copy.legal.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-espresso-900 sm:text-5xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-2 text-lg text-espresso-400">{subtitle}</p> : null}
          <p className="mt-4 text-sm text-espresso-500">
            {copy.legal.updated} <time dateTime={updated}>{updated}</time>
            {version ? ` · ${copy.legal.version} ${version}` : null}
          </p>
        </header>

        {intro ? (
          <div className="mt-8 rounded-2xl bg-sand-100 px-5 py-4 text-sm leading-relaxed text-espresso-700">{intro}</div>
        ) : null}

        <nav aria-label={copy.legal.toc} className="mt-10 rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.legal.toc}</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#${lang}-${slugify(section.title)}`}
                  className="text-sm text-espresso-700 hover:text-terracotta-600"
                >
                  <span className="mr-2 font-serif text-espresso-400">{index + 1}.</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12">
          {note ? <p className="text-sm text-espresso-500">{note}</p> : null}
          {sections.map((section, index) => (
            <section key={section.title} id={`${lang}-${slugify(section.title)}`} className="mt-10 scroll-mt-28">
              <h2 className="font-serif text-2xl font-medium text-espresso-900">
                <span className="mr-2 text-espresso-400">{index + 1}.</span>
                {section.title}
              </h2>
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
          <p className="mt-2 text-espresso-900">{controllerLine(lang)}</p>
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
