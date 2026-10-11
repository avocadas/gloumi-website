/**
 * Administravimo portalo turinio saugumo politika (CSP, Gloumi
 * SECURITY_AUDIT L-10).
 *
 * KODĖL TIK `/admin`
 * ------------------
 * Portalas rodo tai, ką parašė naudotojai (skundai, atsiliepimai, vardai), ir
 * jame gyvena `aal2` administratoriaus sesija. React naudotojų tekstą įterpia
 * kaip tekstą, ne kaip HTML, ir `dangerouslySetInnerHTML` portale nėra, tad tai
 * antra gynybos linija, ne rastos XSS taisymas. Viešiems puslapiams nonce'o politika reikštų dinaminį
 * atvaizdavimą kiekvienam lankytojui (`next.config.ts`).
 *
 * KODĖL KOL KAS `Report-Only`
 * ---------------------------
 * Politika, kuri užblokuotų Next ar Vercel skriptą, išjungtų portalą visai, o
 * tai pamatytume tik prisijungę. Pirma renkamos ataskaitos (`/api/csp-report`)
 * iš tikro naudojimo, tada ta pati eilutė perkeliama į `Content-Security-Policy`.
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

export function adminCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    // `'unsafe-eval'` tik `next dev`: React juo atkuria serverio klaidų dėklus.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
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

/** 128 bitų, kiekvienai užklausai naujas: atspėtas nonce'as atidarytų skriptus. */
export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
