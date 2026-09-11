"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

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
 * Below-the-fold only: the server HTML carries the initial opacity, so the
 * hero uses a CSS keyframe instead and layout.tsx ships a <noscript> rule
 * that reveals every [data-reveal] block for visitors without JavaScript.
 */
export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  const reduce = useReducedMotion();
  return (
    <m.div
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </m.div>
  );
}
