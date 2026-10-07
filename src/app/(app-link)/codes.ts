/*
 * The app's own checks for what a share link carries
 * (gloumi-app/src/services/profileLinks.js, masterCodeService.js,
 * referralsService.js on avocadas/Gloumi office/app-universalios-nuorodos).
 * Nothing from the address reaches the page or the app link unless it passes
 * them, so the page cannot be made to show or forward arbitrary text.
 */

/** The app scheme of the store build (`app.json` `scheme`); the dev build's `gloumidev` is not offered. */
export const APP_SCHEME = "gloumi";

/** `profiles.id` is a uuid. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function profileId(raw: string): string | null {
  let id: string;
  try {
    id = decodeURIComponent(raw);
  } catch {
    return null;
  }
  return UUID.test(id) ? id.toLowerCase() : null;
}

/** A master code: letters and digits only, eight of them (`normalizeMasterCode`). */
export function masterCode(raw: string | string[] | undefined): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return code.length === 8 ? code : null;
}

/**
 * A referral code (`normalizeReferralCode` only trims and upper-cases): kept
 * to letters, digits and dashes of a sane length, or dropped.
 */
export function referralCode(raw: string | string[] | undefined): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return /^[A-Z0-9-]{4,32}$/.test(code) ? code : null;
}
