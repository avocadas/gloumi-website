import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in Polish.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The voice matches the Lithuanian: the reader is addressed as "ty", plain
 * sentences, no exclamation marks, no gendered forms for the reader. Polish
 * quotation marks „…”, money as "12 €".
 *
 * Strings marked "teisininkas – neverčiama" are legal texts (AGENTS.md Article XII): they are
 * left in English until the legal role supplies the Polish wording.
 */
export const pl: typeof lt = {
  a11y: {
    skip: "Przejdź do treści",
  },

  nav: {
    ariaLabel: "Nawigacja główna",
    links: [
      { key: "categories", label: "Kategorie" },
      { key: "why", label: "Dlaczego Gloumi" },
      { key: "masters", label: "Dla specjalistów" },
      { key: "contact", label: "Kontakt" },
    ],
    cta: "Pobierz",
    open: "Otwórz menu",
    close: "Zamknij menu",
    home: "Gloumi – strona główna",
    language: "Język",
  },

  seo: {
    title: "Gloumi – wyszukiwanie i rezerwacja specjalistów od urody na Litwie",
    titleTemplate: "%s · Gloumi",
    description:
      "Znajdź specjalistów od urody i dobrego samopoczucia na Litwie i rezerwuj o dowolnej porze: paznokcie, włosy, brwi, masaże, makijaż i pielęgnacja skóry. Wolne terminy, ceny przed rezerwacją i opinie tylko po odbytej wizycie – w jednej aplikacji.",
    keywords: [
      "specjaliści od urody Litwa",
      "rezerwacja online",
      "manicure Wilno",
      "fryzjer rezerwacja",
      "laminacja brwi",
      "masaż rezerwacja",
      "makijaż wizażystka",
      "kosmetolog",
      "aplikacja do rezerwacji w salonie urody",
      "Gloumi",
    ],
    ogAlt: "Gloumi – aplikacja do wyszukiwania i rezerwacji specjalistów od urody",
    ogHeadline: "Specjaliści od urody i rezerwacje online",
    ogSub: "Paznokcie · Włosy · Brwi · Makijaż · Skóra · Masaże",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Specjaliści od urody i dobrego samopoczucia na Litwie",
    titleStart: "Gloumi – znajdź specjalistę od urody i",
    titleAccent: "zarezerwuj",
    titleEnd: "o dowolnej porze",
    lead:
      "Paznokcie, włosy, brwi, masaże, makijaż i pielęgnacja skóry – prace specjalistów, wolne terminy i jasne ceny w jednej aplikacji. Rezerwuj o każdej porze dnia i nocy, bez telefonów i czekania.",
    masterCta: "Dla specjalistów / Zaloguj się",
    trustLabel: "Dlaczego warto",
    trust: ["Bezpłatnie dla klientów", "Bez ukrytych opłat", "Opinie tylko po wizycie"],
    floatingReviews: { title: "Opinie", sub: "Tylko po odbytej wizycie" },
    floatingBooking: { title: "Termin potwierdzony", sub: "Piątek, 13:00" },
  },

  stores: {
    apple: { small: "Pobierz w", big: "App Store", srOpens: "(otwiera się w nowym oknie)" },
    google: { small: "Pobierz z", big: "Google Play", srOpens: "(otwiera się w nowym oknie)" },
    soon: "Wkrótce",
    soonTitle: "Aplikacja wkrótce pojawi się w sklepie",
    soonSr: "– link pojawi się, gdy aplikacja będzie w sklepie",
  },

  phone: {
    ariaLabel: "Podgląd ekranów aplikacji",
    tabsLabel: "Ekrany aplikacji",
    tabs: [
      { id: "feed", label: "Odkrywaj", alt: "Aktualności w Gloumi: Story specjalistów i najnowsze prace" },
      { id: "search", label: "Szukaj", alt: "Wyszukiwarka Gloumi: specjaliści według usługi, ceny, oceny i odległości" },
      {
        id: "profile",
        label: "Profil",
        alt: "Profil specjalistki w aplikacji Gloumi: ocena, opis, adres i mapa",
      },
      { id: "booking", label: "Rezerwacja", alt: "Rezerwacja wizyty w aplikacji Gloumi: kalendarz i wolne terminy" },
    ],
    note: "Na ekranach – przykładowi specjaliści i opinie.",
    // EN – laukia content vertimo
    pause: "Pause the screen slideshow",
    play: "Play the screen slideshow",
  },

  categories: {
    eyebrow: "Kategorie",
    title: "Do każdej rutyny urodowej – właściwy specjalista",
    lead: "Wybierz kategorię i zobacz, co w niej znajdziesz. W aplikacji każda ma swoich specjalistów, prace i wolne terminy.",
    cta: "Znajdź specjalistę",
    listLabel: "Kategorie usług",
  },

  why: {
    eyebrow: "Dla klientów",
    title: "Dlaczego Gloumi?",
    lead: "Wszystko, żeby wizyta zaczęła się bez stresu – od inspiracji po potwierdzony termin.",
    items: [
      {
        title: "Rezerwuj 24/7",
        text: "Widzisz wolne terminy specjalisty na bieżąco i rezerwujesz od razu – o północy czy w przerwie na lunch. Bez telefonów, bez „odpiszę później”.",
      },
      {
        title: "„Chcę tak” – inspiracja z prac specjalistów",
        text: "Przeglądasz prace specjalistów, zapisujesz te, które ci się podobają, w kolekcjach, a przy rezerwacji pokazujesz specjaliście: chcę właśnie tak.",
      },
      {
        title: "Przejrzyste ceny",
        text: "Cenę i czas trwania widzisz przed rezerwacją, a Gloumi nic do ceny nie dolicza.",
      },
      {
        title: "Opinie tylko po wizycie",
        text: "Opinię może wystawić tylko klient, którego wizyta u tego specjalisty się odbyła. Żadnych opinii od osób z zewnątrz.",
      },
    ],
    howTitle: "Jak to działa",
    steps: [
      { title: "Znajdź", text: "Według kategorii, miejsca na mapie albo pracy, która ci się spodobała." },
      { title: "Zarezerwuj", text: "Wybierz termin i potwierdź w kilka sekund." },
      { title: "Przyjdź", text: "Przypomnienie wyślemy my, a opinię wystawisz po wizycie." },
    ],
  },

  masters: {
    eyebrow: "Dla specjalistów",
    title: "Więcej klientów. Mniej pustych godzin.",
    lead: "Gloumi to twoja recepcja, witryna i kalendarz w jednej aplikacji. Zacznij od planu Starter za 0 € – Gloumi pobiera 5% prowizji tylko od pierwszej odbytej wizyty każdego klienta u ciebie.",
    items: [
      {
        title: "Mniej nieobecności",
        text: "Wymagaj zaliczki – jest blokowana na karcie klienta, a przy późnym odwołaniu lub nieprzyjściu trafia do ciebie zgodnie z twoimi warunkami odwołania.",
        plan: "Pro i VIP",
      },
      {
        title: "Przypomnienia, dzięki którym klienci wracają",
        text: "Przypomnienie dla klienta przed wizytą, a tym, którzy zgodzili się otrzymywać oferty – zaproszenie do ponownej rezerwacji, gdy przyjdzie pora: dla każdej usługi ustalasz, po jakim czasie warto ją powtórzyć.",
      },
      {
        title: "Profil – twoja witryna",
        text: "Elastyczne widżety: portfolio, usługi, godziny pracy, Story i opinie. Ułóż profil tak, jak chcesz, żeby widział go klient.",
      },
      {
        title: "Własnych klientów przyprowadzasz bez prowizji",
        text: "Dostajesz kod dla klientów sprzed Gloumi: może z niego skorzystać do 50 klientów w ciągu 3 mies. od założenia konta. Klient, który przyjdzie z kodem, nigdy nie generuje prowizji.",
      },
    ],
    chipsLabel: "Inne możliwości",
    chips: [
      { text: "Wypłaty na konto bankowe przez Stripe", plan: "Pro i VIP" },
      { text: "Karty klientów z prywatnymi notatkami" },
      { text: "Statystyki miesięcznych przychodów i najpopularniejszych usług" },
      { text: "Osobisty link do rezerwacji" },
      { text: "Przerwy i zablokowany czas w kalendarzu" },
      { text: "Story i posty dla społeczności" },
    ],
  },

  form: {
    eyebrow: "Konto specjalisty",
    title: "Dołącz do specjalistów Gloumi",
    lead: "Zostaw kontakt – pomożemy założyć profil i odpowiemy na pytania. Profil specjalisty możesz też utworzyć samodzielnie w aplikacji.",
    leadSoon: "Zostaw kontakt – pomożemy założyć profil, gdy tylko aplikacja pojawi się w sklepach, i odpowiemy na pytania.",
    fields: {
      name: "Imię",
      email: "E-mail",
      phone: "Telefon",
      city: "Miasto",
      category: "Główna kategoria",
      categoryPlaceholder: "Wybierz kategorię",
      categoryOther: "Inna",
      link: "Instagram lub inny link do prac",
      message: "Wiadomość",
      messagePlaceholder: "Od ilu lat pracujesz, czy masz salon, czego oczekujesz od Gloumi…",
      optional: "opcjonalnie",
    },
    // teisininkas – neverčiama
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama
    consentEnd: ".",
    submit: "Chcę dołączyć",
    submitting: "Wysyłanie…",
    successTitle: "Dzięki – mamy to",
    successText: "Wkrótce odezwiemy się na podany e-mail. A na razie pobierz aplikację i rozejrzyj się.",
    successTextSoon: "Wkrótce odezwiemy się na podany e-mail. Aplikacja niedługo pojawi się w App Store i Google Play.",
    another: "Wyślij kolejne zgłoszenie",
    errorGeneric: "Nie udało się wysłać. Spróbuj ponownie albo napisz do nas e-mailem.",
    errorNetwork: "Brak połączenia. Sprawdź internet i spróbuj ponownie.",
    errorValidation: "Sprawdź zaznaczone pola.",
    errorRateLimited: "Za dużo prób z rzędu. Spróbuj za kilka minut.",
    errorDailyLimit: "Dziś dostaliśmy bardzo dużo zgłoszeń. Napisz do nas na info@gloumi.lt – odpowiemy.",
    unconfiguredTitle: "Formularz jest jeszcze w przygotowaniu",
    unconfiguredText: "Napisz do nas bezpośrednio – odpowiemy z tego samego adresu:",
    mailSubject: "Zgłoszenie: konto specjalisty w Gloumi",
  },

  finalCta: {
    title: "Uroda zaczyna się od dobrego terminu.",
    lead: "Pobierz Gloumi i zarezerwuj pierwszą wizytę – albo dołącz do specjalistów i zapełnij swój kalendarz.",
    masterLink: "Dla specjalistów",
  },

  footer: {
    tagline: "Platforma specjalistów od urody i ich klientów na Litwie.",
    clients: "Dla klientów",
    masters: "Dla specjalistów",
    legal: "Informacje prawne",
    contacts: "Kontakt",
    clientLinks: [
      { key: "download", label: "Pobierz aplikację" },
      { key: "categories", label: "Kategorie" },
      { key: "why", label: "Dlaczego Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Korzyści dla specjalistów" },
      { key: "join", label: "Dołącz do Gloumi" },
    ],
    faq: "Najczęstsze pytania",
    faqMasters: "Pytania specjalistów",
    // Dokumentų pavadinimai – kaip teisininko rolės lenkiškose etiketėse (teisininkas-labels.json).
    legalLinks: [
      { key: "terms", label: "Regulamin" },
      { key: "privacy", label: "Polityka prywatności" },
      { key: "partner", label: "Warunki dla specjalistów i salonów" },
      { key: "refunds", label: "Zasady zwrotów" },
      { key: "transparency", label: "DAC7 i przejrzystość platformy" },
      { key: "deletion", label: "Usuwanie konta" },
      // EN – laukia content vertimo
      { key: "dsa", label: "Digital Services Act" },
      { key: "accessibility", label: "Accessibility" },
    ],
    companyLabel: "Kod przedsiębiorstwa",
    registry: "Rejestr osób prawnych Republiki Litewskiej",
    phoneLabel: "Tel.",
    vatLabel: "Numer identyfikacyjny VAT",
    // teisininkas – neverčiama
    rights: "All rights reserved.",
    // teisininkas – neverčiama
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Media społecznościowe",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Informacje prawne",
    updated: "Zaktualizowano",
    version: "wersja",
    toc: "Spis treści",
    // teisininkas – neverčiama
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama
    controller: "Data controller and platform operator",
    contactQuestion: "Pytania o dane lub regulamin?",
    // teisininkas – neverčiama
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Inne dokumenty",
  },

  faq: {
    eyebrow: "Pomoc",
    intro: "Krótkie odpowiedzi zgodne z obecnie obowiązującym Regulaminem. Nie ma tu odpowiedzi? Napisz na",
    toc: "Tematy",
  },

  appLink: {
    profileTitle: "Ten profil jest w aplikacji Gloumi",
    refTitle: "Zaproszenie do Gloumi",
    text: "Otwórz link w aplikacji Gloumi. Jeśli jej jeszcze nie masz – pobierz ją i otwórz link ponownie.",
    open: "Otwórz w aplikacji",
    masterCode: "Kod specjalisty",
    referralCode: "Kod polecający",
    codeHint: "Jeśli link nie otworzył aplikacji, możesz wpisać ten kod w aplikacji.",
    home: "O Gloumi",
  },

  emailConfirm: {
    askTitle: "Potwierdź adres e-mail",
    askText: "Naciśnij przycisk, a adres e-mail twojego konta Gloumi zostanie potwierdzony.",
    confirm: "Potwierdź e-mail",
    confirming: "Potwierdzanie…",
    title: "E-mail potwierdzony",
    text: "Wróć do aplikacji Gloumi i zaloguj się.",
    open: "Otwórz aplikację",
    otherDevice: "Wiadomość otwarta na innym urządzeniu? Nie musisz nic więcej robić – zaloguj się w aplikacji na telefonie użytym do rejestracji.",
    errorTitle: "Ten link już nie działa",
    errorText: "Ten link wygasł (działa przez 10 minut) albo został już użyty. Jeśli adres e-mail jest już potwierdzony – po prostu zaloguj się w aplikacji. Jeśli nie – wpisz w aplikacji kod z e-maila albo poproś o nową wiadomość.",
    failed: "Nie udało się potwierdzić. Sprawdź połączenie i spróbuj ponownie.",
    changeAskTitle: "Potwierdź zmianę adresu e-mail",
    changeAskText: "Naciśnij przycisk, aby potwierdzić nowy adres e-mail twojego konta Gloumi.",
    changeConfirm: "Potwierdź zmianę",
    changeTitle: "Potwierdzono",
    changeText: "Jeśli ta wiadomość przyszła też na twój drugi adres, potwierdź również tam – wtedy adres e-mail się zmieni.",
    changeErrorText: "Ten link wygasł (działa przez 10 minut) albo został już użyty. Jeśli zmiana adresu e-mail jest już potwierdzona – nie musisz nic robić. Jeśli nie – zmień adres e-mail ponownie w ustawieniach aplikacji.",
    magicTitle: "Otwórz w aplikacji",
    magicText: "Ten link do logowania działa tylko w aplikacji Gloumi. Otwórz wiadomość na telefonie, na którym jest zainstalowana aplikacja, albo wpisz w aplikacji kod z e-maila.",
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
    title: "Nowe hasło",
    text: "Wpisz nowe hasło do konta Gloumi.",
    password: "Nowe hasło",
    repeat: "Powtórz hasło",
    rules: "Co najmniej 8 znaków: mała i wielka litera, cyfra i symbol.",
    show: "Pokaż",
    hide: "Ukryj",
    submit: "Zmień hasło",
    submitting: "Zmienianie…",
    mismatch: "Hasła nie są takie same.",
    weak: "To hasło jest za słabe: potrzeba co najmniej 8 znaków, małej i wielkiej litery, cyfry i symbolu.",
    same: "Nowe hasło musi się różnić od poprzedniego.",
    tooLong: "To hasło jest za długie – skróć je.",
    pwned: "To hasło znajduje się na liście haseł, które wyciekły – wybierz inne.",
    code: "Kod weryfikacji dwuetapowej",
    codeText: "Twoje konto chroni weryfikacja dwuetapowa. Wpisz sześciocyfrowy kod z aplikacji uwierzytelniającej.",
    badCode: "Ten kod nie pasuje. Wpisz nowy kod z aplikacji uwierzytelniającej.",
    doneTitle: "Hasło zmienione",
    doneText: "Wróć do aplikacji Gloumi i zaloguj się nowym hasłem.",
    open: "Otwórz aplikację",
    errorTitle: "Ten link już nie działa",
    errorText: "Ten link wygasł (działa przez 10 minut) albo został już użyty. Poproś o nowy w aplikacji albo wpisz kod z e-maila.",
    failed: "Nie udało się zmienić hasła. Sprawdź połączenie i spróbuj ponownie.",
    inviteTitle: "Utwórz hasło",
    inviteText: "Masz zaproszenie do Gloumi. Utwórz hasło do swojego konta.",
    inviteSubmit: "Utwórz hasło",
    inviteDoneTitle: "Hasło utworzone",
    inviteErrorText: "Ten link z zaproszeniem wygasł albo został już użyty. Poproś osobę, która cię zaprosiła, o wysłanie nowego.",
  },

  masterPage: {
    titleFemale: "Specjalistka",
    titleMale: "Specjalista",
    services: "Usługi",
    otherServices: "Inne usługi",
    minutes: "min",
    deposit: "zaliczka",
    depositPercent: "zaliczka {n}%",
    about: "Informacje",
    works: "Prace",
    hours: "Godziny pracy",
    dayOff: "Nie pracuje",
    weekdays: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
    terms: "Warunki",
    cancellation: "Odwołanie",
    rules: "Zasady specjalisty",
    booking: "Rezerwacja",
    leadTime: "Rezerwuj co najmniej {n} godz. wcześniej.",
    payment: "Płatność",
    workFormat: "Gdzie pracuje",
    amenities: "Udogodnienia",
    addressInApp: "Dokładny adres i mapa są w aplikacji.",
    book: "Zarezerwuj w aplikacji",
    paymentMethods: { cash: "Gotówka", card_onsite: "Kartą na miejscu", card: "W aplikacji" } as Record<string, string>,
    workFormats: { salon: "W salonie lub studiu", mobile: "U klienta", rented_chair: "W wynajmowanym miejscu" } as Record<string, string>,
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
    title: "Opinie",
    outOf: "na 5",
    count: ["opinia", "opinie", "opinii"],
    // teisininkas – neverčiama
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Jak weryfikujemy opinie",
    empty: "Na stronie nie ma jeszcze opinii. Wszystkie opinie znajdziesz w aplikacji.",
    noName: "Bez imienia",
    reply: "Odpowiedź specjalisty",
    report: "Zgłoś treść",
    reportSubject: "Zgłoszenie treści",
  },
  notFound: {
    eyebrow: "404",
    title: "Nie możemy znaleźć tej strony",
    text: "Link mógł się zmienić albo strona została przeniesiona.",
    cta: "Wróć na stronę główną",
  },

  errorPage: {
    eyebrow: "Błąd",
    title: "Coś poszło nie tak",
    text: "Nie udało się wyświetlić tej strony. Spróbuj ponownie za chwilę – jeśli to się powtarza, napisz do nas.",
    retry: "Spróbuj ponownie",
    home: "Wróć na stronę główną",
  },
};
