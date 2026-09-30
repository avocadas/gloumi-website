"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { finishAdminLogin, startAdminLogin } from "./actions";

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
 * WHY THIS FORM NO LONGER TALKS TO SUPABASE
 * -----------------------------------------
 * Until 20260930210151 the browser signed in by itself. That left the
 * password open to guessing from anywhere, because Supabase Auth accepts it
 * directly with the public anon key, and the admin address pattern was in
 * this public repository. Now an admin's address is random and known only to
 * the server, which counts and locks every attempt: see `./actions.ts`. This
 * form only collects the name, the password and the code.
 *
 * WHY THREE STEPS RATHER THAN ONE FORM
 * ------------------------------------
 * Supabase raises a session to `aal2` through a challenge/verify pair that
 * only exists after the password step, and enrolment can only happen once
 * there is a session to attach the factor to. They cannot be submitted
 * together; pretending otherwise would be a form that fails on first use.
 * The password is kept in this component's memory between the steps and
 * sent again with the code, so the password-only session never has to reach
 * the browser.
 *
 * WHY A NAME AND NOT AN E-MAIL
 * ----------------------------
 * Since 20260930165140 an admin is not an app account (#105): it has no
 * profile, and it signs in as `admin.ieva`. Since 20260930210151 the address
 * underneath is random and nobody types it, not even the admin.
 */
type Step = "password" | "enroll" | "code";

const ADMIN_USERNAME = /^admin\.[a-z0-9._]{2,24}$/;

// Tik portalo vidaus kelias. Be šios patikros `?next=https://kitas.lt`
// nukreiptų žmogų į svetimą svetainę tą akimirką, kai jis ką tik prisijungė
// ir labiausiai pasitiki tuo, ką mato.
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/admin") || raw.startsWith("//")) return "/admin";
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [step, setStep] = useState<Step>("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOver = () => {
    setStep("password");
    setPassword("");
    setCode("");
    setFactorId(null);
    setQr(null);
    setSecret(null);
    setError(null);
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Slaptažodžių tvarkyklė gali įrašyti visą adresą — tada domeną nuimame, o
    // ne atmetame žmogų, kuris įvedė teisingą dalyką. Serveris tą patį daro
    // dar kartą; čia tik tam, kad aiški klaida nereikalautų kelionės iki jo.
    const name = username.trim().toLowerCase().replace(/@gloumi\.lt$/, "");
    if (!ADMIN_USERNAME.test(name)) {
      setError("Įveskite administratoriaus vardą, pvz. admin.ieva.");
      return;
    }

    setBusy(true);
    const result = await startAdminLogin(name, password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setUsername(name);
    if (result.next === "code") {
      setFactorId(null);
      setStep("code");
      return;
    }
    setFactorId(result.factorId);
    setQr(result.qr);
    setSecret(result.secret);
    setStep("enroll");
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const result = await finishAdminLogin(username, password, code, factorId);
    if (!result.ok) {
      setBusy(false);
      setCode("");
      setError(result.error);
      return;
    }

    // `busy` lieka įjungtas: perėjimas į skydelį užtrunka, o antras paspaudimas
    // tuo metu būtų dar vienas bandymas su jau panaudotu kodu.
    setPassword("");
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
        maxLength={6}
        placeholder="000000"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-center text-lg tracking-[0.4em]"
      />
      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="w-full rounded-full bg-espresso-900 px-4 py-3 text-sm font-semibold text-cream-50 disabled:opacity-50"
      >
        Patvirtinti
      </button>
      <button
        type="button"
        onClick={startOver}
        disabled={busy}
        className="w-full text-center text-xs font-semibold text-espresso-500 disabled:opacity-50"
      >
        Pradėti iš naujo
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
            type="text"
            required
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Administratorius (admin.vardas)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
