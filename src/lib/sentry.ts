import 'server-only';

/**
 * Programėlės klaidos iš Sentry administravimo portalui (Gloumi #29) — tik
 * skaitymas.
 *
 * KODĖL PER PORTALĄ: Sentry Developer planas turi vieną naudotoją, tad kiti
 * administratoriai Sentry nemato. Portalas klaidas rodo visiems trims, o
 * patekti į jį galima tik su `aal2` (`admin-guard.ts`).
 *
 * RAKTAS: `SENTRY_READ_TOKEN` (Vercel, Sensitive, tik Production) su vienintele
 * teise „Issue & Event: Read" (`event:read`). Tai ne EAS `SENTRY_AUTH_TOKEN`,
 * kuris build'ui įkelia source maps. Į naršyklę raktas nepatenka: šį modulį
 * importuojant iš kliento komponento, build'as krenta (`server-only`). Be
 * rakto grąžinama `not_configured`, ir puslapis tai pasako, o ne krenta.
 *
 * KĄ IMAME: tik žemiau išvardytus laukus. Naudotojo duomenys (`user`),
 * užklausos (`request`), „breadcrumbs", `extra` ir kintamųjų reikšmės (`vars`)
 * į portalą nepatenka — juose gali netyčia atsirasti asmens duomenų.
 * Programėlė tapatybės ir taip nesiunčia (`sendDefaultPii: false`), o
 * organizacijoje IP adresai nesaugomi.
 *
 * Organizacija ES regione, todėl adresas `de.sentry.io`, ne `sentry.io`.
 */

const API = 'https://de.sentry.io/api/0';
const ORG = 'gloumi-k9';
/** Projekto `gloumi` ID — tas pats skaičius yra programėlės DSN gale. */
const PROJECT_ID = '4512098544910416';

export type SentryFailure = 'not_configured' | 'unauthorized' | 'rate_limited' | 'not_found' | 'unavailable';
export type SentryResult<T> = { ok: true; data: T } | { ok: false; failure: SentryFailure };

/** Laikotarpiai, kuriuos leidžia `statsPeriod`. Developer planas klaidas laiko 30 d. */
export const ERROR_PERIODS = ['24h', '7d', '30d'] as const;
export type ErrorPeriod = (typeof ERROR_PERIODS)[number];

export type ErrorIssue = {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  count: number;
  isUnhandled: boolean;
  firstSeen: string | null;
  lastSeen: string | null;
  permalink: string | null;
};

export type ErrorFrame = { fn: string; file: string; line: number | null; col: number | null };
export type ErrorException = { type: string; value: string; frames: ErrorFrame[] };

export type ErrorEvent = {
  dateCreated: string | null;
  release: string | null;
  environment: string | null;
  os: string | null;
  device: string | null;
  appVersion: string | null;
  message: string | null;
  exceptions: ErrorException[];
};

/** Kiek mūsų kodo eilučių rodyti vienai išimčiai: daugiau skaitant nepadeda. */
const MAX_FRAMES = 12;
/** Klaidos tekstas kartais neša visą atsakymą; ilgesnis už tai — nukerpamas. */
const MAX_TEXT = 1000;

const str = (v: unknown): string | null => (typeof v === 'string' && v.length > 0 ? v : null);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const obj = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
const clip = (s: string) => (s.length > MAX_TEXT ? `${s.slice(0, MAX_TEXT)}…` : s);

async function sentryGet(path: string): Promise<SentryResult<unknown>> {
  const token = process.env.SENTRY_READ_TOKEN;
  if (!token) return { ok: false, failure: 'not_configured' };

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Klaidos keičiasi kas minutę, o atsakymas priklauso nuo rakto: nieko nekešuoti.
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error('sentry_api_unreachable', path);
    return { ok: false, failure: 'unavailable' };
  }

  // Į Vercel žurnalą — tik kodas ir kelias (jame vien grupės ID), kad priežastį būtų kur rasti.
  if (!res.ok) console.error('sentry_api', res.status, path);
  if (res.status === 401 || res.status === 403) return { ok: false, failure: 'unauthorized' };
  if (res.status === 404) return { ok: false, failure: 'not_found' };
  if (res.status === 429) return { ok: false, failure: 'rate_limited' };
  if (!res.ok) return { ok: false, failure: 'unavailable' };

  try {
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false, failure: 'unavailable' };
  }
}

function toIssue(raw: unknown): ErrorIssue | null {
  const r = obj(raw);
  const id = str(r?.id);
  if (!r || !id) return null;
  // Raktas mato visą organizaciją; portalas rodo tik programėlės projektą.
  if (str(obj(r.project)?.id) !== PROJECT_ID) return null;
  const count = Number(r.count);
  return {
    id,
    shortId: str(r.shortId) ?? id,
    title: clip(str(r.title) ?? '(be pavadinimo)'),
    culprit: clip(str(r.culprit) ?? ''),
    level: str(r.level) ?? 'error',
    status: str(r.status) ?? 'unresolved',
    count: Number.isFinite(count) ? count : 0,
    isUnhandled: r.isUnhandled === true,
    firstSeen: str(r.firstSeen),
    lastSeen: str(r.lastSeen),
    permalink: str(r.permalink),
  };
}

