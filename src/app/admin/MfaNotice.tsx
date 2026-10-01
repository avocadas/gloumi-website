import { ArrowRight } from "lucide-react";
import { signOutAdmin } from "./sign-out";
import { AuthShell, Brand, STROKE, btn, btnQuiet } from "./ui";

/**
 * Shown to a real admin whose session has not been raised to `aal2`.
 *
 * WHY THIS IS NOT A 404
 * ---------------------
 * A 404 is the right answer to someone who should not know the portal exists.
 * This person is on the list and did sign in — telling them "no such page"
 * would send them hunting for a broken link instead of finishing the sign-in.
 * The distinction only ever reaches someone already authenticated, so it leaks
 * nothing to a visitor.
 *
 * WHEN THIS ACTUALLY APPEARS
 * --------------------------
 * Rarely, and that is deliberate. Enrolling and confirming the second factor
 * both happen in the sign-in form, so the normal path never lands here. What
 * reaches this page is the leftover case: a session that was raised to `aal2`
 * once, expired down to `aal1`, and came back — for example an old cookie on a
 * second device. The answer is the same in every such case, which is why the
 * page has one button and no explanation of factors.
 */
/*
 * `expired` — sesija senesnė nei 12 val. nuo kodo įvedimo (`admin-guard.ts`).
 * Atsakymas tas pats, tik žodžiai kiti: žmogus kodą įvedė, ir sakyti, kad
 * seansas „patvirtintas tik slaptažodžiu", būtų netiesa.
 */
export function MfaNotice({ reason }: { reason: "mfa-required" | "expired" }) {
  const expired = reason === "expired";
  return (
    <AuthShell>
      <Brand />
      <h1 className="mt-6 font-app-serif text-[26px] leading-tight text-app-ink">
        {expired ? "Sesija baigėsi" : "Reikalingas antras veiksnys"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-app-body">
        {expired
          ? "Administravimo skydelis po prisijungimo atviras 12 valandų. Prisijunkite iš naujo slaptažodžiu ir kodu iš autentifikatoriaus."
          : "Jūsų paskyra yra administratorių sąraše, bet šis seansas patvirtintas tik slaptažodžiu. Administravimo skydelis atsidaro tik patvirtinus kodu iš autentifikatoriaus."}
      </p>
      <a href="/admin/login" className={`${btn} mt-6 h-12 w-full`}>
        Prisijungti iš naujo
        <ArrowRight size={16} strokeWidth={STROKE} aria-hidden />
      </a>
      {/* Čia žmogus lieka su pasenusia ar vien slaptažodžio sesija — būtent
          tokią ir turi būti galima užbaigti, o ne tik perrašyti nauja. */}
      <form action={signOutAdmin} className="mt-2">
        <button type="submit" className={`${btnQuiet} w-full`}>
          Atsijungti
        </button>
      </form>
    </AuthShell>
  );
}
