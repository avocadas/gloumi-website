"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { APP_SCHEME } from "../../codes";

type Props = { copy: Copy["emailConfirm"] };

/** Supabase's PKCE code: letters, digits and dashes (a uuid today). Anything else is not forwarded. */
const CODE = /^[A-Za-z0-9-]{8,128}$/;

/*
 * What the address carries, read only in the browser: on success GoTrue adds
 * `?code=` (PKCE), on failure `error`, `error_code`, `error_description` –
 * in the query or, for older flows, after `#`. The server render cannot see
 * the fragment, so it shows the success text and the browser corrects it.
 * One string, so `useSyncExternalStore` compares it by value. Read once and
 * kept: the address is cleared right after, and a later render must not lose
 * the code.
 */
let read: string | null = null;

function readAddress(): string {
  if (read === null) read = parseAddress();
  return read;
}

function parseAddress(): string {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  if (params.get("error") || params.get("error_code") || hash.get("error") || hash.get("error_code")) return "error";
  const code = params.get("code");
  return code && CODE.test(code) ? `code:${code}` : "ok";
}

const subscribe = () => () => {};

export function EmailConfirmed({ copy }: Props) {
  const state = useSyncExternalStore(subscribe, readAddress, () => "ok");
  const code = state.startsWith("code:") ? state.slice(5) : null;

  // The code stays out of the browser history once read: the button carries it, the address no longer does.
  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  if (state === "error") {
    return (
      <>
        <h1 className="mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl">
          {copy.errorTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty">{copy.errorText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <h1 className="mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty">{copy.text}</p>
      {/* On the phone that asked for the email the app holds the PKCE verifier and signs in with this code; elsewhere the code opens nothing. */}
      <ButtonLink
        href={code ? `${APP_SCHEME}://auth-callback?code=${encodeURIComponent(code)}` : `${APP_SCHEME}://`}
        size="lg"
        className="mt-8"
      >
        {copy.open}
      </ButtonLink>
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-espresso-500 text-pretty">{copy.otherDevice}</p>
    </>
  );
}
