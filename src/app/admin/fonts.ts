import { Figtree, Source_Serif_4 } from "next/font/google";

/*
 * Administravimo portalui — programėlės šriftai („Šviesus" drobė,
 * `theme.js` `DISPLAY_FONT` ir `BODY_FONTS`): Source Serif 4 antraštėms,
 * Figtree tekstui.
 *
 * `preload: false`: next/font iš anksto įkelia (`preload`) visų maketų šriftus
 * kiekviename puslapyje, ne tik to maketo, kuris juos naudoja (Turbopack,
 * išmatuota 2026-10-08: atskiras modulis nepadėjo). Kol to nebuvo, kiekvienas
 * gloumi.lt puslapis siuntėsi dar 4 portalo šrifto failus (~87 KB). Portale
 * jie atsiunčiami su CSS, `display: swap` – tekstas matosi iš karto.
 */
export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
  preload: false,
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false,
});

export const adminFontVariables = `${figtree.variable} ${sourceSerif.variable}`;
