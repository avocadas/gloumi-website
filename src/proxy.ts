import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { SESSION_COOKIE_OPTIONS } from '@/lib/supabase/cookie-options';
import { adminCsp, appLinkCsp, authCsp, mfaHelpCsp, newNonce, originOf } from '@/lib/csp';

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
 * Ir dalinimosi nuorodos `/profile/<id>`, `/ref` (dinaminiai, rodo naudotojų
 * turinį): ta pati griežta CSP, plius R2 nuotraukos (web auditas 2026-10-22).
 *
 * CSP (`src/lib/csp.ts`)
 * ----------------------
 * Nonce'as kuriamas čia, nes Next jį ima iš UŽKLAUSOS antraštės
 * `Content-Security-Policy` ir pats prideda savo skriptams; naršyklėje
 * užklausos antraštė nieko neblokuoja. Ji perrašoma visada, kad kliento
 * atsiųsta reikšmė nepadiktuotų nonce'o.
 */

/**
 * Puslapiams be sesijos: politika į užklausą (iš jos Next ima nonce'ą) ir į
 * atsakymą. Kliento atsiųsta `…-report-only` antraštė išmetama, kaip ir admin
 * šakoje, kad Next niekada neimtų nonce'o iš jos (security 2026-10-22, R-4).
 */
function withPolicy(request: NextRequest, policy: string) {
  const headers = new Headers(request.headers);
  headers.set('content-security-policy', policy);
  headers.delete('content-security-policy-report-only');
  const res = NextResponse.next({ request: { headers } });
  res.headers.set('Content-Security-Policy', policy);
  return res;
}

export async function proxy(request: NextRequest) {
  const nonce = newNonce();
  const dev = process.env.NODE_ENV === 'development';

  const { pathname: path } = request.nextUrl;
  // `matcher` didžiųjų ir mažųjų raidžių neskiria (`/Admin` patenka čia), o
  // `/auth/:path*` apima ir patį `/auth`. Todėl šakos renkamos pagal kelią
  // mažosiomis raidėmis ir su pačiu šaknies adresu: iki 2026-10-22 `/auth`
  // krisdavo į admin šaką ir gaudavo nukreipimą į `/admin/login` (web auditas).
  // Admin šaka lieka paskutinė – ją gauna tik tai, kas liko: `/admin…`.
  const p = path.toLowerCase();

  // 2FA nuėmimas per pagalbą: be sesijos, griežta CSP su Turnstile ir Edge adresu, jokio Referer.
  if (p === '/2fa-pagalba' || p.startsWith('/2fa-pagalba/')) {
    const res = withPolicy(request, mfaHelpCsp(nonce, dev, originOf(process.env.NEXT_PUBLIC_SUPABASE_URL)));
    res.headers.set('Referrer-Policy', 'no-referrer');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
  // Dalinimosi nuorodos (`/profile/<id>`, `/ref`): naudotojų turinys – tokia pat griežta CSP, plius R2 nuotraukos.
  if (p === '/profile' || p.startsWith('/profile/') || p === '/ref') {
    return withPolicy(request, appLinkCsp(nonce, dev));
  }
  // Pašto patvirtinimas ir slaptažodžio atkūrimas: be sesijos, tik griežta CSP (privaloma).
  if (p === '/auth' || p.startsWith('/auth/') || p === '/patvirtinta') {
    return withPolicy(request, authCsp(nonce, dev));
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

  // Privaloma nuo web audito 2026-10-22 (#121, SECURITY_AUDIT L-10). Report-Only
  // veikė nuo 10-11 su ta pačia politika; Vercel žurnale (jo saugojimo lange) –
  // tik 2 pranešimai 10-21 16:59 UTC, abu apie rėmelius iš naršyklės įrankio, o
  // administratoriaus naudojimas tą pačią dieną (15:33–15:42 UTC) jų nesukėlė.
  // Vietoje (production build, testinis Turnstile raktas) /admin/login – 0
  // pažeidimų, Turnstile išduoda žetoną. `report-uri` lieka.
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/patvirtinta', '/2fa-pagalba', '/2fa-pagalba/:path*', '/profile/:path*', '/ref'],
};
