import 'server-only';
import { LEGAL_DOCS, LEGAL_META, PARTNER_META } from '@/content/legal-source';

/*
 * Taisyklių punktai, kuriais remiasi moderavimo sprendimas (Gloumi #169).
 * Taisyklės žada: „Pašalinę turinį arba apriboję paskyrą, nurodome priežastį ir
 * taisyklės punktą" (`legal.js`), o DSA 17 str. to reikalauja sprendimo
 * pranešime. Todėl šalinant turinį ar ribojant paskyrą portale reikia ir
 * priežasties, ir punkto.
 *
 * Punktai — tikrų dokumentų skyriai iš `legal-source.ts`, ne ranka surašytas
 * sąrašas: pervadinus skyrių programėlėje, pervadinamas ir čia. Reikšmė saugo
 * dokumentą, jo versiją ir skyrių (`terms@1.12:<pavadinimas>`), kad vėliau būtų
 * aišku, kokia redakcija galiojo sprendimo metu.
 *
 * `server-only`: klientui keliauja tik šis sąrašas (per maketą ir kontekstą),
 * ne visas teisinių dokumentų tekstas.
 */

export type RuleOption = { value: string; label: string };
export type RuleGroup = { label: string; options: RuleOption[] };

function group(doc: 'terms' | 'partner', name: string, version: string): RuleGroup {
  return {
    label: `${name} ${version}`,
    options: LEGAL_DOCS.lt[doc].map((section, i) => ({
      value: `${doc}@${version}:${section.title}`,
      label: `${i + 1}. ${section.title}`,
    })),
  };
}

export function moderationRules(): RuleGroup[] {
  return [
    group('terms', 'Naudojimosi taisyklės', LEGAL_META.version),
    group('partner', 'Meistrų ir salonų sąlygos', PARTNER_META.version),
  ];
}

/** Ar reikšmė — vienas iš dabartinių punktų. Serverio veiksmai kliento reikšme nepasitiki. */
export function isModerationRule(value: unknown): value is string {
  return typeof value === 'string' && moderationRules().some((g) => g.options.some((o) => o.value === value));
}
