// TIK svetaines ekranu fotografavimui (#136). Supabase klientas visas uzklausas
// siuncia per cia: netikri meistrai atiduodami is demoData, rasymai nuryjami,
// o visa kita (prisijungimas, savi duomenys) eina i tikra serveri nepakeista.
import { DEMO_LANG, DEMO_MEDIA_BASE } from './config';
import { buildDemo, FAKE_PREFIX } from './demoData';

const realFetch = global.fetch.bind(global);
let cached = null;
const demo = () => (cached ||= buildDemo(DEMO_LANG, DEMO_MEDIA_BASE));

const isFake = (v) => typeof v === 'string' && v.startsWith(FAKE_PREFIX);
const log = (...a) => console.log('[DEMO]', ...a);

// Rasymai, kuriuos praleidziam: tik savi duomenys, netikru ID juose nera.
const PASS_RPC = new Set([
  'commission_terms',
  'master_clients_overview',
  'my_credit_balance',
  'my_gender',
  'my_payout_details',
  'my_phone',
  'my_plan_usage',
  'my_subscription',
  'is_username_available'
]);

function headerOf(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : '';
}

function respond(body, wantsObject) {
  let payload = body;
  if (wantsObject && Array.isArray(body)) {
    if (body.length !== 1) {
      return new Response(JSON.stringify({ code: 'PGRST116', message: 'demo: not one row' }), {
        status: 406,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    payload = body[0];
  }
  const n = Array.isArray(payload) ? payload.length : payload == null ? 0 : 1;
  return new Response(JSON.stringify(payload ?? null), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Range': `0-${Math.max(n - 1, 0)}/${n}`
    }
  });
}

function filterValue(q, col, op) {
  const raw = q.get(col);
  if (!raw || !raw.startsWith(`${op}.`)) return null;
  const v = raw.slice(op.length + 1);
  if (op !== 'in') return v;
  return v
    .replace(/^\(/, '')
    .replace(/\)$/, '')
    .split(',')
    .map((s) => s.replace(/^"|"$/g, ''));
}

function anyFakeParam(q) {
  for (const [, v] of q.entries()) if (v.includes(FAKE_PREFIX)) return true;
  return false;
}

function limitOf(q, rows) {
  const limit = Number(q.get('limit'));
  return Number.isFinite(limit) && limit > 0 ? rows.slice(0, limit) : rows;
}

/** null = siusti i tikra serveri. */
function routeGet(table, q) {
  const d = demo();
  const eq = (c) => filterValue(q, c, 'eq');
  const inn = (c) => filterValue(q, c, 'in');

  switch (table) {
    case 'posts': {
      const ids = inn('id');
      if (ids) return ids.some(isFake) ? d.posts.filter((p) => ids.includes(p.id)) : null;
      const mid = eq('master_id');
      if (mid) return isFake(mid) ? limitOf(q, d.posts.filter((p) => p.master.profile_id === mid)) : null;
      const mids = inn('master_id');
      if (mids) return mids.some(isFake) ? d.posts.filter((p) => mids.includes(p.master.profile_id)) : null;
      return limitOf(q, d.posts);
    }
    case 'stories':
      if (q.has('author_id')) return anyFakeParam(q) ? [] : null;
      return d.stories;
    case 'master_profiles': {
      const sel = q.get('select') || '';
      if (eq('accepts_bookings') === 'false') return [];
      const pid = eq('profile_id');
      if (pid) return isFake(pid) ? d.masterRows.filter((r) => r.profile_id === pid) : null;
      const pids = inn('profile_id');
      if (pids) return pids.some(isFake) ? d.masterRows.filter((r) => pids.includes(r.profile_id)) : null;
      // Stulpeliu zondai (`select=vibe&limit=1`) - tikras atsakymas apie schema.
      if (!sel.includes(',') && q.get('limit') === '1') return null;
      return Number(q.get('offset') || 0) > 0 ? [] : d.masterRows;
    }
    case 'reviews': {
      const mid = eq('master_id');
      return isFake(mid) ? d.reviewsByMaster[mid] || [] : anyFakeParam(q) ? [] : null;
    }
    case 'working_hours_weekly': {
      const mid = eq('master_id');
      if (isFake(mid)) return d.hoursByMaster[mid] || [];
      const mids = inn('master_id');
      if (mids && mids.some(isFake)) return mids.flatMap((m) => d.hoursByMaster[m] || []);
      return null;
    }
    case 'flash_slots':
      return [];
    case 'profiles': {
      const pid = eq('id');
      if (isFake(pid)) return [{ id: pid, gender: d.genderOf(pid) }];
      return anyFakeParam(q) ? [] : null;
    }
    default:
      return anyFakeParam(q) ? [] : null;
  }
}

function routeRpc(name, body) {
  const d = demo();
  switch (name) {
    case 'get_personalized_feed_page': {
      const exclude = new Set(body?._exclude || []);
      const limit = body?._limit || 30;
      return d.feedOrder
        .filter((pid) => !exclude.has(pid))
        .slice(0, limit)
        .map((post_id, i) => ({ post_id, score: 1000 - i }));
    }
    case 'get_personalized_feed':
      return body?._before_id ? [] : d.feedOrder.map((post_id, i) => ({ post_id, score: 1000 - i }));
    case 'master_busy_slots':
      return isFake(body?._master_id)
        ? d.busy(body._master_id, body._from, body._to).map(({ starts_at, duration_minutes }) => ({ starts_at, duration_minutes }))
        : null;
    case 'master_busy_slots_many': {
      const ids = (body?._master_ids || []).filter(isFake);
      return ids.length ? ids.flatMap((m) => d.busy(m, body._from, body._to)) : null;
    }
    case 'master_title_gender':
      return isFake(body?._profile_id) ? d.genderOf(body._profile_id) : null;
    default:
      return undefined;
  }
}

export async function demoFetch(input, init = {}) {
  const urlStr = typeof input === 'string' ? input : input?.url;
  let u;
  try {
    u = new URL(urlStr);
  } catch {
    return realFetch(input, init);
  }
  const path = u.pathname;
  const method = String(init.method || 'GET').toUpperCase();

  if (path.startsWith('/functions/v1/')) {
    const fn = path.slice('/functions/v1/'.length);
    if (fn === 'r2-presign-get') return realFetch(input, init);
    log('nuryta funkcija', fn);
    return respond({}, false);
  }
  if (!path.startsWith('/rest/v1/')) return realFetch(input, init);

  const rest = path.slice('/rest/v1/'.length);
  const wantsObject = headerOf(init.headers, 'Accept').includes('vnd.pgrst.object');

  if (rest.startsWith('rpc/')) {
    const name = rest.slice(4);
    if (PASS_RPC.has(name)) return realFetch(input, init);
    let body = null;
    try {
      body = init.body ? JSON.parse(init.body) : null;
    } catch {}
    const out = routeRpc(name, body);
    if (out === null) return realFetch(input, init);
    if (out === undefined) {
      log('nuryta rpc', name);
      return respond(null, false);
    }
    log('rpc', name, Array.isArray(out) ? out.length : out);
    return respond(out, wantsObject);
  }

  if (method !== 'GET' && method !== 'HEAD') {
    log('nurytas rasymas', method, rest);
    return respond([], false);
  }

  const out = routeGet(rest, u.searchParams);
  if (out === null) return realFetch(input, init);
  log('get', rest, out.length);
  return respond(out, wantsObject);
}
