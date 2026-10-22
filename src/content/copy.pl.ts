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
    pause: "Wstrzymaj pokaz ekranów",
    play: "Odtwórz pokaz ekranów",
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
      { key: "dsa", label: "Akt o usługach cyfrowych" },
      { key: "accessibility", label: "Dostępność" },
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

  mfaHelp: {
    title: "Wyłączanie weryfikacji dwuetapowej",
    text: "Wpisz kod z e-maila wysłanego na adres e-mail twojego konta. Kod jest ważny 24 godziny.",
    code: "Kod z e-maila",
    password: "Hasło do konta (opcjonalnie)",
    passwordHint: "Jeśli pamiętasz hasło, wpisz je – wtedy prośbę można zrealizować szybciej, najwcześniej po 3 dniach. Nie widzimy ani nie przechowujemy twojego hasła.",
    show: "Pokaż",
    hide: "Ukryj",
    submit: "Potwierdź",
    submitting: "Sprawdzanie…",
    captchaWait: "Poczekaj, aż zakończy się kontrola bezpieczeństwa.",
    codeInvalid: "Ten kod nie działa. Sprawdź, czy jest wpisany dokładnie tak jak w e-mailu i czy jest nadal ważny.",
    passwordWrong: "Hasło jest nieprawidłowe. Pozostałe próby: {n}. Jeśli go nie pamiętasz, zostaw pole puste.",
    captchaFailed: "Kontrola bezpieczeństwa nie powiodła się. Odśwież stronę i spróbuj ponownie.",
    tooMany: "Zbyt wiele prób. Spróbuj później.",
    unavailable: "Nie udało się tego teraz potwierdzić. Spróbuj ponownie za kilka minut.",
    down: "Ta strona chwilowo nie działa. Napisz do nas: support@gloumi.lt.",
    doneTitle: "Prośba potwierdzona",
    doneText: "Weryfikacja dwuetapowa zostanie wyłączona nie wcześniej niż {date}. Do tego czasu będziemy wysyłać przypomnienia na adres e-mail twojego konta z linkiem do anulowania prośby. Po wyłączeniu dostaniesz e-mail.",
    doneTextNoDate: "Wkrótce dostaniesz e-mail z datą wyłączenia weryfikacji dwuetapowej. Do tego czasu będziemy wysyłać przypomnienia na adres e-mail twojego konta z linkiem do anulowania prośby.",
    cancelTitle: "Anuluj prośbę",
    cancelText: "Jeśli to nie twoja prośba, anuluj ją. Twoje konto pozostanie bez zmian.",
    cancel: "Anuluj prośbę",
    cancelling: "Anulowanie…",
    cancelDoneTitle: "Prośba anulowana",
    cancelDoneText: "Jeśli prośba była jeszcze otwarta, została anulowana, a twoje konto się nie zmieniło. Jeśli to nie twoja prośba, radzimy zmienić hasło do konta.",
    cancelMissing: "Ten link jest niepełny. Otwórz go ponownie z e-maila.",
    support: "Masz pytania? Napisz na support@gloumi.lt.",
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
    code: "Kod z aplikacji uwierzytelniającej",
    codeText: "Twoje konto jest chronione weryfikacją dwuetapową. Wpisz sześciocyfrowy kod z aplikacji uwierzytelniającej.",
    badCode: "Ten kod nie zadziałał. Wpisz nowy kod z aplikacji uwierzytelniającej.",
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
    // teisininkas – neverčiama
    reportBody: {
      where: "Where (link or exact location in the app)",
      why: "Why you believe it is illegal",
      confirm: "I confirm that, to the best of my belief, the information in this report is accurate and complete.",
    },
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
