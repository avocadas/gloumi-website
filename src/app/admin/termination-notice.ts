import 'server-only';
import { LEGAL_DOCS, PARTNER_META } from '@/content/legal-source';

/*
 * Meistrų sąlygų pastraipa apie 30 dienų įspėjimą, rodoma meistro paskyros
 * trynimo lange (Gloumi #169; developeris 2026-10-04: „taip"). Trynimas
 * portale yra ir visos paslaugos meistrui nutraukimas, o Sąlygos pažada apie
 * tai pranešti iš anksto, išskyrus jose išvardytus skubius atvejus. Kas trina
 * kaip sankciją, turi tai matyti prieš patvirtindamas, o ne sužinoti vėliau.
 *
 * Tekstas cituojamas iš `legal-source.ts` pagal skyriaus PAVADINIMĄ, ne
 * perpasakojamas: pakeitus Sąlygas, pasikeičia ir čia. Neradus skyriaus ar
 * pastraipos — klaida, ne tuščias langas. Ją pagauna `npm run build`, nes
 * pastraipą skaito portalo maketas, o jį build'o metu piešia statinis
 * `/admin/login`.
 */
const SECTION = 'Ribojimas, sustabdymas ir nutraukimas';
const MARKER = 'prieš 30 dienų';

export type TerminationNotice = { source: string; text: string };

export function masterTerminationNotice(): TerminationNotice {
  const section = LEGAL_DOCS.lt.partner.find((s) => s.title === SECTION);
  const text = section?.paragraphs?.find((p) => p.includes(MARKER));
  if (!text) {
    throw new Error(
      `termination-notice: Meistrų sąlygose nebėra skyriaus „${SECTION}“ pastraipos su „${MARKER}“ – atnaujinti SECTION ir MARKER.`,
    );
  }
  return { source: `Meistrų ir salonų sąlygos ${PARTNER_META.version}, „${SECTION}“`, text };
}
