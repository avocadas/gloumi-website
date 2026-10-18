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
  style: "normal",
  variable: "--font-cormorant",
  display: "swap",
});

/*
 * The italic carries one word, the accent in the home page's H1, yet its two
 * files were 72 KB of the 196 KB preloaded on every page. Not preloaded now
 * (developer 2026-10-18, "del svetaines tinka, darom"): it arrives with the
 * page's CSS, and until then the word shows in the upright face.
 */
export const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: "italic",
  variable: "--font-cormorant-italic",
  display: "swap",
  preload: false,
});

export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const fontVariables = `${cormorant.variable} ${cormorantItalic.variable} ${dmSans.variable}`;
