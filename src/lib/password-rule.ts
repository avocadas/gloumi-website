/*
 * The project's password rule (Supabase Auth `password_requirements =
 * "lower_upper_letters_digits_symbols"`, `minimum_password_length = 8`,
 * db config.toml). Checked in the browser for a quick answer and again on
 * the server; GoTrue checks it a third time.
 */
export const MIN_PASSWORD = 8;

/** bcrypt's limit is 72 BYTES, not characters: Lithuanian letters take two each in UTF-8 (security). */
export const MAX_PASSWORD_BYTES = 72;

/** An admin's new password: at least 16 bytes (security 2026-10-20); the rest is GoTrue's. */
export const ADMIN_MIN_PASSWORD_BYTES = 16;

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
