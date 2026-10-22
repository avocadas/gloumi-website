"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds. Stagger siblings by passing their index times a step. */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
};

/**
 * Fade-and-rise on first scroll into view.
 *
 * Below-the-fold only: the server HTML carries the hidden start (globals.css
 * `[data-reveal]`), so the hero uses a CSS keyframe instead and SiteShell
 * ships a <noscript> rule that reveals every block for visitors without
 * JavaScript. One IntersectionObserver per block, dropped after it shows;
 * the transition itself is CSS (web audit 2026-10-22: framer-motion was the
 * home page's heaviest script).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.shown = "";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.shown = "";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties;
  return (
    <div ref={ref} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}
