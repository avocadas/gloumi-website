"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconAlert } from "@/components/icons";
import { TURNSTILE_SITE_KEY, Turnstile, type TurnstileHandle } from "@/components/Turnstile";
import { ADMIN_MAX_PASSWORD_CHARS, ADMIN_MIN_PASSWORD_CHARS, isStrongAdminPassword, passwordChars } from "@/lib/password-rule";
import { STROKE, btnPrimary, card, input } from "../ui";
import { changeAdminPassword } from "./actions";

/*
 * Keturi laukai vienoje formoje: dabartinis slaptažodis, kodas iš
 * autentifikatoriaus ir naujas du kartus. Naršyklė tikrina tik tai, ką galima
 * pasakyti iškart (sutampa, ilgis); visa kita – serveris ir GoTrue. Po
 * kiekvieno bandymo kodas ir CAPTCHA žetonas išvalomi: abu vienkartiniai.
 * Pavykus visos sesijos atjungtos – žmogus nukreipiamas prisijungti iš naujo.
 */
export function PasswordForm() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [code, setCode] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstile = useRef<TurnstileHandle>(null);
  const waitingForCaptcha = TURNSTILE_SITE_KEY !== null && !captchaToken;

  const takeCaptcha = () => {
    const token = captchaToken ?? undefined;
    if (TURNSTILE_SITE_KEY) {
      setCaptchaToken(null);
      turnstile.current?.reset();
    }
    return token;
  };

  const lengthHint = `Nuo ${ADMIN_MIN_PASSWORD_CHARS} iki ${ADMIN_MAX_PASSWORD_CHARS} simbolių: mažoji ir didžioji raidė, skaičius ir kitas ženklas; nutekėjusių slaptažodžių naudoti negalima.`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== repeat) return setError("Nauji slaptažodžiai nesutampa.");
    const chars = passwordChars(next);
    if (chars < ADMIN_MIN_PASSWORD_CHARS || chars > ADMIN_MAX_PASSWORD_CHARS) return setError(`Naujas slaptažodis: ${lengthHint}`);
    if (!isStrongAdminPassword(next)) {
      return setError("Naujame slaptažodyje turi būti mažoji ir didžioji raidė, skaičius, kitas ženklas ir bent 8 skirtingi simboliai.");
    }
    if (next === current) return setError("Naujas slaptažodis sutampa su dabartiniu.");

    setBusy(true);
    const result = await changeAdminPassword(current, code, next, repeat, takeCaptcha());
    setCode("");
    if (!result.ok) {
      setBusy(false);
      if (result.field === "current") setCurrent("");
      setError(result.error);
      return;
    }
    // `busy` lieka: sesija jau atšaukta, antras paspaudimas nieko nepakeistų.
    setCurrent("");
    setNext("");
    setRepeat("");
    router.replace(result.partial ? "/admin/login?changed=partial" : "/admin/login?changed=1");
    router.refresh();
  };

  const label = "text-[13px] font-semibold text-app-ink";

  return (
    <form onSubmit={submit} className={`${card} max-w-md space-y-4 px-5 py-5`}>
      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text"
        >
          <IconAlert size={18} strokeWidth={STROKE} aria-hidden className="mt-px shrink-0" />
          {error}
        </p>
      ) : null}

      <label className="block">
        <span className={label}>Dabartinis slaptažodis</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={`${input} mt-2`}
        />
      </label>

      <label className="block">
        <span className={label}>Kodas iš autentifikatoriaus</span>
        <input
          type="text"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className={`${input} mt-2 font-semibold tabular-nums tracking-[0.3em]`}
        />
      </label>

      <label className="block">
        <span className={label}>Naujas slaptažodis</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={`${input} mt-2`}
        />
        <span className="mt-1.5 block text-xs text-app-muted">{lengthHint}</span>
      </label>

      <label className="block">
        <span className={label}>Naujas slaptažodis dar kartą</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className={`${input} mt-2`}
        />
      </label>

      {TURNSTILE_SITE_KEY ? (
        <Turnstile ref={turnstile} siteKey={TURNSTILE_SITE_KEY} action="admin-password" onToken={setCaptchaToken} />
      ) : null}

      <button type="submit" disabled={busy || waitingForCaptcha || code.length !== 6} className={`${btnPrimary} h-12 w-full`}>
        {busy ? "Keičiama…" : "Pakeisti slaptažodį"}
      </button>

      <p className="text-xs leading-relaxed text-app-muted">
        Pakeitus atjungiami visi įrenginiai, ir reikės prisijungti iš naujo. Pamiršus slaptažodį, jį nustato kitas
        administratorius arba developeris Supabase skydelyje.
      </p>
    </form>
  );
}
