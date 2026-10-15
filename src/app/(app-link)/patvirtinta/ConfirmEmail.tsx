"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { APP_SCHEME } from "../codes";
import { confirmEmail, type ConfirmResult } from "./actions";

type Props = { copy: Copy["emailConfirm"] };

/*
 * The token is read in the browser only, from after `#` (never sent to any
 * server, so no log holds it) or, for a template that puts it in the query,
 * from there. Read once and kept: the address is cleared right after, and a
 * later render must not lose it. `""` – the link carries no token.
 */
let token: string | null = null;

function readToken(): string {
  if (token === null) {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    token = hash.get("token_hash") ?? query.get("token_hash") ?? "";
  }
  return token;
}

const subscribe = () => () => {};

export function ConfirmEmail({ copy }: Props) {
  // On the server (and before hydration) the token is unknown: `null` shows the button, disabled.
  const tokenHash = useSyncExternalStore<string | null>(subscribe, readToken, () => null);
  const [result, setResult] = useState<ConfirmResult | null>(null);
  const [pending, startTransition] = useTransition();

  // Keep the token out of the browser history and out of any referrer.
  useEffect(() => {
    if (window.location.search || window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const confirm = () =>
    startTransition(async () => {
      setResult(await confirmEmail(tokenHash));
    });

  const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
  const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

  if (result === "confirmed") {
    return (
      <>
        <h1 className={heading}>{copy.title}</h1>
        <p className={lead}>{copy.text}</p>
        {/* A button, not a redirect: on a computer the app link would end on a blank page. */}
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-espresso-500 text-pretty">{copy.otherDevice}</p>
      </>
    );
  }

  if (result === "expired" || tokenHash === "") {
    return (
      <>
        <h1 className={heading}>{copy.errorTitle}</h1>
        <p className={lead}>{copy.errorText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <h1 className={heading}>{copy.askTitle}</h1>
      <p className={lead}>{copy.askText}</p>
      <Button type="button" size="lg" className="mt-8" disabled={pending || tokenHash === null} onClick={confirm}>
        {pending ? copy.confirming : copy.confirm}
      </Button>
      {result === "failed" ? (
        <p role="alert" className="mx-auto mt-4 max-w-md text-sm font-medium text-terracotta-700">
          {copy.failed}
        </p>
      ) : null}
    </>
  );
}
