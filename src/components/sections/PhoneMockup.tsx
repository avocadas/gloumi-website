"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import { useReducedMotion } from "framer-motion";
import { getCopy } from "@/content/copy";
import type { Lang } from "@/content/lang";
import { cn } from "@/lib/cn";
import feedEn from "@/assets/app-screens/en/feed.webp";
import searchEn from "@/assets/app-screens/en/search.webp";
import profileEn from "@/assets/app-screens/en/profile.webp";
import bookingEn from "@/assets/app-screens/en/booking.webp";
import feedLt from "@/assets/app-screens/lt/feed.webp";
import searchLt from "@/assets/app-screens/lt/search.webp";
import profileLt from "@/assets/app-screens/lt/profile.webp";
import bookingLt from "@/assets/app-screens/lt/booking.webp";

/** Written out rather than derived from the dictionary: the two languages must offer the same four screens. */
type ScreenId = "feed" | "search" | "profile" | "booking";

const ORDER: ScreenId[] = ["feed", "search", "profile", "booking"];
const AUTO_MS = 4800;

/**
 * Real screenshots of the app, taken in its own language. The people in them
 * are invented (avocadas/Gloumi#136): the app has no real professionals yet,
 * and the team's test accounts are not for public pages.
 */
const SCREENS: Record<Lang, Record<ScreenId, StaticImageData>> = {
  lt: { feed: feedLt, search: searchLt, profile: profileLt, booking: bookingLt },
  en: { feed: feedEn, search: searchEn, profile: profileEn, booking: bookingEn },
};

/**
 * A phone showing four of the app's screens. It cycles on its own until the
 * visitor hovers, focuses or picks a tab, and never cycles for people who
 * asked for reduced motion.
 */
export function PhoneMockup({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  const [active, setActive] = useState<ScreenId>("feed");
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (reduce || paused || manual) return;
    const timer = window.setInterval(() => {
      setActive((current) => ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [reduce, paused, manual]);

  const select = (id: ScreenId) => {
    setManual(true);
    setActive(id);
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = ORDER.indexOf(active);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % ORDER.length;
    if (event.key === "ArrowLeft") next = (index - 1 + ORDER.length) % ORDER.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ORDER.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(ORDER[next]);
    tabRefs.current[next]?.focus();
  };

  const tabId = (id: ScreenId) => `${baseId}-tab-${id}`;
  const panelId = (id: ScreenId) => `${baseId}-panel-${id}`;
  const activeTab = copy.phone.tabs.find((tab) => tab.id === active);

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        role="group"
        aria-label={copy.phone.ariaLabel}
        className={cn("relative w-[272px] sm:w-[300px]", !reduce && "animate-float")}
      >
        <div className="relative rounded-[2.9rem] bg-espresso-950 p-[10px] shadow-phone">
          {/* The screenshots come from an Android phone, so the camera is a punch hole, not an island. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[19px] z-20 h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-espresso-950 ring-1 ring-white/10"
          />
          <div
            role="tabpanel"
            id={panelId(active)}
            aria-labelledby={tabId(active)}
            className="relative aspect-[900/1950] w-full overflow-hidden rounded-[2.3rem] bg-cream-100"
          >
            {/*
              All four stay mounted and load straight away, so switching never
              waits on the network; only the active one is visible or announced.
            */}
            {ORDER.map((id) => {
              const on = id === active;
              return (
                <Image
                  key={id}
                  src={SCREENS[lang][id]}
                  alt={on ? (activeTab?.alt ?? "") : ""}
                  aria-hidden={on ? undefined : true}
                  fill
                  sizes="(min-width: 640px) 280px, 252px"
                  placeholder="blur"
                  loading="eager"
                  fetchPriority={id === "feed" ? "high" : "auto"}
                  className={cn(
                    "object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
                    on ? "opacity-100" : "opacity-0"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={copy.phone.tabsLabel}
        onKeyDown={onTabKey}
        className="mt-7 inline-flex rounded-full bg-white/80 p-1 shadow-card ring-1 ring-espresso-900/5 backdrop-blur"
      >
        {copy.phone.tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={selected ? panelId(tab.id) : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              className={cn(
                "rounded-full px-3 py-2 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm",
                selected ? "bg-espresso-900 text-cream-100" : "text-espresso-600 hover:text-espresso-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-espresso-500">{copy.phone.note}</p>
    </div>
  );
}
