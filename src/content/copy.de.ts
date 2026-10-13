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
    titleStart: "Finden Sie einen Beauty-Profi und",
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
  },
  notFound: {
    eyebrow: "404",
    title: "Diese Seite finden wir nicht",
    text: "Der Link hat sich vielleicht geändert, oder die Seite wurde verschoben.",
    cta: "Zur Startseite",
  },
};
