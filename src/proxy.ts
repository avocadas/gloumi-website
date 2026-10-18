import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SESSION_COOKIE_OPTIONS } from '@/lib/supabase/cookie-options';
import { adminCsp, authCsp, mfaHelpCsp, newNonce, originOf } from '@/lib/csp';

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
 * Išimtis – `/auth/*` ir `/patvirtinta` (pašto patvirtinimas, slaptažodžio
 * atkūrimas): ten Supabase nekviečiamas, tik uždedama griežta CSP su nonce'u.
 * Taip pat `/2fa-pagalba` (2FA nuėmimas per pagalbą): griežta CSP su Turnstile
 * ir Edge adresu, `Referrer-Policy: no-referrer`, `noindex`, `no-store`.
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
  const dev = process.env.NODE_ENV === 'development';

  // Pašto patvirtinimas ir slaptažodžio atkūrimas: be sesijos, tik griežta CSP (privaloma).
  const { pathname: path } = request.nextUrl;

  // 2FA nuėmimas per pagalbą: be sesijos, griežta CSP su Turnstile ir Edge adresu, jokio Referer.
  if (path === '/2fa-pagalba' || path.startsWith('/2fa-pagalba/')) {
    const policy = mfaHelpCsp(nonce, dev, originOf(process.env.NEXT_PUBLIC_SUPABASE_URL));
    const headers = new Headers(request.headers);
    headers.set('content-security-policy', policy);
    const res = NextResponse.next({ request: { headers } });
    res.headers.set('Content-Security-Policy', policy);
    res.headers.set('Referrer-Policy', 'no-referrer');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  if (path.startsWith('/auth/') || path === '/patvirtinta') {
    const policy = authCsp(nonce, dev);
    const headers = new Headers(request.headers);
    headers.set('content-security-policy', policy);
    const res = NextResponse.next({ request: { headers } });
    res.headers.set('Content-Security-Policy', policy);
    return res;
  }

  const csp = adminCsp(nonce, dev);

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
  matcher: ['/admin/:path*', '/auth/:path*', '/patvirtinta', '/2fa-pagalba', '/2fa-pagalba/:path*'],
};
