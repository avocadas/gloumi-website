# gloumi-website

Marketing site for **Gloumi** – the beauty and wellness marketplace app for Lithuania. Clients find and book masters; masters run their calendar, deposits and payouts from the app. This repository is the public face at https://gloumi.lt.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide. Lithuanian at the root, English under `/en`.

## Run it

```bash
npm install
cp .env.example .env.local   # optional – see "Environment"
npm run dev
```

`npm run check` runs ESLint, the TypeScript typecheck and the WCAG contrast check. `npm run build` produces the production build Vercel deploys.

## Structure

```
src/
  app/(lt)/            Lithuanian routes at the root, plus its root layout and share card
  app/(en)/en/         English routes under /en, plus its root layout and share card
  app/                 shared metadata files (icons, sitemap, robots, manifest), /api/waitlist
  components/
    brand/             Wordmark (GENERATED) + BrandMark (renders public/brand/gloumi-mark.svg)
    layout/            Header, Footer
    sections/          Hero, PhoneMockup, Categories, WhyGloumi, ForMasters, WaitlistForm, FinalCta
    legal/             LegalPage – one layout for the four legal documents
    ui/                Button, Container, SectionHeading, StoreBadges, Reveal, MotionProvider
  content/
    lang.ts            the two languages, their paths, section anchors and legal slugs
    site.ts            company facts, URLs, store links, socials – the one place to fill in
    copy.lt.ts         every visible string, Lithuanian
    copy.en.ts         the same shape in English; typed against copy.lt so a missing key fails the typecheck
    copy.ts            getCopy(lang)
    metadata.ts        canonical, hreflang alternates and OpenGraph, per page and per language
    categories.ts      the six service categories; labels are the app's own
    legal.ts           refund policy + DAC7/DSA notice, helpers
    legal-source.ts    Terms + Privacy – GENERATED from the app repository
scripts/
  gen-from-app.mjs      regenerates the GENERATED files from ../Gloumi/gloumi-app/src
  make-icons.mjs       favicon / apple-icon / manifest icons from public/brand/gloumi-mark.svg
  check-contrast.mjs   WCAG 2.1 AA check for every text/background pairing in use
```

## Kept in step with the app

Three things must never drift from the mobile app, so they are copied by script, never by hand:

| Site file | App source |
|---|---|
| `src/components/brand/Wordmark.tsx` | `gloumi-app/src/theme/wordmarkPath.js` |
| `public/brand/gloumi-mark.svg` | the icon `gloumi-app/app.json` declares as `expo.icon`, as SVG |
| `src/content/legal-source.ts` | `gloumi-app/src/constants/legal.js` (v1.1, 2026-09-02) |

The mark is read from `app.json` rather than by filename, because the app renamed it once already. Everything that draws the icon reads that one SVG: the footer through `BrandMark`, the OpenGraph card, and the favicons.

After changing any of those in the app repository run `npm run gen:app` (pass the path to `gloumi-app/src` as an argument if the app repository is not a sibling directory). It says so when the mark changed; then run `npm run icons` to rebuild the favicons from it.

## Environment

The public pages build and run with none of them. The admin portal does not: without the three Supabase variables every `/admin` request fails in the middleware with `500 MIDDLEWARE_INVOCATION_FAILED`, which is what gloumi.lt answered until they were set on 2026-09-30. The rest of the site is unaffected, because the middleware matches `/admin` only.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and robots. Defaults to `https://gloumi.lt`. |
| `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL` | Store links. While empty the badges read „Netrukus“ and are not links. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta tag. Unset on purpose: the domain is verified by a DNS TXT record. |
| `WAITLIST_WEBHOOK_URL` | Master inquiries are POSTed here as JSON (Slack, Zapier, Make, a Supabase Edge Function…). |
| `RESEND_API_KEY`, `WAITLIST_TO_EMAIL`, `WAITLIST_FROM_EMAIL` | …or e-mailed through Resend. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Admin portal (`/admin`). Public: the same project URL and `sb_publishable_…` key as the app's `gloumi-app/src/config/supabase.js`. Both are inlined into the client bundle at build time, so after changing one, redeploy without the build cache. |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin portal, server only (`src/lib/supabase/admin.ts`). A real secret that bypasses RLS: never `NEXT_PUBLIC_`, never in git; in Vercel, Production only and Sensitive. |
| `REPORT_HOOK_SECRET` | The shared secret the database sends in `x-gloumi-hook-secret` when it calls `/api/hooks/new-report` on a new content report (Gloumi #170); the same value lives in the Supabase Vault. Without it the route answers `503`, with a wrong one `401`. In Vercel, Production only and Sensitive. |
| `MODERATION_ALERT_TO` | Where the new-report email goes. Defaults to the site's `info@` address. Sent through Resend with `RESEND_API_KEY`, from `no-reply@mail.gloumi.lt`, carrying only the reason and a link to `/admin` – no content, no names. |

With neither channel configured, `/api/waitlist` answers `503 not_configured` in production and the form turns into a plain mailto – nothing is silently dropped. In development it logs the submission and answers OK.

## Before going live

- [ ] Company details in `src/content/site.ts` (`company.code`, `company.address`, VAT code if any). The footer and the legal pages render them only once they are set; nothing is placeholder text.
- [ ] Social profile URLs in `src/content/site.ts` – the footer shows the row only when at least one is set.
- [ ] Store URLs (environment) once the app is published.
- [ ] One delivery channel for the master form (environment).
- [ ] Legal review. The Terms and the Privacy Policy are the app's own drafts, and their source file says a lawyer must review them before release. The refund and DAC7/DSA pages were written for this site from those drafts and from the app's business-identity migration; they need the same review.
- [ ] Store badges. The badge buttons are drawn in `StoreBadges.tsx`, not Apple's or Google's official artwork. If the platform marketing guidelines matter to you, drop the official badges into `public/badges/` and swap them in.

## Deploy

Push to `main` and Vercel builds and deploys it (project `gloumi-website`, team `gloumi1`, default Next.js settings, the environment variables above). Three more settings live in the Vercel project rather than in this repository: the function region is `fra1` (Frankfurt), next to the Supabase project in `eu-central-1`, since every admin page makes several database calls and from Vercel's default `iad1` each would cross the Atlantic; Node is 24.x, which `engines.node` pins as well; and the firewall rule „Admin login rate limit“ on `/admin/login`. The build log still says it runs in `iad1`: that is the build machine, not where the functions run. `next/font` fetches Google Fonts at build time, so the build needs network access – Vercel and GitHub Actions both have it. The share card does not fetch anything: it reads its fonts from `assets/fonts/`. CI (`.github/workflows/ci.yml`) runs lint, typecheck, the contrast check and a build on every push and pull request.
