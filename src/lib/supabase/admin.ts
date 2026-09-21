import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase klientas su SERVISINIU raktu.
 *
 * KODĖL `import 'server-only'` YRA PIRMA EILUTĖ
 * ---------------------------------------------
 * Ne stilius. Šis modulis neša raktą, kuris apeina RLS ir mato viską. Jei
 * kas nors kada nors jį importuotų iš kliento komponento, Next.js surinktų
 * jį į naršyklės paketą, ir raktas atsidurtų kiekvieno lankytojo įrenginyje.
 * `server-only` tokį importą paverčia BUILD'O klaida, o ne tyliu nutekėjimu.
 *
 * Tai vienintelė apsauga, kuri veikia prieš klaidą, o ne prieš piktą valią:
 * niekas nenori to padaryti, bet vienas neapgalvotas importas kainuotų viską.
 *
 * KODĖL SESIJA IŠJUNGTA
 * ---------------------
 * `persistSession` ir `autoRefreshToken` yra naršyklės dalykai. Serveryje jie
 * reikštų, kad du lygiagretūs prašymai dalijasi viena sesijos būsena — o čia
 * sesijos apskritai nėra, yra raktas.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    /*
     * Aiški klaida vietoj `undefined` kelionės į biblioteką. Be jos
     * neužpildyta aplinka pasirodytų kaip „Invalid API key" iš Supabase, ir
     * pusvalandis nueitų ieškant to, ko nėra.
     */
    throw new Error(
      'Trūksta NEXT_PUBLIC_SUPABASE_URL arba SUPABASE_SERVICE_ROLE_KEY. ' +
        'Portalas be jų veikti negali.',
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
