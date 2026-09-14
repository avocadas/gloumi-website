import { cn } from "@/lib/cn";

/**
 * The app icon.
 *
 * The artwork lives in public/brand/gloumi-mark.svg, copied from the app by
 * scripts/gen-from-app.mjs, and this component only points at that file. It
 * used to inline the mark as JSX, which meant the repository held the drawing
 * twice: when the app replaced the mark on 2026-09-13, the favicons and the
 * OpenGraph card would have followed the file while the footer kept drawing
 * the old one. One file, read by everything, cannot drift that way.
 *
 * A plain <img> rather than next/image: next/image refuses SVG unless
 * `dangerouslyAllowSVG` is switched on for the whole project, and there is
 * nothing for the image optimizer to do to a 2 KB vector.
 */
type BrandMarkProps = {
  /** Accessible name. Pass an empty string when a visible label already names it. */
  title?: string;
  className?: string;
};

export function BrandMark({ title = "Gloumi", className }: BrandMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/gloumi-mark.svg"
      alt={title}
      width={80}
      height={80}
      loading="lazy"
      decoding="async"
      className={cn("block", className)}
    />
  );
}
