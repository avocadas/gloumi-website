/*
 * The project's password rule (Supabase Auth `password_requirements =
 * "lower_upper_letters_digits_symbols"`, `minimum_password_length = 8`,
 * db config.toml). Checked in the browser for a quick answer and again on
 * the server; GoTrue checks it a third time.
 */
export const MIN_PASSWORD = 8;

/** bcrypt's limit is 72 BYTES, not characters: Lithuanian letters take two each in UTF-8 (security). */
export const MAX_PASSWORD_BYTES = 72;

/*
 * An admin's new password: 16-200 characters (security 2026-10-20; the
 * developer wants passwords "iki 200"). Over 72 bytes it reaches GoTrue only
 * as a derived value (`lib/admin-auth.ts` `forGoTrue`); the rest is GoTrue's.
 */
export const ADMIN_MIN_PASSWORD_CHARS = 16;
export const ADMIN_MAX_PASSWORD_CHARS = 200;

/** Characters as a person counts them (code points, not UTF-16 units). */
export function passwordChars(password: string): number {
  return [...password].length;
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

/** UTF-8 length without Buffer, so the same check runs in the browser. */
export function passwordBytes(password: string): number {
  return new TextEncoder().encode(password).length;
}

/*
 * Naujas administratoriaus slaptažodis, bet kokio ilgio (security M1): ilgesnį
 * nei 72 baitų GoTrue mato tik kaip išvestinį, kuris taisyklę tenkina visada,
 * todėl ją tikriname patys originalui – mažoji, didžioji, skaičius, kitas
 * ženklas ir bent 8 skirtingi simboliai.
 */
export function isStrongAdminPassword(password: string): boolean {
  // Visos patikros – NFC formai (security L4): NFD jungiamasis ženklas
  // (pvz. U+0328) kitaip būtų įskaitytas kaip „kitas ženklas“.
  const n = password.normalize("NFC");
  const chars = [...n];
  return (
    chars.length >= MIN_PASSWORD &&
    /\p{Ll}/u.test(n) &&
    /\p{Lu}/u.test(n) &&
    /\p{Nd}/u.test(n) &&
    /[^\p{L}\p{M}\p{Nd}]/u.test(n) &&
    new Set(chars).size >= 8
  );
}
