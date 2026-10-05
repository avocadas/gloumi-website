import type { LegalKey, SectionKey } from "./lang";

/**
 * Every visible string on the landing page, in Lithuanian.
 *
 * Shape lives here and copy.en.ts is typed against it, so a key added on one
 * side and forgotten on the other fails the typecheck instead of rendering
 * `undefined` on a live page. Deliberately NOT `as const`: literal types would
 * force the English strings to equal the Lithuanian ones.
 *
 * One file so the tone stays consistent and so a second language later is a
 * second file, not a hunt through components. Lithuanian quotation marks are
 * „ “ throughout; the reader is addressed as „jūs“, lowercase – the app talks the same way
 * (`docs/content/tonas.md` in the Gloumi repo).
 */
export const lt = {
  a11y: {
    skip: "Pereiti į turinį",
  },

  nav: {
    ariaLabel: "Pagrindinė navigacija",
    links: [
      { key: "categories", label: "Kategorijos" },
      { key: "why", label: "Kodėl Gloumi" },
      { key: "masters", label: "Meistrams" },
      { key: "contact", label: "Kontaktai" },
    ] as { key: SectionKey; label: string }[],
    cta: "Atsisiųsti",
    open: "Atidaryti meniu",
    close: "Uždaryti meniu",
    home: "Gloumi – į pradžią",
    language: "Kalba",
  },

  seo: {
    title: "Gloumi – grožio meistrų paieška ir rezervavimas Lietuvoje",
    titleTemplate: "%s · Gloumi",
    description:
      "Atraskite ir rezervuokite geriausius grožio bei savijautos meistrus Lietuvoje: nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra. Laisvi laikai, aiškios kainos ir tikri atsiliepimai – vienoje programėlėje.",
    keywords: [
      "grožio meistrai",
      "rezervacija internetu",
      "manikiūras Vilnius",
      "kirpykla rezervacija",
      "antakių laminavimas",
      "masažas rezervacija",
      "makiažo meistras",
      "kosmetologė",
      "grožio salonas programėlė",
      "Gloumi",
    ],
    ogAlt: "Gloumi – grožio meistrų paieškos ir rezervavimo programėlė",
    ogHeadline: "Grožio meistrai ir rezervavimas internetu",
    ogSub: "Nagai · Plaukai · Antakiai · Masažai · Makiažas · Oda",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Grožio ir savijautos meistrai Lietuvoje",
    titleStart: "Atraskite ir rezervuokite",
    titleAccent: "geriausius",
    titleEnd: "grožio meistrus Lietuvoje",
    lead:
      "Nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra – tikri meistrų darbai, laisvi laikai ir aiškios kainos vienoje programėlėje. Rezervuokite bet kurią paros valandą, be skambučių ir laukimo.",
    masterCta: "Esu meistras / Prisijungti",
    trustLabel: "Kodėl verta",
    trust: ["Nemokama klientams", "Be paslėptų mokesčių", "Atsiliepimai tik po vizito"],
    floatingReviews: { title: "Tikri atsiliepimai", sub: "Tik po įvykusio vizito" },
    floatingBooking: { title: "Laikas patvirtintas", sub: "Penktadienis, 13:00" },
  },

  stores: {
    apple: { small: "Atsisiųskite iš", big: "App Store", srOpens: "(atsidaro naujame lange)" },
    google: { small: "Gaukite iš", big: "Google Play", srOpens: "(atsidaro naujame lange)" },
    soon: "Netrukus",
    soonTitle: "Programėlė netrukus pasirodys parduotuvėje",
    soonSr: "– nuoroda pasirodys, kai programėlė bus parduotuvėje",
  },

  phone: {
    ariaLabel: "Programėlės ekranų peržiūra",
    tabsLabel: "Programėlės ekranai",
    tabs: [
      { id: "feed", label: "Atrasti", alt: "Gloumi srautas: meistrų Story ir naujausi darbai" },
      { id: "search", label: "Paieška", alt: "Gloumi paieška: meistrai pagal paslaugą, kainą, įvertinimą ir atstumą" },
      {
        id: "profile",
        label: "Profilis",
        alt: "Meistrės profilis Gloumi programėlėje: įvertinimas, aprašymas, adresas ir žemėlapis",
      },
      { id: "booking", label: "Rezervavimas", alt: "Vizito rezervavimas Gloumi programėlėje: kalendorius ir laisvi laikai" },
    ] as { id: "feed" | "search" | "profile" | "booking"; label: string; alt: string }[],
    note: "Ekranuose – pavyzdiniai meistrai ir atsiliepimai.",
  },

  categories: {
    eyebrow: "Kategorijos",
    title: "Kiekvienai grožio rutinai – savas meistras",
    lead: "Paspauskite kategoriją ir pažiūrėkite, ką joje rasite. Programėlėje kiekviena turi savo meistrus, darbus ir laisvus laikus.",
    cta: "Rasti meistrą",
    listLabel: "Paslaugų kategorijos",
  },

  why: {
    eyebrow: "Klientams",
    title: "Kodėl Gloumi?",
    lead: "Viskas, kad grožio vizitas prasidėtų be streso – nuo įkvėpimo iki patvirtinto laiko.",
    items: [
      {
        title: "Rezervuokite 24/7",
        text: "Matote meistro laisvus laikus realiu laiku ir rezervuojate iškart – vidurnaktį ar per pietų pertrauką. Be skambučių, be „parašysiu vėliau“.",
      },
      {
        title: "„Noriu taip“ – įkvėpimas iš tikrų darbų",
        text: "Naršote tikrus meistrų darbus, išsaugote patikusius į bloknotus ir rezervuodami parodote meistrui: noriu būtent taip.",
      },
      {
        title: "Skaidrios kainos",
        text: "Kainą ir trukmę matote prieš rezervuodami. Mokate tiek, kiek parašyta – be paslėptų mokesčių ir netikėtumų kasoje.",
      },
      {
        title: "Tikri atsiliepimai",
        text: "Atsiliepimą palikti galima tik po įvykusio vizito, todėl kiekvienas įvertinimas – iš tikros patirties, ne iš anoniminės minios.",
      },
    ],
    howTitle: "Kaip tai veikia",
    steps: [
      { title: "Raskite", text: "Pagal kategoriją, vietą žemėlapyje ar darbą, kuris patiko." },
      { title: "Rezervuokite", text: "Pasirinkite laiką ir patvirtinkite per kelias sekundes." },
      { title: "Ateikite", text: "Priminimą atsiųsime, o atsiliepimą paliksite po vizito." },
    ],
  },

  masters: {
    eyebrow: "Meistrams",
    title: "Daugiau klientų. Mažiau tuščių valandų.",
    lead: "Gloumi – jūsų registratūra, vitrina ir kalendorius vienoje programėlėje. Pradėkite nuo Starter plano už 0 € – mokamą planą rinkitės, kai reikės daugiau.",
    items: [
      {
        title: "Mažiau neatvykimų",
        text: "Prašykite avanso – klientas patvirtina laiką pinigais, o neatvykus avansas lieka jums.",
      },
      {
        title: "Priminimai, kurie sugrąžina",
        text: "Automatiniai priminimai apie artėjantį vizitą ir pasiūlymas rezervuoti iš naujo, kai laikas pakartoti vizitą.",
      },
      {
        title: "Profilis – jūsų vitrina",
        text: "Lankstūs valdikliai: portfolio, paslaugos, darbo laikas, Story ir atsiliepimai. Sudėliokite profilį taip, kaip norite, kad jį matytų klientas.",
      },
      {
        title: "Pajamų analitika",
        text: "Dienos ir mėnesio pajamos, populiariausios paslaugos, grįžtantys klientai – skaičiai, kurie padeda planuoti, o ne spėlioti.",
      },
    ],
    chipsLabel: "Kitos galimybės",
    chips: [
      "Išmokos į banko sąskaitą per Stripe",
      "Klientų kortelės su privačiais užrašais",
      "Asmeninė registracijos nuoroda",
      "Pertraukos ir užblokuotas laikas kalendoriuje",
      "Story ir įrašai bendruomenei",
    ],
  },

  form: {
    eyebrow: "Meistro paskyra",
    title: "Tapkite Gloumi meistru",
    lead: "Palikite kontaktus – padėsime susikurti profilį ir atsakysime į klausimus. Meistro profilį programėlėje galite susikurti ir patys.",
    fields: {
      name: "Vardas",
      email: "El. paštas",
      phone: "Telefonas",
      city: "Miestas",
      category: "Pagrindinė kategorija",
      categoryPlaceholder: "Pasirinkite kategoriją",
      categoryOther: "Kita",
      link: "Instagram ar kita nuoroda į darbus",
      message: "Žinutė",
      messagePlaceholder: "Kiek metų dirbate, ar turite saloną, ko tikitės iš Gloumi…",
      optional: "neprivaloma",
    },
    consentStart: "Sutinku, kad MB „Gloumi“ susisiektų su manimi dėl meistro paskyros. Duomenys tvarkomi pagal ",
    consentLink: "Privatumo politiką",
    consentEnd: ".",
    submit: "Noriu prisijungti",
    submitting: "Siunčiama…",
    successTitle: "Ačiū – gavome!",
    successText: "Netrukus susisieksime nurodytu el. paštu. O kol kas – atsisiųskite programėlę ir apsižiūrėkite.",
    another: "Siųsti kitą užklausą",
    errorGeneric: "Nepavyko išsiųsti. Pabandykite dar kartą arba parašykite mums el. paštu.",
    errorNetwork: "Nėra ryšio. Patikrinkite internetą ir pabandykite dar kartą.",
    errorValidation: "Patikrinkite pažymėtus laukus.",
    errorRateLimited: "Per daug bandymų iš eilės. Pabandykite po kelių minučių.",
    unconfiguredTitle: "Forma dar ruošiama",
    unconfiguredText: "Parašykite mums tiesiai – atsakysime tuo pačiu adresu:",
    mailSubject: "Noriu tapti Gloumi meistru",
  },

  finalCta: {
    title: "Grožis prasideda nuo gero laiko.",
    lead: "Atsisiųskite Gloumi ir rezervuokite pirmąjį vizitą – arba prisijunkite kaip meistras ir užpildykite savo kalendorių.",
    masterLink: "Esu meistras",
  },

  footer: {
    tagline: "Grožio meistrų ir klientų platforma Lietuvoje.",
    clients: "Klientams",
    masters: "Meistrams",
    legal: "Teisinė informacija",
    contacts: "Kontaktai",
    clientLinks: [
      { key: "download", label: "Atsisiųsti programėlę" },
      { key: "categories", label: "Kategorijos" },
      { key: "why", label: "Kodėl Gloumi" },
    ] as { key: SectionKey; label: string }[],
    masterLinks: [
      { key: "masters", label: "Privalumai meistrams" },
      { key: "join", label: "Tapti meistru" },
    ] as { key: SectionKey; label: string }[],
    faq: "Dažniausi klausimai",
    faqMasters: "Klausimai meistrams",
    legalLinks: [
      { key: "terms", label: "Naudojimosi taisyklės" },
      { key: "privacy", label: "Privatumo politika" },
      { key: "partner", label: "Meistrų ir salonų sąlygos" },
      { key: "refunds", label: "Grąžinimo sąlygos" },
      { key: "transparency", label: "DAC7 ir platformos skaidrumas" },
      { key: "deletion", label: "Paskyros trynimas" },
    ] as { key: LegalKey; label: string }[],
    companyLabel: "Įmonės kodas",
    vatLabel: "PVM kodas",
    rights: "Visos teisės saugomos.",
    operator: "Platformos operatorius ir kontaktinis punktas pagal ES Skaitmeninių paslaugų aktą (DSA):",
    trademarks: "Apple ir App Store yra Apple Inc. prekių ženklai. Google Play yra Google LLC prekių ženklas.",
    socialLabel: "Socialiniai tinklai",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Teisinė informacija",
    updated: "Atnaujinta",
    version: "versija",
    toc: "Turinys",
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    controller: "Duomenų valdytojas ir platformos operatorius",
    contactQuestion: "Klausimai dėl duomenų ar taisyklių?",
    disclaimer:
      "Šis puslapis – informacinio pobūdžio santrauka. Teisiškai įpareigojantys dokumentai yra Naudojimosi taisyklės, Privatumo politika ir Meistrų ir salonų sąlygos.",
    otherDocs: "Kiti dokumentai",
  },

  faq: {
    eyebrow: "Pagalba",
    intro: "Trumpi atsakymai pagal dabar galiojančias Naudojimosi taisykles. Neradote atsakymo? Rašykite",
    toc: "Temos",
  },

  notFound: {
    eyebrow: "404",
    title: "Šio puslapio nerandame",
    text: "Nuoroda galėjo pasikeisti arba puslapis buvo perkeltas.",
    cta: "Grįžti į pradžią",
  },
};
