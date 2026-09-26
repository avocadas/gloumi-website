import { LEGAL_DOCS, LEGAL_META, type LegalSection } from "./legal-source";
import { LEGAL_ROUTES, type Lang, type LegalKey } from "./lang";
import { site } from "./site";

export { LEGAL_DOCS, LEGAL_META, LEGAL_ROUTES };
export type { LegalSection, LegalKey };

/** Lithuanian-aware slug for section anchors. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z",
  };
  return input
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (ch) => map[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Document titles in both languages, for the page heading and the footer. */
export const LEGAL_TITLES: Record<Lang, Record<LegalKey, string>> = {
  lt: {
    terms: "Naudojimosi taisyklės",
    privacy: "Privatumo politika",
    refunds: "Grąžinimo sąlygos",
    transparency: "DAC7 ir platformos skaidrumas",
  },
  en: {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    refunds: "Refund Policy",
    transparency: "DAC7 and platform transparency",
  },
};

/** The controller line shown under every document, built from what is actually known. */
export function controllerLine(lang: Lang): string {
  const parts: string[] = [site.legalName];
  if (site.company.code) {
    parts.push(lang === "lt" ? `įmonės kodas ${site.company.code}` : `company number ${site.company.code}`);
  }
  if (site.company.address) parts.push(site.company.address);
  parts.push(site.email);
  return parts.join(", ");
}

/**
 * A section of the Terms, looked up by title.
 *
 * The refund page reuses the deposit and subscription rules rather than
 * restating them, so the two pages cannot start disagreeing. If the Terms are
 * reworded in the app, this throws at build time instead of silently dropping
 * the section.
 */
function termsSection(lang: Lang, title: string): LegalSection {
  const found = LEGAL_DOCS[lang].terms.find((s) => s.title === title);
  if (!found) {
    throw new Error(`Terms section "${title}" (${lang}) not found in legal-source.ts – regenerate it and update this title.`);
  }
  return found;
}

const DEPOSIT_TITLES: Record<Lang, string> = {
  lt: "Rezervacijos ir avansas",
  en: "Bookings and deposits",
};

const SUBSCRIPTION_TITLES: Record<Lang, string> = {
  lt: "Meistro prenumerata (Pro ir VIP Studio)",
  en: "Master subscription (Pro and VIP Studio)",
};

const WITHDRAWAL_TITLES: Record<Lang, string> = {
  lt: "Teisė atsisakyti sutarties",
  en: "Right of withdrawal",
};

const RANKING_TITLES: Record<Lang, string> = {
  lt: "Kaip rikiuojami rezultatai",
  en: "Ranking of results",
};

const ILLEGAL_CONTENT_TITLES: Record<Lang, string> = {
  lt: "Neteisėto turinio pranešimas ir sprendimų apskundimas",
  en: "Reporting illegal content and appealing our decisions",
};

const P2B_TITLES: Record<Lang, string> = {
  lt: "Meistrams: sąlygų keitimas, ribojimas ir skundai",
  en: "For masters: changes, restrictions and complaints",
};

/**
 * Refund policy. The rules on deposits and on the master subscription are lifted
 * from the Terms by title; only the framing and the mechanics of a refund are
 * written here.
 */
