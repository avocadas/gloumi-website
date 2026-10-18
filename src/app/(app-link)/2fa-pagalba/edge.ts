/*
 * Supabase Edge `mfa-reset` viešieji keliai (db sąsaja, 2026-10-18). Naršyklė
 * kviečia funkciją pati: kodą iš laiško ir slaptažodį tikrina Edge (tik ji
 * žino paskyros el. paštą), o svetainės serveris jų nemato ir nerašo į jokį
 * žurnalą. `verify_jwt=false`, CORS tik https://gloumi.lt; CSP `connect-src`
 * leidžia tik šį Supabase adresą (`mfaHelpCsp`).
 *
 * Atsakymai (db):
 *   confirm – {ok:true, ready_at, rule} | {ok:false, retry:"password", left} |
 *             {ok:false} (kodas netinka, pasibaigęs ar prašymas ne tos būsenos – vienodai);
 *   cancel  – visada {ok:true}, neatskleidžiant, ar žetonas galiojo;
 *   klaidos – 400 {error:"captcha"}, 429 riba, 500 {error:"server"}.
 */

const ENDPOINT = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "")}/functions/v1/mfa-reset`;

export type ConfirmOutcome =
  | { kind: "confirmed"; readyAt: string | null }
  | { kind: "password"; left: number }
  | { kind: "invalid" }
  | { kind: "captcha" }
  | { kind: "limited" }
  | { kind: "unavailable" };

async function post(body: Record<string, unknown>): Promise<{ status: number; json: Record<string, unknown> | null }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // Jokių slapukų, jokio Referer (adrese kodo jau nėra, bet vis tiek), jokio talpinimo.
    credentials: "omit",
    referrerPolicy: "no-referrer",
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  return { status: res.status, json };
}

export async function confirmReset(code: string, password: string, turnstile: string | null): Promise<ConfirmOutcome> {
  try {
    const { status, json } = await post({
      action: "confirm",
      code,
      // Tuščias laukas – „neįvestas“ (7 d.), todėl jis visai nesiunčiamas.
      ...(password ? { password } : {}),
      turnstile,
    });
    if (status === 429) return { kind: "limited" };
    if (status === 400 && json?.error === "captcha") return { kind: "captcha" };
    if (status !== 200 || !json) return { kind: "unavailable" };
    if (json.ok === true) return { kind: "confirmed", readyAt: typeof json.ready_at === "string" ? json.ready_at : null };
    if (json.retry === "password" && typeof json.left === "number" && json.left > 0) {
      return { kind: "password", left: json.left };
    }
    return { kind: "invalid" };
  } catch {
    return { kind: "unavailable" };
  }
}

export async function cancelReset(token: string): Promise<"done" | "limited" | "unavailable"> {
  try {
    const { status } = await post({ action: "cancel", token });
    if (status === 200) return "done";
    return status === 429 ? "limited" : "unavailable";
  } catch {
    return "unavailable";
  }
}

/**
 * Reikšmė iš adreso dalies po `#` (`#k=…`, `#t=…`), perskaityta vieną kartą.
 * Fragmentas į serverį nekeliauja, todėl nepatenka į jokį žurnalą; perskaičius
 * adresas išvalomas, kad kodas neliktų naršyklės istorijoje.
 */
export function readFragment(name: string): string {
  const value = new URLSearchParams(window.location.hash.replace(/^#/, "")).get(name) ?? "";
  if (window.location.hash || window.location.search) window.history.replaceState(null, "", window.location.pathname);
  return value;
}
