"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { cancelReset, readFragment } from "../edge";

/*
 * The token from the link (`#t=…`), read once and kept; the address is
 * cleared straight away. `""` – the link carries none.
 */
let fromLink: string | null = null;
const readLink = () => (fromLink ??= readFragment("t").slice(0, 200));
const subscribe = () => () => {};

const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

/**
 * No Turnstile on purpose: an owner who did not ask for the change must be
 * able to stop it in one press, and the Edge function answers the same to
 * every token, valid or not, behind an IP limit.
 */
export function CancelReset({ copy }: { copy: Copy["mfaHelp"] }) {
  // On the server (and before hydration) the token is unknown: `null` shows the button, disabled.
  const token = useSyncExternalStore<string | null>(subscribe, readLink, () => null);
  const [state, setState] = useState<"idle" | "pending" | "done" | "limited" | "unavailable">("idle");

  const cancel = async () => {
    if (!token) return;
    setState("pending");
    setState(await cancelReset(token));
  };

  if (state === "done") {
    return (
      <>
        <h1 className={heading}>{copy.cancelDoneTitle}</h1>
        <p className={lead}>{copy.cancelDoneText}</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-espresso-500">{copy.support}</p>
      </>
    );
  }

  if (token === "") {
    return (
      <>
        <h1 className={heading}>{copy.cancelTitle}</h1>
        <p className={lead}>{copy.cancelMissing}</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-espresso-500">{copy.support}</p>
      </>
    );
  }

  return (
    <>
      <h1 className={heading}>{copy.cancelTitle}</h1>
      <p className={lead}>{copy.cancelText}</p>
      <Button type="button" size="lg" className="mt-8" disabled={state === "pending" || token === null} onClick={cancel}>
        {state === "pending" ? copy.cancelling : copy.cancel}
      </Button>
      {state === "limited" || state === "unavailable" ? (
        <p role="alert" className="mx-auto mt-4 max-w-md text-sm font-medium text-terracotta-700">
          {state === "limited" ? copy.tooMany : copy.unavailable}
        </p>
      ) : null}
      <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-espresso-500">{copy.support}</p>
    </>
  );
}
