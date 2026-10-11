/**
 * CSP pažeidimų ataskaitų sutraukimas žurnalui (`/api/csp-report`, `src/lib/csp.ts`).
 *
 * Naršyklės siunčia du formatus: `report-uri` – `{ "csp-report": {…} }`
 * (`application/csp-report`), Reporting API – masyvą `{ type, body }`
 * (`application/reports+json`). Abu suvedami į vieną eilutę, kurioje lieka tik
 * tai, ko reikia politikai pataisyti.
 *
 * Kas NEIMAMA ir kodėl: pilnas užblokuotas adresas (R2 parašuose yra parašas ir
 * savininko id – lieka tik kilmė), puslapio užklausos dalis ir `script-sample`
 * (vidinio skripto pradžia portale gali būti RSC duomenys su asmens duomenimis;
 * politika jo ir neprašo – nėra `'report-sample'`). UUID kelyje keičiamas į
 * `:id`, kad žurnale neliktų, kurio naudotojo puslapį žiūrėjo administratorius.
 */

export type CspViolation = {
  directive: string;
  blocked: string;
  page: string;
  disposition: 'enforce' | 'report' | 'other';
};

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const KEYWORD = /^[a-z][a-z-]{0,31}$/;

function obj(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function directive(value: unknown): string {
  // `violated-directive` (senas laukas) gali būti visa direktyva su šaltiniais.
  const name = typeof value === 'string' ? value.trim().split(/\s+/)[0].toLowerCase() : '';
  return KEYWORD.test(name) ? name : 'other';
}

function blocked(value: unknown): string {
  if (typeof value !== 'string' || !value) return 'other';
  const v = value.trim().toLowerCase();
  // `inline`, `eval`, `data`, `blob`, `wasm-eval`, `trusted-types-policy`…
  if (KEYWORD.test(v)) return v;
  try {
    const url = new URL(value);
    if (/^(https?|wss?):$/.test(url.protocol)) return url.origin;
    return url.protocol.replace(/:$/, '');
  } catch {
    return 'other';
  }
}

function page(value: unknown): string {
  if (typeof value !== 'string') return 'other';
  try {
    return new URL(value).pathname.replace(UUID, ':id').slice(0, 120);
  } catch {
    return 'other';
  }
}

function disposition(value: unknown): CspViolation['disposition'] {
  return value === 'enforce' || value === 'report' ? value : 'other';
}

/** Grąžina ne daugiau kaip `max` pažeidimų; viskas, kas ne CSP ataskaita, praleidžiama. */
export function cspViolations(payload: unknown, max: number): CspViolation[] {
  const out: CspViolation[] = [];
  const legacy = obj(obj(payload)['csp-report']);
  if (Object.keys(legacy).length) {
    out.push({
      directive: directive(legacy['effective-directive'] ?? legacy['violated-directive']),
      blocked: blocked(legacy['blocked-uri']),
      page: page(legacy['document-uri']),
      disposition: disposition(legacy.disposition),
    });
  } else if (Array.isArray(payload)) {
    for (const item of payload) {
      if (out.length >= max) break;
      const report = obj(item);
      if (report.type !== 'csp-violation') continue;
      const body = obj(report.body);
      out.push({
        directive: directive(body.effectiveDirective),
        blocked: blocked(body.blockedURL),
        page: page(body.documentURL),
        disposition: disposition(body.disposition),
      });
    }
  }
  return out.slice(0, max);
}
