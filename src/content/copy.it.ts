import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in Italian.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The voice matches the Lithuanian: the reader is addressed as "tu", plain
 * sentences, no exclamation marks, no gendered forms for the reader.
 */
export const it: typeof lt = {
  a11y: {
    skip: "Vai al contenuto",
  },

  nav: {
    ariaLabel: "Navigazione principale",
    links: [
      { key: "categories", label: "Categorie" },
      { key: "why", label: "Perché Gloumi" },
      { key: "masters", label: "Per i professionisti" },
      { key: "contact", label: "Contatti" },
    ],
    cta: "Scarica l'app",
    open: "Apri menu",
    close: "Chiudi menu",
    home: "Gloumi – home",
    language: "Lingua",
  },

  seo: {
    title: "Gloumi – trova e prenota professionisti della bellezza in Lituania",
    titleTemplate: "%s · Gloumi",
    description:
      "Trova professionisti della bellezza e del benessere in Lituania e prenota quando vuoi: unghie, capelli, sopracciglia e ciglia, massaggi, trucco e cura della pelle. Orari liberi, prezzi prima di prenotare e recensioni solo dopo un appuntamento avvenuto, in un'unica app.",
    keywords: [
      "professionisti della bellezza Lituania",
      "prenotare appuntamento bellezza",
      "manicure Vilnius",
      "prenotazione parrucchiere",
      "laminazione sopracciglia",
      "prenotazione massaggi",
      "make-up artist",
      "estetista",
      "app prenotazione bellezza",
      "Gloumi",
    ],
    ogAlt: "Gloumi – l'app per trovare e prenotare professionisti della bellezza",
    ogHeadline: "Professionisti della bellezza e prenotazioni online",
    ogSub: "Unghie · Capelli · Sopracciglia · Trucco · Pelle · Massaggi",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Professionisti della bellezza e del benessere in Lituania",
    titleStart: "Gloumi – trova un professionista della bellezza e",
    titleAccent: "prenota",
    titleEnd: "quando vuoi",
    lead:
      "Unghie, capelli, sopracciglia, massaggi, trucco e cura della pelle: i lavori dei professionisti, gli orari liberi e prezzi chiari in un'unica app. Prenota a qualsiasi ora, senza telefonate né attese.",
    masterCta: "Per professionisti / Accedi",
    trustLabel: "Perché conviene",
    trust: ["Gratis per i clienti", "Nessun costo nascosto", "Recensioni solo dopo l'appuntamento"],
    floatingReviews: { title: "Recensioni", sub: "Solo dopo un appuntamento avvenuto" },
    floatingBooking: { title: "Orario confermato", sub: "Venerdì, 13:00" },
  },

  stores: {
    apple: { small: "Scarica su", big: "App Store", srOpens: "(si apre in una nuova scheda)" },
    google: { small: "Disponibile su", big: "Google Play", srOpens: "(si apre in una nuova scheda)" },
    soon: "Presto disponibile",
    soonTitle: "L'app arriverà presto negli store",
    soonSr: "– il link comparirà quando l'app sarà nello store",
  },

  phone: {
    ariaLabel: "Anteprima delle schermate dell'app",
    tabsLabel: "Schermate dell'app",
    tabs: [
      { id: "feed", label: "Scopri", alt: "Il feed di Gloumi: Story dei professionisti e lavori più recenti" },
      { id: "search", label: "Cerca", alt: "La ricerca di Gloumi: professionisti per servizio, prezzo, valutazione e distanza" },
      {
        id: "profile",
        label: "Profilo",
        alt: "Il profilo di una professionista nell'app Gloumi: valutazione, descrizione, indirizzo e mappa",
      },
      { id: "booking", label: "Prenotazione", alt: "Prenotazione di un appuntamento nell'app Gloumi: calendario e orari liberi" },
    ],
    note: "Nelle schermate: professionisti e recensioni di esempio.",
    pause: "Metti in pausa la presentazione delle schermate",
    play: "Avvia la presentazione delle schermate",
  },

  categories: {
    eyebrow: "Categorie",
    title: "Per ogni routine di bellezza, il professionista giusto",
    lead: "Tocca una categoria e scopri cosa contiene. Nell'app ognuna ha i suoi professionisti, i loro lavori e gli orari liberi.",
    cta: "Trova un professionista",
    listLabel: "Categorie di servizi",
  },

  why: {
    eyebrow: "Per i clienti",
    title: "Perché Gloumi?",
    lead: "Tutto perché un appuntamento di bellezza inizi senza stress, dall'ispirazione all'orario confermato.",
    items: [
      {
        title: "Prenota 24/7",
        text: "Vedi gli orari liberi del professionista in tempo reale e prenoti subito, a mezzanotte o in pausa pranzo. Niente telefonate, niente «ti scrivo più tardi».",
      },
      {
        title: "«Lo voglio così» – l'ispirazione dai lavori dei professionisti",
        text: "Sfogli i lavori dei professionisti, salvi quelli che ti piacciono nelle tue raccolte e, quando prenoti, li mostri al professionista: lo voglio proprio così.",
      },
      {
        title: "Prezzi trasparenti",
        text: "Vedi prezzo e durata prima di prenotare, e Gloumi non aggiunge nulla al prezzo.",
      },
      {
        title: "Recensioni solo dopo l'appuntamento",
        text: "Può lasciare una recensione solo il cliente che ha avuto davvero un appuntamento con quel professionista. Nessuna recensione da estranei.",
      },
    ],
    howTitle: "Come funziona",
    steps: [
      { title: "Trova", text: "Per categoria, per luogo sulla mappa o partendo da un lavoro che ti è piaciuto." },
      { title: "Prenota", text: "Scegli un orario e confermalo in pochi secondi." },
      { title: "Vieni", text: "Il promemoria te lo mandiamo noi, la recensione la lasci dopo l'appuntamento." },
    ],
  },

  masters: {
    eyebrow: "Per i professionisti",
    title: "Più clienti. Meno ore vuote.",
    lead: "Gloumi è la tua reception, la tua vetrina e il tuo calendario in un'unica app. Inizia con il piano Starter a 0 € – Gloumi trattiene una commissione del 5% solo sul primo appuntamento completato di ogni cliente con te.",
    items: [
      {
        title: "Meno assenze",
        text: "Chiedi un acconto: viene bloccato sulla carta del cliente e, in caso di disdetta tardiva o di assenza, va a te secondo le tue condizioni di cancellazione.",
        plan: "Pro e VIP",
      },
      {
        title: "Promemoria che fanno tornare",
        text: "Un promemoria al cliente prima dell'appuntamento e, a chi ha accettato di ricevere offerte, un invito a prenotare di nuovo quando è il momento: per ogni servizio decidi tu dopo quanto tempo conviene ripeterlo.",
      },
      {
        title: "Il profilo è la tua vetrina",
        text: "Widget flessibili: portfolio, servizi, orari di lavoro, Story e recensioni. Componi il profilo come vuoi che lo veda il cliente.",
      },
      {
        title: "Porta i tuoi clienti, senza commissione",
        text: "Ricevi un codice per i clienti che hai servito prima di Gloumi: possono usarlo fino a 50 clienti entro 3 mesi dalla creazione dell'account. Un cliente arrivato con il tuo codice non genera mai una commissione.",
      },
    ],
    chipsLabel: "Altre funzioni",
    chips: [
      { text: "Bonifici sul conto bancario tramite Stripe", plan: "Pro e VIP" },
      { text: "Schede clienti con note private" },
      { text: "Statistiche su incassi mensili e servizi più richiesti" },
      { text: "Link di prenotazione personale" },
      { text: "Pause e orari bloccati nel calendario" },
      { text: "Story e post per la community" },
    ],
  },

  form: {
    eyebrow: "Account professionista",
    title: "Entra in Gloumi come professionista",
    lead: "Lascia i tuoi contatti: ti aiutiamo a creare il profilo e rispondiamo alle tue domande. Il profilo puoi crearlo anche in autonomia nell'app.",
    leadSoon: "Lascia i tuoi contatti: ti aiuteremo a creare il profilo appena l'app sarà negli store e risponderemo alle tue domande.",
    fields: {
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      city: "Città",
      category: "Categoria principale",
      categoryPlaceholder: "Scegli una categoria",
      categoryOther: "Altro",
      link: "Instagram o un altro link ai tuoi lavori",
      message: "Messaggio",
      messagePlaceholder: "Da quanti anni lavori, se hai un salone, cosa ti aspetti da Gloumi…",
      optional: "facoltativo",
    },
    // teisininkas – neverčiama (sutikimo tekstas, AGENTS.md XII): palikta angliškai, kol nuspręs developeris
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentEnd: ".",
    submit: "Voglio unirmi",
    submitting: "Invio…",
    successTitle: "Grazie, l'abbiamo ricevuto",
    successText: "Ti contatteremo presto all'indirizzo email indicato. Nel frattempo scarica l'app e dai un'occhiata.",
    successTextSoon: "Ti contatteremo presto all'indirizzo email indicato. L'app arriverà presto su App Store e Google Play.",
    another: "Invia un'altra richiesta",
    errorGeneric: "Invio non riuscito. Riprova o scrivici via email.",
    errorNetwork: "Nessuna connessione. Controlla internet e riprova.",
    errorValidation: "Controlla i campi evidenziati.",
    errorRateLimited: "Troppi tentativi di seguito. Riprova tra qualche minuto.",
    errorDailyLimit: "Oggi abbiamo ricevuto moltissime richieste. Scrivici a info@gloumi.lt e ti risponderemo.",
    unconfiguredTitle: "Il modulo è in preparazione",
    unconfiguredText: "Scrivici direttamente, ti risponderemo dallo stesso indirizzo:",
    mailSubject: "Voglio diventare professionista su Gloumi",
  },

  finalCta: {
    title: "La bellezza inizia da un buon orario.",
    lead: "Scarica Gloumi e prenota il tuo primo appuntamento, oppure unisciti come professionista e riempi il tuo calendario.",
    masterLink: "Per professionisti",
  },

  footer: {
    tagline: "La piattaforma per i professionisti della bellezza e i loro clienti in Lituania.",
    clients: "Per i clienti",
    masters: "Per i professionisti",
    legal: "Note legali",
    contacts: "Contatti",
    clientLinks: [
      { key: "download", label: "Scarica l'app" },
      { key: "categories", label: "Categorie" },
      { key: "why", label: "Perché Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Vantaggi per i professionisti" },
      { key: "join", label: "Diventa professionista" },
    ],
    faq: "Domande frequenti",
    faqMasters: "Domande dei professionisti",
    legalLinks: [
      { key: "terms", label: "Termini di utilizzo" },
      { key: "privacy", label: "Informativa sulla privacy" },
      { key: "partner", label: "Condizioni per professionisti e saloni" },
      { key: "refunds", label: "Condizioni di rimborso" },
      { key: "transparency", label: "DAC7 e trasparenza della piattaforma" },
      { key: "deletion", label: "Eliminazione dell'account" },
      { key: "dsa", label: "Regolamento sui servizi digitali" },
      { key: "accessibility", label: "Accessibilità" },
    ],
    companyLabel: "Codice aziendale",
    registry: "Registro delle persone giuridiche della Repubblica di Lituania",
    phoneLabel: "Tel.",
    vatLabel: "Partita IVA",
    // teisininkas – neverčiama (AGENTS.md XII)
    rights: "All rights reserved.",
    // teisininkas – neverčiama (DSA ir prekių ženklų tekstai, AGENTS.md XII)
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama (AGENTS.md XII)
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Profili social",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Note legali",
    updated: "Aggiornato il",
    version: "versione",
    toc: "Indice",
    // teisininkas – neverčiama (kuri kalbinė versija viršesnė – teisinis teiginys, AGENTS.md XII)
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama (AGENTS.md XII)
    controller: "Data controller and platform operator",
    contactQuestion: "Domande sui tuoi dati o sui termini?",
    // teisininkas – neverčiama (AGENTS.md XII)
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Altri documenti",
  },

  faq: {
    eyebrow: "Assistenza",
    intro: "Risposte brevi secondo i Termini di utilizzo oggi in vigore. Non hai trovato la risposta? Scrivi a",
    toc: "Argomenti",
  },

  appLink: {
    profileTitle: "Questo profilo è sull'app Gloumi",
    refTitle: "Hai un invito su Gloumi",
    text: "Apri il link nell'app Gloumi. Se non ce l'hai ancora, scaricala e apri di nuovo il link.",
    open: "Apri nell'app",
    masterCode: "Codice del professionista",
    referralCode: "Codice invito",
    codeHint: "Se il link non ha aperto l'app, puoi inserire questo codice nell'app.",
    home: "Cos'è Gloumi",
  },

  emailConfirm: {
    askTitle: "Conferma la tua email",
    askText: "Premi il pulsante e l'email del tuo account Gloumi sarà confermata.",
    confirm: "Conferma email",
    confirming: "Conferma in corso…",
    title: "Email confermata",
    text: "Torna all'app Gloumi e accedi.",
    open: "Apri l'app",
    otherDevice: "Hai aperto l'email su un altro dispositivo? Non devi fare altro – accedi nell'app sul telefono usato per la registrazione.",
    errorTitle: "Questo link non è più valido",
    errorText: "Questo link è scaduto (vale 10 minuti) o è già stato usato. Se hai già confermato la tua email, accedi semplicemente nell'app. Altrimenti inserisci nell'app il codice dall'email o richiedi una nuova email.",
    failed: "Conferma non riuscita. Controlla la connessione e riprova.",
    changeAskTitle: "Conferma il cambio di email",
    changeAskText: "Premi il pulsante per confermare la nuova email del tuo account Gloumi.",
    changeConfirm: "Conferma il cambio",
    changeTitle: "Confermato",
    changeText: "Se hai ricevuto questa email anche all'altro indirizzo, conferma anche lì – poi la tua email cambierà.",
    changeErrorText: "Questo link è scaduto (vale 10 minuti) o è già stato usato. Se hai già confermato il cambio di email, non devi fare altro. Altrimenti cambia di nuovo l'email nelle impostazioni dell'app.",
    magicTitle: "Aprilo nell'app",
    magicText: "Questo link di accesso funziona solo nell'app Gloumi. Apri l'email sul telefono in cui è installata l'app oppure inserisci nell'app il codice dall'email.",
  },

  mfaHelp: {
    title: "Disattivare la verifica in due passaggi",
    text: "Inserisci il codice dell'e-mail inviata all'indirizzo del tuo account. Il codice è valido 24 ore.",
    code: "Codice dell'e-mail",
    password: "Password dell'account (facoltativa)",
    passwordHint: "Se ricordi la password, inseriscila: così la richiesta può essere completata più in fretta, comunque non prima di 3 giorni. Non vediamo né conserviamo la tua password.",
    show: "Mostra",
    hide: "Nascondi",
    submit: "Conferma",
    submitting: "Verifica in corso…",
    captchaWait: "Attendi la fine del controllo di sicurezza.",
    codeInvalid: "Questo codice non funziona. Controlla di averlo inserito esattamente come nell'e-mail e che sia ancora valido.",
    passwordWrong: "La password non è corretta. Tentativi rimasti: {n}. Se non la ricordi, lascia vuoto il campo.",
    captchaFailed: "Il controllo di sicurezza non è riuscito. Ricarica la pagina e riprova.",
    tooMany: "Troppi tentativi. Riprova più tardi.",
    unavailable: "Al momento non è stato possibile confermare. Riprova tra qualche minuto.",
    down: "Questa pagina al momento non funziona. Scrivici a support@gloumi.lt.",
    doneTitle: "Richiesta confermata",
    doneText: "La verifica in due passaggi verrà disattivata non prima del {date}. Fino ad allora invieremo promemoria all'indirizzo e-mail del tuo account con un link per annullare la richiesta. Riceverai un'e-mail quando sarà disattivata.",
    doneTextNoDate: "A breve riceverai un'e-mail con la data in cui la verifica in due passaggi verrà disattivata. Fino ad allora invieremo promemoria all'indirizzo e-mail del tuo account con un link per annullare la richiesta.",
    cancelTitle: "Annulla la richiesta",
    cancelText: "Se non hai fatto tu questa richiesta, annullala. Il tuo account resterà com'è.",
    cancel: "Annulla la richiesta",
    cancelling: "Annullamento…",
    cancelDoneTitle: "Richiesta annullata",
    cancelDoneText: "Se la richiesta era ancora aperta, è stata annullata e il tuo account non è stato modificato. Se non hai fatto tu la richiesta, ti consigliamo di cambiare la password dell'account.",
    cancelMissing: "Questo link è incompleto. Aprilo di nuovo dall'e-mail.",
    support: "Domande? Scrivi a support@gloumi.lt.",
  },

  passwordReset: {
    title: "Nuova password",
    text: "Inserisci una nuova password per il tuo account Gloumi.",
    password: "Nuova password",
    repeat: "Ripeti la password",
    rules: "Almeno 8 caratteri: una lettera minuscola e una maiuscola, una cifra e un simbolo.",
    show: "Mostra",
    hide: "Nascondi",
    submit: "Cambia password",
    submitting: "Modifica in corso…",
    mismatch: "Le password non coincidono.",
    weak: "Questa password è troppo debole: servono almeno 8 caratteri, una lettera minuscola e una maiuscola, una cifra e un simbolo.",
    same: "La nuova password deve essere diversa da quella precedente.",
    tooLong: "Questa password è troppo lunga – accorciala.",
    pwned: "Questa password compare in un elenco di password trapelate – scegline un'altra.",
    code: "Codice dalla tua app di autenticazione",
    codeText: "Il tuo account è protetto dalla verifica in due passaggi. Inserisci il codice a sei cifre della tua app di autenticazione.",
    badCode: "Quel codice non ha funzionato. Inserisci un nuovo codice dalla tua app di autenticazione.",
    doneTitle: "Password modificata",
    doneText: "Torna all'app Gloumi e accedi con la nuova password.",
    open: "Apri l'app",
    errorTitle: "Questo link non è più valido",
    errorText: "Questo link è scaduto (vale 10 minuti) o è già stato usato. Richiedine uno nuovo nell'app o inserisci il codice dall'email.",
    failed: "Modifica non riuscita. Controlla la connessione e riprova.",
    inviteTitle: "Crea la tua password",
    inviteText: "Hai un invito su Gloumi. Crea una password per il tuo account.",
    inviteSubmit: "Crea password",
    inviteDoneTitle: "Password creata",
    inviteErrorText: "Questo link di invito è scaduto o è già stato usato. Chiedi un nuovo link a chi ti ha mandato l'invito.",
  },

  masterPage: {
    titleFemale: "Professionista",
    titleMale: "Professionista",
    services: "Servizi",
    otherServices: "Altri servizi",
    minutes: "min",
    deposit: "acconto",
    depositPercent: "acconto del {n}%",
    about: "Info",
    works: "Lavori",
    hours: "Orari di lavoro",
    dayOff: "Chiuso",
    weekdays: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
    terms: "Condizioni",
    cancellation: "Annullamento",
    rules: "Regole del professionista",
    booking: "Prenotazione",
    leadTime: "Prenota almeno {n} ore prima.",
    payment: "Pagamento",
    workFormat: "Dove lavora",
    amenities: "Comfort",
    addressInApp: "L’indirizzo esatto e la mappa sono nell’app.",
    book: "Prenota nell’app",
    paymentMethods: { cash: "Contanti", card_onsite: "Carta sul posto", card: "Nell’app" } as Record<string, string>,
    workFormats: { salon: "In un salone o studio", mobile: "A domicilio", rented_chair: "In uno spazio in affitto" } as Record<string, string>,
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
    title: "Recensioni",
    outOf: "su 5",
    count: ["recensione", "recensioni", "recensioni"],
    // teisininkas – neverčiama (V-9 privalomas paaiškinimas, AGENTS.md XII)
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Come verifichiamo le recensioni",
    empty: "Sul sito non ci sono ancora recensioni visibili. Tutte le recensioni sono nell'app.",
    noName: "Nome non indicato",
    reply: "Risposta del professionista",
    report: "Segnala contenuto",
    reportSubject: "Segnalazione di contenuto",
  },
  notFound: {
    eyebrow: "404",
    title: "Non troviamo questa pagina",
    text: "Il link potrebbe essere cambiato o la pagina è stata spostata.",
    cta: "Torna alla home",
  },

  errorPage: {
    eyebrow: "Errore",
    title: "Qualcosa è andato storto",
    text: "Non siamo riusciti a mostrare questa pagina. Riprova tra un momento – se succede ancora, scrivici.",
    retry: "Riprova",
    home: "Torna alla home",
  },
};
