"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { APP_SCHEME } from "../codes";
import { confirmEmail, type ConfirmResult } from "./actions";

type Props = { copy: Copy["emailConfirm"] };

/*
 * The token is read in the browser only, and only from after `#` (security):
 * a fragment never reaches a server, so no log holds it. The db template has
 * put it there since 01fd1c03; a token in the query is ignored. Read once and
 * kept: the address is cleared right after, and a later render must not lose
 * it. `""` – the link carries no token.
 */
let read: string | null = null;

/*
 * Token and kind together, as one string (`useSyncExternalStore` compares by
 * value): "<kind>|<token>". The kind is the link's `type` (db
 * `office/db-email-links`): "email" (sign-up, also when the link has none),
 * "email_change", "magiclink"; anything else is "unknown", shown as an
 * expired link. The server checks the kind again against its own list.
 */
function readLink(): string {
  if (read === null) {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const type = hash.get("type") ?? "email";
    const kind = type === "email" || type === "email_change" || type === "magiclink" ? type : "unknown";
    read = `${kind}|${hash.get("token_hash") ?? ""}`;
  }
  return read;
}

const subscribe = () => () => {};

export function ConfirmEmail({ copy }: Props) {
  // On the server (and before hydration) the link is unknown: `null` shows the button, disabled.
  const link = useSyncExternalStore<string | null>(subscribe, readLink, () => null);
  const kind = link === null ? "email" : link.slice(0, link.indexOf("|"));
  const tokenHash = link === null ? null : link.slice(link.indexOf("|") + 1);
  const change = kind === "email_change";
  const [result, setResult] = useState<ConfirmResult | null>(null);
  const [pending, startTransition] = useTransition();

  // Keep the token out of the browser history and out of any referrer.
  useEffect(() => {
    if (window.location.search || window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const confirm = () =>
    startTransition(async () => {
      setResult(await confirmEmail(tokenHash, kind));
    });

  const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
  const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

  // A magic link signs in, and there is nothing to sign in to on the site: it is never verified here.
  if (kind === "magiclink") {
    return (
      <>
        <h1 className={heading}>{copy.magicTitle}</h1>
        <p className={lead}>{copy.magicText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </>
    );
  }

  if (result === "confirmed" && change) {
    return (
      <>
        <h1 className={heading}>{copy.changeTitle}</h1>
        <p className={lead}>{copy.changeText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </>
    );
  }

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

  if (result === "expired" || tokenHash === "" || kind === "unknown") {
    return (
      <>
        <h1 className={heading}>{copy.errorTitle}</h1>
        <p className={lead}>{change ? copy.changeErrorText : copy.errorText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <h1 className={heading}>{change ? copy.changeAskTitle : copy.askTitle}</h1>
      <p className={lead}>{change ? copy.changeAskText : copy.askText}</p>
      <Button type="button" size="lg" className="mt-8" disabled={pending || tokenHash === null} onClick={confirm}>
        {pending ? copy.confirming : change ? copy.changeConfirm : copy.confirm}
      </Button>
      {result === "failed" ? (
        <p role="alert" className="mx-auto mt-4 max-w-md text-sm font-medium text-terracotta-700">
          {copy.failed}
        </p>
      ) : null}
    </>
  );
}
