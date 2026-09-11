import { LEGAL_DOCS, LEGAL_META, type LegalLang, type LegalSection } from "./legal-source";
import { site } from "./site";

export { LEGAL_DOCS, LEGAL_META };
export type { LegalLang, LegalSection };

/** The four documents the footer links to, with their public paths. */
export const legalPages = [
  { slug: "taisykles", title: "Naudojimosi taisyklės", titleEn: "Terms of Service" },
  { slug: "privatumo-politika", title: "Privatumo politika", titleEn: "Privacy Policy" },
  { slug: "grazinimo-salygos", title: "Grąžinimo sąlygos", titleEn: "Refund Policy" },
  { slug: "dac7", title: "DAC7 ir platformos skaidrumas", titleEn: "DAC7 and platform transparency" },
] as const;

export type LegalSlug = (typeof legalPages)[number]["slug"];

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

/** The controller line shown under every document, built from what is actually known. */
export function controllerLine(): string {
  const parts: string[] = [site.legalName];
  if (site.company.code) parts.push(`įmonės kodas ${site.company.code}`);
  if (site.company.address) parts.push(site.company.address);
  parts.push(site.email);
  return parts.join(", ");
}

function termsSection(title: string): LegalSection {
  const found = LEGAL_DOCS.lt.terms.find((s) => s.title === title);
  if (!found) throw new Error(`Terms section "${title}" not found in legal-source.ts – regenerate it.`);
  return found;
}

/**
 * Refund policy. The rules on deposits and on the Pro subscription are lifted
 * from the Terms by title so the two pages cannot disagree; only the framing
 * and the mechanics of a refund are written here.
 */
export function refundSections(): LegalSection[] {
  const deposits = termsSection("Rezervacijos ir avansas");
  const subscription = termsSection("Meistro prenumerata (Pro)");
  return [
    {
      title: "Kam taikomos šios sąlygos",
      paragraphs: [
        "Gloumi yra platforma, jungianti grožio paslaugų meistrus ir klientus. Paslaugą teikia ir už ją atsako meistras; Gloumi tarpininkauja rezervuojant ir, kai meistras taip nustato, surenka avansą arba užstatą.",
        "Šios sąlygos paaiškina, kada ir kaip pinigai grąžinami. Jos papildo Naudojimosi taisykles ir jų nekeičia – nesutapimo atveju vadovaujamasi Taisyklėmis.",
      ],
    },
    {
      title: "Avansas ir užstatas už vizitą",
      paragraphs: deposits.paragraphs,
      bullets: deposits.bullets,
    },
    {
      title: "Kaip ir per kiek laiko grąžiname",
      bullets: [
        "Grąžiname į tą pačią mokėjimo priemonę, kuria buvo sumokėta, per mokėjimų partnerį Stripe.",
        "Grąžinimą inicijuojame, kai atšaukimas atitinka sąlygas; bankas sumą paprastai įskaito per 5–10 darbo dienų.",
        "Už grąžinimą papildomų mokesčių netaikome.",
        "Tiesiogiai meistrui grynaisiais sumokėtos sumos per Gloumi negrąžinamos – dėl jų kreipkitės į meistrą.",
      ],
    },
    {
      title: "Meistro prenumerata",
      paragraphs: subscription.paragraphs,
      bullets: subscription.bullets,
    },
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
export function dac7Sections(): LegalSection[] {
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
        "Apie neteisėtą turinį – svetimas nuotraukas, klaidinančius atsiliepimus, įžeidžiantį turinį – galima pranešti tuo pačiu adresu, nurodant, kur turinys yra ir kodėl, Jūsų nuomone, jis neteisėtas.",
        "Pašalinę ar apriboję turinį, jo autoriui nurodome priežastį ir kaip sprendimą apskųsti.",
        "Meistrų tvarką paieškoje lemia atstumas iki Jūsų, atitikimas užklausai ar kategorijai, įvertinimai ir laisvi laikai. Jei meistro pozicija priklauso nuo mokamo plano, tai pažymima.",
        "Gloumi yra maža įmonė, todėl kai kurios didesnėms platformoms taikomos DSA pareigos (pavyzdžiui, skaidrumo ataskaitos) jai netaikomos. Tai nekeičia įsipareigojimo reaguoti į pranešimus.",
      ],
    },
    {
      title: "Verslo naudotojams (P2B)",
      paragraphs: [
        "Meistrai Gloumi naudojasi kaip verslo naudotojai (ES reglamentas 2019/1150). Sąlygos, kuriomis paskyra gali būti apribota ar nutraukta, ir pagrindiniai paieškos tvarkos parametrai aprašyti Naudojimosi taisyklėse ir šiame puslapyje. Apie esminius sąlygų pakeitimus meistrams pranešame iš anksto.",
      ],
    },
    {
      title: "Kontaktai",
      paragraphs: [controllerLine()],
    },
  ];
}
