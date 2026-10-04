/*
 * Lentelės, kurių eilutės — kitiems matomas naudotojo turinys (#169). Jas
 * trinant ar taisant reikia ir Taisyklių punkto; kitoms (peržiūros,
 * patiktukai, darbo laikas, privatūs užrašai) punktas nebūtinas — ten nėra ko
 * riboti, nors priežastis privaloma visada.
 *
 * Tas pats sąrašas, kaip Gloumi `moderation_noun_of` (`20261004145806`): bazė
 * tai tikrina pati, o čia — kad langas iš karto žinotų, ar punktas privalomas.
 * Ne `server-only`: jį naudoja ir naršyklės komponentas (`RowCard`).
 */
export const MODERATED_TABLES: ReadonlySet<string> = new Set([
  "posts",
  "post_media",
  "post_comments",
  "stories",
  "highlights",
  "highlight_items",
  "media",
  "services",
  "service_addons",
  "master_service_categories",
  "flash_slots",
  "reviews",
  "client_ratings",
  "client_reviews",
  "messages",
  "profiles",
  "master_profiles",
]);
