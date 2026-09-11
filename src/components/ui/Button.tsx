import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "dark" | "light" | "outline" | "outline-light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta-600 text-white shadow-[0_12px_28px_-14px_rgba(143,61,38,0.7)] hover:bg-terracotta-700",
  dark: "bg-espresso-900 text-cream-100 hover:bg-espresso-800",
  light: "bg-white text-espresso-900 shadow-card hover:bg-cream-200",
  outline:
    "border border-espresso-900/15 bg-transparent text-espresso-900 hover:border-espresso-900/40 hover:bg-white/60",
  "outline-light":
    "border border-white/25 bg-transparent text-cream-100 hover:border-white/60 hover:bg-white/10",
  ghost: "text-espresso-900 hover:bg-espresso-900/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export function buttonClasses({ variant = "primary", size = "md", className }: StyleProps): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...rest} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> &
  StyleProps & {
    href: string;
    /** Opens in a new tab with the safe rel pair. */
    external?: boolean;
  };

/**
 * Same look as Button, rendered as a link. Internal routes go through
 * next/link so they prefetch; external URLs stay plain anchors.
 */
export function ButtonLink({ variant, size, className, href, external, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  if (href.startsWith("/")) {
    return <Link href={href} className={classes} {...rest} />;
  }
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      {...rest}
    />
  );
}