export function refundSections(lang: Lang): LegalSection[] {
  const deposits = termsSection(lang, DEPOSIT_TITLES[lang]);
  const subscription = termsSection(lang, SUBSCRIPTION_TITLES[lang]);
  const withdrawal = termsSection(lang, WITHDRAWAL_TITLES[lang]);

  if (lang === "en") {
    return [
      {
        title: "Who these terms apply to",
        paragraphs: [
          "Gloumi is a platform connecting beauty professionals with clients. The service is provided by the professional, who is responsible for it; Gloumi acts as intermediary for the booking and, where the professional has set one, collects a deposit.",
          "These terms explain when and how money is returned. They supplement the Terms of Service and do not change them; in case of conflict the Terms of Service apply.",
        ],
      },
      { title: "Deposits for an appointment", paragraphs: deposits.paragraphs, bullets: deposits.bullets },
      { title: withdrawal.title, paragraphs: withdrawal.paragraphs, bullets: withdrawal.bullets },
      {
        title: "How and how quickly we refund",
        bullets: [
          "A deposit is refunded to the payment method it was paid with, through our payments partner Stripe.",
          "We start the refund as soon as the cancellation meets the conditions; banks usually credit it within 5 to 10 working days.",
          "We charge no fee for a refund.",
          "A master subscription (Pro or VIP Studio) is not bought from us: it is bought in the App Store or on Google Play, so Apple or Google refund it under their own rules. See the next section.",
          "Cash paid directly to the professional does not pass through Gloumi and cannot be refunded by us; speak to the professional.",
        ],
      },
      { title: "The professional's subscription", paragraphs: subscription.paragraphs, bullets: subscription.bullets },
      {
        title: "Disagreements and your rights as a consumer",
        paragraphs: [
          `If you believe a refund was handled wrongly, write to ${site.email} and we will look into it with the professional.`,
          "Consumers may also contact the State Consumer Rights Protection Authority of Lithuania (vvtat.lt). These terms do not limit your rights under mandatory Lithuanian and European Union law.",
        ],
      },
    ];
  }

  return [
    {
      title: "Kam taikomos šios sąlygos",
      paragraphs: [
        "Gloumi yra platforma, jungianti grožio paslaugų meistrus ir klientus. Paslaugą teikia ir už ją atsako meistras; Gloumi tarpininkauja rezervuojant ir, kai meistras taip nustato, surenka avansą arba užstatą.",
        "Šios sąlygos paaiškina, kada ir kaip pinigai grąžinami. Jos papildo Naudojimosi taisykles ir jų nekeičia – nesutapimo atveju vadovaujamasi Taisyklėmis.",
      ],
    },
    { title: "Avansas ir užstatas už vizitą", paragraphs: deposits.paragraphs, bullets: deposits.bullets },
    { title: withdrawal.title, paragraphs: withdrawal.paragraphs, bullets: withdrawal.bullets },
    {
      title: "Kaip ir per kiek laiko grąžiname",
      bullets: [
        "Avansą grąžiname į tą pačią mokėjimo priemonę, kuria buvo sumokėta, per mokėjimų partnerį Stripe.",
        "Grąžinimą inicijuojame, kai atšaukimas atitinka sąlygas; bankas sumą paprastai įskaito per 5–10 darbo dienų.",
        "Už grąžinimą papildomų mokesčių netaikome.",
        "Meistro prenumerata (Pro ar VIP Studio) perkama ne iš mūsų, o App Store arba Google Play, tad pinigus už ją grąžina Apple arba Google pagal savo taisykles. Žr. kitą skyrių.",
        "Tiesiogiai meistrui grynaisiais sumokėtos sumos per Gloumi negrąžinamos – dėl jų kreipkitės į meistrą.",
      ],
    },
    { title: "Meistro prenumerata", paragraphs: subscription.paragraphs, bullets: subscription.bullets },
    {
      title: "Nesutarimai ir vartotojo teisės",
      paragraphs: [
        `Jei manote, kad grąžinimas pritaikytas neteisingai, parašykite ${site.email} – atsakysime ir padėsime išsiaiškinti su meistru.`,
        "Vartotojai gali kreiptis į Valstybinę vartotojų teisių apsaugos tarnybą (vvtat.lt). Šios sąlygos neriboja Jūsų teisių pagal imperatyvias Lietuvos Respublikos ir Europos Sąjungos teisės normas.",
      ],
    },
  ];
}

/**
 * DAC7 and platform-transparency notice (DAC7, DSA, P2B). Informational: the
 * binding documents remain the Terms and the Privacy Policy.
 */
