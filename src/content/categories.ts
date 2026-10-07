import { type IconComponent } from "@/components/icons";
import { IconCategoryBrows, IconCategoryHair, IconCategoryMakeup, IconCategoryMassage, IconCategoryNails, IconCategorySkincare } from "@/components/icons/categories";
import type { Lang } from "./lang";

/**
 * The six service categories the landing page shows.
 *
 * Both languages use the app's own strings (gloumi-app/src/constants/
 * translations/{lt,en}.js → catNails, catHairBarber, … and the …Short names),
 * so a visitor sees the same words on the site and in the app. The order is
 * the app's too (constants/onboarding.js MASTER_CATEGORIES; developer,
 * 2026-10-07: order and English names as in the app); the app's seventh
 * category, „Kita“ / "Other", is a catch-all and is left out.
 */
export type CategoryId = "hair" | "nails" | "brows_lashes" | "massage_body" | "makeup" | "skincare";

export type Category = {
  id: CategoryId;
  label: string;
  /** Short label for tight spaces such as the phone mockup. */
  short: string;
  tagline: string;
  examples: string[];
  icon: IconComponent;
  /**
   * Icon colour on the disc, and the category eyebrow in the panel below –
   * the app's `ink`. scripts/check-contrast.mjs reads it from this file and
   * checks it against white (text, 4.5:1) and against `tint` (icon, 3:1).
   */
  ink: string;
  /** Disc fill behind the icon – the app's `tint`. */
  tint: string;
};

/*
 * What does not change between languages: the icon and the two colours.
 *
 * The colours are the app's, not the site's own (developer, 2026-10-07: the
 * category row has to look like the app's): gloumi-app/src/constants/
 * categoryIcons.js `BY_ID` `tint` and `ink` (ringaudas-prod @ 672872ad), which
 * the app's Search screen paints as the disc and its icon. Change them there
 * first, then here.
 */
const SHARED: Record<CategoryId, Pick<Category, "icon" | "ink" | "tint">> = {
  hair: { icon: IconCategoryHair, ink: "#9A3A5C", tint: "#F7E3EA" },
  nails: { icon: IconCategoryNails, ink: "#B8563A", tint: "#F9E4D6" },
  brows_lashes: { icon: IconCategoryBrows, ink: "#7A5AA6", tint: "#E9E1F7" },
  massage_body: { icon: IconCategoryMassage, ink: "#4E7A5C", tint: "#DCEDE2" },
  makeup: { icon: IconCategoryMakeup, ink: "#B8436B", tint: "#FBE0E9" },
  skincare: { icon: IconCategorySkincare, ink: "#8F6A3D", tint: "#F2E7D6" },
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
      tagline: "Procedūros pagal jūsų odą, ne pagal madą.",
      examples: ["Veido procedūros", "Pilingai", "Kosmetologija"],
    },
  },
  en: {
    hair: {
      label: "Hair & barber",
      short: "Hair",
      tagline: "From an everyday trim to a wedding blow-dry.",
      examples: ["Cuts", "Colour", "Styling", "Beard care"],
    },
    nails: {
      label: "Nails",
      short: "Nails",
      tagline: "A manicure that lasts until the next visit.",
      examples: ["Manicure", "Pedicure", "Extensions", "Nail art"],
    },
    brows_lashes: {
      label: "Brows & lashes",
      short: "Brows",
      tagline: "A look that needs no filter.",
      examples: ["Extensions", "Lamination", "Tinting", "Shaping"],
    },
    massage_body: {
      label: "Massage & body",
      short: "Massage",
      tagline: "An hour for yourself, for the body and for the head.",
      examples: ["Relaxing", "Anti-cellulite", "Waxing"],
    },
    makeup: {
      label: "Makeup",
      short: "Makeup",
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

const ORDER: CategoryId[] = ["nails", "hair", "brows_lashes", "makeup", "skincare", "massage_body"];

/** The ids the API accepts. Same in both languages: only the labels are translated. */
export const CATEGORY_IDS: readonly CategoryId[] = ORDER;

export function getCategories(lang: Lang): Category[] {
  return ORDER.map((id) => ({ id, ...SHARED[id], ...TEXT[lang][id] }));
}
