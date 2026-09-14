import { Droplets, Eye, Flower2, Hand, Palette, Scissors, type LucideIcon } from "lucide-react";
import type { Lang } from "./lang";

/**
 * The six service categories the landing page shows.
 *
 * Both languages use the app's own strings
 * (gloumi-app/src/constants/translations.js → catNails, catHairBarber, … in its
 * lt and en blocks), so a visitor sees the same words on the site and in the
 * app. Order follows the brief; the app's seventh category, „Kita“ / "Other",
 * is a catch-all and is left out.
 */
export type CategoryId = "hair" | "nails" | "brows_lashes" | "massage_body" | "makeup" | "skincare";

export type Category = {
  id: CategoryId;
  label: string;
  /** Short label for tight spaces such as the phone mockup. */
  short: string;
  tagline: string;
  examples: string[];
  icon: LucideIcon;
  /** Icon colour on the tinted disc. Checked against white by scripts/check-contrast.mjs. */
  accent: string;
  /** Disc tint behind the icon. */
  tint: string;
};

/** What does not change between languages: the icon and the two colours. */
const SHARED: Record<CategoryId, Pick<Category, "icon" | "accent" | "tint">> = {
  hair: { icon: Scissors, accent: "#7A3350", tint: "#F3E6EC" },
  nails: { icon: Hand, accent: "#8F3D26", tint: "#F3E1D8" },
  brows_lashes: { icon: Eye, accent: "#574463", tint: "#ECE6F0" },
  massage_body: { icon: Flower2, accent: "#4C6552", tint: "#E4EBE5" },
  makeup: { icon: Palette, accent: "#B93E72", tint: "#FBE4EC" },
  skincare: { icon: Droplets, accent: "#8E6238", tint: "#F3E7DA" },
};

type CategoryText = Pick<Category, "label" | "short" | "tagline" | "examples">;

const TEXT: Record<Lang, Record<CategoryId, CategoryText>> = {
  lt: {
    hair: {
      label: "Plaukai ir barzda",
      short: "Plaukai",
      tagline: "Nuo kasdienio kirpimo iki nuotakos šukuosenos.",
      examples: ["Kirpimai", "Dažymas", "Šukuosenos", "Barzdos priežiūra"],
    },
    nails: {
      label: "Nagai",
      short: "Nagai",
      tagline: "Manikiūras, kuris išlaiko iki kito vizito.",
      examples: ["Manikiūras", "Pedikiūras", "Priauginimas", "Dizainas"],
    },
    brows_lashes: {
      label: "Antakiai ir blakstienos",
      short: "Antakiai",
      tagline: "Žvilgsnis, kuriam nereikia filtro.",
      examples: ["Priauginimas", "Laminavimas", "Dažymas", "Korekcija"],
    },
    massage_body: {
      label: "Masažai ir kūnas",
      short: "Masažai",
      tagline: "Valanda tik sau – kūnui ir galvai.",
      examples: ["Atpalaiduojantis", "Anticeliulitinis", "Depiliacija"],
    },
    makeup: {
      label: "Makiažas",
      short: "Makiažas",
      tagline: "Dieninis, vakarinis, permanentinis – pagal progą.",
      examples: ["Dieninis", "Vakarinis", "Permanentinis", "Nuotakos"],
    },
    skincare: {
      label: "Odos priežiūra",
      short: "Oda",
      tagline: "Procedūros pagal tavo odą, ne pagal madą.",
      examples: ["Veido procedūros", "Pilingai", "Kosmetologija"],
    },
  },
  en: {
    hair: {
      label: "Hair and beard",
      short: "Hair",
      tagline: "From an everyday trim to a wedding blow-dry.",
      examples: ["Cuts", "Colour", "Styling", "Beard care"],
    },
    nails: {
      label: "Nails",
      short: "Nails",
      tagline: "A manicure that lasts until the next appointment.",
      examples: ["Manicure", "Pedicure", "Extensions", "Nail art"],
    },
    brows_lashes: {
      label: "Brows and lashes",
      short: "Brows",
      tagline: "A look that needs no filter.",
      examples: ["Extensions", "Lamination", "Tinting", "Shaping"],
    },
    massage_body: {
      label: "Massage and body",
      short: "Massage",
      tagline: "An hour for yourself, for the body and for the head.",
      examples: ["Relaxing", "Anti-cellulite", "Waxing"],
    },
    makeup: {
      label: "Make-up",
      short: "Make-up",
      tagline: "Daytime, evening or permanent, to suit the occasion.",
      examples: ["Daytime", "Evening", "Permanent", "Bridal"],
    },
    skincare: {
      label: "Skincare",
      short: "Skin",
      tagline: "Treatments chosen for your skin, not for the trend.",
      examples: ["Facials", "Peels", "Cosmetology"],
    },
  },
};

const ORDER: CategoryId[] = ["hair", "nails", "brows_lashes", "massage_body", "makeup", "skincare"];

/** The ids the API accepts. Same in both languages: only the labels are translated. */
export const CATEGORY_IDS: readonly CategoryId[] = ORDER;

export function getCategories(lang: Lang): Category[] {
  return ORDER.map((id) => ({ id, ...SHARED[id], ...TEXT[lang][id] }));
}

/** The app's StoryRing gradient – the ring around an unseen story. */
export const RING_GRADIENT =
  "conic-gradient(from 210deg, #8F3D26 0%, #E2578C 35%, #7A3350 70%, #4C6552 100%)";
