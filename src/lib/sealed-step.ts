import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

/*
 * A short-lived, server-sealed value the browser carries between two POSTs
 * without being able to read or use it (slaptažodžio atkūrimas, security
 * 2026-10-17: after verifyOtp a TOTP code may still be needed, but gloumi.lt
 * keeps no cookies and no server storage).
 *
 * AES-256-GCM; the key is derived (HKDF-SHA256) from the service-role key,
 * which only the server has, so no new secret is needed and the browser
 * holds an opaque string. The expiry is inside the sealed part, so it cannot
 * be extended. Anything that fails to open – tampered, expired, another key
 * after rotation – is simply "no step".
 */
const INFO = "gloumi-sealed-step-v1";

function key(): Buffer | null {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  return Buffer.from(hkdfSync("sha256", secret, "gloumi.lt", INFO, 32));
}

export function seal(value: Record<string, unknown>, ttlSeconds: number): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.from(JSON.stringify({ ...value, exp: Date.now() + ttlSeconds * 1000 }), "utf8");
  const data = Buffer.concat([cipher.update(body), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}

export function unseal<T extends Record<string, unknown>>(sealed: unknown): T | null {
  const k = key();
  if (!k || typeof sealed !== "string" || sealed.length > 8192) return null;
  try {
    const raw = Buffer.from(sealed, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", k, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const body = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const value = JSON.parse(body) as T & { exp?: unknown };
    if (typeof value.exp !== "number" || value.exp < Date.now()) return null;
    return value;
  } catch {
    return null;
  }
}
