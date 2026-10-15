import { createHash } from "node:crypto";

/*
 * https://gloumi.lt/turnstile?action=…&lang=… – Cloudflare Turnstile for the
 * app's WebView (CAPTCHA, developer 2026-10-16; db plan
 * ataskaitos/db-captcha-planas-2026-10-16.md, security's conditions).
 *
 * Plain HTML from a route handler, not a Next page: no framework scripts,
 * so the CSP can be strict – nothing but this document and
 * challenges.cloudflare.com. The one inline script and style are allowed by
 * their hashes, computed per response because the script carries the site
 * key, the action and the language.
 *
 * The app reads what the page posts through window.ReactNativeWebView:
 *   {"type":"token","token":"…"}  – one-time token for Supabase Auth
 *   {"type":"expired"}             – it lapsed; Turnstile issues a new one
 *   {"type":"error","code":"…"}    – show "try again"
 * and may call window.gloumiTurnstileReset() after using a token.
 *
 * Without NEXT_PUBLIC_TURNSTILE_SITE_KEY the route answers 503, so the app
 * shows an error instead of waiting on an empty page.
 */
export const dynamic = "force-dynamic";

const ACTIONS = new Set(["signup", "login", "recover", "resend"]);
const LANGS = new Set(["lt", "en"]);
const CLOUDFLARE = "https://challenges.cloudflare.com";

const sha256 = (text: string) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;

const STYLE =
  "html,body{margin:0;height:100%;background:#F9F6F0}body{display:flex;align-items:center;justify-content:center}";

function script(siteKey: string, action: string, lang: string): string {
  // JSON.stringify keeps every value a plain string literal; `<` is escaped so none can close the tag.
  const value = (v: string) => JSON.stringify(v).replace(/</g, "\\u003c");
  return [
    "(function(){",
    "var id=null;",
    "function send(m){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(m));}",
    "window.gloumiTurnstileReset=function(){if(id!==null&&window.turnstile)window.turnstile.reset(id);};",
    "window.gloumiTurnstileLoaded=function(){",
    `id=window.turnstile.render('#t',{sitekey:${value(siteKey)},action:${value(action)},language:${value(lang)},theme:'light',`,
    "callback:function(t){send({type:'token',token:t});},",
    "'expired-callback':function(){send({type:'expired'});},",
    "'timeout-callback':function(){send({type:'expired'});},",
    "'error-callback':function(c){send({type:'error',code:String(c)});return true;}});",
    "};",
    "})();",
  ].join("");
}

export async function GET(request: Request) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey) {
    return new Response("not_configured", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }

  const params = new URL(request.url).searchParams;
  const action = ACTIONS.has(params.get("action") ?? "") ? (params.get("action") as string) : "login";
  const lang = LANGS.has(params.get("lang") ?? "") ? (params.get("lang") as string) : "lt";
  const js = script(siteKey, action, lang);

  const csp = [
    "default-src 'none'",
    `script-src ${sha256(js)} ${CLOUDFLARE}`,
    `style-src ${sha256(STYLE)}`,
    `frame-src ${CLOUDFLARE}`,
    "connect-src 'none'",
    "img-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");

  const html =
    `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">` +
    `<title>Gloumi</title><style>${STYLE}</style></head>` +
    `<body><div id="t"></div><script>${js}</script>` +
    `<script src="${CLOUDFLARE}/turnstile/v0/api.js?render=explicit&amp;onload=gloumiTurnstileLoaded" async defer></script>` +
    `</body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": csp,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
