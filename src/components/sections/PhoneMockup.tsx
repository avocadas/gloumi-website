"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";
import { categories, RING_GRADIENT } from "@/content/categories";
import { copy } from "@/content/copy";
import { cn } from "@/lib/cn";

type ScreenId = (typeof copy.phone.tabs)[number]["id"];

const ORDER: ScreenId[] = ["search", "categories", "calendar"];
const AUTO_MS = 4800;

/** Which bottom-bar item lights up for each screen. */
const TAB_FOR_SCREEN: Record<ScreenId, number> = { search: 1, categories: 1, calendar: 2 };

/** The app's TAB_ACCENTS: Feed, Search, Vizitai, Profilis. */
const TAB_ACCENTS = ["#574463", "#4C6552", "#8F3D26", "#7A3350"];
const TAB_IDLE = "#9B8E93";

/**
 * A CSS phone showing three of the app's screens. It cycles on its own until
 * the visitor hovers, focuses or picks a tab, and never cycles for people who
 * asked for reduced motion.
 */
export function PhoneMockup() {
  const [active, setActive] = useState<ScreenId>("search");
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
        <div className="relative aspect-[9/19.4] rounded-[2.9rem] bg-espresso-950 p-[10px] shadow-phone">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[18px] z-20 h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-espresso-950"
          />
          <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-cream-100 text-espresso-900">
            <StatusBar />
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active}
                role="tabpanel"
                id={panelId(active)}
                aria-labelledby={tabId(active)}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-[62px] top-[46px] overflow-hidden px-4"
              >
                {active === "search" ? <SearchScreen /> : null}
                {active === "categories" ? <CategoriesScreen /> : null}
                {active === "calendar" ? <CalendarScreen /> : null}
              </m.div>
            </AnimatePresence>
            <TabBar activeIndex={TAB_FOR_SCREEN[active]} />
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
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selected ? "bg-espresso-900 text-cream-100" : "text-espresso-600 hover:text-espresso-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[46px] items-end justify-between px-7 pb-2 text-[11px] font-semibold text-espresso-900"
    >
      <span>{copy.phone.time}</span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[2px]">
          <span className="h-1.5 w-[3px] rounded-sm bg-espresso-900" />
          <span className="h-2 w-[3px] rounded-sm bg-espresso-900" />
          <span className="h-2.5 w-[3px] rounded-sm bg-espresso-900" />
          <span className="h-3 w-[3px] rounded-sm bg-espresso-900/40" />
        </span>
        <span className="relative ml-1 h-[10px] w-[20px] rounded-[3px] border border-espresso-900/70">
          <span className="absolute inset-[1.5px] right-[4px] rounded-[1.5px] bg-espresso-900" />
        </span>
      </span>
    </div>
  );
}

