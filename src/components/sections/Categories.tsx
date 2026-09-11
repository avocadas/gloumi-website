"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, RING_GRADIENT, type Category } from "@/content/categories";
import { copy } from "@/content/copy";
import { cn } from "@/lib/cn";

/**
 * The app's circular "highlight" categories. A ring lights up with the
 * StoryRing gradient on hover and spins slowly while selected; the panel
 * below shows what that category holds.
 */
export function CategoriesSection() {
  const [selectedId, setSelectedId] = useState<Category["id"]>(categories[0].id);
  const reduce = useReducedMotion();
  const current = categories.find((c) => c.id === selectedId) ?? categories[0];

  return (
    <section id="kategorijos" aria-labelledby="kategorijos-title" className="scroll-mt-24 bg-cream-200 py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="kategorijos-title"
          align="center"
          eyebrow={copy.categories.eyebrow}
          title={copy.categories.title}
          lead={copy.categories.lead}
        />

        <ul
          aria-label={copy.categories.listLabel}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-6 sm:gap-x-4"
        >
          {categories.map((category) => {
            const selected = category.id === selectedId;
            const Icon = category.icon;
            return (
              <li key={category.id} className="flex justify-center">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedId(category.id)}
                  className="group flex w-full max-w-[128px] flex-col items-center gap-3 rounded-2xl p-1 text-center"
                >
                  <span
                    className={cn(
                      "relative block h-20 w-20 transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:h-[92px] sm:w-[92px]",
                      selected && "-translate-y-1"
                    )}
                  >
                    <m.span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 rounded-full transition-opacity duration-300",
                        selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                      style={{ background: RING_GRADIENT }}
                      animate={selected && !reduce ? { rotate: [0, 360] } : { rotate: 0 }}
                      transition={
                        selected && !reduce ? { repeat: Infinity, duration: 9, ease: "linear" } : { duration: 0.4 }
                      }
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 rounded-full ring-1 ring-inset ring-sand-400 transition-opacity duration-300",
                        selected ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                      )}
                    />
                    <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white shadow-card">
                      <span
                        className="flex h-[calc(100%-10px)] w-[calc(100%-10px)] items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: category.tint, color: category.accent }}
                      >
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-[13px] font-medium leading-snug sm:text-sm",
                      selected ? "text-espresso-900" : "text-espresso-600 group-hover:text-espresso-900"
                    )}
                  >
                    {category.label}
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
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: current.accent }}>
                    {current.label}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-espresso-900 sm:text-[1.75rem]">
                    {current.tagline}
                  </h3>
                </div>
                <ButtonLink href="/#atsisiusti" size="sm" variant="dark">
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
