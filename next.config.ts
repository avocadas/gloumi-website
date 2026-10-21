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
 *
 * `Cross-Origin-Opener-Policy: same-origin`: a page opened from another
 * site cannot keep a handle on this window (tabnabbing, XS-Leaks). The site
 * opens no cross-origin popups that need to talk back.
 */
const baselineCsp = [
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: baselineCsp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
