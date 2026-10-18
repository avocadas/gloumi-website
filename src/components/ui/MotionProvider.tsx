"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/* Loaded after the first paint: the animations are decoration, the text is not. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Loads only the DOM animation feature set and enforces the `m` components.
 * `strict` throws on a stray `motion.div`, which would drag the full bundle
 * back in – the whole point of the split is a marketing page that stays light.
 *
 * The feature set itself is fetched after the page renders (developer
 * 2026-10-18: the first visit on a slow phone took ~7 s). Until it arrives
 * an `m` element keeps its `initial` style; the only ones that start hidden
 * are the Reveal sections below the first screen, which wait for scrolling
 * anyway – nothing in the first view depends on it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
