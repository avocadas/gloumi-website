import type { CookieOptionsWithName } from '@supabase/ssr';

/**
 * Sesijos slapukų nustatymai abiem serverio Supabase klientams: middleware'o
 * (`src/middleware.ts`) ir Server Components (`./server.ts`).
 *
 * KODĖL `httpOnly`
 * ----------------
 * `@supabase/ssr` pagal nutylėjimą slapukus rašo su `httpOnly: false`, nes jo
 * naršyklės klientas turi juos skaityti. Šioje svetainėje naršyklės kliento
 * nėra: prisijungimas, atsijungimas ir visi portalo veiksmai vyksta serveryje.
 * Paliktas skaitomas skriptui, `aal2` administratoriaus slapukas būtų pirmas
 * dalykas, kurį pasiimtų bet kokia XSS bet kuriame `gloumi.lt` puslapyje
 * (slapuko kelias `/`). SECURITY_AUDIT.md L-9 (avocadas/Gloumi).
 *
 * KODĖL `secure` TIK PRODUKCIJOJE
 * -------------------------------
 * Vercel'yje (ir Preview) `NODE_ENV` yra `production`, ten slapukas eina tik
 * per HTTPS. `next dev` veikia per `http://localhost`, ir ten `Secure` slapuką
 * ne kiekviena naršyklė priimtų — vietinis portalas tiesiog neprisijungtų.
 *
 * Gyvavimo laikas paliktas bibliotekos: 12 valandų riba tikrinama serveryje
 * (`src/lib/admin-guard.ts`), ir `maxAge` ją tik dubliuotų.
 */
export const SESSION_COOKIE_OPTIONS: CookieOptionsWithName = {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};
