/*
 * Pokalbio žinutės portale – tik su pagrindu (teisininko A-16, LV 3; db
 * `20261022142220`, `admin_read_chat`). Duomenų naršyklė žinučių teksto
 * nebeduoda: perskaityti galima tik pasirinkus, kuo remiantis, ir kiekvieną
 * skaitymą bazė įrašo į administratorių žurnalą (veiksmas `read_chat`:
 * pagrindas, nuoroda, žinučių skaičius; tekstas – ne).
 *
 * Bendra langui ir serverio veiksmui: serveris tikrina, kad pagrindas – vienas
 * iš šių, o ar jis liečia būtent šį pokalbį, sprendžia bazė.
 */
export const CHAT_READ_BASES = [
  {
    value: "content_report",
    label: "Skundas dėl šio pokalbio",
    refLabel: "Skundo ID",
    refHint: "Skundas dėl šio pokalbio žinutės arba dėl pokalbio nario, pateiktas kito nario.",
  },
  {
    value: "dispute",
    label: "Ginčas dėl vizito",
    refLabel: "Ginčijamo vizito ID",
    refHint: "Vizito klientas ir meistras turi būti šio pokalbio nariai.",
  },
  {
    value: "law_enforcement",
    label: "Teisėsaugos ar institucijos prašymas",
    refLabel: "Prašymo numeris",
    refHint: "Rašto ar prašymo numeris, iki 200 ženklų.",
  },
] as const;

export type ChatReadBasis = (typeof CHAT_READ_BASES)[number]["value"];

export const isChatReadBasis = (v: unknown): v is ChatReadBasis => CHAT_READ_BASES.some((b) => b.value === v);

/**
 * Kurį pokalbį skaityti: žinomas pokalbis, pranešta žinutė arba dviejų žmonių
 * bendras pokalbis (skundas dėl profilio, ginčas). Pokalbį pagal žinutę ar
 * narius randa serveris – tik `chat_id`, be turinio.
 */
export type ChatTarget = { chatId: string } | { messageId: string } | { memberIds: [string, string] };

export type ChatMessage = {
  id: string;
  senderId: string | null;
  /** `client` arba `master` (`app_role`). */
  senderRole: string | null;
  body: string | null;
  mediaId: string | null;
  replyToId: string | null;
  createdAt: string;
  editedAt: string | null;
};