function toFrames(stacktrace: unknown): ErrorFrame[] {
  const frames = obj(stacktrace)?.frames;
  if (!Array.isArray(frames)) return [];
  const all = frames.map(obj).filter((f): f is Record<string, unknown> => f !== null);
  // Pirmiausia mūsų kodas; jei Sentry nė vienos eilutės nepažymėjo kaip mūsų, rodomos visos.
  const ours = all.filter((f) => f.inApp === true);
  // Sentry eilutes pateikia nuo seniausios; skaitant patogiau nuo tos, kur klaida iškilo.
  return (ours.length > 0 ? ours : all)
    .reverse()
    .slice(0, MAX_FRAMES)
    .map((f) => ({
      fn: str(f.function) ?? '?',
      file: str(f.filename) ?? str(f.module) ?? str(f.absPath) ?? '?',
      line: num(f.lineNo),
      col: num(f.colNo),
    }));
}

function toEvent(raw: unknown): ErrorEvent | null {
  const r = obj(raw);
  if (!r) return null;

  const tags = Array.isArray(r.tags) ? r.tags.map(obj) : [];
  const tag = (key: string) => str(tags.find((t) => t?.key === key)?.value);

  const contexts = obj(r.contexts);
  const os = obj(contexts?.os);
  const device = obj(contexts?.device);
  const app = obj(contexts?.app);
  const appVersion = str(app?.app_version);
  const appBuild = str(app?.app_build);

  const exceptions: ErrorException[] = [];
  for (const entry of Array.isArray(r.entries) ? r.entries.map(obj) : []) {
    if (entry?.type !== 'exception') continue;
    const values = obj(entry.data)?.values;
    if (!Array.isArray(values)) continue;
    // Paskutinė išimtis — ta, kurią programėlė pagavo; ankstesnės — jos priežastys.
    for (const v of [...values].reverse()) {
      const e = obj(v);
      if (!e) continue;
      exceptions.push({
        type: str(e.type) ?? 'Error',
        value: clip(str(e.value) ?? ''),
        frames: toFrames(e.stacktrace),
      });
    }
  }

  // Pranešimas rodomas tik tada, kai išimties nėra (`captureMessage`): kitaip jis ją kartoja.
  const message = exceptions.length === 0 ? str(r.message) : null;

  return {
    dateCreated: str(r.dateCreated),
    release: str(obj(r.release)?.version) ?? tag('release'),
    environment: tag('environment'),
    os: [str(os?.name), str(os?.version)].filter(Boolean).join(' ') || null,
    device: str(device?.model) ?? str(device?.family),
    appVersion: appVersion ? (appBuild ? `${appVersion} (${appBuild})` : appVersion) : null,
    message: message ? clip(message) : null,
    exceptions,
  };
}

/** Programėlės klaidų grupės (Sentry „issues"), naujausios viršuje. */
export async function listErrorIssues(period: ErrorPeriod, unresolvedOnly: boolean): Promise<SentryResult<ErrorIssue[]>> {
  const params = new URLSearchParams({
    project: PROJECT_ID,
    statsPeriod: period,
    sort: 'date',
    limit: '50',
    // Tuščia `query` — visos būsenos; be parametro Sentry rodytų tik neišspręstas.
    query: unresolvedOnly ? 'is:unresolved' : '',
  });
  const res = await sentryGet(`/organizations/${ORG}/issues/?${params}`);
  if (!res.ok) return res;
  if (!Array.isArray(res.data)) return { ok: false, failure: 'unavailable' };
  return { ok: true, data: res.data.map(toIssue).filter((i): i is ErrorIssue => i !== null) };
}

/** Viena klaidų grupė ir jos naujausias įvykis. */
export async function getErrorIssue(
  id: string,
): Promise<SentryResult<{ issue: ErrorIssue; event: ErrorEvent | null }>> {
  // Sentry grupių ID — skaičiai; kitokia reikšmė į adresą nepatenka.
  if (!/^\d{1,20}$/.test(id)) return { ok: false, failure: 'not_found' };

  const [issueRes, eventRes] = await Promise.all([
    sentryGet(`/organizations/${ORG}/issues/${id}/`),
    sentryGet(`/organizations/${ORG}/issues/${id}/events/latest/`),
  ]);
  if (!issueRes.ok) return issueRes;
  const issue = toIssue(issueRes.data);
  if (!issue) return { ok: false, failure: 'not_found' };
  return { ok: true, data: { issue, event: eventRes.ok ? toEvent(eventRes.data) : null } };
}
