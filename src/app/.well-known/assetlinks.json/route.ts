/**
 * https://gloumi.lt/.well-known/assetlinks.json – lets Android open the app's
 * share links (#210) in the app instead of the browser: /profile/<id> and
 * /ref, the paths app.config.js claims (`intentFilters`, `autoVerify`).
 *
 * WAITING FOR THE FINGERPRINTS. Android verifies the app by the SHA-256 of
 * the certificate the installed APK is signed with, so each list needs:
 *  - the EAS upload key: `npx eas-cli credentials -p android`, per variant
 *    (only the developer can run it - it is interactive);
 *  - for the store build also the Google Play app signing key: Play Console →
 *    the app → Test and release → App integrity → App signing (exists once
 *    the app is uploaded to Play) - an app installed from Play carries that
 *    signature, not the upload key's.
 * Format: "AB:CD:...", 32 colon-separated hex pairs.
 *
 * Until a package has a fingerprint it is left out, and with none at all the
 * route answers 404 like before: a file with an empty list would make Android
 * mark the domain as failed until its next check, a missing one does not.
 */
const PACKAGES: { name: string; fingerprints: string[] }[] = [
  { name: "com.ringaudas.gloumi", fingerprints: [] },
  { name: "com.ringaudas.gloumi.dev", fingerprints: [] },
];

const FINGERPRINT = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

const statements = PACKAGES.filter((p) => p.fingerprints.length > 0).map((p) => {
  const bad = p.fingerprints.find((f) => !FINGERPRINT.test(f));
  if (bad) throw new Error(`assetlinks: ${p.name} fingerprint is not 32 colon-separated hex pairs: ${bad}`);
  return {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: { namespace: "android_app", package_name: p.name, sha256_cert_fingerprints: p.fingerprints },
  };
});

export const dynamic = "force-static";

export function GET() {
  if (statements.length === 0) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(statements), {
    headers: { "Content-Type": "application/json" },
  });
}
