import type { NextConfig } from "next";

/**
 * Baseline hardening for a static marketing site.
 *
 * Script rules need per-request nonces (proxy.ts + dynamic rendering), so
 * the static pages carry no `script-src`: a permissive one would be theatre.
 * What a static page can still use is the part of CSP that does not depend
 * on scripts (web audit 2026-10-21): no plugins, no `<base>` hijack, forms
 * only back to this site, no framing, and plain-http subresources upgraded.
 * On the pages proxy.ts covers (/admin, /auth, /patvirtinta, /2fa-pagalba,
 * /profile, /ref) its nonce policy replaces this header rather than adding
 * a second one: proxy headers win over these (as /2fa-pagalba's
 * `Referrer-Policy: no-referrer` already does live), and each of those
 * policies carries every directive here except `upgrade-insecure-requests`.
 * A config header also replaces a route handler's own, so /turnstile, which
 * sends a stricter policy of its own (script and style hashes), is left out
 * of this one: in a local production build (2026-10-21) it had lost its
 * policy to this header.
 *
 * `Cross-Origin-Opener-Policy: same-origin` only where there is a session
 * or a one-time code to protect (the portal, the e-mail links, 2FA help): a
 * page opened from another site cannot keep a handle on that window
 * (tabnabbing, XS-Leaks), and none of them opens popups that talk back. Not
 * on the public pages: there it protects nothing, and with it Lighthouse,
 * and so PageSpeed Insights, lost the page load (NO_NAVSTART, the page moves
 * to a new browser process) in 7 of 9 runs of the branch preview, against
 * 0 of 13 on the live site without it (web audit 2026-10-22).
 */
const baselineCsp = [
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const isolatedPaths = ["/admin/:path*", "/auth/:path*", "/patvirtinta", "/2fa-pagalba/:path*"];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
   * AVIF first, WebP for browsers without it: the phone screens are the only
   * raster images on the public pages, and AVIF is about a third smaller at
   * the same quality.
   */
  images: { formats: ["image/avif", "image/webp"] },
  /*
   * Savas 404 adresams, kurių neatitinka joks maršrutas (`src/app/global-not-found.tsx`):
   * su keliais šakniniais išdėstymais kitaip rodomas Next numatytasis.
   */
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Everywhere but /turnstile (see above).
      { source: "/:path((?!turnstile$).*)", headers: [{ key: "Content-Security-Policy", value: baselineCsp }] },
      ...isolatedPaths.map((source) => ({ source, headers: [{ key: "Cross-Origin-Opener-Policy", value: "same-origin" }] })),
    ];
  },
};

export default nextConfig;
