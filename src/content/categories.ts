import { Droplets, Eye, Flower2, Hand, Palette, Scissors, type LucideIcon } from "lucide-react";

/**
 * The six service categories the landing page shows.
 *
 * Labels and example services are the app's own strings
 * (gloumi-app/src/constants/translations.js → catNails, catHairBarber, …), so a
 * visitor sees the same words on the site and in the app. Order follows the
 * brief; the app's seventh category, „Kita“, is a catch-all and is left out.
 */
export type Category = {
  id: "hair" | "nails" | "brows_lashes" | "massage_body" | "makeup" | "skincare";
  label: string;
  /** Short label for tight spaces such as the phone mockup. */
  short: string;
  tagline: string;
  examples: string[];
  icon: LucideIcon;
  /** Icon colour on the tinted disc. */
  accent: string;
  /** Disc tint behind the icon. */
  tint: string;
};

export const categories: Category[] = [
  {
    id: "hair",
    label: "Plaukai ir barzda",
    short: "Plaukai",
    tagline: "Nuo kasdienio kirpimo iki nuotakos šukuosenos.",
    examples: ["Kirpimai", "Dažymas", "Šukuosenos", "Barzdos priežiūra"],
    icon: Scissors,
    accent: "#7A3350",
    tint: "#F3E6EC",
  },
  {
    id: "nails",
    label: "Nagai",
    short: "Nagai",
    tagline: "Manikiūras, kuris išlaiko iki kito vizito.",
    examples: ["Manikiūras", "Pedikiūras", "Priauginimas", "Dizainas"],
    icon: Hand,
    accent: "#8F3D26",
    tint: "#F3E1D8",
  },
  {
    id: "brows_lashes",
    label: "Antakiai ir blakstienos",
    short: "Antakiai",
    tagline: "Žvilgsnis, kuriam nereikia filtro.",
    examples: ["Priauginimas", "Laminavimas", "Dažymas", "Korekcija"],
    icon: Eye,
    accent: "#574463",
    tint: "#ECE6F0",
  },
  {
    id: "massage_body",
    label: "Masažai ir kūnas",
    short: "Masažai",
    tagline: "Valanda tik sau – kūnui ir galvai.",
    examples: ["Atpalaiduojantis", "Anticeliulitinis", "Depiliacija"],
    icon: Flower2,
    accent: "#4C6552",
    tint: "#E4EBE5",
  },
  {
    id: "makeup",
    label: "Makiažas",
    short: "Makiažas",
    tagline: "Dieninis, vakarinis, permanentinis – pagal progą.",
    examples: ["Dieninis", "Vakarinis", "Permanentinis", "Nuotakos"],
    icon: Palette,
    accent: "#B93E72",
    tint: "#FBE4EC",
  },
  {
    id: "skincare",
    label: "Odos priežiūra",
    short: "Oda",
    tagline: "Procedūros pagal tavo odą, ne pagal madą.",
    examples: ["Veido procedūros", "Pilingai", "Kosmetologija"],
    icon: Droplets,
    accent: "#8E6238",
    tint: "#F3E7DA",
  },
];

/** The app's StoryRing gradient – the ring around an unseen story. */
export const RING_GRADIENT =
  "conic-gradient(from 210deg, #8F3D26 0%, #E2578C 35%, #7A3350 70%, #4C6552 100%)";
