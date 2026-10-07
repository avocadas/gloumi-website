"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, type Category } from "@/content/categories";
import { getCopy } from "@/content/copy";
import { sectionHref, sectionId, type Lang } from "@/content/lang";
import { cn } from "@/lib/cn";

/**
 * The category row of the app's Search screen, drawn the way the app draws it
 * (gloumi-app/src/screens/tabs/SearchScreen.js, `catItem` / `catCircle`);
 * the panel below shows what the selected category holds.
 */
export function CategoriesSection({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  const categories = getCategories(lang);
  const [selectedId, setSelectedId] = useState<Category["id"]>("hair");
  const reduce = useReducedMotion();
  const current = categories.find((c) => c.id === selectedId) ?? categories[0];

  return (
    <section id={sectionId(lang, "categories")} aria-labelledby="kategorijos-title" className="scroll-mt-24 bg-cream-200 py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="kategorijos-title"
          align="center"
          eyebrow={copy.categories.eyebrow}
          title={copy.categories.title}
          lead={copy.categories.lead}
        />

        {/*
         * On a phone the row scrolls sideways, edge to edge, as it does in the
         * app (six 64-wide items do not fit); from `sm` it sits centred.
         * `py-1` keeps the focus outline from being clipped by the overflow.
         */}
        <ul
          aria-label={copy.categories.listLabel}
          className="no-scrollbar -mx-5 mt-12 flex gap-3 overflow-x-auto px-5 py-1 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0"
        >
          {categories.map((category) => {
            const selected = category.id === selectedId;
            const Icon = category.icon;
            return (
              <li key={category.id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedId(category.id)}
                  className="group flex w-16 flex-col items-center gap-[7px] rounded-2xl text-center"
                >
                  {/*
                   * As the app's `catCircle`: 58 across, filled with the
                   * category's `tint`, a 32 icon in its `ink`. Selection is an
                   * ink border of 1.5, not a different fill: the fill is how a
                   * category is recognised without reading, so it stays.
                   */}
                  <span
                    className={cn(
                      "flex h-[58px] w-[58px] items-center justify-center rounded-full border-[1.5px] transition-colors duration-200",
                      selected ? "border-espresso-900" : "border-transparent group-hover:border-espresso-900/25"
                    )}
                    style={{ backgroundColor: category.tint, color: category.ink }}
                  >
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </span>
                  {/* The short name on one line, as in the app; the full one heads the panel below. */}
                  <span
                    className={cn(
                      "whitespace-nowrap text-[11px] leading-tight",
                      selected
                        ? "font-extrabold text-espresso-900"
                        : "font-semibold text-espresso-600 group-hover:text-espresso-900"
                    )}
                  >
                    {category.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-12 max-w-2xl" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: current.ink }}>
                    {current.label}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-espresso-900 sm:text-[1.75rem]">
                    {current.tagline}
                  </h3>
                </div>
                <ButtonLink href={sectionHref(lang, "download")} size="sm" variant="dark">
                  {copy.categories.cta}
                </ButtonLink>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {current.examples.map((example) => (
                  <li key={example} className="rounded-full bg-sand-100 px-3.5 py-1.5 text-sm text-espresso-700">
                    {example}
                  </li>
                ))}
              </ul>
            </m.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
