import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type AdminCheck =
  | { ok: true; userId: string; username: string | null }
  | { ok: false; reason: 'anonymous' | 'not-admin' | 'mfa-required' | 'expired' };

/*
 * Kiek laiko sesija galioja nuo kodo įvedimo (#105, developeris 2026-09-30).
 * Free plane Supabase sesiją atnaujina be pabaigos, tad be šios ribos kartą
 * įvestas kodas atidarytų skydelį tame įrenginyje visam laikui.
 */
const MAX_SESSION_SECONDS = 12 * 60 * 60;

/*
 * Paskutinio TOTP patvirtinimo laikas iš sesijos AMR. Jei Supabase kada
 * grąžintų AMR be laikų (eilučių masyvą), rezultatas 0, ir sesija laikoma
 * pasibaigusia: nežinomas laikas nėra laikas, kuriuo galima pasitikėti.
 */
function lastTotpAt(methods: unknown): number {
  if (!Array.isArray(methods)) return 0;
  let latest = 0;
  for (const entry of methods) {
    if (!entry || typeof entry !== 'object') continue;
    const { method, timestamp } = entry as { method?: unknown; timestamp?: unknown };
    if ((method === 'totp' || method === 'mfa/totp') && typeof timestamp === 'number') {
      latest = Math.max(latest, timestamp);
    }
  }
  return latest;
}

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
  // `user_id`, ne `profile_id`: nuo 20260930165140 administratorius yra
  // `auth.users` įrašas be programėlės profilio (#105).
  const { data: row, error } = await admin
    .from('admin_ids')
    .select('user_id, username')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !row) return { ok: false, reason: 'not-admin' };

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== 'aal2') return { ok: false, reason: 'mfa-required' };

  const totpAt = lastTotpAt(aal.currentAuthenticationMethods);
  if (!totpAt || Date.now() / 1000 - totpAt > MAX_SESSION_SECONDS) {
    return { ok: false, reason: 'expired' };
  }

  // Vardas, ne el. paštas: nuo 20260930210151 adresas atsitiktinis ir yra
  // viena iš apsaugos dalių. Parodytas skydelyje jis atsidurtų ekrane ir HTML.
  return { ok: true, userId: user.id, username: row.username ?? null };
}
