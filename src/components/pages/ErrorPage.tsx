"use client";

import { useEffect, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getCopy } from "@/content/copy";
import { homePath, type Lang } from "@/content/lang";
import { site } from "@/content/site";
import { SystemPage } from "./SystemPage";

/*
 * Klaidos riba (`error.tsx`) savu dizainu: „Kažkas nepavyko“, „Bandyti dar
 * kartą“ (Next `reset` – iš naujo atvaizduoja segmentą) ir kelias į pradžią.
 * Klaidos tekstas lankytojui nerodomas – tik `digest`, pagal kurį ją galima
 * rasti serverio žurnale, kai žmogus parašo.
 */
export function ErrorPage({ lang, error, reset }: { lang: Lang; error: Error & { digest?: string }; reset: () => void }) {
  const copy = getCopy(lang).errorPage;

  useEffect(() => {
    console.error("[error-boundary]", error.digest ?? error.message);
  }, [error]);

  // A page that threw in its metadata leaves the tab without a title (web audit I-4); one that did not keeps its own.
  // The title set here follows a language change (share links render once in Lithuanian, then in the browser's language).
  const ownTitle = useRef<string | null>(null);
  useEffect(() => {
    if (!document.title || document.title === ownTitle.current) {
      document.title = `${copy.title} · Gloumi`;
      ownTitle.current = document.title;
    }
  }, [copy.title]);

  return (
    <SystemPage
      lang={lang}
      eyebrow={copy.eyebrow}
      title={copy.title}
      text={copy.text}
      actions={
        <>
          <Button type="button" onClick={reset}>
            {copy.retry}
          </Button>
          <ButtonLink href={homePath(lang)} variant="outline">
            {copy.home}
          </ButtonLink>
          <p className="w-full text-sm text-espresso-500">
            {/* Someone stuck on a broken page is a client: support@ (developer T-69, 2026-10-22). */}
            <a href={`mailto:${site.supportEmail}`} className="font-medium text-terracotta-600 hover:underline">
              {site.supportEmail}
            </a>
            {error.digest ? <span className="ml-2 font-mono text-xs text-espresso-400">#{error.digest}</span> : null}
          </p>
        </>
      }
    />
  );
}
