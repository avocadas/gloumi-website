import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in French.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The voice matches the Lithuanian: the reader is addressed as « vous », plain
 * sentences, no exclamation marks, no gendered forms for the reader. Money as
 * "12 €", quotation marks « … ». Terms follow the app's French strings.
 *
 * Keys marked `teisininkas – neverčiama` are legal or compliance text and stay
 * in English until the legal role provides the French (AGENTS.md XII).
 */
export const fr: typeof lt = {
  a11y: {
    skip: "Aller au contenu",
  },

  nav: {
    ariaLabel: "Navigation principale",
    links: [
      { key: "categories", label: "Catégories" },
      { key: "why", label: "Pourquoi Gloumi" },
      { key: "masters", label: "Pour les professionnels" },
      { key: "contact", label: "Contact" },
    ],
    cta: "Télécharger",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    home: "Gloumi – accueil",
    language: "Langue",
  },

  seo: {
    title: "Gloumi – trouver et réserver des professionnels de la beauté en Lituanie",
    titleTemplate: "%s · Gloumi",
    description:
      "Trouvez des professionnels de la beauté et du bien-être en Lituanie et réservez à tout moment : ongles, cheveux, sourcils et cils, massages, maquillage et soins de la peau. Créneaux libres, prix avant la réservation et avis uniquement après un rendez-vous effectué – dans une seule application.",
    keywords: [
      "professionnels de la beauté Lituanie",
      "réserver un rendez-vous beauté",
      "manucure Vilnius",
      "réservation salon de coiffure",
      "restructuration des sourcils",
      "réservation massage",
      "maquillage professionnel",
      "esthétique",
      "application de réservation beauté",
      "Gloumi",
    ],
    ogAlt: "Gloumi – l'application pour trouver et réserver des professionnels de la beauté",
    ogHeadline: "Professionnels de la beauté et réservation en ligne",
    ogSub: "Ongles · Cheveux · Sourcils · Maquillage · Peau · Massages",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Professionnels de la beauté et du bien-être en Lituanie",
    titleStart: "Gloumi – trouvez un professionnel de la beauté et",
    titleAccent: "réservez",
    titleEnd: "à tout moment",
    lead:
      "Ongles, cheveux, sourcils, massages, maquillage et soins de la peau – réalisations des professionnels, créneaux libres et prix clairs dans une seule application. Réservez à toute heure, sans appel ni attente.",
    masterCta: "Espace pro / Se connecter",
    trustLabel: "Pourquoi choisir Gloumi",
    trust: ["Gratuit pour les clients", "Sans frais cachés", "Avis uniquement après un rendez-vous"],
    floatingReviews: { title: "Avis", sub: "Uniquement après un rendez-vous effectué" },
    floatingBooking: { title: "Créneau confirmé", sub: "Vendredi, 13:00" },
  },

  stores: {
    apple: { small: "Télécharger dans l'", big: "App Store", srOpens: "(s'ouvre dans un nouvel onglet)" },
    google: { small: "Disponible sur", big: "Google Play", srOpens: "(s'ouvre dans un nouvel onglet)" },
    soon: "Bientôt",
    soonTitle: "L'application arrive bientôt dans la boutique",
    soonSr: "– le lien apparaîtra dès que l'application sera dans la boutique",
  },

  phone: {
    ariaLabel: "Aperçu des écrans de l'application",
    tabsLabel: "Écrans de l'application",
    tabs: [
      { id: "feed", label: "Découvrir", alt: "Le fil Gloumi : Story des professionnels et dernières réalisations" },
      {
        id: "search",
        label: "Recherche",
        alt: "La recherche Gloumi : professionnels par prestation, prix, note et distance",
      },
      {
        id: "profile",
        label: "Profil",
        alt: "Le profil d'une professionnelle dans l'application Gloumi : note, description, adresse et carte",
      },
      {
        id: "booking",
        label: "Réservation",
        alt: "Réservation d'un rendez-vous dans l'application Gloumi : calendrier et créneaux libres",
      },
    ],
    note: "Les écrans montrent des professionnels et des avis fictifs.",
    // EN – laukia content vertimo
    pause: "Pause the screen slideshow",
    play: "Play the screen slideshow",
  },

  categories: {
    eyebrow: "Catégories",
    title: "Un professionnel pour chaque routine beauté",
    lead: "Choisissez une catégorie et découvrez ce qu'elle propose. Dans l'application, chacune a ses professionnels, leurs réalisations et leurs créneaux libres.",
    cta: "Trouver un professionnel",
    listLabel: "Catégories de prestations",
  },

  why: {
    eyebrow: "Pour les clients",
    title: "Pourquoi Gloumi ?",
    lead: "Tout pour qu'un rendez-vous beauté commence sans stress – de l'inspiration au créneau confirmé.",
    items: [
      {
        title: "Réservez 24 h/24, 7 j/7",
        text: "Vous voyez les créneaux libres du professionnel en temps réel et réservez tout de suite – à minuit ou pendant la pause déjeuner. Sans appel, sans « je vous réponds plus tard ».",
      },
      {
        title: "« Je veux ça » – l'inspiration des réalisations",
        text: "Parcourez les réalisations des professionnels, enregistrez celles qui vous plaisent dans vos collections et montrez-les au moment de réserver : c'est exactement ce que je veux.",
      },
      {
        title: "Des prix transparents",
        text: "Vous voyez le prix et la durée avant de réserver, et Gloumi n'ajoute rien au prix.",
      },
      {
        title: "Avis uniquement après un rendez-vous",
        text: "Seul un client dont le rendez-vous avec ce professionnel a bien eu lieu peut laisser un avis. Aucun avis venu de nulle part.",
      },
    ],
    howTitle: "Comment ça marche",
    steps: [
      { title: "Trouvez", text: "Par catégorie, par lieu sur la carte ou à partir d'une réalisation qui vous a plu." },
      { title: "Réservez", text: "Choisissez un créneau et confirmez en quelques secondes." },
      { title: "Venez", text: "Nous envoyons le rappel, et vous laissez votre avis après le rendez-vous." },
    ],
  },

  masters: {
    eyebrow: "Pour les professionnels",
    title: "Plus de clients. Moins d'heures creuses.",
    lead: "Gloumi, c'est votre accueil, votre vitrine et votre calendrier dans une seule application. Commencez avec la formule Starter à 0 € – Gloumi prend une commission de 5 % uniquement sur le premier rendez-vous effectué de chaque client chez vous.",
    items: [
      {
        title: "Moins de rendez-vous manqués",
        text: "Demandez un acompte – il est bloqué sur la carte du client et, en cas d'annulation tardive ou d'absence, il vous revient selon vos conditions d'annulation.",
        plan: "Pro et VIP",
      },
      {
        title: "Des rappels qui font revenir",
        text: "Un rappel au client avant le rendez-vous et, pour les clients qui acceptent de recevoir des offres, une invitation à réserver de nouveau le moment venu : pour chaque prestation, vous choisissez au bout de combien de temps il vaut la peine de la refaire.",
      },
      {
        title: "Un profil qui vous sert de vitrine",
        text: "Des widgets modulables : portfolio, prestations, horaires, Story et avis. Composez votre profil comme vous voulez que le client le voie.",
      },
      {
        title: "Vos propres clients, sans commission",
        text: "Vous recevez un code pour les clients que vous serviez avant Gloumi : jusqu'à 50 clients peuvent l'utiliser dans les 3 mois suivant la création du compte. Un client venu avec ce code ne génère jamais de commission.",
      },
    ],
    chipsLabel: "Et aussi",
    chips: [
      { text: "Virements sur votre compte bancaire via Stripe", plan: "Pro et VIP" },
      { text: "Fiches clients avec notes privées" },
      { text: "Statistiques du chiffre du mois et des prestations les plus demandées" },
      { text: "Lien de réservation personnel" },
      { text: "Pauses et créneaux bloqués dans le calendrier" },
      { text: "Story et publications pour la communauté" },
    ],
  },

  form: {
    eyebrow: "Compte professionnel",
    title: "Rejoignez Gloumi en tant que pro",
    lead: "Laissez vos coordonnées – nous vous aiderons à créer votre profil et répondrons à vos questions. Vous pouvez aussi créer votre profil professionnel vous-même dans l'application.",
    leadSoon: "Laissez vos coordonnées – nous vous aiderons à créer votre profil dès que l'application sera dans les boutiques, et répondrons à vos questions.",
    fields: {
      name: "Prénom",
      email: "E-mail",
      phone: "Téléphone",
      city: "Ville",
      category: "Catégorie principale",
      categoryPlaceholder: "Choisissez une catégorie",
      categoryOther: "Autre",
      link: "Instagram ou autre lien vers vos réalisations",
      message: "Message",
      messagePlaceholder: "Depuis combien d'années vous exercez, si vous avez un salon, ce que vous attendez de Gloumi…",
      optional: "facultatif",
    },
    // teisininkas – neverčiama
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama
    consentEnd: ".",
    submit: "Je veux rejoindre Gloumi",
    submitting: "Envoi…",
    successTitle: "Merci, c'est bien reçu",
    successText: "Nous vous contacterons bientôt à l'adresse e-mail indiquée. En attendant, téléchargez l'application et faites un tour.",
    successTextSoon: "Nous vous contacterons bientôt à l'adresse e-mail indiquée. L'application arrive bientôt sur l'App Store et Google Play.",
    another: "Envoyer une autre demande",
    errorGeneric: "Envoi impossible. Réessayez ou écrivez-nous par e-mail.",
    errorNetwork: "Pas de connexion. Vérifiez votre accès à internet et réessayez.",
    errorValidation: "Vérifiez les champs signalés.",
    errorRateLimited: "Trop de tentatives d'affilée. Réessayez dans quelques minutes.",
    errorDailyLimit: "Nous avons reçu beaucoup de demandes aujourd'hui. Écrivez-nous à info@gloumi.lt – nous vous répondrons.",
    unconfiguredTitle: "Le formulaire est en préparation",
    unconfiguredText: "Écrivez-nous directement – nous répondrons depuis la même adresse :",
    mailSubject: "Je veux rejoindre Gloumi en tant que pro",
  },

  finalCta: {
    title: "La beauté commence par un bon créneau.",
    lead: "Téléchargez Gloumi et réservez votre premier rendez-vous – ou rejoignez Gloumi en tant que pro et remplissez votre calendrier.",
    masterLink: "Espace pro",
  },

  footer: {
    tagline: "La plateforme des professionnels de la beauté et de leurs clients en Lituanie.",
    clients: "Pour les clients",
    masters: "Pour les professionnels",
    legal: "Informations légales",
    contacts: "Contact",
    clientLinks: [
      { key: "download", label: "Télécharger l'application" },
      { key: "categories", label: "Catégories" },
      { key: "why", label: "Pourquoi Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Avantages pour les pros" },
      { key: "join", label: "Rejoindre Gloumi en tant que pro" },
    ],
    faq: "Questions fréquentes",
    faqMasters: "Questions des professionnels",
    // Dokumentų pavadinimai – kaip teisininko prancūziškame faile (i18n/fr/teisininkas-labels.json).
    legalLinks: [
      { key: "terms", label: "Conditions d'utilisation" },
      { key: "privacy", label: "Politique de confidentialité" },
      { key: "partner", label: "Conditions pour les professionnels et les salons" },
      { key: "refunds", label: "Conditions de remboursement" },
      { key: "transparency", label: "DAC7 et transparence de la plateforme" },
      { key: "deletion", label: "Suppression du compte" },
      // EN – laukia content vertimo
      { key: "dsa", label: "Digital Services Act" },
      { key: "accessibility", label: "Accessibility" },
    ],
    companyLabel: "Numéro d'entreprise",
    registry: "Registre des personnes morales de la République de Lituanie",
    phoneLabel: "Tél.",
    vatLabel: "Numéro de TVA",
    // teisininkas – neverčiama
    rights: "All rights reserved.",
    // teisininkas – neverčiama
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Réseaux sociaux",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Informations légales",
    updated: "Mis à jour le",
    version: "version",
    toc: "Sommaire",
    // teisininkas – neverčiama
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama
    controller: "Data controller and platform operator",
    contactQuestion: "Des questions sur vos données ou les conditions ?",
    // teisininkas – neverčiama
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Autres documents",
  },

  faq: {
    eyebrow: "Aide",
    intro: "Des réponses courtes, selon les Conditions d'utilisation en vigueur. Vous ne trouvez pas de réponse ? Écrivez à",
    toc: "Thèmes",
  },

  appLink: {
    profileTitle: "Ce professionnel est sur l'application Gloumi",
    refTitle: "Vous avez reçu une invitation à rejoindre Gloumi",
    text: "Ouvrez le lien dans l'application Gloumi. Si vous ne l'avez pas encore, téléchargez-la et ouvrez le lien de nouveau.",
    open: "Ouvrir dans l'application",
    masterCode: "Code professionnel",
    referralCode: "Code de parrainage",
    codeHint: "Si le lien n'a pas ouvert l'application, vous pourrez saisir ce code dans l'application.",
    home: "À propos de Gloumi",
  },

  emailConfirm: {
    askTitle: "Confirmez votre adresse e-mail",
    askText: "Appuyez sur le bouton : l'adresse e-mail de votre compte Gloumi sera confirmée.",
    confirm: "Confirmer l'adresse e-mail",
    confirming: "Confirmation…",
    title: "Adresse e-mail confirmée",
    text: "Revenez dans l'application Gloumi et connectez-vous.",
    open: "Ouvrir l'application",
    otherDevice: "Vous avez ouvert l'e-mail sur un autre appareil ? Plus rien à faire – connectez-vous dans l'application sur le téléphone utilisé lors de l'inscription.",
    errorTitle: "Ce lien n'est plus valable",
    errorText: "Ce lien a expiré (il est valable 10 minutes) ou a déjà été utilisé. Si votre adresse e-mail est déjà confirmée, connectez-vous simplement dans l'application. Sinon, saisissez dans l'application le code reçu par e-mail ou demandez un nouvel e-mail.",
    failed: "La confirmation a échoué. Vérifiez votre connexion et réessayez.",
    changeAskTitle: "Confirmez le changement d'adresse e-mail",
    changeAskText: "Appuyez sur le bouton pour confirmer la nouvelle adresse e-mail de votre compte Gloumi.",
    changeConfirm: "Confirmer le changement",
    changeTitle: "C'est confirmé",
    changeText: "Si vous avez aussi reçu cet e-mail à votre autre adresse, confirmez également là-bas – votre adresse e-mail sera alors modifiée.",
    changeErrorText: "Ce lien a expiré (il est valable 10 minutes) ou a déjà été utilisé. Si le changement d'adresse e-mail est déjà confirmé, vous n'avez plus rien à faire. Sinon, modifiez de nouveau votre adresse e-mail dans les paramètres de l'application.",
    magicTitle: "Ouvrez-le dans l'application",
    magicText: "Ce lien de connexion fonctionne uniquement dans l'application Gloumi. Ouvrez l'e-mail sur le téléphone où l'application est installée, ou saisissez dans l'application le code reçu par e-mail.",
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
    title: "Nouveau mot de passe",
    text: "Saisissez un nouveau mot de passe pour votre compte Gloumi.",
    password: "Nouveau mot de passe",
    repeat: "Répétez le mot de passe",
    rules: "Au moins 8 caractères : une minuscule, une majuscule, un chiffre et un symbole.",
    show: "Afficher",
    hide: "Masquer",
    submit: "Changer le mot de passe",
    submitting: "Modification…",
    mismatch: "Les mots de passe ne correspondent pas.",
    weak: "Ce mot de passe est trop faible : il faut au moins 8 caractères, une minuscule, une majuscule, un chiffre et un symbole.",
    same: "Le nouveau mot de passe doit être différent de l'ancien.",
    tooLong: "Ce mot de passe est trop long – raccourcissez-le.",
    pwned: "Ce mot de passe figure dans une liste de mots de passe divulgués – choisissez-en un autre.",
    code: "Code de validation en deux étapes",
    codeText: "La validation en deux étapes est activée sur votre compte. Saisissez le code à six chiffres de votre application d'authentification.",
    badCode: "Ce code ne fonctionne pas. Saisissez un nouveau code de votre application d'authentification.",
    doneTitle: "Mot de passe modifié",
    doneText: "Revenez dans l'application Gloumi et connectez-vous avec votre nouveau mot de passe.",
    open: "Ouvrir l'application",
    errorTitle: "Ce lien n'est plus valable",
    errorText: "Ce lien a expiré (il est valable 10 minutes) ou a déjà été utilisé. Demandez-en un nouveau dans l'application ou saisissez le code reçu par e-mail.",
    failed: "La modification a échoué. Vérifiez votre connexion et réessayez.",
    inviteTitle: "Créez votre mot de passe",
    inviteText: "Vous avez reçu une invitation à rejoindre Gloumi. Créez un mot de passe pour votre compte.",
    inviteSubmit: "Créer le mot de passe",
    inviteDoneTitle: "Mot de passe créé",
    inviteErrorText: "Ce lien d'invitation a expiré ou a déjà été utilisé. Demandez un nouveau lien à la personne à l'origine de l'invitation.",
  },

  masterPage: {
    titleFemale: "Professionnelle",
    titleMale: "Professionnel",
    services: "Prestations",
    otherServices: "Autres prestations",
    minutes: "min",
    deposit: "acompte",
    depositPercent: "acompte de {n} %",
    about: "À propos",
    works: "Réalisations",
    hours: "Horaires",
    dayOff: "Fermé",
    weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    terms: "Conditions",
    cancellation: "Annulation",
    rules: "Règles du professionnel",
    booking: "Réservation",
    leadTime: "Réservez au moins {n} h à l’avance.",
    payment: "Paiement",
    workFormat: "Lieu de travail",
    amenities: "Équipements",
    addressInApp: "L’adresse exacte et la carte sont dans l’application.",
    book: "Réserver dans l’application",
    paymentMethods: { cash: "Espèces", card_onsite: "Carte sur place", card: "Dans l’application" } as Record<string, string>,
    workFormats: { salon: "En salon ou studio", mobile: "Chez le client", rented_chair: "Dans un espace loué" } as Record<string, string>,
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
    title: "Avis",
    outOf: "sur 5",
    count: ["avis", "avis", "avis"],
    // teisininkas – neverčiama
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Comment nous vérifions les avis",
    empty: "Aucun avis n'est encore affiché sur le site. Vous trouverez tous les avis dans l'application.",
    noName: "Prénom non indiqué",
    reply: "Réponse du professionnel",
    report: "Signaler le contenu",
    reportSubject: "Signalement de contenu",
  },
  notFound: {
    eyebrow: "404",
    title: "Page introuvable",
    text: "Le lien a peut-être changé, ou la page a été déplacée.",
    cta: "Retour à l'accueil",
  },

  errorPage: {
    eyebrow: "Erreur",
    title: "Un problème est survenu",
    text: "Impossible d'afficher cette page. Réessayez dans un instant – si le problème persiste, écrivez-nous.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
};
