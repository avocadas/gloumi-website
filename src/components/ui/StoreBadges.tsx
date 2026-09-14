import { getCopy } from "@/content/copy";
import type { Lang } from "@/content/lang";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type Store = "apple" | "google";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** A play-store triangle from four flat polygons – our own drawing, not Google's artwork (see README). */
function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <polygon points="3,2 3,22 12,12" fill="#2196F3" />
      <polygon points="3,2 12,12 15.9,8.4" fill="#4CAF50" />
      <polygon points="3,22 12,12 15.9,15.6" fill="#F44336" />
      <polygon points="15.9,8.4 21,11.3 21,12.7 15.9,15.6 12,12" fill="#FFC107" />
    </svg>
  );
}

type BadgeProps = {
  store: Store;
  lang: Lang;
  className?: string;
};

/**
 * One store badge. With a URL it is a real link; without one it renders as a
 * disabled "Netrukus" (coming soon) pill, so the hero never carries a dead
 * link while the app is still in review.
 */
export function StoreBadge({ store, lang, className }: BadgeProps) {
  const copy = getCopy(lang);
  const href = store === "apple" ? site.stores.appStore : site.stores.googlePlay;
  const text = copy.stores[store];
  const Logo = store === "apple" ? AppleLogo : PlayLogo;
  const classes = cn(
    "inline-flex h-14 min-w-[176px] items-center gap-3 rounded-2xl bg-espresso-950 pl-4 pr-5 text-left text-white ring-1 ring-white/10 transition-[transform,box-shadow,background-color] duration-200",
    href
      ? "shadow-[0_14px_30px_-16px_rgba(31,23,21,0.7)] hover:-translate-y-0.5 hover:bg-espresso-900"
      : "opacity-85",
    className
  );
  const body = (
    <>
      <Logo className="h-7 w-7 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/70">
          {href ? text.small : copy.stores.soon}
        </span>
        <span className="mt-1 text-[19px] font-semibold tracking-[-0.01em]">{text.big}</span>
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {body}
        <span className="sr-only">{text.srOpens}</span>
      </a>
    );
  }
  return (
    <span className={classes} aria-disabled="true" title={copy.stores.soonTitle}>
      {body}
      <span className="sr-only">{copy.stores.soonSr}</span>
    </span>
  );
}

export function StoreBadges({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <StoreBadge store="apple" lang={lang} />
      <StoreBadge store="google" lang={lang} />
    </div>
  );
}
