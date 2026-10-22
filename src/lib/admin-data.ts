import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/*
 * Ką portalas gali daryti su kiekviena lentele, sako duomenų bazė
 * (`admin_catalog()`, 20261001012855), ne šis failas: katalogas yra vienas,
 * tad nauja lentelė čia neatsiranda atsitiktinai, o atsiradusi kataloge —
 * atsiranda ir portale be jokio pakeitimo čia.
 */
export type CatalogKind = 'content' | 'account' | 'view';

export type CatalogEntry = {
  tbl: string;
  label: string;
  kind: CatalogKind;
  owners: string[];
  search_cols: string[];
  edit_cols: string[];
  hidden_cols: string[];
};

/** `key` — pirminio rakto reikšmės ta forma, kurią priima `admin_remove` ir `admin_edit_text`. */
export type DataRow = { key: Record<string, unknown>; row: Record<string, unknown> };

export type SearchResult = { table: string; total: number; rows: DataRow[] };

export type SignedMedia = { url: string; contentType: string };

export const PAGE_SIZE = 50;

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loadCatalog(): Promise<CatalogEntry[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc('admin_catalog');
  if (error) throw new Error(`admin_catalog: ${error.message}`);
  return (data ?? []) as CatalogEntry[];
}

export async function searchTable(
  adminId: string,
  table: string,
  query: string | null,
  owner: string | null,
  offset: number,
): Promise<{ ok: true; result: SearchResult } | { ok: false; error: string }> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc('admin_search', {
    _admin_id: adminId,
    _table: table,
    _query: query,
    _owner: owner,
    _limit: PAGE_SIZE,
    _offset: offset,
  });
  if (error) return { ok: false, error: error.message };
  const result = data as SearchResult;
  const never = NEVER_SENT[table];
  if (!never) return { ok: true, result };
  return {
    ok: true,
    result: {
      ...result,
      rows: result.rows.map((r) => ({
        ...r,
        row: Object.fromEntries(Object.entries(r.row).filter(([col]) => !never.includes(col))),
      })),
    },
  };
}

/*
 * Stulpeliai, kurių naršyklė niekada negauna, net jei katalogas jų nepaslėptų:
 * kliento telefonas matomas tik paskyros puslapyje per „Rodyti“, kad kiekvienas
 * atvėrimas būtų žurnale (teisininkas U-27). Pirmoji apsauga – `hidden_cols`
 * bazėje; ši – kad klaida kataloge numerio neatskleistų.
 */
const NEVER_SENT: Record<string, string[]> = { profiles: ['phone_number'] };

/*
 * Nuotraukų id eilutėje: `media` lentelėje tai pati eilutė, kitur —
 * `media_id` ir `*_media_id` stulpeliai. Pavadinimo taisyklė, ne sąrašas:
 * 2026-10-01 kiekvienas ryšys į `media` vadinosi būtent taip
 * (`avatar_media_id`, `cover_media_id`, `inspo_media_id`).
 */
export function mediaIdsOf(table: string, row: Record<string, unknown>): string[] {
  // A-16: pokalbio nuotraukos – privatus susirašinėjimas, kaip ir tekstas; jos
  // pasirašomos tik skaitant pokalbį su pagrindu (`readChat`), ne naršyklėje.
  if (table === 'messages') return [];
  const ids: string[] = [];
  if (table === 'media' && typeof row.id === 'string') ids.push(row.id);
  for (const [col, value] of Object.entries(row)) {
    if ((col === 'media_id' || col.endsWith('_media_id')) && typeof value === 'string') ids.push(value);
  }
  return ids;
}

/** Kiek id priima vienas `admin-media-urls` kvietimas (funkcijos `MAX_BATCH`). */
const SIGN_BATCH = 100;

/** Pokalbio priedas, kurio šis administratorius dar neskaitė su pagrindu (A-16): kuriam pokalbiui jis priklauso. */
export type LockedMedia = { chatId: string };

/*
 * Pasirašyti skaitymo adresai (`admin-media-urls`). Viešas `r2.dev` adresas
 * nuo 2026-09-01 visam kam atsako 401, tad be parašo nuotraukos nematyti.
 *
 * Nepavykus grąžinamas tuščias atsakymas, o ne klaida: puslapis be nuotraukų
 * vis tiek leidžia rasti ir ištrinti, o priežastis lieka serverio žurnale.
 *
 * A-16 (db `20261022164619`): pokalbio priedą funkcija pasirašo tik tada, kai
 * tas administratorius per paskutines 30 min. tą pokalbį skaitė su pagrindu;
 * kitaip grąžina jį `locked` sąraše su pokalbio id, o portalas rodo
 * „pokalbio priedas – skaityti su pagrindu“. Senesnė funkcija `locked` neturi.
 */
export async function signMediaChecked(
  adminId: string,
  ids: string[],
): Promise<{ signed: Record<string, SignedMedia>; locked: Record<string, LockedMedia> }> {
  const unique = [...new Set(ids)].filter((id) => UUID_RE.test(id));
  const signed: Record<string, SignedMedia> = {};
  const locked: Record<string, LockedMedia> = {};
  if (unique.length === 0) return { signed, locked };

  const db = createSupabaseAdminClient();
  for (let i = 0; i < unique.length; i += SIGN_BATCH) {
    const { data, error } = await db.functions.invoke('admin-media-urls', {
      body: { adminId, mediaIds: unique.slice(i, i + SIGN_BATCH) },
    });
    if (error) {
      console.error('admin-media-urls:', error.message);
      continue;
    }
    const items = (data?.items ?? []) as Array<{ mediaId: string; url: string; contentType: string }>;
    for (const item of items) signed[item.mediaId] = { url: item.url, contentType: item.contentType };
    const held = (Array.isArray(data?.locked) ? data.locked : []) as Array<{ mediaId?: unknown; chatId?: unknown }>;
    for (const item of held) {
      if (typeof item.mediaId === 'string' && typeof item.chatId === 'string' && UUID_RE.test(item.chatId)) {
        locked[item.mediaId] = { chatId: item.chatId };
      }
    }
  }
  return { signed, locked };
}

export async function signMedia(adminId: string, ids: string[]): Promise<Record<string, SignedMedia>> {
  return (await signMediaChecked(adminId, ids)).signed;
}
