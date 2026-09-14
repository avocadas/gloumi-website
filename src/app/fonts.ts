import { Cormorant_Garamond, DM_Sans } from "next/font/google";

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
