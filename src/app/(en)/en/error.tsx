"use client";

import dynamic from "next/dynamic";

/*
 * Loaded only when a page throws (web audit 2026-10-22): the error page draws the
 * header and the footer, and imported directly it put every language's texts
 * into every page's JavaScript. If even this load fails, global-error.tsx answers.
 */
const ErrorPage = dynamic(() => import("@/components/pages/ErrorPage").then((mod) => mod.ErrorPage));

/* A page that throws shows Gloumi's own error page, not Next's default (developer, 2026-10-17). */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage lang="en" error={error} reset={reset} />;
}
