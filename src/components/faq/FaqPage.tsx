import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { FAQ, FAQ_UPDATED, type FaqItem } from "@/content/faq";
import type { Lang } from "@/content/lang";
import { LEGAL_TITLES } from "@/content/legal";
import { site } from "@/content/site";

/*
 * The FAQ (Gloumi #209): `/duk` and `/en/faq`, the support role's answers as
 * generated into `faq.ts` (`scripts/gen-faq.mjs`).
 *
 * Every answer is open, not folded into an accordion: they are short (most
 * under 250 characters), a reader scrolling for theirs reads the questions
 * anyway, and a link from one answer to another – or from the footer to the
 * section for masters – lands on text that is already showing.
 *
 * An answer may point at another one as "K-18"; that becomes a link carrying
 * the other question, because the numbers mean nothing to a reader.
 */
const anchor = (id: string) => id.toLowerCase(); // "K-18" → "k-18"

function Answer({ text, questions, lang }: { text: string; questions: Map<string, string>; lang: Lang }) {
  const quote = (q: string) => (lang === "lt" ? `„${q}“` : `“${q}”`);
  const parts: ReactNode[] = text.split(/\b(K-\d+)\b/).map((part, index) => {
    const question = index % 2 === 1 ? questions.get(part) : undefined;
    if (!question) return part;
    return (
      <a key={part} href={`#${anchor(part)}`} className="font-medium text-terracotta-600 hover:underline">
        {quote(question)}
      </a>
    );
  });
  return <p className="mt-2 leading-relaxed text-espresso-700">{parts}</p>;
}

export function FaqPage({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  const sections = FAQ[lang];
  const questions = new Map<string, string>(sections.flatMap((s) => s.items.map((i: FaqItem) => [i.id, i.q])));

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">{copy.faq.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-espresso-900 sm:text-5xl">
            {LEGAL_TITLES[lang].faq}
          </h1>
          <p className="mt-4 text-sm text-espresso-500">
            {copy.legal.updated} <time dateTime={FAQ_UPDATED}>{FAQ_UPDATED}</time>
          </p>
        </header>

        <div className="mt-8 rounded-2xl bg-sand-100 px-5 py-4 text-sm leading-relaxed text-espresso-700">
          {copy.faq.intro}{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-terracotta-600 hover:underline">
            {site.email}
          </a>
          .
        </div>

        <nav aria-label={copy.faq.toc} className="mt-10 rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.faq.toc}</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.key}>
                <a href={`#${section.key}`} className="text-sm text-espresso-700 hover:text-terracotta-600">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6">
          {sections.map((section) => (
            <section key={section.key} id={section.key} className="mt-12 scroll-mt-28">
              <h2 className="font-serif text-2xl font-medium text-espresso-900 sm:text-3xl">{section.title}</h2>
              {section.items.map((item) => (
                <div key={item.id} id={anchor(item.id)} className="mt-6 scroll-mt-28">
                  <h3 className="font-semibold text-espresso-900">{item.q}</h3>
                  <Answer text={item.a} questions={questions} lang={lang} />
                </div>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
