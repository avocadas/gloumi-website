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
 * `MFA_RESET_ENABLED=1` (Vercel). Be jo `/2fa-pagalba` ir portalo skiltis
 * atsako 404: puslapiai be paskelbtos Edge funkcijos tik klaidintų.
 */

export function mfaResetEnabled(): boolean {
  return process.env.MFA_RESET_ENABLED?.trim() === '1';
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

/** Eilutė portalo eilėje: tik vardas, būsena ir laikai – jokio el. pašto ar kitų paskyros duomenų. */
export type MfaResetRow = {
  id: string;
  username: string | null;
  status: string;
  opened_by: string | null;
  created_at: string | null;
  email_sent_at: string | null;
  confirmed_at: string | null;
  ready_at: string | null;
  cancelled_at: string | null;
  done_at: string | null;
};

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
