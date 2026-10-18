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
      "Raskite grožio ir savijautos meistrus Lietuvoje ir rezervuokite bet kada: nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra. Laisvi laikai, kainos prieš rezervuojant ir atsiliepimai tik po įvykusio vizito – vienoje programėlėje.",
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
    ogSub: "Nagai · Plaukai · Antakiai · Makiažas · Oda · Masažai",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Grožio ir savijautos meistrai Lietuvoje",
    titleStart: "Gloumi – raskite grožio meistrą ir",
    titleAccent: "rezervuokite",
    titleEnd: "bet kada",
    lead:
      "Nagai, plaukai, antakiai, masažai, makiažas ir odos priežiūra – meistrų darbai, laisvi laikai ir aiškios kainos vienoje programėlėje. Rezervuokite bet kurią paros valandą, be skambučių ir laukimo.",
    masterCta: "Esu meistras / Prisijungti",
    trustLabel: "Kodėl verta",
    trust: ["Nemokama klientams", "Be paslėptų mokesčių", "Atsiliepimai tik po vizito"],
    floatingReviews: { title: "Atsiliepimai", sub: "Tik po įvykusio vizito" },
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
    pause: "Sustabdyti ekranų keitimą",
    play: "Paleisti ekranų keitimą",
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
        title: "„Noriu taip“ – įkvėpimas iš meistrų darbų",
        text: "Naršote meistrų darbus, išsaugote patikusius į bloknotus ir rezervuodami parodote meistrui: noriu būtent taip.",
      },
      {
        title: "Skaidrios kainos",
        text: "Kainą ir trukmę matote prieš rezervuodami, o Gloumi prie kainos nieko neprideda.",
      },
      {
        title: "Atsiliepimai tik po vizito",
        text: "Atsiliepimą palikti gali tik klientas, kurio vizitas pas tą meistrą įvyko. Jokių atsiliepimų „iš šono“.",
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
    lead: "Gloumi – jūsų registratūra, vitrina ir kalendorius vienoje programėlėje. Pradėkite nuo Starter plano už 0 € – Gloumi ima 5 % komisinį tik už pirmą įvykusį kiekvieno kliento vizitą pas jus.",
    items: [
      {
        title: "Mažiau neatvykimų",
        text: "Prašykite avanso – jis rezervuojamas kliento kortelėje, o vėlai atšaukus ar neatvykus atitenka jums pagal jūsų atšaukimo sąlygas.",
        // S-082 (Taisyklės 1.13 T-13, M-8): avansai ir mokėjimai programėlėje – tik Pro ir VIP Studio.
        plan: "Pro ir VIP",
      },
      {
        title: "Priminimai, kurie sugrąžina",
        text: "Priminimas klientui prieš vizitą, o sutikusiems gauti pasiūlymus – kvietimas rezervuoti iš naujo, kai ateina laikas: kiekvienai paslaugai patys nustatote, po kiek laiko ją verta kartoti.",
      },
      {
        title: "Profilis – jūsų vitrina",
        text: "Lankstūs valdikliai: portfolio, paslaugos, darbo laikas, Story ir atsiliepimai. Sudėliokite profilį taip, kaip norite, kad jį matytų klientas.",
      },
      {
        title: "Savo klientus atsiveskite be komisinio",
        text: "Gaunate kodą klientams, kuriuos aptarnavote iki Gloumi: jį gali panaudoti iki 50 klientų per 3 mėn. nuo paskyros sukūrimo. Su kodu atėjęs klientas komisinio nesukuria niekada.",
      },
    ],
    chipsLabel: "Kitos galimybės",
    /*
     * `plan` – mokamų planų galimybė (S-082): be žymos meistras galėtų manyti,
     * kad ją turi ir nemokamas Starter. Klientų kortelės – visiems planams
     * (developeris 2026-10-04), automatiniai priminimai – taip pat (2026-10-05).
     */
    chips: [
      { text: "Išmokos į banko sąskaitą per Stripe", plan: "Pro ir VIP" },
      { text: "Klientų kortelės su privačiais užrašais" },
      { text: "Mėnesio pajamų ir populiariausių paslaugų statistika" },
      { text: "Asmeninė registracijos nuoroda" },
      { text: "Pertraukos ir užblokuotas laikas kalendoriuje" },
      { text: "Story ir įrašai bendruomenei" },
    ] as { text: string; plan?: string }[],
  },

  form: {
    eyebrow: "Meistro paskyra",
    title: "Tapkite Gloumi meistru",
    lead: "Palikite kontaktus – padėsime susikurti profilį ir atsakysime į klausimus. Meistro profilį programėlėje galite susikurti ir patys.",
    /** Kol programėlės parduotuvėse nėra (`site.stores` tušti): profilio patys susikurti dar negali. */
    leadSoon: "Palikite kontaktus – padėsime susikurti profilį, kai tik programėlė pasirodys parduotuvėse, ir atsakysime į klausimus.",
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
    successTextSoon: "Netrukus susisieksime nurodytu el. paštu. Programėlė netrukus pasirodys App Store ir Google Play.",
    another: "Siųsti kitą užklausą",
    errorGeneric: "Nepavyko išsiųsti. Pabandykite dar kartą arba parašykite mums el. paštu.",
    errorNetwork: "Nėra ryšio. Patikrinkite internetą ir pabandykite dar kartą.",
    errorValidation: "Patikrinkite pažymėtus laukus.",
    errorRateLimited: "Per daug bandymų iš eilės. Pabandykite po kelių minučių.",
    errorDailyLimit: "Šiandien gavome labai daug užklausų. Parašykite mums info@gloumi.lt – atsakysime.",
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
      { key: "dsa", label: "Skaitmeninių paslaugų aktas" },
      { key: "accessibility", label: "Prieinamumas" },
    ] as { key: LegalKey; label: string }[],
    companyLabel: "Įmonės kodas",
    /* IVPĮ 11 str. (S-075): kuriame registre įmonė įregistruota. */
    registry: "Juridinių asmenų registras",
    phoneLabel: "Tel.",
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

  /** Kai puslapis nulūžta (error.tsx): savas Gloumi langas, ne naršyklės ar Next numatytasis. */
  errorPage: {
    eyebrow: "Klaida",
    title: "Kažkas nepavyko",
    text: "Puslapio nepavyko parodyti. Bandykite dar kartą po akimirkos – jei kartojasi, parašykite mums.",
    retry: "Bandyti dar kartą",
    home: "Grįžti į pradžią",
  },
  /*
   * Puslapiai, į kuriuos veda programėlės dalinimosi nuorodos (#210), kai
   * programėlės telefone nėra arba nuoroda atidaryta naršyklėje.
   */
  appLink: {
    profileTitle: "Šis meistras – Gloumi programėlėje",
    refTitle: "Jus pakvietė į Gloumi",
    text: "Atidarykite nuorodą Gloumi programėlėje. Jei jos dar neturite – atsisiųskite ir atidarykite nuorodą dar kartą.",
    open: "Atidaryti programėlėje",
    masterCode: "Meistro kodas",
    referralCode: "Rekomendacijos kodas",
    codeHint: "Jei nuoroda programėlės neatidarė, šį kodą galėsite įvesti programėlėje.",
    home: "Apie Gloumi",
  },

  /** El. pašto patvirtinimo nuoroda (/patvirtinta): patvirtinama paspaudus, ypač kai laiškas atidarytas kitame įrenginyje. */
  emailConfirm: {
    askTitle: "Patvirtinkite el. paštą",
    askText: "Paspauskite mygtuką – ir jūsų Gloumi paskyros el. paštas bus patvirtintas.",
    confirm: "Patvirtinti el. paštą",
    confirming: "Tvirtinama…",
    title: "El. paštas patvirtintas",
    text: "Grįžkite į Gloumi programėlę ir prisijunkite.",
    open: "Atidaryti programėlę",
    otherDevice: "Laišką atidarėte kitame įrenginyje? Nieko daryti nereikia – prisijunkite programėlėje telefone, kuriame registravotės.",
    errorTitle: "Nuoroda nebegalioja",
    errorText:
      "Ši nuoroda pasenusi (galioja 10 min.) arba jau panaudota. Jei paštą jau patvirtinote – tiesiog prisijunkite programėlėje. Jei ne – įveskite kodą iš laiško programėlėje arba užsisakykite naują laišką.",
    failed: "Patvirtinti nepavyko. Patikrinkite ryšį ir bandykite dar kartą.",
    // El. pašto keitimas (type=email_change): Supabase laišką siunčia abiem adresams.
    changeAskTitle: "Patvirtinkite el. pašto keitimą",
    changeAskText: "Paspauskite mygtuką, kad patvirtintumėte naują Gloumi paskyros el. paštą.",
    changeConfirm: "Patvirtinti keitimą",
    changeTitle: "Patvirtinta",
    changeText: "Jei laišką gavote ir kitu adresu, patvirtinkite ir ten – tada el. paštas pasikeis.",
    changeErrorText:
      "Ši nuoroda pasenusi (galioja 10 min.) arba jau panaudota. Jei el. pašto keitimą jau patvirtinote – nieko daryti nereikia. Jei ne – programėlės nustatymuose pakeiskite el. paštą dar kartą.",
    // Prisijungimo nuoroda (type=magiclink): svetainėje netikrinama – prisijungti galima tik programėlėje.
    magicTitle: "Atidarykite programėlėje",
    magicText:
      "Ši prisijungimo nuoroda veikia tik Gloumi programėlėje. Atidarykite laišką telefone, kuriame įdiegta programėlė, arba įveskite kodą iš laiško programėlėje.",
  },

  /**
   * 2FA nuėmimas per pagalbą (/2fa-pagalba, security 2026-10-18). JUODRAŠTIS:
   * galutinius žodžius derina support ir content. {n} – likę bandymai, {date} – data.
   */
  mfaHelp: {
    title: "Dviejų veiksnių autentifikacijos nuėmimas",
    text: "Įveskite kodą iš laiško, kurį gavote paskyros el. pašto adresu. Kodas galioja 24 valandas.",
    code: "Kodas iš laiško",
    password: "Paskyros slaptažodis (neprivaloma)",
    passwordHint:
      "Jei prisimenate slaptažodį, įveskite jį – tada prašymas gali būti įvykdytas greičiau, ne anksčiau kaip po 3 dienų. Mes slaptažodžio nematome ir nesaugome.",
    show: "Rodyti",
    hide: "Slėpti",
    submit: "Patvirtinti",
    submitting: "Tikrinama…",
    captchaWait: "Palaukite, kol baigsis saugumo patikra.",
    codeInvalid: "Kodas netinka. Patikrinkite, ar įvedėte jį tiksliai kaip laiške ir ar jis dar galioja.",
    passwordWrong: "Slaptažodis netinka. Liko bandymų: {n}. Jei slaptažodžio neprisimenate, palikite lauką tuščią.",
    captchaFailed: "Saugumo patikra nepavyko. Atnaujinkite puslapį ir bandykite dar kartą.",
    tooMany: "Per daug bandymų. Pabandykite vėliau.",
    unavailable: "Šiuo metu patvirtinti nepavyko. Pabandykite po kelių minučių.",
    down: "Šis puslapis laikinai neveikia. Parašykite mums support@gloumi.lt.",
    doneTitle: "Prašymas patvirtintas",
    doneText:
      "Dviejų veiksnių autentifikacija bus nuimta ne anksčiau kaip {date}. Iki tol paskyros el. pašto adresu siųsime priminimus su nuoroda prašymą atšaukti. Kai ji bus nuimta, gausite laišką.",
    doneTextNoDate:
      "Netrukus gausite laišką su data, kada dviejų veiksnių autentifikacija bus nuimta. Iki tol paskyros el. pašto adresu siųsime priminimus su nuoroda prašymą atšaukti.",
    cancelTitle: "Atšaukti prašymą",
    cancelText:
      "Jei prašymo nuimti dviejų veiksnių autentifikaciją nepateikėte, atšaukite jį. Jūsų paskyra liks tokia, kokia yra.",
    cancel: "Atšaukti prašymą",
    cancelling: "Atšaukiama…",
    cancelDoneTitle: "Prašymas atšauktas",
    cancelDoneText:
      "Jei prašymas dar galiojo, jis atšauktas, o dviejų veiksnių autentifikacija lieka įjungta. Jei prašymo nepateikėte, rekomenduojame pakeisti paskyros slaptažodį.",
    cancelMissing: "Nuoroda neišsami. Atidarykite ją iš laiško dar kartą.",
    support: "Klausimų turite? Rašykite support@gloumi.lt.",
  },

  /** Slaptažodžio atkūrimo nuoroda (/auth/reset): naujas slaptažodis naršyklėje. */
  passwordReset: {
    title: "Naujas slaptažodis",
    text: "Įveskite naują Gloumi paskyros slaptažodį.",
    password: "Naujas slaptažodis",
    repeat: "Pakartokite slaptažodį",
    rules: "Bent 8 simboliai: mažoji ir didžioji raidė, skaitmuo ir simbolis.",
    show: "Rodyti",
    hide: "Slėpti",
    submit: "Pakeisti slaptažodį",
    submitting: "Keičiama…",
    mismatch: "Slaptažodžiai nesutampa.",
    weak: "Slaptažodis per silpnas: reikia bent 8 simbolių, mažosios ir didžiosios raidės, skaitmens ir simbolio.",
    same: "Naujas slaptažodis turi skirtis nuo ankstesnio.",
    tooLong: "Slaptažodis per ilgas – sutrumpinkite jį.",
    pwned: "Šis slaptažodis rastas tarp nutekėjusių slaptažodžių – pasirinkite kitą.",
    code: "Kodas iš autentifikavimo programėlės",
    codeText: "Jūsų paskyrą saugo dviejų veiksnių autentifikacija. Įveskite šešių skaitmenų kodą iš autentifikavimo programėlės.",
    badCode: "Kodas netinka. Įveskite naują kodą iš autentifikavimo programėlės.",
    doneTitle: "Slaptažodis pakeistas",
    doneText: "Grįžkite į Gloumi programėlę ir prisijunkite nauju slaptažodžiu.",
    open: "Atidaryti programėlę",
    errorTitle: "Nuoroda nebegalioja",
    errorText:
      "Ši nuoroda pasenusi (galioja 10 min.) arba jau panaudota. Programėlėje paprašykite naujos arba įveskite kodą iš laiško.",
    failed: "Pakeisti nepavyko. Patikrinkite ryšį ir bandykite dar kartą.",
    // Kvietimas (type=invite): ta pati forma, kitas pavadinimas.
    inviteTitle: "Sukurkite slaptažodį",
    inviteText: "Jus pakvietė į Gloumi. Sukurkite paskyros slaptažodį.",
    inviteSubmit: "Sukurti slaptažodį",
    inviteDoneTitle: "Slaptažodis sukurtas",
    inviteErrorText: "Ši kvietimo nuoroda pasenusi arba jau panaudota. Paprašykite kvietusio žmogaus atsiųsti naują.",
  },

  /** Viešas meistro puslapis (#210, U-22; developeris K-W1, K-W2). */
  masterPage: {
    titleFemale: "Meistrė",
    titleMale: "Meistras",
    services: "Paslaugos",
    otherServices: "Kitos paslaugos",
    minutes: "min.",
    deposit: "avansas",
    depositPercent: "avansas {n} %",
    about: "Apie",
    works: "Darbai",
    hours: "Darbo laikas",
    dayOff: "Nedirba",
    weekdays: ["Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis", "Sekmadienis"],
    terms: "Sąlygos",
    cancellation: "Atšaukimas",
    rules: "Meistro taisyklės",
    booking: "Rezervavimas",
    leadTime: "Rezervuokite ne vėliau kaip prieš {n} val.",
    payment: "Mokėjimas",
    workFormat: "Kur dirba",
    amenities: "Patogumai",
    addressInApp: "Tikslus adresas ir žemėlapis – programėlėje.",
    book: "Rezervuoti programėlėje",
    paymentMethods: { cash: "Grynieji", card_onsite: "Kortele vietoje", card: "Programėlėje" } as Record<string, string>,
    workFormats: { salon: "Salone ar studijoje", mobile: "Pas klientą", rented_chair: "Nuomojamoje vietoje" } as Record<string, string>,
    cancellationPolicies: {
      // Teisininkas 2026-10-14 (pažodžiui). Teisininkas 2026-10-15: free_24h ir move_only – su „patvirtintas“, kaip programėlės policyForfeitText / policyMoveOnlyText (b63ff56d).
      free_24h:
        "Nemokamai atšaukti galima likus ne mažiau kaip 24 val. iki vizito; atšaukus patvirtintą vizitą vėliau ar neatvykus, nurašomas avansas.",
      deposit_required:
        "Rezervuojant avansas rezervuojamas Jūsų kortelėje; atšaukus patvirtintą vizitą likus mažiau nei 24 val. ar neatvykus, jis nurašomas ir atitenka meistrui.",
      no_deposit: "Atšaukti galima bet kada – sumokėta suma grąžinama visa.",
      move_only:
        "Atšaukti nemokamai galima bet kada. Likus mažiau nei 24 val. iki patvirtinto vizito, perkelti jį galima tik priėmus meistro pasiūlytą naują laiką.",
    } as Record<string, string>,
  },

  /** Viešo meistro puslapio atsiliepimai (#210, U-22, V-9). */
  masterReviews: {
    title: "Atsiliepimai",
    outOf: "iš 5",
    count: ["atsiliepimas", "atsiliepimai", "atsiliepimų"],
    // V-9: privalomas, kai įvertinimas skaičiuojamas iš visų, o rodomi tik sutikusiųjų.
    consentNote:
      "Rodomi tik tie atsiliepimai, kurių autoriai sutiko juos rodyti svetainėje. Įvertinimas skaičiuojamas iš visų patikrintų atsiliepimų.",
    howWeCheck: "Kaip tikriname atsiliepimus",
    empty: "Svetainėje rodomų atsiliepimų dar nėra. Visus atsiliepimus rasite programėlėje.",
    noName: "Vardas nenurodytas",
    reply: "Meistro atsakymas",
    report: "Pranešti apie turinį",
    reportSubject: "Pranešimas apie turinį",
  },
};
