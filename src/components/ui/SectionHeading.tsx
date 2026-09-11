import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  className,
  id,
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            dark ? "text-terracotta-300" : "text-terracotta-600"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          "mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-balance sm:text-5xl",
          dark ? "text-cream-50" : "text-espresso-900"
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed text-pretty",
            dark ? "text-sand-400" : "text-espresso-500"
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
