import { type IconComponent } from "@/components/icons";
import { CATEGORY_ICONS } from "./category-icons";
import type { Lang } from "./lang";

// The icons come from category-icons.ts (one place); the names stay, since
// scripts/check-contrast.mjs reads the `{ icon: Name, ink, tint }` lines below.
const {
  hair: IconCategoryHair,
  nails: IconCategoryNails,
  brows_lashes: IconCategoryBrows,
  massage_body: IconCategoryMassage,
  makeup: IconCategoryMakeup,
  skincare: IconCategorySkincare,
} = CATEGORY_ICONS;

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
      tagline: "Procedūros pagal Jūsų odą, ne pagal madą.",
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
  pl: {
    hair: {
      label: "Włosy i broda",
      short: "Włosy",
      tagline: "Od codziennego strzyżenia po fryzurę ślubną.",
      examples: ["Strzyżenie", "Koloryzacja", "Fryzury", "Pielęgnacja brody"],
    },
    nails: {
      label: "Paznokcie",
      short: "Paznokcie",
      tagline: "Manicure, który wytrzyma do następnej wizyty.",
      examples: ["Manicure", "Pedicure", "Przedłużanie", "Zdobienia"],
    },
    brows_lashes: {
      label: "Brwi i rzęsy",
      short: "Brwi",
      tagline: "Spojrzenie, które nie potrzebuje filtra.",
      examples: ["Przedłużanie", "Laminacja", "Henna", "Regulacja"],
    },
    massage_body: {
      label: "Masaże i ciało",
      short: "Masaże",
      tagline: "Godzina tylko dla siebie – dla ciała i głowy.",
      examples: ["Relaksacyjny", "Antycellulitowy", "Depilacja"],
    },
    makeup: {
      label: "Makijaż",
      short: "Makijaż",
      tagline: "Dzienny, wieczorowy, permanentny – na każdą okazję.",
      examples: ["Dzienny", "Wieczorowy", "Permanentny", "Ślubny"],
    },
    skincare: {
      label: "Pielęgnacja skóry",
      short: "Skóra",
      tagline: "Zabiegi dobrane do twojej skóry, nie do mody.",
      examples: ["Zabiegi na twarz", "Peelingi", "Kosmetologia"],
    },
  },
  lv: {
    hair: {
      label: "Mati un bārda",
      short: "Mati",
      tagline: "No ikdienas griezuma līdz līgavas frizūrai.",
      examples: ["Matu griezumi", "Krāsošana", "Frizūras", "Bārdas kopšana"],
    },
    nails: {
      label: "Nagi",
      short: "Nagi",
      tagline: "Manikīrs, kas noturas līdz nākamajai vizītei.",
      examples: ["Manikīrs", "Pedikīrs", "Pieaudzēšana", "Dizains"],
    },
    brows_lashes: {
      label: "Uzacis un skropstas",
      short: "Uzacis",
      tagline: "Skatiens, kuram nevajag filtru.",
      examples: ["Pieaudzēšana", "Laminēšana", "Krāsošana", "Korekcija"],
    },
    massage_body: {
      label: "Masāžas un ķermenis",
      short: "Masāžas",
      tagline: "Stunda tikai sev – ķermenim un galvai.",
      examples: ["Relaksējošā", "Pretcelulīta", "Depilācija"],
    },
    makeup: {
      label: "Grims",
      short: "Grims",
      tagline: "Dienas, vakara, permanentais – atbilstoši gadījumam.",
      examples: ["Dienas", "Vakara", "Permanentais", "Līgavas"],
    },
    skincare: {
      label: "Ādas kopšana",
      short: "Āda",
      tagline: "Procedūras atbilstoši jūsu ādai, nevis modei.",
      examples: ["Sejas procedūras", "Pīlingi", "Kosmetoloģija"],
    },
  },
  de: {
    hair: {
      label: "Haare und Bart",
      short: "Haare",
      tagline: "Vom Alltagsschnitt bis zur Brautfrisur.",
      examples: ["Haarschnitte", "Färben", "Frisuren", "Bartpflege"],
    },
    nails: {
      label: "Nägel",
      short: "Nägel",
      tagline: "Eine Maniküre, die bis zum nächsten Termin hält.",
      examples: ["Maniküre", "Pediküre", "Verlängerung", "Nageldesign"],
    },
    brows_lashes: {
      label: "Brauen und Wimpern",
      short: "Brauen",
      tagline: "Ein Blick, der keinen Filter braucht.",
      examples: ["Verlängerung", "Lifting", "Färben", "Korrektur"],
    },
    massage_body: {
      label: "Massage und Körper",
      short: "Massage",
      tagline: "Eine Stunde nur für Sie – für Körper und Kopf.",
      examples: ["Entspannend", "Anti-Cellulite", "Haarentfernung"],
    },
    makeup: {
      label: "Make-up",
      short: "Make-up",
      tagline: "Für den Tag, den Abend oder dauerhaft – je nach Anlass.",
      examples: ["Tages-Make-up", "Abend-Make-up", "Permanent-Make-up", "Braut-Make-up"],
    },
    skincare: {
      label: "Hautpflege",
      short: "Haut",
      tagline: "Behandlungen nach Ihrer Haut, nicht nach der Mode.",
      examples: ["Gesichtsbehandlungen", "Peelings", "Kosmetik"],
    },
  },
  fr: {
    hair: {
      label: "Cheveux et barbe",
      short: "Cheveux",
      tagline: "De la coupe du quotidien à la coiffure de mariée.",
      examples: ["Coupes", "Coloration", "Coiffures", "Entretien de la barbe"],
    },
    nails: {
      label: "Ongles",
      short: "Ongles",
      tagline: "Une manucure qui tient jusqu'au prochain rendez-vous.",
      examples: ["Manucure", "Pédicure", "Extensions", "Nail art"],
    },
    brows_lashes: {
      label: "Sourcils et cils",
      short: "Sourcils",
      tagline: "Un regard qui se passe de filtre.",
      examples: ["Extensions", "Lamination", "Teinture", "Restructuration"],
    },
    massage_body: {
      label: "Massages et corps",
      short: "Massages",
      tagline: "Une heure rien que pour vous – pour le corps et pour la tête.",
      examples: ["Relaxant", "Anticellulite", "Épilation"],
    },
    makeup: {
      label: "Maquillage",
      short: "Maquillage",
      tagline: "Jour, soirée ou permanent – selon l'occasion.",
      examples: ["Jour", "Soirée", "Permanent", "Mariée"],
    },
    skincare: {
      label: "Soins de la peau",
      short: "Peau",
      tagline: "Des soins choisis pour votre peau, pas pour la mode.",
      examples: ["Soins du visage", "Peelings", "Esthétique"],
    },
  },
  es: {
    hair: {
      label: "Pelo y barba",
      short: "Cabello",
      tagline: "Desde el corte de diario hasta el peinado de novia.",
      examples: ["Cortes", "Coloración", "Peinados", "Cuidado de la barba"],
    },
    nails: {
      label: "Uñas",
      short: "Uñas",
      tagline: "Una manicura que aguanta hasta la próxima cita.",
      examples: ["Manicura", "Pedicura", "Extensiones", "Diseño"],
    },
    brows_lashes: {
      label: "Cejas y pestañas",
      short: "Cejas",
      tagline: "Una mirada que no necesita filtro.",
      examples: ["Extensiones", "Laminado", "Tinte", "Diseño"],
    },
    massage_body: {
      label: "Masajes y cuerpo",
      short: "Masajes",
      tagline: "Una hora solo para ti – para el cuerpo y la mente.",
      examples: ["Relajante", "Anticelulítico", "Depilación"],
    },
    makeup: {
      label: "Maquillaje",
      short: "Maquillaje",
      tagline: "De día, de noche o permanente – según la ocasión.",
      examples: ["De día", "De noche", "Permanente", "De novia"],
    },
    skincare: {
      label: "Cuidado de la piel",
      short: "Piel",
      tagline: "Tratamientos pensados para tu piel, no para la moda.",
      examples: ["Tratamientos faciales", "Peelings", "Cosmetología"],
    },
  },
  it: {
    hair: {
      label: "Capelli e barba",
      short: "Capelli",
      tagline: "Dal taglio di tutti i giorni all'acconciatura da sposa.",
      examples: ["Tagli", "Colore", "Acconciature", "Cura della barba"],
    },
    nails: {
      label: "Unghie",
      short: "Unghie",
      tagline: "Una manicure che dura fino al prossimo appuntamento.",
      examples: ["Manicure", "Pedicure", "Ricostruzione", "Nail art"],
    },
    brows_lashes: {
      label: "Sopracciglia e ciglia",
      short: "Sopracciglia",
      tagline: "Uno sguardo che non ha bisogno di filtri.",
      examples: ["Extension", "Laminazione", "Tinta", "Correzione"],
    },
    massage_body: {
      label: "Massaggi e corpo",
      short: "Massaggi",
      tagline: "Un'ora solo per te – per il corpo e per la mente.",
      examples: ["Rilassante", "Anticellulite", "Depilazione"],
    },
    makeup: {
      label: "Trucco",
      short: "Trucco",
      tagline: "Da giorno, da sera, permanente – secondo l'occasione.",
      examples: ["Giorno", "Sera", "Permanente", "Sposa"],
    },
    skincare: {
      label: "Cura della pelle",
      short: "Pelle",
      tagline: "Trattamenti scelti per la tua pelle, non per la moda.",
      examples: ["Trattamenti viso", "Peeling", "Cosmetologia"],
    },
  },
};

const ORDER: CategoryId[] = ["nails", "hair", "brows_lashes", "makeup", "skincare", "massage_body"];

/** The ids the API accepts. Same in both languages: only the labels are translated. */
export const CATEGORY_IDS: readonly CategoryId[] = ORDER;

export function getCategories(lang: Lang): Category[] {
  return ORDER.map((id) => ({ id, ...SHARED[id], ...TEXT[lang][id] }));
}

/** A category without its icon component: what a server component can pass to a client one as props. */
export type CategoryView = Omit<Category, "icon">;

/**
 * One language's categories, serialisable (web audit 2026-10-22): client
 * components get these as props and draw the icon from category-icons.ts,
 * so the other seven languages' texts stay on the server.
 */
export function getCategoryViews(lang: Lang): CategoryView[] {
  return ORDER.map((id) => ({ id, ink: SHARED[id].ink, tint: SHARED[id].tint, ...TEXT[lang][id] }));
}
