/**
 * https://gloumi.lt/.well-known/apple-app-site-association – lets iOS open
 * the app's share links (#210) in the app instead of the browser.
 *
 * Apple reads it from gloumi.lt itself, without following redirects (that is
 * why the app's links use gloumi.lt, not www), and wants JSON at this exact
 * path with no extension. A route handler, not a file in public/, so the
 * content type is set here rather than guessed from a missing extension.
 *
 * Team ID 633UGQQGS4 – measured by the release role from the EAS production
 * iOS build log (2026-10-07). The paths are the ones the app claims in
 * app.config.js (`ios.associatedDomains`, Android `intentFilters`):
 * /profile/<id> and /ref. Both store and dev builds are listed, so the dev
 * client can be tested against the live site.
 */
const APP_IDS = ["633UGQQGS4.com.ringaudas.gloumi", "633UGQQGS4.com.ringaudas.gloumi.dev"];

const ASSOCIATION = {
  applinks: {
    details: [
      {
        appIDs: APP_IDS,
        components: [{ "/": "/profile/*" }, { "/": "/ref" }],
      },
    ],
  },
};

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(ASSOCIATION), {
    headers: { "Content-Type": "application/json" },
  });
}
