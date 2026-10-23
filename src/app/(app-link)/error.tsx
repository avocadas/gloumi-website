"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/*
 * Loaded only when a page throws (web audit 2026-10-22): the error page draws the
 * header and the footer, and imported directly it put every language's texts
 * into every page's JavaScript. If even this load fails, global-error.tsx answers.
 */
const ErrorPage = dynamic(() => import("@/components/pages/ErrorPage").then((mod) => mod.ErrorPage));

const noSubscription = () => () => {};

/*
 * Share-link pages pick their language from the browser on the server; here,
 * in the browser, the root layout's <html lang> already says which one.
 *
 * Read through useSyncExternalStore, not inline: the boundary is also rendered
 * on the server, where there is no document, and that Lithuanian render was
 * what the browser kept, so an English reader got the Lithuanian page (web
 * audit I-4). The server snapshot keeps hydration matching; React then renders
 * again with the browser's value.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = useSyncExternalStore(
    noSubscription,
    () => (document.documentElement.lang === "en" ? "en" : "lt"),
    () => "lt" as const,
  );
  return <ErrorPage lang={lang} error={error} reset={reset} />;
}
