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
 * „ “ throughout; the reader is addressed as „tu“ – the app talks the same way.
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
    title: "Gloumi – grožio meistrai ir rezervacijos Lietuvoje",
    titleTemplate: "%s · Gloumi",
    description:
      "Atrask ir rezervuok geriausius grožio bei savijautos meistrus Lietuvoje: nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra. Laisvi laikai, aiškios kainos ir tikri atsiliepimai – vienoje programėlėje.",
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
    ogAlt: "Gloumi – grožio meistrų ir rezervacijų programėlė",
    ogHeadline: "Grožio meistrai ir rezervacijos Lietuvoje",
    ogSub: "Nagai · Plaukai · Antakiai · Masažai · Makiažas · Oda",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Grožio ir savijautos meistrai Lietuvoje",
    titleStart: "Atrask ir rezervuok",
    titleAccent: "geriausius",
    titleEnd: "grožio meistrus Lietuvoje",
    lead:
      "Nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra – tikri meistrų darbai, laisvi laikai ir aiškios kainos vienoje programėlėje. Rezervuok bet kurią paros valandą, be skambučių ir laukimo.",
    masterCta: "Esu meistras / Prisijungti",
    trustLabel: "Kodėl verta",
    trust: ["Nemokama klientams", "Be paslėptų mokesčių", "Atsiliepimai tik po vizito"],
    floatingRating: { value: "4,9", label: "128 atsiliepimai" },
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
    time: "9:41",
    tabs: [
      { id: "search", label: "Paieška" },
      { id: "categories", label: "Kategorijos" },
      { id: "calendar", label: "Kalendorius" },
    ] as { id: "search" | "categories" | "calendar"; label: string }[],
    search: {
      locationLabel: "Vieta",
      city: "Vilnius",
      placeholder: "Meistras, paslauga ar salonas",
      chips: ["Visi", "Nagai", "Plaukai", "Antakiai", "Masažai"],
      nearby: "Šalia tavęs",
      map: "Žemėlapis",
      availableToday: "Laisva šiandien",
      from: "nuo",
      masters: [
        {
          initials: "EJ",
          name: "Eglė J.",
          role: "Nagų meistrė",
          rating: "4,9",
          reviews: "128",
          distance: "1,2 km",
          price: "35 €",
          today: true,
          hue: "#8F3D26",
        },
        {
          initials: "RK",
          name: "Rūta K.",
          role: "Plaukų stilistė",
          rating: "5,0",
          reviews: "86",
          distance: "2,4 km",
          price: "45 €",
          today: false,
          hue: "#7A3350",
        },
        {
          initials: "AM",
          name: "Aistė M.",
          role: "Antakiai ir blakstienos",
          rating: "4,8",
          reviews: "203",
          distance: "0,8 km",
          price: "25 €",
          today: true,
          hue: "#574463",
        },
      ],
    },
    categories: {
      title: "Kategorijos",
      stories: "Istorijos",
      storyNames: ["Eglė", "Rūta", "Aistė", "Monika", "Greta"],
      popular: "Populiaru šią savaitę",
      popularItems: ["Gelinis manikiūras", "Antakių laminavimas", "Balayage"],
    },
    calendar: {
      title: "Rezervacija",
      master: "Eglė J.",
      service: "Manikiūras su geliu",
      meta: "60 min · 35 €",
      month: "Rugsėjis 2026",
      weekdays: ["P", "A", "T", "K", "Pn", "Š", "S"],
      slotsLabel: "Laisvi laikai",
      slots: ["10:00", "11:30", "13:00", "15:30", "17:00"],
      confirm: "Patvirtinti · 35 €",
      deposit: "Užstatas 10 € – grąžinamas atšaukus iki 24 val.",
    },
    tabbar: ["Srautas", "Paieška", "Vizitai", "Profilis"],
  },

  categories: {
    eyebrow: "Kategorijos",
    title: "Kiekvienai grožio rutinai – savas meistras",
    lead: "Paspausk kategoriją ir pažiūrėk, ką joje rasi. Programėlėje kiekviena turi savo meistrus, darbus ir laisvus laikus.",
    cta: "Rasti meistrą",
    listLabel: "Paslaugų kategorijos",
  },

  why: {
    eyebrow: "Klientams",
    title: "Kodėl Gloumi?",
    lead: "Viskas, kad grožio vizitas prasidėtų be streso – nuo įkvėpimo iki patvirtinto laiko.",
    items: [
      {
        title: "Rezervacija 24/7",
        text: "Matai meistro laisvus laikus realiu laiku ir užsirašai iškart – vidurnaktį ar per pietų pertrauką. Be skambučių, be „parašysiu vėliau“.",
      },
      {
        title: "„Noriu taip“ – įkvėpimas iš tikrų darbų",
        text: "Lookbook’e naršai tikrus meistrų darbus, išsaugai patikusius ir rezervacijoje parodai meistrui: noriu būtent taip.",
      },
      {
        title: "Skaidrios kainos",
        text: "Kainą ir trukmę matai prieš rezervaciją. Moki tiek, kiek parašyta – be paslėptų mokesčių ir netikėtumų kasoje.",
      },
      {
        title: "Tikri atsiliepimai",
        text: "Atsiliepimą palikti galima tik po įvykusio vizito, todėl kiekvienas įvertinimas – iš tikros patirties, ne iš anoniminės minios.",
      },
    ],
    howTitle: "Kaip tai veikia",
    steps: [
      { title: "Rask", text: "Pagal kategoriją, vietą žemėlapyje ar darbą, kuris patiko." },
      { title: "Rezervuok", text: "Pasirink laiką ir patvirtink per kelias sekundes." },
      { title: "Ateik", text: "Priminimą atsiųsime, o atsiliepimą paliksi po vizito." },
    ],
  },

  masters: {
    eyebrow: "Meistrams",
    title: "Daugiau klientų. Mažiau tuščių valandų.",
    lead: "Gloumi – tavo registratūra, vitrina ir apskaita vienoje programėlėje. Pradėk nemokamai, mokėk tik tada, kai reikia daugiau.",
    items: [
      {
        title: "Nulis neatvykimų",
        text: "Nustatyk užstatą ar avansą – klientas patvirtina laiką pinigais, o neatvykus kompensacija lieka tau.",
      },
      {
        title: "Priminimai, kurie sugrąžina",
        text: "Automatiniai priminimai apie artėjantį vizitą ir pasiūlymas užsirašyti iš naujo, kai laikas pakartoti procedūrą.",
      },
      {
        title: "Profilis – tavo vitrina",
        text: "Lankstūs valdikliai: portfolio, paslaugos, darbo laikas, istorijos ir atsiliepimai. Sudėliok profilį taip, kaip nori, kad jį matytų klientas.",
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
      "Istorijos ir įrašai bendruomenei",
    ],
  },

  form: {
    eyebrow: "Meistro paskyra",
    title: "Tapk Gloumi meistru",
    lead: "Palik kontaktus – padėsime susikurti profilį ir atsakysime į klausimus. Meistro profilį programėlėje gali susikurti ir savarankiškai.",
    fields: {
      name: "Vardas",
      email: "El. paštas",
      phone: "Telefonas",
      city: "Miestas",
      category: "Pagrindinė kategorija",
      categoryPlaceholder: "Pasirink kategoriją",
      categoryOther: "Kita",
      link: "Instagram ar kita nuoroda į darbus",
      message: "Žinutė",
      messagePlaceholder: "Kiek metų dirbi, ar turi saloną, ko tikiesi iš Gloumi…",
      optional: "neprivaloma",
    },
    consentStart: "Sutinku, kad MB „Gloumi“ susisiektų su manimi dėl meistro paskyros. Duomenys tvarkomi pagal ",
    consentLink: "Privatumo politiką",
    consentEnd: ".",
    submit: "Noriu prisijungti",
    submitting: "Siunčiama…",
    successTitle: "Ačiū – gavome!",
    successText: "Netrukus susisieksime nurodytu el. paštu. O kol kas – atsisiųsk programėlę ir apsižiūrėk.",
    another: "Siųsti kitą užklausą",
    errorGeneric: "Nepavyko išsiųsti. Pabandyk dar kartą arba parašyk mums el. paštu.",
    errorNetwork: "Nėra ryšio. Patikrink internetą ir pabandyk dar kartą.",
    errorValidation: "Patikrink pažymėtus laukus.",
    errorRateLimited: "Per daug bandymų iš eilės. Pabandyk po kelių minučių.",
    unconfiguredTitle: "Forma dar ruošiama",
    unconfiguredText: "Parašyk mums tiesiai – atsakysime tuo pačiu adresu:",
    mailSubject: "Noriu tapti Gloumi meistru",
  },

  finalCta: {
    title: "Grožis prasideda nuo gero laiko.",
    lead: "Atsisiųsk Gloumi ir rezervuok pirmąjį vizitą – arba prisijunk kaip meistras ir užpildyk savo kalendorių.",
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
    legalLinks: [
      { key: "terms", label: "Naudojimosi taisyklės" },
      { key: "privacy", label: "Privatumo politika" },
      { key: "refunds", label: "Grąžinimo sąlygos" },
      { key: "transparency", label: "DAC7 ir platformos skaidrumas" },
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
      "Šis puslapis – informacinio pobūdžio santrauka. Teisiškai įpareigojantys dokumentai yra Naudojimosi taisyklės ir Privatumo politika.",
    otherDocs: "Kiti dokumentai",
  },

  notFound: {
    eyebrow: "404",
    title: "Šio puslapio nerandame",
    text: "Nuoroda galėjo pasikeisti arba puslapis buvo perkeltas.",
    cta: "Grįžti į pradžią",
  },
};
