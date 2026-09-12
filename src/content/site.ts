/**
 * Site-wide facts. Everything a footer, a legal page or a meta tag needs to
 * know about the company lives here, once.
 *
 * `null` means "not known yet, do not render" – never a placeholder string,
 * because a placeholder on a public legal page reads as a fact.
 */
const trimmed = (v: string | undefined): string | null => (v && v.trim() ? v.trim() : null);

export const site = {
  name: "Gloumi",
  legalName: "MB „Gloumi“",
  url: (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://gloumi.lt") as string,
  email: "info@gloumi.lt",
  locale: "lt_LT",
  language: "lt",
  country: "Lietuva",

  /** Registration details, confirmed by Ringaudas on 2026-09-12. `vatCode` stays
   *  null until Gloumi is a VAT payer – an empty string would render as a fact. */
  company: {
    code: "308087857" as string | null,
    vatCode: null as string | null,
    address: "L. Zamenhofo g. 10-36, LT-06330, Vilnius" as string | null,
  },

  /** Store links. Empty until the app is live; the badges then read „Netrukus“. */
  stores: {
    appStore: trimmed(process.env.NEXT_PUBLIC_APP_STORE_URL),
    googlePlay: trimmed(process.env.NEXT_PUBLIC_PLAY_STORE_URL),
  },

  /** Social profiles – rendered in the footer only when set. */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },

  /** The app's deep-link scheme (app.json → expo.scheme). */
  appScheme: "gloumi",
} as const;

export type Site = typeof site;
