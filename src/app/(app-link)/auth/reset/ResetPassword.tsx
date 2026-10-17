"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { APP_SCHEME } from "../../codes";
import { resetPassword, type ResetResult } from "./actions";
import { isStrongPassword } from "./password";

type Props = { copy: Copy["passwordReset"] };

/*
 * The token is read in the browser only, from after `#` (never sent to a
 * server, so no log holds it) or, for an older template, from the query.
 * Read once and kept: the address is cleared right after.
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

const field =
  "mt-2 block h-12 w-full rounded-2xl bg-white px-4 text-base text-espresso-900 ring-1 ring-espresso-900/10 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500";

export function ResetPassword({ copy }: Props) {
  const tokenHash = useSyncExternalStore<string | null>(subscribe, readToken, () => null);
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [visible, setVisible] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [result, setResult] = useState<ResetResult | null>(null);
  const [pending, startTransition] = useTransition();

  // Keep the token out of the browser history and out of any referrer.
  useEffect(() => {
    if (window.location.search || window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
  const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setProblem(null);
    if (!isStrongPassword(password)) return setProblem(copy.weak);
    if (password !== repeat) return setProblem(copy.mismatch);
    startTransition(async () => {
      const res = await resetPassword(tokenHash, password);
      setPassword("");
      setRepeat("");
      if (res === "weak" || res === "same") {
        // GoTrue refused it after the link was verified: the link is used up now.
        setProblem(`${res === "weak" ? copy.weak : copy.same} ${copy.usedNote}`);
        setResult("expired");
        return;
      }
      if (res === "failed") return setProblem(copy.failed);
      setResult(res);
    });
  };

  if (result === "done") {
    return (
      <div className="text-center">
        <h1 className={heading}>{copy.doneTitle}</h1>
        <p className={lead}>{copy.doneText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </div>
    );
  }

  if (result === "expired" || tokenHash === "") {
    return (
      <div className="text-center">
        <h1 className={heading}>{copy.errorTitle}</h1>
        <p className={lead}>{problem ?? copy.errorText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className={`${heading} text-center`}>{copy.title}</h1>
      <p className={`${lead} text-center`}>{copy.text}</p>
      <form onSubmit={submit} className="mt-8 space-y-4 text-left">
        <label className="block">
          <span className="text-sm font-semibold text-espresso-900">{copy.password}</span>
          <input
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            required
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-espresso-900">{copy.repeat}</span>
          <input
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            required
            maxLength={72}
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className={field}
          />
        </label>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm leading-relaxed text-espresso-500">{copy.rules}</p>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="shrink-0 text-sm font-medium text-terracotta-600 hover:underline"
          >
            {visible ? copy.hide : copy.show}
          </button>
        </div>
        {problem ? (
          <p role="alert" className="text-sm font-medium text-terracotta-700">
            {problem}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending || tokenHash === null}>
          {pending ? copy.submitting : copy.submit}
        </Button>
      </form>
    </div>
  );
}