export function dac7Sections(lang: Lang): LegalSection[] {
  /*
   * Ranking, notice-and-action and the P2B section are lifted from the Terms
   * rather than restated. Restating them once put a wrong ranking on this page:
   * it claimed search is ordered by distance from the reader, while the app
   * ranks search by the filters the reader picks and personalises only the
   * feed. P2B requires the parameters to be accurate, so there is one source.
   */
  const ranking = termsSection(lang, RANKING_TITLES[lang]);
  const illegalContent = termsSection(lang, ILLEGAL_CONTENT_TITLES[lang]);
  const p2b = termsSection(lang, P2B_TITLES[lang]);

  if (lang === "en") {
    return [
      {
        title: "What Gloumi is",
        paragraphs: [
          `The Gloumi app and this site are operated by ${site.legalName}. Gloumi is a digital platform: it lets beauty professionals offer their services and lets clients find and book them. Gloumi does not provide beauty services itself and is not a party to the contract between a professional and a client.`,
        ],
      },
      {
        title: "DAC7: what we report to the tax authority",
        paragraphs: [
          "EU Council Directive 2021/514 (DAC7) requires operators of digital platforms to collect information about sellers who earn income through them and to report it to the tax authority once a year. In Lithuania that is the State Tax Inspectorate (VMI), reporting on the previous calendar year.",
        ],
        bullets: [
          "We collect: the professional's name or the company's name, the form of business and the company or self-employment certificate number, the address, the VAT number where there is one, and the account details used for payouts.",
          "We report: the consideration received through the platform by quarter, any fees or commission withheld from it, and the number of services provided.",
          "Reporting covers sellers who meet the thresholds set in the directive; each professional receives a copy of the data reported about them.",
          "We ask for these details when the professional account is created, because they cannot be collected retrospectively.",
        ],
      },
      {
        title: "Transparency under the Digital Services Act (DSA)",
        paragraphs: [
          `Gloumi is an intermediary service under EU Regulation 2022/2065 (the Digital Services Act). The single point of contact for authorities and for users is ${site.email}.`,
        ],
        bullets: [
          "Gloumi is a small enterprise, so some DSA obligations that apply to larger platforms (transparency reports, for example) do not apply to it. That does not change our commitment to act on reports.",
        ],
      },
      { title: illegalContent.title, paragraphs: illegalContent.paragraphs, bullets: illegalContent.bullets },
      { title: ranking.title, paragraphs: ranking.paragraphs, bullets: ranking.bullets },
      {
        title: "For business users (P2B)",
        paragraphs: [
          "Professionals use Gloumi as business users under EU Regulation 2019/1150. What that means in practice is set out in the Terms of Service and repeated below, so that this page and the Terms cannot drift apart.",
        ],
      },
      { title: p2b.title, paragraphs: p2b.paragraphs, bullets: p2b.bullets },
      { title: "Contact", paragraphs: [controllerLine("en")] },
    ];
  }

  return [
    {
      title: "Kas yra Gloumi",
      paragraphs: [
        `Gloumi programėlę ir svetainę valdo ${site.legalName}. Gloumi yra skaitmeninė platforma: ji leidžia grožio paslaugų meistrams siūlyti paslaugas, o klientams – jas rasti ir rezervuoti. Gloumi pati grožio paslaugų neteikia ir nėra paslaugų sutarties tarp meistro ir kliento šalis.`,
      ],
    },
    {
      title: "DAC7: ką pranešame mokesčių administratoriui",
      paragraphs: [
        "ES Tarybos direktyva 2021/514 (DAC7) įpareigoja skaitmeninių platformų operatorius rinkti ir kasmet teikti mokesčių administratoriui informaciją apie pardavėjus, kurie per platformą uždirba pajamų. Lietuvoje ši informacija teikiama Valstybinei mokesčių inspekcijai (VMI) už praėjusius kalendorinius metus.",
      ],
      bullets: [
        "Renkame: meistro vardą ir pavardę arba juridinio asmens pavadinimą, veiklos formą ir įmonės ar individualios veiklos pažymos numerį, adresą, PVM mokėtojo kodą (jei yra) ir mokėjimams naudojamos sąskaitos duomenis.",
        "Pranešame: per platformą gautą atlygį pagal ketvirčius, iš jo išskaičiuotus mokesčius ar komisinius ir įvykdytų paslaugų skaičių.",
        "Pranešimas teikiamas apie tuos pardavėjus, kurie atitinka direktyvoje nustatytus kriterijus; meistras gauna apie jį pateiktų duomenų kopiją.",
        "Šių duomenų prašome jau kuriant meistro paskyrą, nes atgaline data jų surinkti nebeįmanoma.",
      ],
    },
    {
      title: "Skaidrumas pagal Skaitmeninių paslaugų aktą (DSA)",
      paragraphs: [
        `Gloumi yra tarpininkavimo paslauga pagal ES reglamentą 2022/2065 (Skaitmeninių paslaugų aktas). Vieno kontaktinio punkto funkciją valstybės institucijoms ir naudotojams atlieka el. paštas ${site.email}.`,
      ],
      bullets: [
        "Gloumi yra maža įmonė, todėl kai kurios didesnėms platformoms taikomos DSA pareigos (pavyzdžiui, skaidrumo ataskaitos) jai netaikomos. Tai nekeičia įsipareigojimo reaguoti į pranešimus.",
      ],
    },
    { title: illegalContent.title, paragraphs: illegalContent.paragraphs, bullets: illegalContent.bullets },
    { title: ranking.title, paragraphs: ranking.paragraphs, bullets: ranking.bullets },
    {
      title: "Verslo naudotojams (P2B)",
      paragraphs: [
        "Meistrai Gloumi naudojasi kaip verslo naudotojai (ES reglamentas 2019/1150). Ką tai reiškia praktiškai, surašyta Naudojimosi taisyklėse ir pakartota žemiau, kad šis puslapis ir Taisyklės negalėtų prasilenkti.",
      ],
    },
    { title: p2b.title, paragraphs: p2b.paragraphs, bullets: p2b.bullets },
    { title: "Kontaktai", paragraphs: [controllerLine("lt")] },
  ];
}
