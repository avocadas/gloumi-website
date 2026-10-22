import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in German.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one. Meaning comes from the Lithuanian; the reader is addressed
 * as „Sie“, a master is „Profi“ (never „Meister“), no exclamation marks,
 * money as „12 €“, German quotation marks „…“.
 */
export const de: typeof lt = {
  a11y: {
    skip: "Zum Inhalt springen",
  },

  nav: {
    ariaLabel: "Hauptnavigation",
    links: [
      { key: "categories", label: "Kategorien" },
      { key: "why", label: "Warum Gloumi" },
      { key: "masters", label: "Für Profis" },
      { key: "contact", label: "Kontakt" },
    ],
    cta: "App laden",
    open: "Menü öffnen",
    close: "Menü schließen",
    home: "Gloumi – zur Startseite",
    language: "Sprache",
  },

  seo: {
    title: "Gloumi – Beauty-Profis in Litauen finden und buchen",
    titleTemplate: "%s · Gloumi",
    description:
      "Finden Sie Beauty- und Wellness-Profis in Litauen und buchen Sie jederzeit: Nägel, Haare, Brauen und Wimpern, Massage, Make-up und Hautpflege. Freie Zeiten, Preise vor der Buchung und Bewertungen nur nach einem stattgefundenen Termin – in einer App.",
    keywords: [
      "Beauty-Profis Litauen",
      "Beauty-Termin online buchen",
      "Maniküre Vilnius",
      "Friseur online buchen",
      "Brauenlifting",
      "Massage buchen",
      "Visagistin",
      "Kosmetikerin",
      "Beauty-App",
      "Gloumi",
    ],
    ogAlt: "Gloumi – die App, um Beauty-Profis zu finden und zu buchen",
    ogHeadline: "Beauty-Profis online buchen in Litauen",
    ogSub: "Nägel · Haare · Brauen · Make-up · Haut · Massage",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Beauty- und Wellness-Profis in Litauen",
    titleStart: "Gloumi – finden Sie einen Beauty-Profi und",
    titleAccent: "buchen",
    titleEnd: "Sie jederzeit",
    lead:
      "Nägel, Haare, Brauen, Massage, Make-up und Hautpflege – Arbeiten der Profis, freie Zeiten und klare Preise in einer App. Buchen Sie zu jeder Tageszeit, ohne Anrufe und ohne Warten.",
    masterCta: "Ich bin Profi / Anmelden",
    trustLabel: "Warum es sich lohnt",
    trust: ["Kostenlos für Kunden", "Keine versteckten Gebühren", "Bewertungen nur nach einem Termin"],
    floatingReviews: { title: "Bewertungen", sub: "Nur nach einem stattgefundenen Termin" },
    floatingBooking: { title: "Termin bestätigt", sub: "Freitag, 13:00" },
  },

  stores: {
    apple: { small: "Laden im", big: "App Store", srOpens: "(öffnet in einem neuen Tab)" },
    google: { small: "Jetzt bei", big: "Google Play", srOpens: "(öffnet in einem neuen Tab)" },
    soon: "Demnächst",
    soonTitle: "Die App erscheint in Kürze im Store",
    soonSr: "– der Link erscheint, sobald die App im Store ist",
  },

  phone: {
    ariaLabel: "Vorschau der App-Bildschirme",
    tabsLabel: "App-Bildschirme",
    tabs: [
      { id: "feed", label: "Entdecken", alt: "Der Gloumi-Feed: Storys und neueste Arbeiten der Profis" },
      { id: "search", label: "Suche", alt: "Die Gloumi-Suche: Profis nach Leistung, Preis, Bewertung und Entfernung" },
      {
        id: "profile",
        label: "Profil",
        alt: "Ein Profi-Profil in der Gloumi-App: Bewertung, Beschreibung, Adresse und Karte",
      },
      { id: "booking", label: "Buchung", alt: "Termin buchen in der Gloumi-App: Kalender und freie Zeiten" },
    ],
    note: "Die Bildschirme zeigen Beispiel-Profis und -Bewertungen.",
    pause: "Bildschirm-Diashow anhalten",
    play: "Bildschirm-Diashow abspielen",
  },

  categories: {
    eyebrow: "Kategorien",
    title: "Für jede Beauty-Routine der passende Profi",
    lead: "Tippen Sie auf eine Kategorie und sehen Sie, was sie bietet. In der App hat jede ihre eigenen Profis, Arbeiten und freien Zeiten.",
    cta: "Profi finden",
    listLabel: "Leistungskategorien",
  },

  why: {
    eyebrow: "Für Kunden",
    title: "Warum Gloumi?",
    lead: "Alles, damit Ihr Beauty-Termin ohne Stress beginnt – von der Inspiration bis zur bestätigten Zeit.",
    items: [
      {
        title: "Rund um die Uhr buchen",
        text: "Sie sehen die freien Zeiten der Profis in Echtzeit und buchen sofort – um Mitternacht oder in der Mittagspause. Keine Anrufe, kein „Ich melde mich später“.",
      },
      {
        title: "„So möchte ich das“ – Inspiration aus Arbeiten der Profis",
        text: "Sie stöbern in den Arbeiten der Profis, speichern Ihre Favoriten in Sammlungen und zeigen beim Buchen: genau so möchte ich das.",
      },
      {
        title: "Transparente Preise",
        text: "Preis und Dauer sehen Sie vor der Buchung, und Gloumi schlägt nichts auf den Preis auf.",
      },
      {
        title: "Bewertungen nur nach einem Termin",
        text: "Eine Bewertung abgeben kann nur, wer bei diesem Profi tatsächlich einen Termin hatte. Keine Bewertungen von Unbeteiligten.",
      },
    ],
    howTitle: "So funktioniert es",
    steps: [
      { title: "Finden", text: "Nach Kategorie, Ort auf der Karte oder einer Arbeit, die Ihnen gefallen hat." },
      { title: "Buchen", text: "Wählen Sie eine Zeit und bestätigen Sie sie in wenigen Sekunden." },
      { title: "Hingehen", text: "Wir schicken Ihnen eine Erinnerung, und nach dem Termin geben Sie eine Bewertung ab." },
    ],
  },

  masters: {
    eyebrow: "Für Profis",
    title: "Mehr Kunden. Weniger leere Stunden.",
    lead: "Gloumi ist Ihr Empfang, Ihr Schaufenster und Ihr Kalender in einer App. Starten Sie mit dem Starter-Plan für 0 € – Gloumi erhält 5 % Provision nur für den ersten stattgefundenen Termin jedes Kunden bei Ihnen.",
    items: [
      {
        title: "Weniger Nichterscheinen",
        text: "Verlangen Sie eine Anzahlung – sie wird auf der Karte des Kunden vorgemerkt und geht bei später Stornierung oder Nichterscheinen gemäß Ihren Stornobedingungen an Sie.",
        plan: "Pro und VIP",
      },
      {
        title: "Erinnerungen, die zurückbringen",
        text: "Eine Erinnerung an den Kunden vor dem Termin und – für alle, die Angebote erhalten möchten – eine Einladung zur erneuten Buchung, wenn es Zeit ist: Für jede Leistung legen Sie selbst fest, nach welcher Zeit sich eine Wiederholung lohnt.",
      },
      {
        title: "Ihr Profil als Schaufenster",
        text: "Flexible Bausteine: Portfolio, Leistungen, Arbeitszeiten, Storys und Bewertungen. Gestalten Sie Ihr Profil so, wie Kunden es sehen sollen.",
      },
      {
        title: "Eigene Kunden ohne Provision mitbringen",
        text: "Sie erhalten einen Code für Kunden, die Sie schon vor Gloumi betreut haben: Bis zu 50 Kunden können ihn innerhalb von 3 Monaten nach der Kontoerstellung nutzen. Für Kunden, die mit Ihrem Code kommen, fällt nie eine Provision an.",
      },
    ],
    chipsLabel: "Außerdem dabei",
    chips: [
      { text: "Auszahlungen auf Ihr Bankkonto über Stripe", plan: "Pro und VIP" },
      { text: "Kundenkarten mit privaten Notizen" },
      { text: "Monatsumsatz und die meistgebuchten Leistungen" },
      { text: "Eigener Buchungslink zum Teilen" },
      { text: "Pausen und blockierte Zeit im Kalender" },
      { text: "Storys und Beiträge für die Community" },
    ],
  },

  form: {
    eyebrow: "Profi-Konto",
    title: "Werden Sie Profi bei Gloumi",
    lead: "Hinterlassen Sie Ihre Kontaktdaten – wir helfen Ihnen beim Einrichten des Profils und beantworten Ihre Fragen. Ihr Profi-Profil können Sie auch selbst in der App erstellen.",
    leadSoon: "Hinterlassen Sie Ihre Kontaktdaten – wir helfen Ihnen beim Einrichten des Profils, sobald die App in den Stores ist, und beantworten Ihre Fragen.",
    fields: {
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      city: "Stadt",
      category: "Hauptkategorie",
      categoryPlaceholder: "Kategorie wählen",
      categoryOther: "Sonstiges",
      link: "Instagram oder ein anderer Link zu Ihren Arbeiten",
      message: "Nachricht",
      messagePlaceholder: "Wie lange Sie schon arbeiten, ob Sie einen Salon haben, was Sie von Gloumi erwarten…",
      optional: "optional",
    },
    // teisininkas – neverčiama
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama
    consentEnd: ".",
    submit: "Ich möchte mitmachen",
    submitting: "Wird gesendet…",
    successTitle: "Danke – ist angekommen",
    successText: "Wir melden uns bald unter der angegebenen E-Mail-Adresse. Bis dahin können Sie die App laden und sich umsehen.",
    successTextSoon: "Wir melden uns bald unter der angegebenen E-Mail-Adresse. Die App erscheint in Kürze im App Store und bei Google Play.",
    another: "Weitere Anfrage senden",
    errorGeneric: "Das Senden hat nicht geklappt. Versuchen Sie es erneut oder schreiben Sie uns eine E-Mail.",
    errorNetwork: "Keine Verbindung. Prüfen Sie Ihr Internet und versuchen Sie es erneut.",
    errorValidation: "Prüfen Sie die markierten Felder.",
    errorRateLimited: "Zu viele Versuche hintereinander. Versuchen Sie es in einigen Minuten erneut.",
    errorDailyLimit: "Heute haben wir sehr viele Anfragen erhalten. Schreiben Sie uns an info@gloumi.lt – wir antworten.",
    unconfiguredTitle: "Das Formular ist noch in Arbeit",
    unconfiguredText: "Schreiben Sie uns direkt – wir antworten von derselben Adresse:",
    mailSubject: "Ich möchte Profi bei Gloumi werden",
  },

  finalCta: {
    title: "Schönheit beginnt mit einem guten Termin.",
    lead: "Laden Sie Gloumi und buchen Sie Ihren ersten Termin – oder machen Sie als Profi mit und füllen Sie Ihren Kalender.",
    masterLink: "Ich bin Profi",
  },

  footer: {
    tagline: "Die Plattform für Beauty-Profis und ihre Kunden in Litauen.",
    clients: "Für Kunden",
    masters: "Für Profis",
    legal: "Rechtliches",
    contacts: "Kontakt",
    clientLinks: [
      { key: "download", label: "App laden" },
      { key: "categories", label: "Kategorien" },
      { key: "why", label: "Warum Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Vorteile für Profis" },
      { key: "join", label: "Profi werden" },
    ],
    faq: "Häufige Fragen",
    faqMasters: "Fragen von Profis",
    legalLinks: [
      { key: "terms", label: "Nutzungsbedingungen" },
      { key: "privacy", label: "Datenschutzerklärung" },
      { key: "partner", label: "Bedingungen für Profis und Salons" },
      { key: "refunds", label: "Erstattungsbedingungen" },
      { key: "transparency", label: "DAC7 und Transparenz der Plattform" },
      { key: "deletion", label: "Konto löschen" },
      { key: "dsa", label: "Gesetz über digitale Dienste" },
      { key: "accessibility", label: "Barrierefreiheit" },
    ],
    companyLabel: "Unternehmenscode",
    registry: "Register juristischer Personen der Republik Litauen",
    phoneLabel: "Tel.",
    vatLabel: "USt-IdNr.",
    // teisininkas – neverčiama
    rights: "All rights reserved.",
    // teisininkas – neverčiama
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Soziale Netzwerke",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Rechtliches",
    updated: "Aktualisiert",
    version: "Version",
    toc: "Inhalt",
    // teisininkas – neverčiama
    englishNote: "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama
    controller: "Data controller and platform operator",
    contactQuestion: "Fragen zu Ihren Daten oder den Bedingungen?",
    // teisininkas – neverčiama
    disclaimer: "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Weitere Dokumente",
  },

  faq: {
    eyebrow: "Hilfe",
    intro: "Kurze Antworten nach den aktuell geltenden Nutzungsbedingungen. Keine Antwort gefunden? Schreiben Sie an",
    toc: "Themen",
  },

  appLink: {
    profileTitle: "Dieser Profi ist in der Gloumi-App",
    refTitle: "Sie wurden zu Gloumi eingeladen",
    text: "Öffnen Sie den Link in der Gloumi-App. Wenn Sie die App noch nicht haben, laden Sie sie und öffnen Sie den Link erneut.",
    open: "In der App öffnen",
    masterCode: "Profi-Code",
    referralCode: "Empfehlungscode",
    codeHint: "Wenn der Link die App nicht geöffnet hat, können Sie diesen Code in der App eingeben.",
    home: "Über Gloumi",
  },

  emailConfirm: {
    askTitle: "Bestätigen Sie Ihre E-Mail-Adresse",
    askText: "Tippen Sie auf die Schaltfläche – dann wird die E-Mail-Adresse Ihres Gloumi-Kontos bestätigt.",
    confirm: "E-Mail-Adresse bestätigen",
    confirming: "Wird bestätigt…",
    title: "E-Mail-Adresse bestätigt",
    text: "Kehren Sie zur Gloumi-App zurück und melden Sie sich an.",
    open: "App öffnen",
    otherDevice: "Sie haben die E-Mail auf einem anderen Gerät geöffnet? Sie müssen nichts weiter tun – melden Sie sich in der App auf dem Telefon an, mit dem Sie sich registriert haben.",
    errorTitle: "Dieser Link ist nicht mehr gültig",
    errorText: "Dieser Link ist abgelaufen (er gilt 10 Minuten) oder wurde bereits verwendet. Wenn Sie Ihre E-Mail-Adresse schon bestätigt haben, melden Sie sich einfach in der App an. Wenn nicht, geben Sie den Code aus der E-Mail in der App ein oder fordern Sie eine neue E-Mail an.",
    failed: "Die Bestätigung hat nicht geklappt. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    changeAskTitle: "Bestätigen Sie die Änderung Ihrer E-Mail-Adresse",
    changeAskText: "Tippen Sie auf die Schaltfläche, um die neue E-Mail-Adresse Ihres Gloumi-Kontos zu bestätigen.",
    changeConfirm: "Änderung bestätigen",
    changeTitle: "Bestätigt",
    changeText: "Wenn Sie diese E-Mail auch an Ihre andere Adresse erhalten haben, bestätigen Sie auch dort – dann wird Ihre E-Mail-Adresse geändert.",
    changeErrorText: "Dieser Link ist abgelaufen (er gilt 10 Minuten) oder wurde bereits verwendet. Wenn Sie die Änderung schon bestätigt haben, müssen Sie nichts weiter tun. Wenn nicht, ändern Sie Ihre E-Mail-Adresse in den App-Einstellungen erneut.",
    magicTitle: "In der App öffnen",
    magicText: "Dieser Anmeldelink funktioniert nur in der Gloumi-App. Öffnen Sie die E-Mail auf dem Telefon, auf dem die App installiert ist, oder geben Sie den Code aus der E-Mail in der App ein.",
  },

  mfaHelp: {
    title: "Zwei-Faktor-Authentifizierung deaktivieren",
    text: "Geben Sie den Code aus der E-Mail ein, die an die E-Mail-Adresse Ihres Kontos gesendet wurde. Der Code ist 24 Stunden gültig.",
    code: "Code aus der E-Mail",
    password: "Kontopasswort (optional)",
    passwordHint: "Wenn Sie Ihr Passwort noch wissen, geben Sie es ein – dann kann die Anfrage schneller bearbeitet werden, frühestens nach 3 Tagen. Wir sehen und speichern Ihr Passwort nicht.",
    show: "Anzeigen",
    hide: "Ausblenden",
    submit: "Bestätigen",
    submitting: "Wird geprüft…",
    captchaWait: "Bitte warten Sie, bis die Sicherheitsprüfung abgeschlossen ist.",
    codeInvalid: "Dieser Code funktioniert nicht. Prüfen Sie, ob Sie ihn genau wie in der E-Mail eingegeben haben und ob er noch gültig ist.",
    passwordWrong: "Das Passwort ist nicht richtig. Verbleibende Versuche: {n}. Wenn Sie es nicht mehr wissen, lassen Sie das Feld leer.",
    captchaFailed: "Die Sicherheitsprüfung ist fehlgeschlagen. Laden Sie die Seite neu und versuchen Sie es erneut.",
    tooMany: "Zu viele Versuche. Bitte versuchen Sie es später erneut.",
    unavailable: "Wir konnten das gerade nicht bestätigen. Bitte versuchen Sie es in ein paar Minuten erneut.",
    down: "Diese Seite funktioniert vorübergehend nicht. Bitte schreiben Sie uns an support@gloumi.lt.",
    doneTitle: "Anfrage bestätigt",
    doneText: "Die Zwei-Faktor-Authentifizierung wird frühestens am {date} deaktiviert. Bis dahin senden wir Erinnerungen an die E-Mail-Adresse Ihres Kontos, mit einem Link zum Zurückziehen der Anfrage. Sobald sie deaktiviert ist, erhalten Sie eine E-Mail.",
    doneTextNoDate: "Sie erhalten bald eine E-Mail mit dem Datum, an dem die Zwei-Faktor-Authentifizierung deaktiviert wird. Bis dahin senden wir Erinnerungen an die E-Mail-Adresse Ihres Kontos, mit einem Link zum Zurückziehen der Anfrage.",
    cancelTitle: "Anfrage zurückziehen",
    cancelText: "Wenn Sie diese Anfrage nicht gestellt haben, ziehen Sie sie zurück. Ihr Konto bleibt unverändert.",
    cancel: "Anfrage zurückziehen",
    cancelling: "Wird zurückgezogen…",
    cancelDoneTitle: "Anfrage zurückgezogen",
    cancelDoneText: "Falls die Anfrage noch offen war, wurde sie zurückgezogen und Ihr Konto nicht geändert. Wenn Sie die Anfrage nicht gestellt haben, empfehlen wir, das Passwort Ihres Kontos zu ändern.",
    cancelMissing: "Dieser Link ist unvollständig. Öffnen Sie ihn erneut aus der E-Mail.",
    support: "Fragen? Schreiben Sie an support@gloumi.lt.",
  },

  passwordReset: {
    title: "Neues Passwort",
    text: "Geben Sie ein neues Passwort für Ihr Gloumi-Konto ein.",
    password: "Neues Passwort",
    repeat: "Passwort wiederholen",
    rules: "Mindestens 8 Zeichen: ein Klein- und ein Großbuchstabe, eine Ziffer und ein Sonderzeichen.",
    show: "Anzeigen",
    hide: "Ausblenden",
    submit: "Passwort ändern",
    submitting: "Wird geändert…",
    mismatch: "Die Passwörter stimmen nicht überein.",
    weak: "Dieses Passwort ist zu schwach: Es braucht mindestens 8 Zeichen, einen Klein- und einen Großbuchstaben, eine Ziffer und ein Sonderzeichen.",
    same: "Das neue Passwort muss sich vom bisherigen unterscheiden.",
    tooLong: "Dieses Passwort ist zu lang – kürzen Sie es.",
    pwned: "Dieses Passwort steht auf einer Liste kompromittierter Passwörter – wählen Sie ein anderes.",
    code: "Code aus Ihrer Authenticator-App",
    codeText: "Ihr Konto ist mit Zwei-Faktor-Authentifizierung geschützt. Geben Sie den sechsstelligen Code aus Ihrer Authenticator-App ein.",
    badCode: "Dieser Code hat nicht funktioniert. Geben Sie einen neuen Code aus Ihrer Authenticator-App ein.",
    doneTitle: "Passwort geändert",
    doneText: "Kehren Sie zur Gloumi-App zurück und melden Sie sich mit Ihrem neuen Passwort an.",
    open: "App öffnen",
    errorTitle: "Dieser Link ist nicht mehr gültig",
    errorText: "Dieser Link ist abgelaufen (er gilt 10 Minuten) oder wurde bereits verwendet. Fordern Sie in der App einen neuen an oder geben Sie den Code aus der E-Mail ein.",
    failed: "Die Änderung hat nicht geklappt. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    inviteTitle: "Erstellen Sie Ihr Passwort",
    inviteText: "Sie wurden zu Gloumi eingeladen. Erstellen Sie ein Passwort für Ihr Konto.",
    inviteSubmit: "Passwort erstellen",
    inviteDoneTitle: "Passwort erstellt",
    inviteErrorText: "Dieser Einladungslink ist abgelaufen oder wurde bereits verwendet. Bitten Sie die Person, die Sie eingeladen hat, einen neuen zu senden.",
  },

  masterPage: {
    titleFemale: "Profi",
    titleMale: "Profi",
    services: "Leistungen",
    otherServices: "Weitere Leistungen",
    minutes: "Min.",
    deposit: "Anzahlung",
    depositPercent: "{n} % Anzahlung",
    about: "Über",
    works: "Arbeiten",
    hours: "Arbeitszeiten",
    dayOff: "Geschlossen",
    weekdays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    terms: "Bedingungen",
    cancellation: "Stornierung",
    rules: "Regeln des Profis",
    booking: "Buchung",
    leadTime: "Buchen Sie mindestens {n} Std. im Voraus.",
    payment: "Zahlung",
    workFormat: "Arbeitsort",
    amenities: "Ausstattung",
    addressInApp: "Die genaue Adresse und die Karte finden Sie in der App.",
    book: "In der App buchen",
    paymentMethods: { cash: "Bargeld", card_onsite: "Mit Karte vor Ort", card: "In der App" } as Record<string, string>,
    workFormats: { salon: "Im Salon oder Studio", mobile: "Beim Kunden", rented_chair: "In einem gemieteten Raum" } as Record<string, string>,
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
    title: "Bewertungen",
    outOf: "von 5",
    count: ["Bewertung", "Bewertungen", "Bewertungen"],
    // teisininkas – neverčiama
    consentNote: "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Wie wir Bewertungen prüfen",
    empty: "Auf der Website werden noch keine Bewertungen angezeigt. Alle Bewertungen finden Sie in der App.",
    noName: "Name nicht angegeben",
    reply: "Antwort des Profis",
    report: "Inhalt melden",
    reportSubject: "Meldung zu Inhalten",
    // teisininkas – neverčiama
    reportBody: {
      where: "Where (link or exact location in the app)",
      why: "Why you believe it is illegal",
      name: "Name (optional)",
      confirm: "I confirm that, to the best of my belief, the information in this report is accurate and complete.",
    },
  },
  notFound: {
    eyebrow: "404",
    title: "Diese Seite finden wir nicht",
    text: "Der Link hat sich vielleicht geändert, oder die Seite wurde verschoben.",
    cta: "Zur Startseite",
  },

  errorPage: {
    eyebrow: "Fehler",
    title: "Etwas ist schiefgelaufen",
    text: "Diese Seite konnte nicht angezeigt werden. Versuchen Sie es gleich noch einmal – wenn das wieder passiert, schreiben Sie uns.",
    retry: "Erneut versuchen",
    home: "Zur Startseite",
  },
};
