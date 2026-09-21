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
export function MfaNotice() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">Gloumi</p>
      <h1 className="mt-1 font-serif text-3xl text-espresso-900">Reikalingas antras veiksnys</h1>
      <p className="mt-4 text-sm leading-relaxed text-espresso-600">
        Jūsų paskyra yra administratorių sąraše, bet šis seansas patvirtintas tik slaptažodžiu.
        Administravimo skydelis atsidaro tik patvirtinus kodu iš autentifikatoriaus.
      </p>
      <a
        href="/admin/login"
        className="mt-6 inline-block rounded-full bg-espresso-900 px-5 py-3 text-center text-sm font-semibold text-cream-50"
      >
        Prisijungti iš naujo
      </a>
    </main>
  );
}
