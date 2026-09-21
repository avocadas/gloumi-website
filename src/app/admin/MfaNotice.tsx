/**
 * Shown to a real admin whose session has not been raised to `aal2`.
 *
 * WHY THIS IS NOT A 404
 * ---------------------
 * A 404 is the right answer to someone who should not know the portal exists.
 * This person is on the list and did sign in — telling them "no such page"
 * would send them hunting for a broken link instead of opening their
 * authenticator. The distinction only ever reaches someone already
 * authenticated, so it leaks nothing to a visitor.
 *
 * WHY THERE IS NO "ENROL NOW" BUTTON HERE
 * ---------------------------------------
 * Enrolling a second factor means scanning a QR code and storing recovery
 * codes somewhere safe. That is a deliberate, unhurried act, not something to
 * rush through a gate that is currently blocking you. The app is where the
 * account lives, and that is where it belongs.
 */
export function MfaNotice() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">Gloumi</p>
      <h1 className="mt-1 font-serif text-3xl text-espresso-900">Reikalingas antras veiksnys</h1>
      <p className="mt-4 text-sm leading-relaxed text-espresso-600">
        Jūsų paskyra yra administratorių sąraše, bet šis seansas patvirtintas tik slaptažodžiu.
        Administravimo skydelis atsidaro tik patvirtinus antru veiksniu.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-espresso-600">
        Įjunkite jį savo paskyroje ir prisijunkite iš naujo, patvirtindami kodu iš
        autentifikatoriaus.
      </p>
    </main>
  );
}
