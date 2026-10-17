"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Copy } from "@/content/copy";
import { APP_SCHEME } from "../../codes";
import { finishReset, resetPassword, type ResetAnswer } from "./actions";
import { isStrongPassword } from "./password";

type Props = { copy: Copy["passwordReset"] };

/*
 * The token is read in the browser only, and only from after `#` (security):
 * a fragment never reaches a server, so no log holds it. Read once and kept,
 * because the address is cleared right after.
 */
let read: string | null = null;

/*
 * Token and kind as one string, "<kind>|<token>": "recovery" (also when the
 * link has no type) or "invite" (db `office/db-email-links`); anything else
 * is "unknown", shown as an expired link. The server checks the kind again.
 */
function readLink(): string {
  if (read === null) {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const type = hash.get("type") ?? "recovery";
    const kind = type === "recovery" || type === "invite" ? type : "unknown";
    read = `${kind}|${hash.get("token_hash") ?? ""}`;
  }
  return read;
}

const subscribe = () => () => {};

const field =
  "mt-2 block h-12 w-full rounded-2xl bg-white px-4 text-base text-espresso-900 ring-1 ring-espresso-900/10 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500";

export function ResetPassword({ copy }: Props) {
  const link = useSyncExternalStore<string | null>(subscribe, readLink, () => null);
  const kind = link === null ? "recovery" : link.slice(0, link.indexOf("|"));
  const tokenHash = link === null ? null : link.slice(link.indexOf("|") + 1);
  const invite = kind === "invite";
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [code, setCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // After the first POST: the sealed step (opaque to the browser) and whether a TOTP code is needed.
  const [step, setStep] = useState<string | null>(null);
  const [needCode, setNeedCode] = useState(false);
  const [state, setState] = useState<"form" | "done" | "expired">("form");
  const [pending, startTransition] = useTransition();

  // Keep the token out of the browser history and out of any referrer.
  useEffect(() => {
    if (window.location.search || window.location.hash) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
  const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

  const handle = (answer: ResetAnswer) => {
    if (answer.step) setStep(answer.step);
    switch (answer.result) {
      case "done":
        setPassword("");
        setRepeat("");
        setCode("");
        setState("done");
        return;
      case "expired":
        setState("expired");
        return;
      case "need_code":
        setNeedCode(true);
        setProblem(null);
        return;
      case "bad_code":
        setCode("");
        setProblem(copy.badCode);
        return;
      case "pwned":
        setProblem(copy.pwned);
        return;
      case "same":
        setProblem(copy.same);
        return;
      case "weak":
        setProblem(copy.weak);
        return;
      default:
        setProblem(copy.failed);
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setProblem(null);
    // bcrypt counts bytes (72), not letters: ą, č, ę take two each.
    if (new TextEncoder().encode(password).length > 72) return setProblem(copy.tooLong);
    if (!isStrongPassword(password)) return setProblem(copy.weak);
    if (password !== repeat) return setProblem(copy.mismatch);
    if (needCode && !/^\d{6}$/.test(code)) return setProblem(copy.badCode);
    startTransition(async () => {
      handle(step ? await finishReset(step, password, needCode ? code : null) : await resetPassword(tokenHash, password, kind));
    });
  };

  if (state === "done") {
    return (
      <div className="text-center">
        <h1 className={heading}>{invite ? copy.inviteDoneTitle : copy.doneTitle}</h1>
        <p className={lead}>{copy.doneText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </div>
    );
  }

  if (state === "expired" || tokenHash === "" || kind === "unknown") {
    return (
      <div className="text-center">
        <h1 className={heading}>{copy.errorTitle}</h1>
        <p className={lead}>{invite ? copy.inviteErrorText : copy.errorText}</p>
        <ButtonLink href={`${APP_SCHEME}://`} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className={`${heading} text-center`}>{invite ? copy.inviteTitle : copy.title}</h1>
      <p className={`${lead} text-center`}>{needCode ? copy.codeText : invite ? copy.inviteText : copy.text}</p>
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
        {needCode ? (
          <label className="block">
            <span className="text-sm font-semibold text-espresso-900">{copy.code}</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className={`${field} text-center tabular-nums tracking-[0.4em]`}
            />
          </label>
        ) : null}
        {problem ? (
          <p role="alert" className="text-sm font-medium text-terracotta-700">
            {problem}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending || tokenHash === null}>
          {pending ? copy.submitting : invite ? copy.inviteSubmit : copy.submit}
        </Button>
      </form>
    </div>
  );
}
