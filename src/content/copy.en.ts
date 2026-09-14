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
      { key: "masters", label: "For professionals" },
      { key: "contact", label: "Contact" },
    ],
    cta: "Get the app",
    open: "Open menu",
    close: "Close menu",
    home: "Gloumi – home",
    language: "Language",
  },

  seo: {
    title: "Gloumi – book beauty and wellness professionals in Lithuania",
    titleTemplate: "%s · Gloumi",
    description:
      "Find and book the best beauty and wellness professionals in Lithuania: nails, hair, brows and lashes, massage, make-up and skincare. Real availability, clear prices and reviews from real appointments, in one app.",
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
    ogAlt: "Gloumi – the app for finding and booking beauty professionals",
    ogHeadline: "Beauty professionals and bookings in Lithuania",
    ogSub: "Nails · Hair · Brows · Massage · Make-up · Skin",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Beauty and wellness professionals in Lithuania",
    titleStart: "Find and book the",
    titleAccent: "best",
    titleEnd: "beauty professionals in Lithuania",
    lead:
      "Nails, hair, brows, massage, make-up and skincare. Real work from real professionals, live availability and clear prices, all in one app. Book at any hour, without a single phone call.",
    masterCta: "I'm a professional / Sign in",
    trustLabel: "Why it is worth it",
    trust: ["Free for clients", "No hidden fees", "Reviews only after a visit"],
    floatingRating: { value: "4.9", label: "128 reviews" },
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
    time: "9:41",
    tabs: [
      { id: "search", label: "Search" },
      { id: "categories", label: "Categories" },
      { id: "calendar", label: "Calendar" },
    ],
    search: {
      locationLabel: "Location",
      city: "Vilnius",
      placeholder: "Professional, service or salon",
      chips: ["All", "Nails", "Hair", "Brows", "Massage"],
      nearby: "Near you",
      map: "Map",
      availableToday: "Free today",
      from: "from",
      masters: [
        {
          initials: "EJ",
          name: "Eglė J.",
          role: "Nail technician",
          rating: "4.9",
          reviews: "128",
          distance: "1.2 km",
          price: "35 €",
          today: true,
          hue: "#8F3D26",
        },
        {
          initials: "RK",
          name: "Rūta K.",
          role: "Hair stylist",
          rating: "5.0",
          reviews: "86",
          distance: "2.4 km",
          price: "45 €",
          today: false,
          hue: "#7A3350",
        },
        {
          initials: "AM",
          name: "Aistė M.",
          role: "Brows and lashes",
          rating: "4.8",
          reviews: "203",
          distance: "0.8 km",
          price: "25 €",
          today: true,
          hue: "#574463",
        },
      ],
    },
    categories: {
      title: "Categories",
      stories: "Stories",
      storyNames: ["Eglė", "Rūta", "Aistė", "Monika", "Greta"],
      popular: "Popular this week",
      popularItems: ["Gel manicure", "Brow lamination", "Balayage"],
    },
    calendar: {
      title: "Booking",
      master: "Eglė J.",
      service: "Gel manicure",
      meta: "60 min · 35 €",
      month: "September 2026",
      weekdays: ["M", "T", "W", "T", "F", "S", "S"],
      slotsLabel: "Available times",
      slots: ["10:00", "11:30", "13:00", "15:30", "17:00"],
      confirm: "Confirm · 35 €",
      deposit: "10 € deposit, refunded if you cancel 24 h ahead",
    },
    tabbar: ["Feed", "Search", "Bookings", "Profile"],
  },

  categories: {
    eyebrow: "Categories",
    title: "A professional for every part of your routine",
    lead: "Pick a category and see what it holds. In the app each one has its own professionals, their work and their free slots.",
    cta: "Find a professional",
    listLabel: "Service categories",
  },

  why: {
    eyebrow: "For clients",
    title: "Why Gloumi?",
    lead: "Everything that makes a beauty appointment start without stress, from the first idea to a confirmed time.",
    items: [
      {
        title: "Booking around the clock",
        text: "You see live availability and book straight away, at midnight or on your lunch break. No phone calls, no waiting for someone to write back.",
      },
      {
        title: "A lookbook of real work",
        text: "Browse work done by real professionals, save what you like, and show it when you book: this is what I want.",
      },
      {
        title: "Prices you can see",
        text: "The price and the length of the appointment are there before you book. You pay what it says, with no fees appearing at the till.",
      },
      {
        title: "Reviews that were earned",
        text: "A review can only be left after an appointment that actually happened, so every rating comes from someone who sat in the chair.",
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
    eyebrow: "For professionals",
    title: "More clients. Fewer empty hours.",
    lead: "Gloumi is your front desk, your shop window and your books, in one app. Start free and pay only when you need more.",
    items: [
      {
        title: "No more no-shows",
        text: "Ask for a deposit and the client confirms the time with money. If they do not turn up, the deposit stays with you.",
      },
      {
        title: "Reminders that bring people back",
        text: "Automatic reminders before an appointment, and a nudge to rebook when it is time for the next one.",
      },
      {
        title: "A profile you arrange yourself",
        text: "Movable widgets: portfolio, services, working hours, stories and reviews. Put your profile together the way you want a client to read it.",
      },
      {
        title: "Revenue you can read",
        text: "Daily and monthly takings, your most booked services, who comes back. Numbers you can plan with instead of guessing.",
      },
    ],
    chipsLabel: "Also included",
    chips: [
      "Payouts to your bank account through Stripe",
      "Client cards with private notes",
      "Your own booking link to share",
      "Breaks and blocked time in the calendar",
      "Stories and posts for the community",
    ],
  },

  form: {
    eyebrow: "Professional account",
    title: "Join Gloumi as a professional",
    lead: "Leave your details and we will help you set the profile up and answer any questions. You can also build the profile yourself in the app.",
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
    consentStart: "I agree that MB „Gloumi“ may contact me about a professional account. Data is handled under the ",
    consentLink: "Privacy Policy",
    consentEnd: ".",
    submit: "I want to join",
    submitting: "Sending…",
    successTitle: "Thank you, we have it",
    successText: "We will be in touch at the address you gave. In the meantime, download the app and have a look around.",
    another: "Send another enquiry",
    errorGeneric: "That did not send. Try again, or write to us by email.",
    errorNetwork: "No connection. Check your internet and try again.",
    errorValidation: "Please check the marked fields.",
    errorRateLimited: "Too many attempts in a row. Try again in a few minutes.",
    unconfiguredTitle: "The form is not ready yet",
    unconfiguredText: "Write to us directly and we will answer from the same address:",
    mailSubject: "I want to join Gloumi as a professional",
  },

  finalCta: {
    title: "Beauty starts with a good time slot.",
    lead: "Download Gloumi and book your first appointment, or join as a professional and fill your calendar.",
    masterLink: "I'm a professional",
  },

  footer: {
    tagline: "The platform for beauty professionals and their clients in Lithuania.",
    clients: "For clients",
    masters: "For professionals",
    legal: "Legal",
    contacts: "Contact",
    clientLinks: [
      { key: "download", label: "Download the app" },
      { key: "categories", label: "Categories" },
      { key: "why", label: "Why Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "What you get" },
      { key: "join", label: "Join as a professional" },
    ],
    legalLinks: [
      { key: "terms", label: "Terms of Service" },
      { key: "privacy", label: "Privacy Policy" },
      { key: "refunds", label: "Refund Policy" },
      { key: "transparency", label: "DAC7 and platform transparency" },
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
      "This page is an informational summary. The legally binding documents are the Terms of Service and the Privacy Policy.",
    otherDocs: "Other documents",
  },

  notFound: {
    eyebrow: "404",
    title: "We cannot find this page",
    text: "The link may have changed, or the page was moved.",
    cta: "Back to the home page",
  },
};
