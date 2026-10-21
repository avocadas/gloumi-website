/**
 * Turinio saugumo politikos (CSP, Gloumi SECURITY_AUDIT L-10, #121) tiems
 * puslapiams, kuriuos `proxy.ts` atvaizduoja kiekvienai užklausai: `/admin`,
 * `/auth/*`, `/patvirtinta`, `/2fa-pagalba`, `/profile/<id>`, `/ref`.
 *
 * KODĖL TIK ŠIEMS
 * ---------------
 * Portalas rodo tai, ką parašė naudotojai (skundai, atsiliepimai, vardai), ir
 * jame gyvena `aal2` administratoriaus sesija; kiti – pašto nuorodų ir
 * dalinimosi puslapiai, du iš jų rodo naudotojų turinį. React naudotojų tekstą
 * įterpia kaip tekstą, ne kaip HTML, ir `dangerouslySetInnerHTML` šiuose
 * puslapiuose nėra, tad tai antra gynybos linija, ne rastos XSS taisymas.
 * Statiniams puslapiams nonce'o politika reikštų dinaminį atvaizdavimą
 * kiekvienam lankytojui; jie gauna bazinę, be skriptų taisyklių
 * (`next.config.ts`), o čia esanti ją pakeičia (ta pati antraštė).
 *
 * KODĖL PORTALE PIRMA BUVO `Report-Only`
 * --------------------------------------
 * Politika, kuri užblokuotų Next ar Vercel skriptą, išjungtų portalą visai, o
 * tai pamatytume tik prisijungę. Nuo 2026-10-11 ataskaitos (`/api/csp-report`)
 * rinktos iš tikro naudojimo; nuo web audito 2026-10-22 ta pati eilutė yra
 * `Content-Security-Policy` (`proxy.ts`), o `report-uri` lieka.
 *
 * KODĖL `style-src` SU `'unsafe-inline'`
 * --------------------------------------
 * React `style={…}` ir `next/font` rašo vidinius stilius, kurių nonce'as
 * nepadengia, o stilius pats skriptų nevykdo. Nonce'as šalia
 * `'unsafe-inline'` naršyklėje jį išjungtų, todėl jo čia nėra.
 */

export const CSP_REPORT_PATH = '/api/csp-report';

/*
 * Pasirašyti `admin-media-urls` adresai: `R2_S3_ENDPOINT` arba
 * `<paskyra>.r2.cloudflarestorage.com`. Žvaigždutė apima ir ES jurisdikcijos
 * `<paskyra>.eu.r2…`, o paskyros id čia nerašomas.
 */
const R2 = 'https://*.r2.cloudflarestorage.com';

/** Cloudflare Turnstile, admin prisijungimo CAPTCHA (2026-10-16). */
const TURNSTILE = 'https://challenges.cloudflare.com';

export function adminCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    // `'unsafe-eval'` tik `next dev`: React juo atkuria serverio klaidų dėklus.
    // Turnstile (`components/Turnstile.tsx`): skriptą įterpia mūsų kodas (`'strict-dynamic'`);
    // šaltinis – senoms naršyklėms be `'strict-dynamic'`, rėmelis – `frame-src`.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${TURNSTILE}${dev ? " 'unsafe-eval'" : ''}`,
    `frame-src ${TURNSTILE}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${R2}`,
    `media-src 'self' ${R2}`,
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    /*
     * Tik `report-uri`: jį siunčia visos naršyklės, iš karto po pažeidimo.
     * Su `report-to` ir `Reporting-Endpoints` Chromium `report-uri` ignoruoja,
     * o įterptinė Chromium naršyklė per 3 min tokios ataskaitos neišsiuntė
     * (2026-10-11); ar išsiųstų tikras Chrome, nepamatuota.
     */
    `report-uri ${CSP_REPORT_PATH}`,
  ].join('; ');
}

/**
 * Pašto patvirtinimo ir slaptažodžio atkūrimo puslapiai (`/auth/*`,
 * `/patvirtinta`; security 2026-10-17): griežta ir PRIVALOMA, ne tik stebima –
 * tik savi skriptai su nonce'u, jokių trečiųjų šalių, jokio įrėminimo.
 * Paveikslėliai – tik savi (be R2), formos – tik į save.
 */
export function authCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

/**
 * Dalinimosi nuorodų puslapiai (`/profile/<id>`, `/ref`; web auditas
 * 2026-10-22): rodo naudotojų turinį (meistro vardą, paslaugas, atsiliepimus),
 * todėl – ta pati griežta ir privaloma politika kaip `authCsp`. Vienintelis
 * skirtumas – nuotraukos: meistro avataras ir darbai ateina pasirašytais R2
 * adresais (`public-media-urls`; `public-master.ts` priima tik
 * `*.r2.cloudflarestorage.com`).
 */
export function appLinkCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${R2}`,
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

/**
 * 2FA nuėmimo per pagalbą puslapiai (`/2fa-pagalba`, `/2fa-pagalba/atsaukti`;
 * security 2026-10-18): tokia pati griežta ir privaloma kaip `authCsp`, plius
 * tai, ko jiems reikia – Turnstile valdiklis ir vienas `connect-src` adresas,
 * Supabase Edge `mfa-reset`, kuriam naršyklė pati siunčia kodą (ir
 * slaptažodį). `supabaseOrigin` – tik kilmė (schema ir domenas), be kelio.
 */
export function mfaHelpCsp(nonce: string, dev: boolean, supabaseOrigin: string | null): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${TURNSTILE}${dev ? " 'unsafe-eval'" : ''}`,
    `frame-src ${TURNSTILE}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ''}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

/** `NEXT_PUBLIC_SUPABASE_URL` kilmė CSP eilutei; netinkamas adresas – `null` (tada `connect-src` lieka tik `'self'`). */
export function originOf(url: string | undefined): string | null {
  try {
    const parsed = new URL(url ?? '');
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' ? parsed.origin : null;
  } catch {
    return null;
  }
}

/** 128 bitų, kiekvienai užklausai naujas: atspėtas nonce'as atidarytų skriptus. */
export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
