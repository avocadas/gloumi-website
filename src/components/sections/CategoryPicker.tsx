"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { CategoryView } from "@/content/categories";
import { CATEGORY_ICONS } from "@/content/category-icons";
import { cn } from "@/lib/cn";

/** The app's StoryRing gradient – the ring around an unseen story. */
const RING_GRADIENT = "conic-gradient(from 210deg, #8F3D26 0%, #E2578C 35%, #7A3350 70%, #4C6552 100%)";

/**
 * The interactive part of the categories section: the row of discs and the
 * panel that shows what the selected one holds.
 *
 * The texts arrive as props, for one language (`getCategoryViews`), and the
 * icons come from category-icons.ts: importing categories.ts here would ship
 * every language's texts to every visitor (web audit 2026-10-22).
 */
export function CategoryPicker({
  items,
  listLabel,
  cta,
  downloadHref,
}: {
  items: CategoryView[];
  listLabel: string;
  cta: string;
  downloadHref: string;
}) {
  // The first in the row, as the row is the app's order (nails first).
  const [selectedId, setSelectedId] = useState<CategoryView["id"]>(items[0].id);
  const current = items.find((c) => c.id === selectedId) ?? items[0];

  return (
    <>
      <ul aria-label={listLabel} className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-6 sm:gap-x-4">
        {items.map((category) => {
          const selected = category.id === selectedId;
          const Icon = CATEGORY_ICONS[category.id];
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
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-full transition-opacity duration-300",
                      selected ? "animate-ring-spin opacity-100 motion-reduce:animate-none" : "opacity-0 group-hover:opacity-100"
                    )}
                    style={{ background: RING_GRADIENT }}
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
                      style={{ backgroundColor: category.tint, color: category.ink }}
                    >
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
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
        {/* `key` remounts the panel, so each category enters with the CSS keyframe. */}
        <div key={current.id} className="animate-panel-in rounded-3xl bg-white p-6 shadow-card ring-1 ring-espresso-900/5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: current.ink }}>
                {current.label}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-medium text-espresso-900 sm:text-[1.75rem]">{current.tagline}</h3>
            </div>
            <ButtonLink href={downloadHref} size="sm" variant="dark">
              {cta}
            </ButtonLink>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {current.examples.map((example) => (
              <li key={example} className="rounded-full bg-sand-100 px-3.5 py-1.5 text-sm text-espresso-700">
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
