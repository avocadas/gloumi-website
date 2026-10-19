import type { lt } from "./copy.lt";

/**
 * Every visible string on the landing page, in Spanish (Spain).
 *
 * Typed as `typeof lt`, so this file cannot fall out of step with the
 * Lithuanian one: a key added there and forgotten here fails the typecheck.
 *
 * The reader is addressed as "tú", with no gendered forms; "profesional" for
 * master, "anticipo" for deposit, "cita" for visit. No exclamation marks.
 */
export const es: typeof lt = {
  a11y: {
    skip: "Saltar al contenido",
  },

  nav: {
    ariaLabel: "Navegación principal",
    links: [
      { key: "categories", label: "Categorías" },
      { key: "why", label: "Por qué Gloumi" },
      { key: "masters", label: "Para profesionales" },
      { key: "contact", label: "Contacto" },
    ],
    cta: "Descargar",
    open: "Abrir menú",
    close: "Cerrar menú",
    home: "Gloumi – inicio",
    language: "Idioma",
  },

  seo: {
    title: "Gloumi – busca y reserva profesionales de belleza en Lituania",
    titleTemplate: "%s · Gloumi",
    description:
      "Encuentra profesionales de belleza y bienestar en Lituania y reserva cuando quieras: uñas, cabello, cejas, masajes, maquillaje y cuidado de la piel. Horas libres, precios antes de reservar y reseñas solo después de una cita realizada, todo en una app.",
    keywords: [
      "profesionales de belleza Lituania",
      "reservar cita de belleza",
      "manicura Vilna",
      "reservar peluquería",
      "laminado de cejas",
      "reservar masaje",
      "maquillaje profesional",
      "cosmetología",
      "app de reservas de belleza",
      "Gloumi",
    ],
    ogAlt: "Gloumi – la app para buscar y reservar profesionales de belleza",
    ogHeadline: "Profesionales de belleza y reservas online",
    ogSub: "Uñas · Cabello · Cejas · Maquillaje · Piel · Masajes",
    ogStores: "App Store · Google Play",
  },

  hero: {
    eyebrow: "Profesionales de belleza y bienestar en Lituania",
    titleStart: "Gloumi – encuentra un profesional de belleza y",
    titleAccent: "reserva",
    titleEnd: "cuando quieras",
    lead:
      "Uñas, cabello, cejas, masajes, maquillaje y cuidado de la piel – trabajos de profesionales, horas libres y precios claros en una sola app. Reserva a cualquier hora, sin llamadas ni esperas.",
    masterCta: "Soy profesional / Iniciar sesión",
    trustLabel: "Por qué merece la pena",
    trust: ["Gratis para clientes", "Sin costes ocultos", "Reseñas solo después de la cita"],
    floatingReviews: { title: "Reseñas", sub: "Solo tras una cita realizada" },
    floatingBooking: { title: "Hora confirmada", sub: "Viernes, 13:00" },
  },

  stores: {
    apple: { small: "Descargar en el", big: "App Store", srOpens: "(se abre en una pestaña nueva)" },
    google: { small: "Disponible en", big: "Google Play", srOpens: "(se abre en una pestaña nueva)" },
    soon: "Próximamente",
    soonTitle: "La app llegará pronto a la tienda",
    soonSr: "– el enlace aparecerá cuando la app esté en la tienda",
  },

  phone: {
    ariaLabel: "Vista previa de las pantallas de la app",
    tabsLabel: "Pantallas de la app",
    tabs: [
      { id: "feed", label: "Descubrir", alt: "El feed de Gloumi: Story de profesionales y sus últimos trabajos" },
      { id: "search", label: "Buscar", alt: "Búsqueda en Gloumi: profesionales por servicio, precio, valoración y distancia" },
      {
        id: "profile",
        label: "Perfil",
        alt: "Perfil de una profesional en la app Gloumi: valoración, descripción, dirección y mapa",
      },
      { id: "booking", label: "Reserva", alt: "Reserva de una cita en la app Gloumi: calendario y horas libres" },
    ],
    note: "Las pantallas muestran profesionales y reseñas de ejemplo.",
    // EN – laukia content vertimo
    pause: "Pause the screen slideshow",
    play: "Play the screen slideshow",
  },

  categories: {
    eyebrow: "Categorías",
    title: "Un profesional para cada rutina de belleza",
    lead: "Pulsa una categoría y mira lo que incluye. En la app, cada una tiene sus profesionales, sus trabajos y sus horas libres.",
    cta: "Encontrar profesional",
    listLabel: "Categorías de servicios",
  },

  why: {
    eyebrow: "Para clientes",
    title: "¿Por qué Gloumi?",
    lead: "Todo para que tu cita de belleza empiece sin estrés, desde la idea hasta la hora confirmada.",
    items: [
      {
        title: "Reserva 24/7",
        text: "Ves las horas libres del profesional en tiempo real y reservas al momento, a medianoche o en la pausa de la comida. Sin llamadas ni «ya te escribo luego».",
      },
      {
        title: "«Lo quiero así» – inspiración en el trabajo de los profesionales",
        text: "Explora trabajos de profesionales, guarda los que te gusten en tus colecciones y, al reservar, enséñaselos al profesional: lo quiero exactamente así.",
      },
      {
        title: "Precios transparentes",
        text: "Ves el precio y la duración antes de reservar, y Gloumi no añade nada al precio.",
      },
      {
        title: "Reseñas solo después de la cita",
        text: "Solo puede dejar una reseña el cliente cuya cita con ese profesional se ha realizado. Nada de reseñas de gente ajena.",
      },
    ],
    howTitle: "Cómo funciona",
    steps: [
      { title: "Encuentra", text: "Por categoría, por ubicación en el mapa o por un trabajo que te haya gustado." },
      { title: "Reserva", text: "Elige una hora y confírmala en unos segundos." },
      { title: "Ven", text: "Te enviamos un recordatorio, y la reseña la dejas después de la cita." },
    ],
  },

  masters: {
    eyebrow: "Para profesionales",
    title: "Más clientes. Menos horas vacías.",
    lead: "Gloumi es tu recepción, tu escaparate y tu calendario en una sola app. Empieza con el plan Starter por 0 € – Gloumi cobra una comisión del 5 % solo por la primera cita realizada de cada cliente contigo.",
    items: [
      {
        title: "Menos ausencias",
        text: "Pide un anticipo: se retiene en la tarjeta del cliente y, si cancela tarde o no se presenta, es para ti según tus condiciones de cancelación.",
        plan: "Pro y VIP",
      },
      {
        title: "Recordatorios que hacen volver",
        text: "Un recordatorio al cliente antes de la cita y, a quienes han aceptado recibir ofertas, una invitación a reservar de nuevo cuando llega el momento: para cada servicio decides cada cuánto tiempo conviene repetirlo.",
      },
      {
        title: "Tu perfil, tu escaparate",
        text: "Widgets flexibles: portfolio, servicios, horario, Story y reseñas. Organiza tu perfil tal y como quieres que lo vea el cliente.",
      },
      {
        title: "Trae a tus clientes sin comisión",
        text: "Recibes un código para los clientes a los que atendías antes de Gloumi: pueden usarlo hasta 50 clientes durante los 3 meses siguientes a la creación de tu cuenta. Un cliente que llega con tu código nunca genera comisión.",
      },
    ],
    chipsLabel: "Otras funciones",
    chips: [
      { text: "Transferencias a tu cuenta bancaria a través de Stripe", plan: "Pro y VIP" },
      { text: "Fichas de clientes con notas privadas" },
      { text: "Estadísticas de ingresos mensuales y servicios más reservados" },
      { text: "Tu propio enlace de reserva" },
      { text: "Pausas y horario bloqueado en el calendario" },
      { text: "Story y publicaciones para la comunidad" },
    ],
  },

  form: {
    eyebrow: "Cuenta de profesional",
    title: "Únete a Gloumi como profesional",
    lead: "Déjanos tus datos de contacto: te ayudamos a crear tu perfil y respondemos a tus dudas. También puedes crear tu perfil de profesional por tu cuenta en la app.",
    leadSoon: "Déjanos tus datos de contacto: te ayudaremos a crear tu perfil en cuanto la app esté en las tiendas y responderemos a tus dudas.",
    fields: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      city: "Ciudad",
      category: "Categoría principal",
      categoryPlaceholder: "Elige una categoría",
      categoryOther: "Otra",
      link: "Instagram u otro enlace a tus trabajos",
      message: "Mensaje",
      messagePlaceholder: "Cuántos años llevas trabajando, si tienes salón, qué esperas de Gloumi…",
      optional: "opcional",
    },
    // teisininkas – neverčiama (AGENTS.md XII)
    consentStart: "I agree that MB “Gloumi” may contact me about a master account. Data is handled under the ",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentLink: "Privacy Policy",
    // teisininkas – neverčiama (AGENTS.md XII)
    consentEnd: ".",
    submit: "Quiero unirme",
    submitting: "Enviando…",
    successTitle: "Gracias, lo hemos recibido",
    successText: "Pronto nos pondremos en contacto contigo en el correo que has indicado. Mientras tanto, descarga la app y échale un vistazo.",
    successTextSoon: "Pronto nos pondremos en contacto contigo en el correo que has indicado. La app llegará pronto al App Store y a Google Play.",
    another: "Enviar otra solicitud",
    errorGeneric: "No se ha podido enviar. Inténtalo de nuevo o escríbenos por correo electrónico.",
    errorNetwork: "No hay conexión. Comprueba tu conexión a internet e inténtalo de nuevo.",
    errorValidation: "Revisa los campos marcados.",
    errorRateLimited: "Demasiados intentos seguidos. Inténtalo de nuevo dentro de unos minutos.",
    errorDailyLimit: "Hoy hemos recibido muchísimas solicitudes. Escríbenos a info@gloumi.lt y te responderemos.",
    unconfiguredTitle: "El formulario aún no está listo",
    unconfiguredText: "Escríbenos directamente y te responderemos desde la misma dirección:",
    mailSubject: "Quiero ser profesional en Gloumi",
  },

  finalCta: {
    title: "La belleza empieza por una buena cita.",
    lead: "Descarga Gloumi y reserva tu primera cita, o únete como profesional y llena tu calendario.",
    masterLink: "Soy profesional",
  },

  footer: {
    tagline: "La plataforma de profesionales de la belleza y sus clientes en Lituania.",
    clients: "Para clientes",
    masters: "Para profesionales",
    legal: "Información legal",
    contacts: "Contacto",
    clientLinks: [
      { key: "download", label: "Descargar la app" },
      { key: "categories", label: "Categorías" },
      { key: "why", label: "Por qué Gloumi" },
    ],
    masterLinks: [
      { key: "masters", label: "Ventajas para profesionales" },
      { key: "join", label: "Ser profesional" },
    ],
    faq: "Preguntas frecuentes",
    faqMasters: "Preguntas para profesionales",
    legalLinks: [
      { key: "terms", label: "Condiciones de uso" },
      { key: "privacy", label: "Política de privacidad" },
      { key: "partner", label: "Condiciones para profesionales y salones" },
      { key: "refunds", label: "Condiciones de reembolso" },
      { key: "transparency", label: "DAC7 y transparencia de la plataforma" },
      { key: "deletion", label: "Eliminación de la cuenta" },
      // EN – laukia content vertimo
      { key: "dsa", label: "Digital Services Act" },
      { key: "accessibility", label: "Accessibility" },
    ],
    companyLabel: "Código de empresa",
    registry: "Registro de Personas Jurídicas de Lituania",
    phoneLabel: "Tel.",
    vatLabel: "Número de IVA",
    // teisininkas – neverčiama (AGENTS.md XII)
    rights: "All rights reserved.",
    // teisininkas – neverčiama (AGENTS.md XII)
    operator: "Platform operator and single point of contact under the EU Digital Services Act (DSA):",
    // teisininkas – neverčiama (AGENTS.md XII)
    trademarks: "Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC.",
    socialLabel: "Redes sociales",
    social: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },

  legal: {
    eyebrow: "Información legal",
    updated: "Última actualización",
    version: "versión",
    toc: "Índice",
    // teisininkas – neverčiama (AGENTS.md XII)
    englishNote:
      "The English text is a translation of the Lithuanian original; in case of conflict the Lithuanian version prevails.",
    // teisininkas – neverčiama (AGENTS.md XII)
    controller: "Data controller and platform operator",
    contactQuestion: "¿Tienes preguntas sobre tus datos o las condiciones?",
    // teisininkas – neverčiama (AGENTS.md XII)
    disclaimer:
      "This page is an informational summary. The legally binding documents are the Terms of Service, the Privacy Policy and the Terms for Masters and Salons.",
    otherDocs: "Otros documentos",
  },

  faq: {
    eyebrow: "Ayuda",
    intro: "Respuestas breves según las Condiciones de uso vigentes. ¿No encuentras la respuesta? Escribe a",
    toc: "Temas",
  },

  appLink: {
    profileTitle: "Este perfil está en la app Gloumi",
    refTitle: "Te han invitado a Gloumi",
    text: "Abre el enlace en la app Gloumi. Si aún no la tienes, descárgala y vuelve a abrir el enlace.",
    open: "Abrir en la app",
    masterCode: "Código de profesional",
    referralCode: "Código de invitación",
    codeHint: "Si el enlace no ha abierto la app, puedes introducir este código en la app.",
    home: "Sobre Gloumi",
  },

  emailConfirm: {
    askTitle: "Confirma tu correo electrónico",
    askText: "Pulsa el botón y el correo electrónico de tu cuenta de Gloumi quedará confirmado.",
    confirm: "Confirmar correo",
    confirming: "Confirmando…",
    title: "Correo confirmado",
    text: "Vuelve a la app Gloumi e inicia sesión.",
    open: "Abrir la app",
    otherDevice: "¿Has abierto el correo en otro dispositivo? No tienes que hacer nada más – inicia sesión en la app en el teléfono con el que te registraste.",
    errorTitle: "Este enlace ya no funciona",
    errorText: "Este enlace ha caducado (es válido durante 10 minutos) o ya se ha usado. Si ya has confirmado tu correo, simplemente inicia sesión en la app. Si no, introduce en la app el código del correo o pide un correo nuevo.",
    failed: "No se ha podido confirmar. Comprueba la conexión e inténtalo de nuevo.",
    changeAskTitle: "Confirma el cambio de correo",
    changeAskText: "Pulsa el botón para confirmar el nuevo correo electrónico de tu cuenta de Gloumi.",
    changeConfirm: "Confirmar el cambio",
    changeTitle: "Confirmado",
    changeText: "Si también has recibido este correo en tu otra dirección, confírmalo allí también – entonces tu correo cambiará.",
    changeErrorText: "Este enlace ha caducado (es válido durante 10 minutos) o ya se ha usado. Si ya has confirmado el cambio de correo, no tienes que hacer nada más. Si no, vuelve a cambiar el correo en los ajustes de la app.",
    magicTitle: "Ábrelo en la app",
    magicText: "Este enlace de inicio de sesión solo funciona en la app Gloumi. Abre el correo en el teléfono donde tienes instalada la app o introduce en la app el código del correo.",
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
    title: "Contraseña nueva",
    text: "Introduce una contraseña nueva para tu cuenta de Gloumi.",
    password: "Contraseña nueva",
    repeat: "Repite la contraseña",
    rules: "Al menos 8 caracteres: una minúscula y una mayúscula, un número y un símbolo.",
    show: "Mostrar",
    hide: "Ocultar",
    submit: "Cambiar contraseña",
    submitting: "Cambiando…",
    mismatch: "Las contraseñas no coinciden.",
    weak: "La contraseña es demasiado débil: necesita al menos 8 caracteres, una minúscula y una mayúscula, un número y un símbolo.",
    same: "La contraseña nueva debe ser distinta de la anterior.",
    tooLong: "La contraseña es demasiado larga – acórtala.",
    pwned: "Esta contraseña aparece en una lista de contraseñas filtradas – elige otra.",
    code: "Código de verificación en dos pasos",
    codeText: "Tu cuenta tiene activada la verificación en dos pasos. Introduce el código de seis dígitos de tu app de autenticación.",
    badCode: "Ese código no vale. Introduce un código nuevo de tu app de autenticación.",
    doneTitle: "Contraseña cambiada",
    doneText: "Vuelve a la app Gloumi e inicia sesión con tu contraseña nueva.",
    open: "Abrir la app",
    errorTitle: "Este enlace ya no funciona",
    errorText: "Este enlace ha caducado (es válido durante 10 minutos) o ya se ha usado. Pide uno nuevo en la app o introduce el código del correo.",
    failed: "No se ha podido cambiar. Comprueba la conexión e inténtalo de nuevo.",
    inviteTitle: "Crea tu contraseña",
    inviteText: "Te han invitado a Gloumi. Crea una contraseña para tu cuenta.",
    inviteSubmit: "Crear contraseña",
    inviteDoneTitle: "Contraseña creada",
    inviteErrorText: "Este enlace de invitación ha caducado o ya se ha usado. Pide a la persona que te invitó que te envíe uno nuevo.",
  },

  masterPage: {
    titleFemale: "Profesional",
    titleMale: "Profesional",
    services: "Servicios",
    otherServices: "Otros servicios",
    minutes: "min",
    deposit: "anticipo",
    depositPercent: "anticipo del {n} %",
    about: "Información",
    works: "Trabajos",
    hours: "Horario",
    dayOff: "Cerrado",
    weekdays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    terms: "Condiciones",
    cancellation: "Cancelación",
    rules: "Normas del profesional",
    booking: "Reserva",
    leadTime: "Reserva con al menos {n} h de antelación.",
    payment: "Pago",
    workFormat: "Dónde trabaja",
    amenities: "Comodidades",
    addressInApp: "La dirección exacta y el mapa están en la app.",
    book: "Reservar en la app",
    paymentMethods: { cash: "Efectivo", card_onsite: "Con tarjeta en persona", card: "En la app" } as Record<string, string>,
    workFormats: { salon: "En un salón o estudio", mobile: "A domicilio", rented_chair: "En un espacio alquilado" } as Record<string, string>,
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
    title: "Reseñas",
    outOf: "de 5",
    count: ["reseña", "reseñas", "reseñas"],
    // teisininkas – neverčiama (AGENTS.md XII)
    consentNote:
      "Only reviews whose authors agreed to show them on the website appear here. The rating is calculated from all verified reviews.",
    howWeCheck: "Cómo verificamos las reseñas",
    empty: "Todavía no hay reseñas visibles en la web. Encontrarás todas las reseñas en la app.",
    noName: "Nombre no indicado",
    reply: "Respuesta del profesional",
    report: "Denunciar contenido",
    reportSubject: "Denuncia de contenido",
  },
  notFound: {
    eyebrow: "404",
    title: "No encontramos esta página",
    text: "Puede que el enlace haya cambiado o que la página se haya movido.",
    cta: "Volver al inicio",
  },

  errorPage: {
    eyebrow: "Error",
    title: "Algo ha fallado",
    text: "No hemos podido mostrar esta página. Inténtalo de nuevo en un momento – si sigue pasando, escríbenos.",
    retry: "Intentar de nuevo",
    home: "Volver al inicio",
  },
};
