/**
 * Tab titles and search descriptions of the Terms and Privacy translations
 * (/legal/<lang>/terms and /privacy), in their own language (web audit SEO-3).
 *
 * The content role's, 2026-10-23 (notes/content-juodrasciai/web/legal-meta.md):
 * each title is the name the legal role's translation gives the document, each
 * description the Lithuanian and English pages' one translated. Copied here
 * as written, so a change belongs in that file first.
 */
export const LEGAL_TRANSLATION_META: Record<string, Record<"terms" | "privacy", { title: string; description: string }>> = {
  pl: {
    terms: {
      title: "Regulamin",
      description: "Regulamin aplikacji Gloumi: rola platformy, konto, rezerwacje i zaliczka, subskrypcja dla specjalistów, treści i odpowiedzialność.",
    },
    privacy: {
      title: "Polityka prywatności",
      description: "Jakie dane zbiera Gloumi, dlaczego i na jakiej podstawie, komu są przekazywane, jak długo są przechowywane i jakie prawa masz na mocy RODO.",
    },
  },
  lv: {
    terms: {
      title: "Lietošanas noteikumi",
      description: "Gloumi lietotnes lietošanas noteikumi: platformas loma, konts, rezervācijas un avanss, meistaru abonements, saturs un atbildība.",
    },
    privacy: {
      title: "Privātuma politika",
      description: "Kādus datus Gloumi vāc, kāpēc un uz kāda pamata, kam tie tiek nodoti, cik ilgi tiek glabāti un kādas tiesības Jums ir saskaņā ar VDAR.",
    },
  },
  de: {
    terms: {
      title: "Nutzungsbedingungen",
      description: "Nutzungsbedingungen der Gloumi-App: Rolle der Plattform, Konto, Buchungen und Anzahlung, Abonnement für Profis, Inhalte und Haftung.",
    },
    privacy: {
      title: "Datenschutzerklärung",
      description: "Welche Daten Gloumi erhebt, warum und auf welcher Grundlage, an wen sie gehen, wie lange sie gespeichert werden und welche Rechte Sie nach der DSGVO haben.",
    },
  },
  fr: {
    terms: {
      title: "Conditions d’utilisation",
      description: "Conditions d’utilisation de Gloumi\u00a0: rôle de la plateforme, compte, réservations et acompte, abonnement des professionnels, contenus et responsabilité.",
    },
    privacy: {
      title: "Politique de confidentialité",
      description: "Quelles données Gloumi collecte, pourquoi et sur quelle base, à qui elles sont transmises, combien de temps elles sont conservées et vos droits selon le RGPD.",
    },
  },
  es: {
    terms: {
      title: "Condiciones de uso",
      description: "Condiciones de uso de la app Gloumi: papel de la plataforma, cuenta, reservas y anticipo, suscripción para profesionales, contenido y responsabilidad.",
    },
    privacy: {
      title: "Política de privacidad",
      description: "Qué datos recoge Gloumi, por qué y con qué base, a quién se comunican, cuánto tiempo se conservan y qué derechos tienes según el RGPD.",
    },
  },
  it: {
    terms: {
      title: "Condizioni d'uso",
      description: "Condizioni d'uso dell'app Gloumi: ruolo della piattaforma, account, prenotazioni e acconto, abbonamento per i professionisti, contenuti e responsabilità.",
    },
    privacy: {
      title: "Informativa sulla privacy",
      description: "Quali dati raccoglie Gloumi, perché e su quale base, a chi vengono comunicati, per quanto tempo sono conservati e quali diritti hai ai sensi del GDPR.",
    },
  },
};
