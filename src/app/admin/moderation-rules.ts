import 'server-only';
import { LEGAL_DOCS, LEGAL_META, PARTNER_META } from '@/content/legal-source';

/*
 * Taisyklių punktai, kuriais remiasi moderavimo sprendimas (Gloumi #169).
 * Taisyklės žada: „Pašalinę turinį arba apriboję paskyrą, nurodome priežastį ir
 * taisyklės punktą" (`legal.js`), o DSA 17 str. to reikalauja sprendimo
 * pranešime. Todėl šalinant turinį ar ribojant paskyrą portale reikia ir
 * priežasties, ir punkto.
 *
 * Langas renkasi reikšmę `terms@1.12:<LT pavadinimas>` (arba `partner@…`), arba
 * `request` — veiksmas atliekamas paties naudotojo prašymu, tai ne ribojimas.
 * Serveris ją paverčia db sutarties `jsonb` (Gloumi `20261004145806`,
 * `moderation_rule`):
 *   {"doc":"terms"|"partner","version":"1.12","section":{"lt":"…","en":"…"}}
 *   arba {"doc":"request"}
 * Pranešimą autoriui db rašo jo kalba, todėl reikia ir angliško pavadinimo.
 * Reikšmėje — versija ir pavadinimas, ne eilės numeris: jei tarp lango
 * atidarymo ir patvirtinimo deploy'us pakeistų skyrius, serveris punkto
 * neatpažins ir paprašys atnaujinti puslapį, o ne tyliai pacituos kitą.
 *
 * LT IR EN SKYRIAI — NE TA PAČIA TVARKA. Taisyklių 4–7 skyriai angliškai
 * sudėlioti kitaip (išmatuota 2026-10-04, versija 1.12): pagal indeksą imant
 * pranešimas cituotų kitą skyrių. Todėl šiems — pavadinimų poros, o modulis
 * jau build'o metu krenta, jei poros pavadinimo nebeliko arba vienas EN
 * skyrius tektų dviem LT. Kai programėlė sulygins EN tvarką, poros taps
 * nereikalingos (patikra tai parodys, jei jos sutaps su indeksu).
 *
 * `server-only`: klientui keliauja tik pavadinimų sąrašas (per maketą ir
 * kontekstą), ne visas teisinių dokumentų tekstas.
 */

export type RuleOption = { value: string; label: string };
export type RuleGroup = { label: string; options: RuleOption[] };
export type ModerationRule =
  | { doc: 'terms' | 'partner'; version: string; section: { lt: string; en: string } }
  | { doc: 'request' };

type Doc = 'terms' | 'partner';

/** Skyriai, kurių angliška vieta kita: LT pavadinimas → EN pavadinimas. */
const EN_BY_LT: Record<Doc, Record<string, string>> = {
  terms: {
    'Rezervacijos ir avansas': 'Bookings and deposits',
    'Kai apmokėtas vizitas neįvyko': 'When a paid visit did not happen',
    'Mokėjimai, komisinis ir išmokos meistrui': 'Payments, commission and payouts to masters',
    'Teisė atsisakyti sutarties': 'Right of withdrawal',
  },
  partner: {},
};

const VERSION: Record<Doc, string> = { terms: LEGAL_META.version, partner: PARTNER_META.version };

function pairsOf(doc: Doc): { lt: string; en: string }[] {
  const lt = LEGAL_DOCS.lt[doc];
  const en = LEGAL_DOCS.en[doc];
  if (lt.length !== en.length) {
    throw new Error(`moderation-rules: ${doc} turi ${lt.length} LT ir ${en.length} EN skyrius – suderinti poras.`);
  }
  const overrides = EN_BY_LT[doc];
  for (const [ltTitle, enTitle] of Object.entries(overrides)) {
    if (!lt.some((s) => s.title === ltTitle) || !en.some((s) => s.title === enTitle)) {
      throw new Error(`moderation-rules: ${doc} poros „${ltTitle}“ → „${enTitle}“ nebėra legal-source.ts – atnaujinti EN_BY_LT.`);
    }
  }
  const pairs = lt.map((s, i) => ({ lt: s.title, en: overrides[s.title] ?? en[i].title }));
  if (new Set(pairs.map((p) => p.en)).size !== pairs.length) {
    throw new Error(`moderation-rules: ${doc} vienas EN skyrius tenka dviem LT – patikrinti EN_BY_LT.`);
  }
  return pairs;
}

const PAIRS: Record<Doc, { lt: string; en: string }[]> = { terms: pairsOf('terms'), partner: pairsOf('partner') };

export function moderationRules(): RuleGroup[] {
  const group = (doc: Doc, name: string): RuleGroup => ({
    label: `${name} ${VERSION[doc]}`,
    options: PAIRS[doc].map((p, i) => ({ value: `${doc}@${VERSION[doc]}:${p.lt}`, label: `${i + 1}. ${p.lt}` })),
  });
  return [
    group('terms', 'Naudojimosi taisyklės'),
    group('partner', 'Meistrų ir salonų sąlygos'),
    { label: 'Kita', options: [{ value: 'request', label: 'Paties naudotojo prašymu — ne pažeidimas, pranešimo nebus' }] },
  ];
}

/**
 * Lango reikšmė → db `_rule`. `null` — reikšmės dabartiniame sąraše nėra
 * (serveris kliento reikšme nepasitiki, o pasenusio puslapio punktas — ne tas
 * pats punktas).
 */
export function ruleFor(value: unknown): ModerationRule | null {
  if (value === 'request') return { doc: 'request' };
  if (typeof value !== 'string') return null;
  const m = /^(terms|partner)@([^:]+):(.+)$/.exec(value);
  if (!m) return null;
  const doc = m[1] as Doc;
  if (m[2] !== VERSION[doc]) return null;
  const pair = PAIRS[doc].find((p) => p.lt === m[3]);
  return pair ? { doc, version: VERSION[doc], section: { lt: pair.lt, en: pair.en } } : null;
}
