"use client";

import dynamic from "next/dynamic";

/*
 * Loaded only when a page throws (web audit 2026-10-22): the error page draws the
 * header and the footer, and imported directly it put every language's texts
 * into every page's JavaScript. If even this load fails, global-error.tsx answers.
 */
const ErrorPage = dynamic(() => import("@/components/pages/ErrorPage").then((mod) => mod.ErrorPage));

/*
 * Share-link pages pick their language from the browser on the server; here,
 * in the browser, the root layout's <html lang> already says which one.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "lt";
  return <ErrorPage lang={lang} error={error} reset={reset} />;
}
