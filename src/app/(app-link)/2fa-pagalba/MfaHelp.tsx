"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TURNSTILE_SITE_KEY, Turnstile, type TurnstileHandle } from "@/components/Turnstile";
import type { Copy } from "@/content/copy";
import type { Lang } from "@/content/lang";
import { confirmReset, readFragment, type ConfirmOutcome } from "./edge";

type Props = { copy: Copy["mfaHelp"]; lang: Lang };

/*
 * Kodas iš laiško nuorodos (`#k=…`), perskaitytas vieną kartą ir išsaugotas:
 * adresas išvalomas iškart, o vėlesnis atvaizdavimas jo neturi prarasti.
 */
let fromLink: string | null = null;
const readLink = () => (fromLink ??= normalise(readFragment("k")));
const subscribe = () => () => {};

/** 8 simboliai, didžiosiomis, be tarpų ir brūkšnelių – kaip nukopijuoja žmogus. */
function normalise(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

const field =
  "mt-2 block h-12 w-full rounded-2xl bg-white px-4 text-base text-espresso-900 ring-1 ring-espresso-900/10 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500";
const heading = "mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl";
const lead = "mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty";

function formatReadyAt(iso: string, lang: Lang): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  // Ne `dateStyle`/`timeStyle`: su `timeZoneName` jų derinti negalima (TypeError).
  try {
    return new Intl.DateTimeFormat(lang === "lt" ? "lt-LT" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Vilnius",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return null;
  }
}

/**
 * Savininko patvirtinimas (procedūros C žingsnis): kodas iš laiško ir, jei
 * prisimena, slaptažodis. Abu keliauja tik naršyklė -> Edge; puslapis jų
 * niekur nerašo, o slaptažodis po kiekvieno siuntimo išvalomas.
 */
export function MfaHelp({ copy, lang }: Props) {
  const linkCode = useSyncExternalStore<string | null>(subscribe, readLink, () => null);
  const [typed, setTyped] = useState<string | null>(null);
  const code = typed ?? linkCode ?? "";
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<ConfirmOutcome | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const waitingForCaptcha = TURNSTILE_SITE_KEY !== null && !captcha;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending || waitingForCaptcha) return;
    if (code.length !== 8) {
      setOutcome({ kind: "invalid" });
      codeRef.current?.focus();
      return;
    }
    setPending(true);
    const result = await confirmReset(code, password, captcha);
    setPending(false);
    setPassword("");
    // Žetonas vienkartinis: kitam bandymui valdiklis išduoda naują.
    if (TURNSTILE_SITE_KEY) turnstile.current?.reset();
    setOutcome(result);
    if (result.kind === "password") passwordRef.current?.focus();
    else if (result.kind === "invalid") codeRef.current?.focus();
  };

  if (outcome?.kind === "confirmed") {
    const when = outcome.readyAt ? formatReadyAt(outcome.readyAt, lang) : null;
    return (
      <div className="text-center">
        <h1 className={heading}>{copy.doneTitle}</h1>
        <p className={lead}>{when ? copy.doneText.replace("{date}", when) : copy.doneTextNoDate}</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-espresso-500">{copy.support}</p>
      </div>
    );
  }

  const message =
    outcome === null
      ? null
      : outcome.kind === "password"
        ? copy.passwordWrong.replace("{n}", String(outcome.left))
        : outcome.kind === "invalid"
          ? copy.codeInvalid
          : outcome.kind === "captcha"
            ? copy.captchaFailed
            : outcome.kind === "limited"
              ? copy.tooMany
              : outcome.kind === "down"
                ? copy.down
                : copy.unavailable;
  const errorId = "mfa-help-error";
  const codeBad = outcome?.kind === "invalid";
  const passwordBad = outcome?.kind === "password";

  return (
    <div className="mx-auto max-w-md">
      <h1 className={`${heading} text-center`}>{copy.title}</h1>
      <p className={`${lead} text-center`}>{copy.text}</p>
      <form onSubmit={submit} className="mt-8 space-y-4 text-left" noValidate>
        <label className="block">
          <span className="text-sm font-semibold text-espresso-900">{copy.code}</span>
          <input
            ref={codeRef}
            type="text"
            name="code"
            inputMode="text"
            autoComplete="one-time-code"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={12}
            required
            value={code}
            onChange={(e) => setTyped(normalise(e.target.value))}
            aria-invalid={codeBad || undefined}
            aria-describedby={codeBad ? errorId : undefined}
            className={`${field} text-center font-mono tracking-[0.3em]`}
          />
        </label>
        <div>
          <label className="block">
            <span className="text-sm font-semibold text-espresso-900">{copy.password}</span>
            <input
              ref={passwordRef}
              type={visible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              maxLength={200}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={passwordBad || undefined}
              aria-describedby={passwordBad ? `${errorId} mfa-help-password-hint` : "mfa-help-password-hint"}
              className={field}
            />
          </label>
          <div className="mt-2 flex items-start justify-between gap-4">
            <p id="mfa-help-password-hint" className="text-sm leading-relaxed text-espresso-500">
              {copy.passwordHint}
            </p>
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-pressed={visible}
              className="shrink-0 text-sm font-medium text-terracotta-600 hover:underline"
            >
              {visible ? copy.hide : copy.show}
            </button>
          </div>
        </div>
        {TURNSTILE_SITE_KEY ? (
          <Turnstile ref={turnstile} siteKey={TURNSTILE_SITE_KEY} action="mfa-reset-confirm" onToken={setCaptcha} />
        ) : null}
        {message ? (
          <p id={errorId} role="alert" className="text-sm font-medium text-terracotta-700">
            {message}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending || waitingForCaptcha}>
          {pending ? copy.submitting : copy.submit}
        </Button>
        {waitingForCaptcha ? <p className="text-center text-sm text-espresso-500">{copy.captchaWait}</p> : null}
      </form>
      <p className="mt-8 text-center text-sm leading-relaxed text-espresso-500">{copy.support}</p>
    </div>
  );
}
