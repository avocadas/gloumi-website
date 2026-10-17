"use client";

import { ErrorPage } from "@/components/pages/ErrorPage";

/*
 * Share-link pages pick their language from the browser on the server; here,
 * in the browser, the root layout's <html lang> already says which one.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "lt";
  return <ErrorPage lang={lang} error={error} reset={reset} />;
}
