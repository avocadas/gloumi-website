import 'server-only';

/**
 * 2FA nuėmimas per pagalbą (security procedūra 2026-10-18, 5.3) – svetainės
 * serverio pusė: įjungimo jungiklis ir portalo kvietimai į Edge `mfa-reset`.
 *
 * KODĖL PER EDGE IR SU ADMINISTRATORIAUS JWT
 * ------------------------------------------
 * Visas patikras (aal2, `admin_ids`, TOTP amžius, prašymo būsena, vardo
 * sutapimas) daro Edge funkcija, viena vieta. Portalas jai siunčia ne
 * `_admin_id` su servisiniu raktu, o paties administratoriaus prieigos žetoną:
 * kas atidarė ar nuėmė, Edge ima iš žetono, ne iš formos. Portalas prieš
 * kiekvieną kvietimą dar tikrina `checkAdmin()`, kad atmestų anksčiau ir
 * aiškiau, bet sprendimas – Edge.
 *
 * JUNGIKLIS
 * ---------
 * `MFA_RESET_ENABLED=1` (Vercel) IR `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Be bet
 * kurio iš jų `/2fa-pagalba` ir portalo skiltis atsako 404: puslapiai be
 * paskelbtos Edge funkcijos tik klaidintų, o be Turnstile forma neturi būti
 * įjungiama visai (security 2026-10-18; Edge be paslapties ir taip atsako 503).
 */

export function mfaResetEnabled(): boolean {
  return process.env.MFA_RESET_ENABLED?.trim() === '1' && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

const ENDPOINT = () => `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '')}/functions/v1/mfa-reset`;

/** Prašymo būsenos (procedūros 1 sk.). */
export const MFA_RESET_STATUSES = [
  'email_sent',
  'confirmed',
  'ready',
  'done',
  'cancelled_by_owner',
  'cancelled_aal2_login',
  'failed_checks',
  'expired',
] as const;
export type MfaResetStatus = (typeof MFA_RESET_STATUSES)[number];

/**
 * Eilutė portalo eilėje: tik vardas, rūšis, būdas, būsena ir laikai. Paskyros
 * el. pašto nėra; naujas el. paštas (atkūrimo prašymui) – tik paslėptas
 * (`maskEmail`), ir slepiamas serveryje, kad visas adresas nepatektų į naršyklę.
 */
export type MfaResetRow = {
  id: string;
  username: string | null;
  /** `mfa_reset` – 2FA nuėmimas (5.3); `email_recovery` – atkūrimas be paskyros el. pašto (variantas A). */
  kind: string;
  /** `email_code` (5.3), `oauth` (A1), `device_password` (A2). */
  method: string | null;
  /** Atkūrimo prašymui: ar kartu nuimama ir 2FA. */
  remove_mfa: boolean;
  new_email_masked: string | null;
  status: string;
  opened_by: string | null;
  created_at: string | null;
  email_sent_at: string | null;
  confirmed_at: string | null;
  ready_at: string | null;
  cancelled_at: string | null;
  done_at: string | null;
};

/**
 * `jonas@gmail.com` -> `j***@g***.com`: pirmoji vardo ir domeno raidė ir
 * paskutinė domeno dalis. Ar adresas tas, kurį žmogus nurodė, administratorius
 * gali patikrinti, bet perskaityti ir užrašyti jo – ne.
 */
export function maskEmail(email: string | null | undefined): string | null {
  if (typeof email !== 'string') return null;
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const local = email.slice(0, at);
  const labels = email.slice(at + 1).split('.');
  if (labels.length < 2 || !labels[0]) return null;
  return `${local[0]}***@${labels[0][0]}***.${labels[labels.length - 1]}`;
}

export type EdgeAnswer = { status: number; json: Record<string, unknown> | null };

/**
 * Vienas administratoriaus veiksmas Edge funkcijai. `accessToken` – prisijungusio
 * administratoriaus sesijos žetonas (iš slapukų, serveryje). Atsakymo kūnas
 * neišvedamas į žurnalą: jame būna paskyros vardas.
 */
export async function callMfaResetAdmin(accessToken: string, body: Record<string, unknown>): Promise<EdgeAnswer> {
  const res = await fetch(ENDPOINT(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  return { status: res.status, json };
}
