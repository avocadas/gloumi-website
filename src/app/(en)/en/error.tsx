"use client";

import { ErrorPage } from "@/components/pages/ErrorPage";

/* A page that throws shows Gloumi's own error page, not Next's default (developer, 2026-10-17). */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage lang="en" error={error} reset={reset} />;
}
