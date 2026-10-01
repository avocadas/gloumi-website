import { Cormorant_Garamond, DM_Sans, Figtree, Source_Serif_4 } from "next/font/google";

/*
 * Shared by both root layouts, so the two languages load the same two font
 * files and a visitor switching language does not fetch a second copy.
 *
 * Cormorant Garamond is the face the app's design canvas asks for (its wordmark
 * is set in it); DM Sans carries the body. Self-hosted by next/font with
 * latin-ext, so ą č ę ė į š ų ū ž render in the real face.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const fontVariables = `${cormorant.variable} ${dmSans.variable}`;

/*
 * Administravimo portalui — programėlės šriftai („Šviesus" drobė,
 * `theme.js` `DISPLAY_FONT` ir `BODY_FONTS`): Source Serif 4 antraštėms,
 * Figtree tekstui. Kraunami tik portalo makete, tad rinkodaros puslapio
 * lankytojas jų nesisiunčia.
 */
export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  variable: "--font-source-serif",
  display: "swap",
});

export const adminFontVariables = `${figtree.variable} ${sourceSerif.variable}`;
