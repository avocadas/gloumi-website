"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Loads only the DOM animation feature set and enforces the `m` components.
 * `strict` throws on a stray `motion.div`, which would drag the full bundle
 * back in – the whole point of the split is a marketing page that stays light.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
