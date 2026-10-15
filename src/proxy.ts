import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SESSION_COOKIE_OPTIONS } from '@/lib/supabase/cookie-options';
import { adminCsp, newNonce } from '@/lib/csp';

/**
 * Proxy (iki Next 16 – `middleware`; #121): sesijos atnaujinimas ir `/admin`
 * uždarymas. Pervadinta be elgesio pakeitimų: tas pats `matcher`, ta pati CSP.
 * Next 16 proxy visada vykdomas Node.js aplinkoje.
 *
 * KODĖL SESIJA ATNAUJINAMA BŪTENT ČIA
 * -----------------------------------
 * Server Components slapukų rašyti negali, tad pasibaigęs žetonas ten
 * neatsinaujina — žmogus tiesiog taptų neprisijungęs vidury naršymo.
 * Middleware yra vienintelė vieta, kuri gali ir skaityti, ir rašyti, todėl
 * `getUser()` kvietimas čia nėra perteklinis: jis ir yra tas, kuris žetoną
 * atnaujina.
 *
 * KODĖL NEPRISIJUNGĘS GAUNA PERADRESAVIMĄ, O NE 404
 * -------------------------------------------------
 * Užduotis siūlė „404 arba peradresavimą". Pasirinktas antras, ir tik
 * neprisijungusiam: 404 čia reikštų, kad administratorius, kurio sesija
 * pasibaigė, mato „tokio puslapio nėra" ir nesupranta, ką daryti.
 *
 * Bet PRISIJUNGĘS NE ADMINISTRATORIUS gauna būtent 404, ir tai daroma
 * puslapio viduje (`notFound()`), ne čia: middleware neturi servisinio rakto,
 * tad `admin_ids` jis patikrinti negali, o spėlioti čia nėra ko. Skirtumas
 * matomas tik tam, kas jau prisijungęs, ir jis sąmoningas — pašalinis
 * lankytojas apie `/admin` egzistavimą nesužino nieko.
 *
 * KODĖL `matcher` SIAURAS
 * -----------------------
 * Visa kita svetainė yra statiniai rinkodaros ir teisiniai puslapiai be
 * jokios sesijos. Paleidus middleware ant jų, kiekvienas lankytojas gautų
 * Supabase kvietimą už nieką, o puslapiai nustotų būti visiškai statiniai.
 *
 * CSP (`src/lib/csp.ts`)
 * ----------------------
 * Nonce'as kuriamas čia, nes Next jį ima iš UŽKLAUSOS antraštės
 * `Content-Security-Policy` ir pats prideda savo skriptams; naršyklėje
 * užklausos antraštė nieko neblokuoja. Ji perrašoma visada, kad kliento
 * atsiųsta reikšmė nepadiktuotų nonce'o.
 */
export async function proxy(request: NextRequest) {
  const nonce = newNonce();
  const csp = adminCsp(nonce, process.env.NODE_ENV === 'development');

  // Antraštės kopijuojamos kiekvieną kartą iš naujo: `setAll` pakeičia
  // `request` slapukus, ir Server Components turi gauti jau atnaujintą žetoną.
  const forward = () => {
    const headers = new Headers(request.headers);
    headers.set('content-security-policy', csp);
    headers.delete('content-security-policy-report-only');
    return NextResponse.next({ request: { headers } });
  };

  let response = forward();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = forward();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith('/admin/login');

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    // `next` išsaugomas, kad po prisijungimo žmogus grįžtų ten, kur ėjo, o ne
    // į skydelio pradžią.
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  response.headers.set('Content-Security-Policy-Report-Only', csp);
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
