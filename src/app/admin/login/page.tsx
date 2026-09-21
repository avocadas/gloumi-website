"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Admin sign-in: password, then the second factor.
 *
 * WHY THE BROWSER SIGNS IN AND NOT A SERVER ACTION
 * ------------------------------------------------
 * The session has to end up in cookies the middleware can read and refresh.
 * `createBrowserClient` writes exactly those. Doing it in a server action
 * would mean handling the password on our side for no gain — the browser
 * talks to Supabase directly, and the password never touches this app's
 * server at all.
 *
 * WHY TWO STEPS RATHER THAN ONE FORM
 * ----------------------------------
 * Supabase raises a session to `aal2` through a challenge/verify pair that
 * only exists after the password step. They cannot be submitted together;
 * pretending otherwise would just mean a form that fails on first use.
 */
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      setError(signInError.message);
      return;
    }

    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    if (!totp) {
      /*
       * Signed in, but nothing to raise the session with. We stop here rather
       * than continuing: letting them through would mean the portal's own
       * rule is decorative. The page they land on says the same thing.
       */
      setBusy(false);
      router.replace(next);
      return;
    }
    setFactorId(totp.id);
    setBusy(false);
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setError(null);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError || !challenge) {
      setBusy(false);
      setError(challengeError?.message ?? "Nepavyko pradėti patvirtinimo.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    if (verifyError) {
      setBusy(false);
      setError(verifyError.message);
      return;
    }

    router.replace(next);
    router.refresh();
  };

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">Gloumi</p>
      <h1 className="mt-1 font-serif text-3xl text-espresso-900">Administravimas</h1>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-terracotta-500">
          {error}
        </p>
      ) : null}

      {factorId === null ? (
        <form onSubmit={submitPassword} className="mt-6 space-y-3">
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="El. paštas"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-sm"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Slaptažodis"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-espresso-900 px-4 py-3 text-sm font-semibold text-cream-50 disabled:opacity-50"
          >
            Toliau
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="mt-6 space-y-3">
          <p className="text-sm text-espresso-600">
            Įveskite kodą iš autentifikatoriaus.
          </p>
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-center text-lg tracking-[0.4em]"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-espresso-900 px-4 py-3 text-sm font-semibold text-cream-50 disabled:opacity-50"
          >
            Patvirtinti
          </button>
        </form>
      )}
    </main>
  );
}

export default function AdminLoginPage() {
  // `useSearchParams` reikalauja Suspense ribos, kitaip `next build` visą
  // puslapį išveda į kliento pusę su įspėjimu.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
