import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type AdminCheck =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; reason: 'anonymous' | 'not-admin' | 'mfa-required' };

/**
 * Ar šitas prašymas ateina iš administratoriaus, ir ar jo sesija pakankamai
 * stipri.
 *
 * TRYS ATSKIRI KLAUSIMAI, IR JŲ EILĖ SVARBI
 * -----------------------------------------
 * 1. Ar apskritai prisijungęs.
 * 2. Ar yra `admin_ids` lentelėje.
 * 3. Ar sesija patvirtinta antru veiksniu.
 *
 * Trečiasis atskirai nuo antrojo sąmoningai: žmogus gali BŪTI
 * administratorius ir vis tiek neturėti teisės matyti skydelio, kol
 * nepatvirtino TOTP. Sulieję juos į vieną `false` prarastume galimybę
 * pasakyti „pridėk antrą veiksnį" vietoj „tu ne administratorius".
 *
 * KODĖL `aal2`, O NE „ar žmogus turi TOTP"
 * ----------------------------------------
 * Įjungtas antras veiksnys ir PANAUDOTAS antras veiksnys yra skirtingi
 * dalykai. Supabase tai sako per Authenticator Assurance Level: `aal1` —
 * prisijungė slaptažodžiu, `aal2` — patvirtino ir kodu. Tikrinti reikia
 * antrąjį, kitaip pavogtas slaptažodis atrakintų skydelį, nors TOTP ir
 * įjungtas.
 *
 * KODĖL ADMINISTRATORIAUS SĄRAŠAS TIKRINAMAS SERVISINIU RAKTU
 * -----------------------------------------------------------
 * `admin_ids` yra visiškai uždaryta lentelė: RLS įjungta, politikų nulis
 * (20260912133829). Prisijungusio žmogaus klientas jos nemato iš principo —
 * ir taip ir turi būti, nes matomas administratorių sąrašas yra nutekėjimas.
 */
export async function checkAdmin(): Promise<AdminCheck> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'anonymous' };

  const admin = createSupabaseAdminClient();
  const { data: row, error } = await admin
    .from('admin_ids')
    .select('profile_id')
    .eq('profile_id', user.id)
    .maybeSingle();

  if (error || !row) return { ok: false, reason: 'not-admin' };

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== 'aal2') return { ok: false, reason: 'mfa-required' };

  return { ok: true, userId: user.id, email: user.email ?? null };
}
