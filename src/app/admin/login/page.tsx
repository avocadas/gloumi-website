"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Admin sign-in: password, then the second factor — enrolling it here if the
 * account does not have one yet.
 *
 * WHY ENROLMENT LIVES IN THIS FORM AND NOT IN THE APP
 * ---------------------------------------------------
 * The portal refuses anything below `aal2`. Measured 2026-09-21: none of the
 * three admins had a TOTP factor, and the mobile app has no MFA screen at all
 * — so as first written, this portal could not be entered by anybody. A gate
 * with no key is not security, it is a bug.
 *
 * It belongs here rather than in the app because the requirement is an
 * ADMIN one: three people need it, and every other user of Gloumi does not.
 * Shipping an MFA feature to a beauty-booking app for three accounts would be
 * a native release and a support surface for no one.
 *
 * WHY THE BROWSER SIGNS IN AND NOT A SERVER ACTION
 * ------------------------------------------------
 * The session has to end up in cookies the middleware can read and refresh.
 * `createBrowserClient` writes exactly those, and the password never touches
 * this app's server at all.
 *
 * WHY THREE STEPS RATHER THAN ONE FORM
 * ------------------------------------
 * Supabase raises a session to `aal2` through a challenge/verify pair that
 * only exists after the password step, and enrolment can only happen once
 * there is a session to attach the factor to. They cannot be submitted
 * together; pretending otherwise would be a form that fails on first use.
 */
type Step = "password" | "enroll" | "code";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
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
    /*
     * `listFactors()` grąžina TIK patvirtintus. Nebaigtas įsijungimas (žmogus
     * nuskenavo kodą ir uždarė langą) lieka `unverified` ir čia nesimato, o
     * antras `enroll` su tuo pačiu vardu nulūžtų. Todėl vardas kaskart
     * naujas — nebaigti veiksniai nieko nekainuoja ir nieko neatrakina.
     */
    const totp = factors?.totp?.[0];
    if (totp) {
      setFactorId(totp.id);
      setStep("code");
      setBusy(false);
      return;
    }

    const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Gloumi admin ${new Date().toISOString().slice(0, 16)}`,
    });
    if (enrollError || !enrolled) {
      setBusy(false);
      setError(enrollError?.message ?? "Nepavyko pradėti antro veiksnio įjungimo.");
      return;
    }

    setFactorId(enrolled.id);
    setQr(enrolled.totp.qr_code);
    setSecret(enrolled.totp.secret);
    setStep("enroll");
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

  const codeForm = (
    <form onSubmit={submitCode} className="mt-6 space-y-3">
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
  );

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">Gloumi</p>
      <h1 className="mt-1 font-serif text-3xl text-espresso-900">Administravimas</h1>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-terracotta-500">
          {error}
        </p>
      ) : null}

      {step === "password" ? (
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
      ) : null}

      {step === "enroll" ? (
        <div className="mt-6">
          <p className="text-sm leading-relaxed text-espresso-600">
            Ši paskyra dar neturi antro veiksnio. Nuskenuokite kodą
            autentifikatoriumi (Google Authenticator, 1Password, Bitwarden) ir įveskite
            šešiaženklį skaičių.
          </p>
          {qr ? (
            <Image
              src={qr}
              alt="QR kodas antram veiksniui"
              width={200}
              height={200}
              unoptimized
              className="mx-auto mt-4 h-50 w-50 rounded-xl border border-sand-300 bg-white p-2"
            />
          ) : null}
          {secret ? (
            <p className="mt-3 break-all text-center text-xs text-espresso-500">
              Jei skeneris neveikia, įveskite ranka: <code>{secret}</code>
            </p>
          ) : null}
          {codeForm}
        </div>
      ) : null}

      {step === "code" ? (
        <div className="mt-6">
          <p className="text-sm text-espresso-600">Įveskite kodą iš autentifikatoriaus.</p>
          {codeForm}
        </div>
      ) : null}
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
