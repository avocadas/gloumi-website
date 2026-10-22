import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in English.
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The voice matches the Lithuanian: second person, plain sentences, no
 * exclamation marks. British spelling.
 */
export const en: typeof lt = {
  a11y: {
    skip: "Skip to content",
  },

  nav: {
    ariaLabel: "Main navigation",
    links: [
      { key: "categories", label: "Categories" },
      { key: "why", label: "Why Gloumi" },
      { key: "masters", label: "For masters" },
      { key: "contact", label: "Contact" },
    ],
    cta: "Get the app",
    open: "Open menu",
    close: "Close menu",
    home: "Gloumi – home",
    language: "Language",
  },

  seo: {
    title: "Gloumi – book beauty and wellness masters in Lithuania",
    titleTemplate: "%s · Gloumi",
    description:
      "Find beauty and wellness masters in Lithuania and book any time: nails, hair, brows and lashes, massage, makeup and skincare. Live availability, prices before you book and reviews only after a completed visit, in one app.",
    keywords: [
      "beauty professionals Lithuania",
      "book beauty appointment",
      "manicure Vilnius",
      "hair salon booking",
      "brow lamination",
      "massage booking",
      "make-up artist",
      "skincare specialist",
      "beauty booking app",
      "Gloumi",
    ],
    ogAlt: "Gloumi – the app for finding and booking beauty masters",
    ogHeadline: "Beauty masters and bookings in Lithuania",
    ogSub: "Nails · Hair · Brows · Makeup · Skin · Massage",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Beauty and wellness masters in Lithuania",
    titleStart: "Gloumi – find a beauty master and",
    titleAccent: "book",
    titleEnd: "any time",
    lead:
      "Nails, hair, brows, massage, makeup and skincare. Masters' work, live availability and clear prices, all in one app. Book at any hour, without a single phone call.",
    masterCta: "I'm a master / Sign in",
    trustLabel: "Why it is worth it",
    trust: ["Free for clients", "No hidden fees", "Reviews only after a visit"],
    floatingReviews: { title: "Reviews", sub: "Only after a visit" },
    floatingBooking: { title: "Booking confirmed", sub: "Friday, 13:00" },
  },

  stores: {
    apple: { small: "Download on the", big: "App Store", srOpens: "(opens in a new tab)" },
    google: { small: "Get it on", big: "Google Play", srOpens: "(opens in a new tab)" },
    soon: "Coming soon",
    soonTitle: "The app will be in the store shortly",
    soonSr: "– the link appears once the app is in the store",
  },

  phone: {
    ariaLabel: "Preview of the app's screens",
    tabsLabel: "App screens",
    tabs: [
      { id: "feed", label: "Discover", alt: "The Gloumi feed: masters' stories and latest work" },
      { id: "search", label: "Search", alt: "Gloumi search: masters by service, price, rating and distance" },
      {
        id: "profile",
        label: "Profile",
        alt: "A master's profile in the Gloumi app: rating, bio, address and map",
      },
      { id: "booking", label: "Booking", alt: "Booking a visit in the Gloumi app: calendar and free times" },
    ],
    note: "The screens show sample masters and reviews.",
    pause: "Pause the screen slideshow",
    play: "Play the screen slideshow",
  },

  categories: {
    eyebrow: "Categories",
    title: "A master for every part of your routine",
    lead: "Pick a category and see what it holds. In the app each one has its own masters, their work and their free slots.",
    cta: "Find a master",
    listLabel: "Service categories",
  },

  why: {
    eyebrow: "For clients",
    title: "Why Gloumi?",
    lead: "Everything that makes a beauty visit start without stress, from the first idea to a confirmed time.",
    items: [
      {
        title: "Booking around the clock",
        text: "You see live availability and book straight away, at midnight or on your lunch break. No phone calls, no waiting for someone to write back.",
      },
      {
        title: "Inspiration from masters' work",
        text: "Browse masters' work, save what you like to your collections, and show it when you book: this is what I want.",
      },
      {
        title: "Prices you can see",
        text: "You see the price and the length of the visit before you book, and Gloumi adds nothing to the price.",
      },
      {
        title: "Reviews only after a visit",
        text: "Only a client whose visit with that master actually happened can leave a review.",
      },
    ],
    howTitle: "How it works",
    steps: [
      { title: "Find", text: "By category, by place on the map, or by a photo of work you liked." },
      { title: "Book", text: "Pick a time and confirm it in seconds." },
      { title: "Arrive", text: "We send the reminder, and you leave the review afterwards." },
    ],
  },

  masters: {
    eyebrow: "For masters",
    title: "More clients. Fewer empty hours.",
    lead: "Gloumi is your front desk, your shop window and your calendar, in one app. Start on the Starter plan for €0 – Gloumi takes a 5% commission only on each client's first completed visit with you.",
    items: [
      {
        title: "Fewer no-shows",
        text: "Ask for a deposit – it is reserved on the client's card, and after a late cancellation or a no-show it goes to you under your cancellation terms.",
        plan: "Pro and VIP",
      },
      {
        title: "Reminders that bring people back",
        text: "A reminder to the client before the visit, and – for clients who agreed to receive offers – an invitation to book again when it is time: you set for each service how soon it is worth repeating.",
      },
      {
        title: "A profile you arrange yourself",
        text: "Movable widgets: portfolio, services, working hours, stories and reviews. Put your profile together the way you want a client to read it.",
      },
      {
        title: "Bring your own clients, commission-free",
        text: "You get a code for clients you served before Gloumi: up to 50 of them can use it within 3 months of sign-up. A client who comes with your code never generates a commission.",
      },
    ],
    chipsLabel: "Also included",
    chips: [
      { text: "Payouts to your bank account through Stripe", plan: "Pro and VIP" },
      { text: "Client cards with private notes" },
      { text: "Monthly takings and most booked services" },
      { text: "Your own booking link to share" },
      { text: "Breaks and blocked time in the calendar" },
      { text: "Stories and posts for the community" },
    ],
  },

  form: {
    eyebrow: "Master account",
    title: "Join Gloumi as a master",
    lead: "Leave your details and we will help you set the profile up and answer any questions. You can also build the profile yourself in the app.",
    leadSoon: "Leave your details and we will help you set up your profile as soon as the app is in the stores, and answer any questions.",
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      city: "City",
      category: "Main category",
      categoryPlaceholder: "Choose a category",
      categoryOther: "Other",
      link: "Instagram or another link to your work",
      message: "Message",
      messagePlaceholder: "How long you have been working, whether you have a salon, what you want from Gloumi…",
      optional: "optional",
    },
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    consentLink: "Privacy Policy",
    consentEnd: ".",
    submit: "I want to join",
    submitting: "Sending…",
    successTitle: "Thank you, we have it",
    successText: "We will be in touch at the address you gave. In the meantime, download the app and have a look around.",
    successTextSoon: "We will be in touch at the address you gave. The app is coming soon to the App Store and Google Play.",
    another: "Send another enquiry",
    errorGeneric: "That did not send. Try again, or write to us by email.",
    errorNetwork: "No connection. Check your internet and try again.",
    errorValidation: "Check the marked fields.",
    errorRateLimited: "Too many attempts in a row. Try again in a few minutes.",
    errorDailyLimit: "We've had a lot of requests today. Write to us at info@gloumi.lt and we'll reply.",
    unconfiguredTitle: "The form is not ready yet",
    unconfiguredText: "Write to us directly and we will answer from the same address:",
    mailSubject: "I want to join Gloumi as a master",
  },

  finalCta: {
    title: "Beauty starts with a good time slot.",
    lead: "Download Gloumi and book your first visit, or join as a master and fill your calendar.",
    masterLink: "I'm a master",
  },

  footer: {
    tagline: "The platform for beauty masters and their clients in Lithuania.",
    clients: "For clients",
    masters: "For masters",
    legal: "Legal",
    contacts: "Contact",
    clientLinks: [
      { key: "download", label: "Download the app" },
      { key: "categories", label: "Categories" },
      { key: "why", label: "Why Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "What you get" },
      { key: "join", label: "Join as a master" },
    ],
    faq: "FAQ",
    faqMasters: "Questions from masters",
    legalLinks: [
      { key: "terms", label: "Terms of Service" },
      { key: "privacy", label: "Privacy Policy" },
      { key: "partner", label: "Terms for Masters and Salons" },
      { key: "refunds", label: "Refund Policy" },
      { key: "transparency", label: "DAC7 and platform transparency" },
      { key: "deletion", label: "Account deletion" },
      { key: "dsa", label: "Digital Services Act" },
      { key: "accessibility", label: "Accessibility" },
    ],
    companyLabel: "Company number",
    registry: "Register of Legal Entities of the Republic of Lithuania",
    phoneLabel: "Phone",
    vatLabel: "VAT number",
    rights: "All rights reserved.",
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Social profiles",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Legal",
    updated: "Last updated",
    version: "version",
    toc: "Contents",
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    controller: "Data controller and platform operator",
    contactQuestion: "Questions about your data or these terms?",
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Other documents",
  },

  faq: {
    eyebrow: "Help",
    intro: "Short answers under the Terms of Service as they stand today. No answer here? Write to",
    toc: "Topics",
  },

  appLink: {
    profileTitle: "This master is on the Gloumi app",
    refTitle: "You're invited to Gloumi",
    text: "Open the link in the Gloumi app. If you don't have it yet, download it and open the link again.",
    open: "Open in the app",
    masterCode: "Master code",
    referralCode: "Referral code",
    codeHint: "If the link didn't open the app, you can enter this code in the app.",
    home: "About Gloumi",
  },

  emailConfirm: {
    askTitle: "Confirm your email",
    askText: "Tap the button and the email address of your Gloumi account will be confirmed.",
    confirm: "Confirm email",
    confirming: "Confirming…",
    title: "Email confirmed",
    text: "Go back to the Gloumi app and sign in.",
    open: "Open the app",
    otherDevice: "Opened the email on another device? Nothing else to do – sign in in the app on the phone you signed up on.",
    errorTitle: "This link no longer works",
    errorText:
      "This link has expired (it works for 10 minutes) or has already been used. If you have already confirmed your email, just sign in in the app. If not, enter the code from the email in the app or ask for a new email.",
    failed: "Confirmation failed. Check your connection and try again.",
    changeAskTitle: "Confirm the email change",
    changeAskText: "Tap the button to confirm the new email address of your Gloumi account.",
    changeConfirm: "Confirm the change",
    changeTitle: "Confirmed",
    changeText: "If you also received this email at your other address, confirm it there too – then your email will change.",
    changeErrorText:
      "This link has expired (it works for 10 minutes) or has already been used. If you have already confirmed the change, there is nothing else to do. If not, change your email again in the app's settings.",
    magicTitle: "Open it in the app",
    magicText:
      "This sign-in link works only in the Gloumi app. Open the email on the phone where the app is installed, or enter the code from the email in the app.",
  },

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
    title: "New password",
    text: "Enter a new password for your Gloumi account.",
    password: "New password",
    repeat: "Repeat the password",
    rules: "At least 8 characters: a lowercase and an uppercase letter, a digit and a symbol.",
    show: "Show",
    hide: "Hide",
    submit: "Change password",
    submitting: "Changing…",
    mismatch: "The passwords do not match.",
    weak: "This password is too weak: it needs at least 8 characters, a lowercase and an uppercase letter, a digit and a symbol.",
    same: "The new password must differ from the old one.",
    tooLong: "This password is too long – make it shorter.",
    pwned: "This password has appeared in a data breach – choose another one.",
    code: "Code from your authenticator app",
    codeText: "Your account is protected by two-factor authentication. Enter the six-digit code from your authenticator app.",
    badCode: "That code did not work. Enter a new code from your authenticator app.",
    doneTitle: "Password changed",
    doneText: "Go back to the Gloumi app and sign in with your new password.",
    open: "Open the app",
    errorTitle: "This link no longer works",
    errorText:
      "This link has expired (it works for 10 minutes) or has already been used. Ask for a new one in the app or enter the code from the email.",
    failed: "The change failed. Check your connection and try again.",
    inviteTitle: "Create your password",
    inviteText: "You have been invited to Gloumi. Create a password for your account.",
    inviteSubmit: "Create password",
    inviteDoneTitle: "Password created",
    inviteErrorText: "This invitation link has expired or has already been used. Ask the person who invited you to send a new one.",
  },

  masterPage: {
    titleFemale: "Master",
    titleMale: "Master",
    services: "Services",
    otherServices: "Other services",
    minutes: "min",
    deposit: "deposit",
    depositPercent: "{n}% deposit",
    about: "About",
    works: "Work",
    hours: "Opening hours",
    dayOff: "Closed",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    terms: "Terms",
    cancellation: "Cancellation",
    rules: "Master's rules",
    booking: "Booking",
    leadTime: "Book at least {n} h ahead.",
    payment: "Payment",
    workFormat: "Where they work",
    amenities: "Amenities",
    addressInApp: "The exact address and map are in the app.",
    book: "Book in the app",
    paymentMethods: { cash: "Cash", card_onsite: "Card on site", card: "In the app" } as Record<string, string>,
    workFormats: { salon: "At a salon or studio", mobile: "At the client's place", rented_chair: "In a rented space" } as Record<string, string>,
    cancellationPolicies: {
      // Legal role, 2026-10-14 (word for word). Teisininkas 2026-10-15: free_24h ir move_only – su „patvirtintas“, kaip programėlės policyForfeitText / policyMoveOnlyText (b63ff56d).
      free_24h: "Free cancellation until 24 hours before the visit; if you cancel a confirmed visit later or don’t show up, the deposit is charged.",
      deposit_required:
        "A deposit is reserved on your card when you book; if you cancel a confirmed visit less than 24 hours before or don’t show up, it is charged and goes to the master.",
      no_deposit: "You can cancel at any time – anything paid is refunded in full.",
      move_only: "Free cancellation any time. Within 24 hours of a confirmed visit, it can only be moved to a new time the master proposes.",
    } as Record<string, string>,
  },

  masterReviews: {
    title: "Reviews",
    outOf: "out of 5",
    count: ["review", "reviews", "reviews"],
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "How we verify reviews",
    empty: "There are no reviews shown on the website yet. You'll find all reviews in the app.",
    noName: "Name not given",
    reply: "Master's reply",
    report: "Report content",
    reportSubject: "Content report",
    // DSA Art. 16(2): what a notice must contain (legal role 2026-10-22).
    reportBody: {
      where: "Where (link or exact location in the app)",
      why: "Why you believe it is illegal",
      name: "Name (optional)",
      confirm: "I confirm that, to the best of my belief, the information in this report is accurate and complete.",
    },
  },
  notFound: {
    eyebrow: "404",
    title: "We cannot find this page",
    text: "The link may have changed, or the page was moved.",
    cta: "Back to the home page",
  },

  errorPage: {
    eyebrow: "Error",
    title: "Something went wrong",
    text: "We could not show this page. Try again in a moment – if it keeps happening, write to us.",
    retry: "Try again",
    home: "Back to the home page",
  },
};