function SearchScreen() {
  const s = copy.phone.search;
  return (
    <div className="flex h-full flex-col gap-3 pt-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-espresso-400">{s.locationLabel}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold">
            <MapPin className="h-3.5 w-3.5 text-sage-500" aria-hidden="true" />
            {s.city}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-full bg-linear-to-br from-plum-500 to-terracotta-500 ring-2 ring-white"
        />
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-card ring-1 ring-espresso-900/5">
        <Search className="h-4 w-4 text-espresso-400" aria-hidden="true" />
        <span className="flex-1 truncate text-[12px] text-espresso-400">{s.placeholder}</span>
        <SlidersHorizontal className="h-4 w-4 text-espresso-700" aria-hidden="true" />
      </div>

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {s.chips.map((chip, index) => (
          <span
            key={chip}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium",
              index === 0 ? "bg-espresso-900 text-cream-100" : "bg-white text-espresso-700 ring-1 ring-espresso-900/8"
            )}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="font-serif text-[17px] font-semibold">{s.nearby}</p>
        <span className="text-[11px] font-semibold text-sage-500">{s.map}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {s.masters.map((master) => (
          <li
            key={master.name}
            className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card ring-1 ring-espresso-900/5"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[12px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${master.hue}, #C27C5D)` }}
            >
              {master.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-semibold">{master.name}</p>
                <p className="shrink-0 text-[12px] font-semibold text-terracotta-600">
                  {s.from} {master.price}
                </p>
              </div>
              <p className="truncate text-[11px] text-espresso-500">{master.role}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-espresso-500">
                <Star className="h-3 w-3 fill-terracotta-500 text-terracotta-500" aria-hidden="true" />
                <span className="font-semibold text-espresso-900">{master.rating}</span>
                <span>({master.reviews})</span>
                <span aria-hidden="true">·</span>
                <span>{master.distance}</span>
                {master.today ? (
                  <span className="ml-auto rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-500">
                    {s.availableToday}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoriesScreen() {
  const c = copy.phone.categories;
  return (
    <div className="flex h-full flex-col gap-3 pt-1">
      <p className="font-serif text-[22px] font-semibold">{c.title}</p>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-espresso-400">{c.stories}</p>
        <ul className="mt-2 flex gap-3">
          {c.storyNames.map((name, index) => (
            <li key={name} className="flex flex-col items-center gap-1">
              <span className="rounded-full p-[2px]" style={{ background: index < 3 ? RING_GRADIENT : "#D8C6B6" }}>
                <span
                  aria-hidden="true"
                  className="block h-10 w-10 rounded-full border-2 border-cream-100 bg-linear-to-br from-sand-300 to-sand-500"
                />
              </span>
              <span className="text-[10px] text-espresso-600">{name}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid grid-cols-3 gap-x-2 gap-y-3 pt-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.id} className="flex flex-col items-center gap-1.5">
              <span className="rounded-full p-[2.5px]" style={{ background: RING_GRADIENT }}>
                <span
                  className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-cream-100"
                  style={{ backgroundColor: category.tint, color: category.accent }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </span>
              <span className="text-center text-[11px] font-medium leading-tight text-espresso-800">{category.short}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto rounded-2xl bg-white p-3 shadow-card ring-1 ring-espresso-900/5">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-espresso-400">{c.popular}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {c.popularItems.map((item) => (
            <li key={item} className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-medium text-espresso-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* September 2026 starts on a Tuesday; the grid is Monday-first like the app's. */
const DAYS_IN_MONTH = 30;
const LEADING_BLANKS = 1;
const TODAY = 11;
const SELECTED = 18;
const AVAILABLE = new Set([14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 28, 29, 30]);

function CalendarScreen() {
  const c = copy.phone.calendar;
  const cells: Array<number | null> = [
    ...Array.from({ length: LEADING_BLANKS }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  return (
    <div className="flex h-full flex-col gap-2.5 pt-1">
      <p className="font-serif text-[22px] font-semibold">{c.title}</p>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-card ring-1 ring-espresso-900/5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-terracotta-600 to-terracotta-400 text-[12px] font-bold text-white"
        >
          EJ
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">
            {c.master} · {c.service}
          </p>
          <p className="text-[11px] text-espresso-500">{c.meta}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-espresso-900/5">
        <div className="flex items-center justify-between">
          <ChevronLeft className="h-4 w-4 text-espresso-400" aria-hidden="true" />
          <p className="text-[13px] font-semibold">{c.month}</p>
          <ChevronRight className="h-4 w-4 text-espresso-900" aria-hidden="true" />
        </div>
        <div className="mt-2 grid grid-cols-7 text-center text-[10px] font-medium text-espresso-400">
          {c.weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[12px]">
          {cells.map((day, index) =>
            day === null ? (
              <span key={`blank-${index}`} />
            ) : (
              <span
                key={day}
                className={cn(
                  "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                  day === SELECTED && "bg-terracotta-600 font-semibold text-white",
                  day === TODAY && "font-semibold text-terracotta-600 ring-1 ring-terracotta-600",
                  day < TODAY && "text-espresso-400/60",
                  day > TODAY && day !== SELECTED && !AVAILABLE.has(day) && "text-espresso-400",
                  AVAILABLE.has(day) &&
                    day !== SELECTED &&
                    "after:absolute after:-bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-sage-500 after:content-['']"
                )}
              >
                {day}
              </span>
            )
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-espresso-400">{c.slotsLabel}</p>
        <div className="no-scrollbar -mx-4 mt-1.5 flex gap-1.5 overflow-x-auto px-4">
          {c.slots.map((slot, index) => (
            <span
              key={slot}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold",
                index === 2 ? "bg-espresso-900 text-cream-100" : "bg-white text-espresso-800 ring-1 ring-espresso-900/8"
              )}
            >
              {slot}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <span className="flex h-11 items-center justify-center rounded-2xl bg-terracotta-600 text-[13px] font-semibold text-white shadow-[0_10px_20px_-12px_rgba(143,61,38,0.7)]">
          {c.confirm}
        </span>
        <p className="mt-1.5 text-center text-[10px] text-espresso-500">{c.deposit}</p>
      </div>
    </div>
  );
}

function TabBar({ activeIndex }: { activeIndex: number }) {
  const icons = [Home, Search, Calendar, User];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 flex h-[62px] items-start justify-around border-t border-espresso-900/6 bg-cream-100/95 px-2 pt-2 backdrop-blur"
    >
      {copy.phone.tabbar.map((label, index) => {
        const Icon = icons[index];
        const on = index === activeIndex;
        return (
          <span
            key={label}
            className="flex flex-col items-center gap-0.5 text-[10px] font-medium"
            style={{ color: on ? TAB_ACCENTS[index] : TAB_IDLE }}
          >
            <Icon className="h-5 w-5" strokeWidth={on ? 2.2 : 1.8} />
            {label}
          </span>
        );
      })}
    </div>
  );
}
