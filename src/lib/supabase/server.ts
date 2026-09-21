import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase klientas SERVERIO pusėje, su prisijungusio žmogaus sesija.
 *
 * KODĖL `@supabase/ssr`, O NE PAPRASTAS `createClient`
 * ---------------------------------------------------
 * Paprastas klientas sesiją laiko atmintyje ir naršyklėje. Serveryje jos
 * reikia iš SLAPUKŲ, o Next.js Server Components slapukų rašyti negali — tik
 * skaityti. `createServerClient` tai supranta: skaitymas veikia visur, o
 * rašymas tyliai praleidžiamas ten, kur jis draudžiamas, ir įvyksta
 * middleware'e, kuriam leidžiama.
 *
 * KODĖL ČIA NĖRA `SERVICE_ROLE` RAKTO
 * -----------------------------------
 * Šis klientas atsako į klausimą „kas prisijungęs", ir atsakymas privalo
 * ateiti iš to žmogaus sesijos, o ne iš rakto, kuris gali viską. Servisinis
 * raktas gyvena `admin.ts` ir naudojamas TIK po to, kai šitas patvirtino
 * tapatybę.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /*
             * Server Component slapukų rašyti negali, ir tai NE klaida.
             * Sesijos atnaujinimą daro middleware, kuriam tai leidžiama, tad
             * čia užtenka nenukristi. Be šito bloko kiekvienas puslapis,
             * kurio žetonas kaip tik pasibaigė, mestų išimtį vietoj to, kad
             * parodytų turinį.
             */
          }
        },
      },
    },
  );
}
