import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in Latvian.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The voice matches the Lithuanian: the reader is addressed as "jūs", lower
 * case, plain sentences, no exclamation marks. Money as "12 €", percent "5 %".
 *
 * Ten strings hold the English value on purpose, each marked
 * `// teisininkas – neverčiama`: consent, legal and regulatory texts, which
 * only the legal role translates (AGENTS.md, Article XII).
 */
export const lv: typeof lt = {
  a11y: {
    skip: "Pāriet uz saturu",
  },

  nav: {
    ariaLabel: "Galvenā navigācija",
    links: [
      { key: "categories", label: "Kategorijas" },
      { key: "why", label: "Kāpēc Gloumi" },
      { key: "masters", label: "Meistariem" },
      { key: "contact", label: "Kontakti" },
    ],
    cta: "Lejupielādēt",
    open: "Atvērt izvēlni",
    close: "Aizvērt izvēlni",
    home: "Gloumi – uz sākumu",
    language: "Valoda",
  },

  seo: {
    title: "Gloumi – skaistumkopšanas meistaru meklēšana un rezervēšana Lietuvā",
    titleTemplate: "%s · Gloumi",
    description:
      "Atrodiet skaistumkopšanas un labsajūtas meistarus Lietuvā un rezervējiet jebkurā laikā: nagi, mati, uzacis, masāžas, grims un ādas kopšana. Brīvie laiki, cenas pirms rezervēšanas un atsauksmes tikai pēc notikušas vizītes – vienā lietotnē.",
    keywords: [
      "skaistumkopšanas meistari Lietuvā",
      "rezervēšana tiešsaistē",
      "manikīrs Viļņā",
      "frizētava pieraksts",
      "uzacu laminēšana",
      "masāžas rezervēšana",
      "grima meistars",
      "kosmetologs",
      "skaistumkopšanas lietotne",
      "Gloumi",
    ],
    ogAlt: "Gloumi – skaistumkopšanas meistaru meklēšanas un rezervēšanas lietotne",
    ogHeadline: "Skaistumkopšanas meistari un rezervēšana tiešsaistē",
    ogSub: "Nagi · Mati · Uzacis · Grims · Āda · Masāžas",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Skaistumkopšanas un labsajūtas meistari Lietuvā",
    titleStart: "Gloumi – atrodiet skaistumkopšanas meistaru un",
    titleAccent: "rezervējiet",
    titleEnd: "jebkurā laikā",
    lead:
      "Nagi, mati, uzacis, masāžas, grims un ādas kopšana – meistaru darbi, brīvie laiki un skaidras cenas vienā lietotnē. Rezervējiet jebkurā diennakts stundā, bez zvaniem un gaidīšanas.",
    masterCta: "Esmu meistars / Pieteikties",
    trustLabel: "Kāpēc vērts",
    trust: ["Klientiem bez maksas", "Bez slēptām maksām", "Atsauksmes tikai pēc vizītes"],
    floatingReviews: { title: "Atsauksmes", sub: "Tikai pēc notikušas vizītes" },
    floatingBooking: { title: "Laiks apstiprināts", sub: "Piektdiena, 13:00" },
  },

  stores: {
    apple: { small: "Lejupielādējiet no", big: "App Store", srOpens: "(atveras jaunā cilnē)" },
    google: { small: "Pieejams", big: "Google Play", srOpens: "(atveras jaunā cilnē)" },
    soon: "Drīzumā",
    soonTitle: "Lietotne drīzumā būs pieejama veikalā",
    soonSr: "– saite parādīsies, kad lietotne būs veikalā",
  },

  phone: {
    ariaLabel: "Lietotnes ekrānu priekšskatījums",
    tabsLabel: "Lietotnes ekrāni",
    tabs: [
      { id: "feed", label: "Atklāt", alt: "Gloumi plūsma: meistaru Story un jaunākie darbi" },
      { id: "search", label: "Meklēšana", alt: "Gloumi meklēšana: meistari pēc pakalpojuma, cenas, vērtējuma un attāluma" },
      {
        id: "profile",
        label: "Profils",
        alt: "Meistares profils Gloumi lietotnē: vērtējums, apraksts, adrese un karte",
      },
      { id: "booking", label: "Rezervēšana", alt: "Vizītes rezervēšana Gloumi lietotnē: kalendārs un brīvie laiki" },
    ],
    note: "Ekrānos – meistaru un atsauksmju piemēri.",
    // EN – laukia content vertimo
    pause: "Pause the screen slideshow",
    play: "Play the screen slideshow",
  },

  categories: {
    eyebrow: "Kategorijas",
    title: "Katrai skaistumkopšanas rutīnai – savs meistars",
    lead: "Izvēlieties kategoriju un apskatiet, ko tajā atradīsiet. Lietotnē katrai kategorijai ir savi meistari, darbi un brīvie laiki.",
    cta: "Atrast meistaru",
    listLabel: "Pakalpojumu kategorijas",
  },

  why: {
    eyebrow: "Klientiem",
    title: "Kāpēc Gloumi?",
    lead: "Viss, lai skaistumkopšanas vizīte sāktos bez stresa – no iedvesmas līdz apstiprinātam laikam.",
    items: [
      {
        title: "Rezervējiet 24/7",
        text: "Meistara brīvos laikus redzat reāllaikā un rezervējat uzreiz – pusnaktī vai pusdienu pārtraukumā. Bez zvaniem un bez „uzrakstīšu vēlāk”.",
      },
      {
        title: "„Gribu tā” – iedvesma no meistaru darbiem",
        text: "Pārlūkojat meistaru darbus, saglabājat patikušos kolekcijās un, rezervējot, parādāt meistaram: gribu tieši tā.",
      },
      {
        title: "Pārskatāmas cenas",
        text: "Cenu un ilgumu redzat pirms rezervēšanas, un Gloumi cenai neko nepieliek.",
      },
      {
        title: "Atsauksmes tikai pēc vizītes",
        text: "Atsauksmi var atstāt tikai klients, kura vizīte pie šī meistara notika. Nekādu atsauksmju „no malas”.",
      },
    ],
    howTitle: "Kā tas darbojas",
    steps: [
      { title: "Atrodiet", text: "Pēc kategorijas, vietas kartē vai darba, kas patika." },
      { title: "Rezervējiet", text: "Izvēlieties laiku un apstipriniet dažās sekundēs." },
      { title: "Ierodieties", text: "Atgādinājumu atsūtīsim mēs, bet atsauksmi atstāsiet pēc vizītes." },
    ],
  },

  masters: {
    eyebrow: "Meistariem",
    title: "Vairāk klientu. Mazāk tukšu stundu.",
    lead: "Gloumi – jūsu reģistratūra, skatlogs un kalendārs vienā lietotnē. Sāciet ar Starter plānu par 0 € – Gloumi ņem 5 % komisijas maksu tikai par katra klienta pirmo notikušo vizīti pie jums.",
    items: [
      {
        title: "Mazāk neierašanos",
        text: "Prasiet avansu – tas tiek rezervēts klienta kartē, un, ja vizīti atceļ par vēlu vai uz to neierodas, avanss pienākas jums saskaņā ar jūsu atcelšanas nosacījumiem.",
        plan: "Pro un VIP",
      },
      {
        title: "Atgādinājumi, kas atved atpakaļ",
        text: "Atgādinājums klientam pirms vizītes, bet tiem, kas piekrituši saņemt piedāvājumus, – aicinājums rezervēt vēlreiz, kad pienāk laiks: katram pakalpojumam paši nosakāt, pēc cik ilga laika to vērts atkārtot.",
      },
      {
        title: "Profils – jūsu skatlogs",
        text: "Elastīgi logrīki: portfolio, pakalpojumi, darba laiks, Story un atsauksmes. Sakārtojiet profilu tā, kā vēlaties, lai to redz klients.",
      },
      {
        title: "Savus klientus atvediet bez komisijas maksas",
        text: "Saņemat kodu klientiem, kurus apkalpojāt pirms Gloumi: to var izmantot līdz 50 klientiem 3 mēnešu laikā no konta izveides. Klients, kas atnāk ar kodu, komisijas maksu nerada nekad.",
      },
    ],
    chipsLabel: "Citas iespējas",
    chips: [
      { text: "Izmaksas uz bankas kontu caur Stripe", plan: "Pro un VIP" },
      { text: "Klientu kartītes ar privātām piezīmēm" },
      { text: "Mēneša ienākumu un populārāko pakalpojumu statistika" },
      { text: "Personīga rezervēšanas saite" },
      { text: "Pārtraukumi un bloķēts laiks kalendārā" },
      { text: "Story un ieraksti kopienai" },
    ],
  },

  form: {
    eyebrow: "Meistara konts",
    title: "Kļūstiet par Gloumi meistaru",
    lead: "Atstājiet kontaktus – palīdzēsim izveidot profilu un atbildēsim uz jautājumiem. Meistara profilu lietotnē varat izveidot arī paši.",
    leadSoon: "Atstājiet kontaktus – palīdzēsim izveidot profilu, tiklīdz lietotne parādīsies veikalos, un atbildēsim uz jautājumiem.",
    fields: {
      name: "Vārds",
      email: "E-pasts",
      phone: "Tālrunis",
      city: "Pilsēta",
      category: "Galvenā kategorija",
      categoryPlaceholder: "Izvēlieties kategoriju",
      categoryOther: "Cita",
      link: "Instagram vai cita saite uz darbiem",
      message: "Ziņa",
      messagePlaceholder: "Cik gadus strādājat, vai jums ir salons, ko sagaidāt no Gloumi…",
      optional: "nav obligāti",
    },
    // teisininkas – neverčiama (AGENTS.md XII)
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentEnd: ".",
    submit: "Gribu pievienoties",
    submitting: "Sūta…",
    successTitle: "Paldies – saņēmām",
    successText: "Drīz sazināsimies pa norādīto e-pastu. Bet pagaidām lejupielādējiet lietotni un apskatiet to.",
    successTextSoon: "Drīz sazināsimies pa norādīto e-pastu. Lietotne drīzumā parādīsies App Store un Google Play.",
    another: "Sūtīt vēl vienu pieprasījumu",
    errorGeneric: "Neizdevās nosūtīt. Mēģiniet vēlreiz vai rakstiet mums e-pastā.",
    errorNetwork: "Nav savienojuma. Pārbaudiet internetu un mēģiniet vēlreiz.",
    errorValidation: "Pārbaudiet atzīmētos laukus.",
    errorRateLimited: "Pārāk daudz mēģinājumu pēc kārtas. Mēģiniet pēc dažām minūtēm.",
    errorDailyLimit: "Šodien saņēmām ļoti daudz pieprasījumu. Rakstiet mums uz info@gloumi.lt – atbildēsim.",
    unconfiguredTitle: "Forma vēl tiek gatavota",
    unconfiguredText: "Rakstiet mums tieši – atbildēsim no tās pašas adreses:",
    mailSubject: "Gribu kļūt par Gloumi meistaru",
  },

  finalCta: {
    title: "Skaistums sākas ar labu laiku.",
    lead: "Lejupielādējiet Gloumi un rezervējiet pirmo vizīti – vai pievienojieties kā meistars un aizpildiet savu kalendāru.",
    masterLink: "Esmu meistars",
  },

  footer: {
    tagline: "Skaistumkopšanas meistaru un klientu platforma Lietuvā.",
    clients: "Klientiem",
    masters: "Meistariem",
    legal: "Juridiskā informācija",
    contacts: "Kontakti",
    clientLinks: [
      { key: "download", label: "Lejupielādēt lietotni" },
      { key: "categories", label: "Kategorijas" },
      { key: "why", label: "Kāpēc Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Ieguvumi meistariem" },
      { key: "join", label: "Kļūt par meistaru" },
    ],
    faq: "Biežāk uzdotie jautājumi",
    faqMasters: "Jautājumi meistariem",
    legalLinks: [
      { key: "terms", label: "Lietošanas noteikumi" },
      { key: "privacy", label: "Privātuma politika" },
      { key: "partner", label: "Meistaru un salonu nosacījumi" },
      { key: "refunds", label: "Atmaksas nosacījumi" },
      { key: "transparency", label: "DAC7 un platformas pārredzamība" },
      { key: "deletion", label: "Konta dzēšana" },
      // EN – laukia content vertimo
      { key: "dsa", label: "Digital Services Act" },
      { key: "accessibility", label: "Accessibility" },
    ],
    companyLabel: "Uzņēmuma kods",
    registry: "Lietuvas Republikas Juridisko personu reģistrs",
    phoneLabel: "Tālr.",
    vatLabel: "PVN numurs",
    // teisininkas – neverčiama (AGENTS.md XII)
    rights: "All rights reserved.",
    // teisininkas – neverčiama (AGENTS.md XII)
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama (AGENTS.md XII)
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Sociālie tīkli",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Juridiskā informācija",
    updated: "Atjaunināts",
    version: "versija",
    toc: "Saturs",
    // teisininkas – neverčiama (AGENTS.md XII)
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama (AGENTS.md XII)
    controller: "Data controller and platform operator",
    contactQuestion: "Jautājumi par datiem vai noteikumiem?",
    // teisininkas – neverčiama (AGENTS.md XII)
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Citi dokumenti",
  },

  faq: {
    eyebrow: "Palīdzība",
    intro: "Īsas atbildes saskaņā ar pašlaik spēkā esošajiem Lietošanas noteikumiem. Neatradāt atbildi? Rakstiet",
    toc: "Tēmas",
  },

  appLink: {
    profileTitle: "Šis meistars ir Gloumi lietotnē",
    refTitle: "Jūs uzaicināja uz Gloumi",
    text: "Atveriet saiti Gloumi lietotnē. Ja jums tās vēl nav – lejupielādējiet to un atveriet saiti vēlreiz.",
    open: "Atvērt lietotnē",
    masterCode: "Meistara kods",
    referralCode: "Ieteikuma kods",
    codeHint: "Ja saite neatvēra lietotni, šo kodu varēsiet ievadīt lietotnē.",
    home: "Par Gloumi",
  },

  emailConfirm: {
    askTitle: "Apstipriniet e-pastu",
    askText: "Nospiediet pogu – un jūsu Gloumi konta e-pasts tiks apstiprināts.",
    confirm: "Apstiprināt e-pastu",
    confirming: "Apstiprina…",
    title: "E-pasts apstiprināts",
    text: "Atgriezieties Gloumi lietotnē un piesakieties.",
    open: "Atvērt lietotni",
    otherDevice: "Atvērāt vēstuli citā ierīcē? Nekas vairs nav jādara – piesakieties lietotnē tālrunī, kurā reģistrējāties.",
    errorTitle: "Saite vairs nedarbojas",
    errorText: "Šīs saites derīguma termiņš ir beidzies (tā derīga 10 minūtes), vai tā jau izmantota. Ja e-pastu jau apstiprinājāt – vienkārši piesakieties lietotnē. Ja ne – ievadiet lietotnē kodu no e-pasta vai pieprasiet jaunu vēstuli.",
    failed: "Apstiprināt neizdevās. Pārbaudiet savienojumu un mēģiniet vēlreiz.",
    changeAskTitle: "Apstipriniet e-pasta maiņu",
    changeAskText: "Nospiediet pogu, lai apstiprinātu jauno Gloumi konta e-pastu.",
    changeConfirm: "Apstiprināt maiņu",
    changeTitle: "Apstiprināts",
    changeText: "Ja vēstuli saņēmāt arī otrā adresē, apstipriniet arī tur – tad e-pasts mainīsies.",
    changeErrorText: "Šīs saites derīguma termiņš ir beidzies (tā derīga 10 minūtes), vai tā jau izmantota. Ja e-pasta maiņu jau apstiprinājāt – nekas nav jādara. Ja ne – nomainiet e-pastu vēlreiz lietotnes iestatījumos.",
    magicTitle: "Atveriet lietotnē",
    magicText: "Šī pieteikšanās saite darbojas tikai Gloumi lietotnē. Atveriet vēstuli tālrunī, kurā instalēta lietotne, vai ievadiet lietotnē kodu no e-pasta.",
  },

  // EN – laukia content vertimo
  mfaHelp: {
    title: "Turning off two-factor authentication",
    text: "Enter the code from the email sent to your account's email address. The code is valid for 24 hours.",
    code: "Code from the email",
    password: "Account password (optional)",
    passwordHint:
      "If you remember your password, enter it – the request can then go through sooner, after 3 days at the earliest. We do not see or keep your password.",
    show: "Show",
    hide: "Hide",
    submit: "Confirm",
    submitting: "Checking…",
    captchaWait: "Please wait for the security check to finish.",
    codeInvalid: "This code does not work. Check that you entered it exactly as in the email and that it is still valid.",
    passwordWrong: "The password is not right. Attempts left: {n}. If you do not remember it, leave the field empty.",
    captchaFailed: "The security check failed. Reload the page and try again.",
    tooMany: "Too many attempts. Please try again later.",
    unavailable: "We could not confirm it right now. Please try again in a few minutes.",
    down: "This page is temporarily not working. Please write to us at support@gloumi.lt.",
    doneTitle: "Request confirmed",
    doneText:
      "Two-factor authentication will be turned off no earlier than {date}. Until then we will send reminders to your account's email address with a link to cancel the request. You will get an email once it is turned off.",
    doneTextNoDate:
      "You will soon get an email with the date two-factor authentication will be turned off. Until then we will send reminders to your account's email address with a link to cancel the request.",
    cancelTitle: "Cancel the request",
    cancelText: "If you did not make this request, cancel it. Your account will stay as it is.",
    cancel: "Cancel the request",
    cancelling: "Cancelling…",
    cancelDoneTitle: "Request cancelled",
    cancelDoneText:
      "If the request was still open, it has been cancelled and your account has not been changed. If you did not make the request, we recommend changing your account password.",
    cancelMissing: "This link is incomplete. Open it from the email again.",
    support: "Questions? Write to support@gloumi.lt.",
  },

  passwordReset: {
    title: "Jaunā parole",
    text: "Ievadiet jaunu Gloumi konta paroli.",
    password: "Jaunā parole",
    repeat: "Atkārtojiet paroli",
    rules: "Vismaz 8 rakstzīmes: mazais un lielais burts, cipars un simbols.",
    show: "Rādīt",
    hide: "Slēpt",
    submit: "Mainīt paroli",
    submitting: "Maina…",
    mismatch: "Paroles nesakrīt.",
    weak: "Parole ir pārāk vāja: vajag vismaz 8 rakstzīmes, mazo un lielo burtu, ciparu un simbolu.",
    same: "Jaunajai parolei jāatšķiras no iepriekšējās.",
    tooLong: "Parole ir pārāk gara – saīsiniet to.",
    pwned: "Šī parole ir atrasta nopludinātu paroļu sarakstā – izvēlieties citu.",
    code: "Divu soļu verifikācijas kods",
    codeText: "Jūsu kontā ieslēgta divu soļu verifikācija. Ievadiet sešciparu kodu no autentifikācijas lietotnes.",
    badCode: "Kods neder. Ievadiet jaunu kodu no autentifikācijas lietotnes.",
    doneTitle: "Parole nomainīta",
    doneText: "Atgriezieties Gloumi lietotnē un piesakieties ar jauno paroli.",
    open: "Atvērt lietotni",
    errorTitle: "Saite vairs nedarbojas",
    errorText: "Šīs saites derīguma termiņš ir beidzies (tā derīga 10 minūtes), vai tā jau izmantota. Pieprasiet jaunu lietotnē vai ievadiet kodu no e-pasta.",
    failed: "Nomainīt neizdevās. Pārbaudiet savienojumu un mēģiniet vēlreiz.",
    inviteTitle: "Izveidojiet paroli",
    inviteText: "Jūs uzaicināja uz Gloumi. Izveidojiet sava konta paroli.",
    inviteSubmit: "Izveidot paroli",
    inviteDoneTitle: "Parole izveidota",
    inviteErrorText: "Šīs uzaicinājuma saites derīguma termiņš ir beidzies, vai tā jau izmantota. Palūdziet cilvēkam, kas jūs uzaicināja, atsūtīt jaunu.",
  },

  masterPage: {
    titleFemale: "Meistare",
    titleMale: "Meistars",
    services: "Pakalpojumi",
    otherServices: "Citi pakalpojumi",
    minutes: "min",
    deposit: "avanss",
    depositPercent: "avanss {n}%",
    about: "Par",
    works: "Darbi",
    hours: "Darba laiks",
    dayOff: "Nestrādā",
    weekdays: ["Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena", "Piektdiena", "Sestdiena", "Svētdiena"],
    terms: "Noteikumi",
    cancellation: "Atcelšana",
    rules: "Meistara noteikumi",
    booking: "Rezervēšana",
    leadTime: "Rezervējiet vismaz {n} stundas iepriekš.",
    payment: "Maksājums",
    workFormat: "Kur strādā",
    amenities: "Ērtības",
    addressInApp: "Precīza adrese un karte ir lietotnē.",
    book: "Rezervēt lietotnē",
    paymentMethods: { cash: "Skaidra nauda", card_onsite: "Ar karti uz vietas", card: "Lietotnē" } as Record<string, string>,
    workFormats: { salon: "Salonā vai studijā", mobile: "Pie klienta", rented_chair: "Īrētā vietā" } as Record<string, string>,
    cancellationPolicies: {
      // teisininkas – neverčiama (AGENTS.md XII; svetainėje – teisininko tekstai)
      free_24h: "Free cancellation until 24 hours before the visit; if you cancel a confirmed visit later or don’t show up, the deposit is charged.",
      deposit_required:
        "A deposit is reserved on your card when you book; if you cancel a confirmed visit less than 24 hours before or don’t show up, it is charged and goes to the master.",
      no_deposit: "You can cancel at any time – anything paid is refunded in full.",
      move_only: "Free cancellation any time. Within 24 hours of a confirmed visit, it can only be moved to a new time the master proposes.",
    } as Record<string, string>,
  },

  masterReviews: {
    title: "Atsauksmes",
    outOf: "no 5",
    count: ["atsauksme", "atsauksmes", "atsauksmes"],
    // teisininkas – neverčiama (AGENTS.md XII)
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Kā mēs pārbaudām atsauksmes",
    empty: "Tīmekļa vietnē vēl nav redzamu atsauksmju. Visas atsauksmes atradīsiet lietotnē.",
    noName: "Vārds nav norādīts",
    reply: "Meistara atbilde",
    report: "Ziņot par saturu",
    reportSubject: "Ziņojums par saturu",
  },
  notFound: {
    eyebrow: "404",
    title: "Šo lapu nevaram atrast",
    text: "Saite, iespējams, ir mainījusies, vai lapa ir pārvietota.",
    cta: "Atpakaļ uz sākumu",
  },

  errorPage: {
    eyebrow: "Kļūda",
    title: "Kaut kas nogāja greizi",
    text: "Šo lapu neizdevās parādīt. Mēģiniet vēlreiz pēc brīža – ja tas atkārtojas, rakstiet mums.",
    retry: "Mēģināt vēlreiz",
    home: "Atpakaļ uz sākumu",
  },
};
