/*
 * The project's password rule (Supabase Auth `password_requirements =
 * "lower_upper_letters_digits_symbols"`, `minimum_password_length = 8`,
 * db config.toml). Checked in the browser for a quick answer and again on
 * the server; GoTrue checks it a third time.
 */
export const MIN_PASSWORD = 8;

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
