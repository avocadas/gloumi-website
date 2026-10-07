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
    titleStart: "Find a beauty master and",
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
    lead: "Gloumi is your front desk, your shop window and your calendar, in one app. Start on the Starter plan for €0 – Gloumi only takes a 5% commission on visits paid in the app.",
    items: [
      {
        title: "Fewer no-shows",
        text: "Ask for a deposit and the client confirms the time with money. If they do not turn up, the deposit stays with you.",
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
    errorValidation: "Please check the marked fields.",
    errorRateLimited: "Too many attempts in a row. Try again in a few minutes.",
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
    ],
    companyLabel: "Company number",
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

  notFound: {
    eyebrow: "404",
    title: "We cannot find this page",
    text: "The link may have changed, or the page was moved.",
    cta: "Back to the home page",
  },
};
