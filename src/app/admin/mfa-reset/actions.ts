"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { callMfaResetAdmin, mfaResetEnabled } from "@/lib/mfa-reset";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UUID_PATTERN } from "../format";

/*
 * 2FA nuėmimas per pagalbą (security procedūra 2026-10-18, B ir E žingsniai).
 *
 * Abu veiksmai eina per Edge `mfa-reset` su administratoriaus prieigos
 * žetonu: kas atidarė ar nuėmė, Edge ima iš žetono, ne iš šių argumentų.
 * `checkAdmin()` čia – ankstyvas ir aiškesnis atmetimas, ne vienintelė patikra.
 *
 * „Nuimti 2FA“ reikalauja šviežio TOTP (security 3 p.): administratorius
 * kodą įveda iš naujo, sesija patvirtinama dar kartą (`challengeAndVerify`),
 * ir Edge gauna žetoną, kurio `amr` totp laikas – ką tik. Edge atmeta
 * senesnį nei 10 min. (`totp_stale`).
 */

export type OpenResult = { ok: true } | { ok: false; error: string };
export type ExecuteResult = { ok: true; factors: number | null; sessions: number | null } | { ok: false; error: string };

const REFUSED: Record<string, string> = {
  admin: "Tai administratoriaus paskyra – šiuo keliu ji netvarkoma (tik developeris, Supabase skydelyje).",
  no_factor: "Paskyra neturi įjungtos 2FA – nuimti nėra ko. Atsakykite įprasta pagalba.",
  open_request: "Šiai paskyrai jau yra atviras prašymas – jis matomas eilėje.",
  cooldown: "Per paskutines 7 d. prašymas buvo atšauktas arba atmestas – naujo dar atidaryti negalima.",
  email_changed: "Paskyros el. paštas keistas per paskutines 30 d. – šiuo keliu nuimti negalima.",
  not_found: "Tokios paskyros nėra.",
};

const ERRORS: Record<string, string> = {
  not_ready: "Prašymas dar ne „Galima nuimti“ būsenos – laukimo laikas nepasibaigęs arba prašymas uždarytas.",
  username_mismatch: "Įvestas vardas nesutampa su prašymo paskyros vardu.",
  not_found: "Šio prašymo nebėra.",
  totp_stale: "Reikia šviežio kodo – įveskite naują kodą iš autentifikavimo programėlės.",
  captcha: "Saugumo patikra nepavyko.",
  server: "Edge funkcija grąžino klaidą. Bandykite dar kartą vėliau.",
};

function statusError(status: number, json: Record<string, unknown> | null): string {
  const code = typeof json?.error === "string" ? json.error : null;
  if (code && ERRORS[code]) return ERRORS[code];
  if (status === 401) return "Sesija nepriimta – prisijunkite iš naujo.";
  if (status === 403) return "Neturite teisės atlikti šio veiksmo (reikia administratoriaus su 2FA).";
  if (status === 429) return "Per daug veiksmų per trumpą laiką. Palaukite ir bandykite vėl.";
  return code ? `Nepavyko: ${code}.` : "Nepavyko susisiekti su Edge funkcija.";
}

async function requireAdmin() {
  if (!mfaResetEnabled()) throw new Error("2FA pagalba šioje aplinkoje neįjungta.");
  const check = await checkAdmin();
  if (!check.ok) {
    throw new Error(
      check.reason === "mfa-required"
        ? "Reikalingas antras veiksnys."
        : check.reason === "expired"
          ? "Sesija baigėsi — prisijunkite iš naujo."
          : "Neturite teisės atlikti šio veiksmo.",
    );
  }
  return check;
}

/** Prisijungusio administratoriaus prieigos žetonas iš slapukų; jį tikrina Edge. */
async function accessToken(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Sesija baigėsi — prisijunkite iš naujo.");
  return session.access_token;
}

export async function openMfaReset(account: string, ticket: string): Promise<OpenResult> {
  try {
    await requireAdmin();
    const who = typeof account === "string" ? account.trim() : "";
    const ref = typeof ticket === "string" ? ticket.trim() : "";
    if (!who || who.length > 254) return { ok: false, error: "Įveskite paskyros vardą arba el. paštą." };
    if (!ref || ref.length > 100) return { ok: false, error: "Įveskite kreipimosi ID (iki 100 simbolių)." };

    const { status, json } = await callMfaResetAdmin(await accessToken(), { action: "open", account: who, ticket: ref });
    if (status === 200 && json?.status === "sent") {
      revalidatePath("/admin/mfa-reset");
      return { ok: true };
    }
    if (status === 200 && json?.status === "refused") {
      const reason = typeof json.reason === "string" ? json.reason : "";
      return { ok: false, error: `Atsisakyta: ${REFUSED[reason] ?? reason}` };
    }
    return { ok: false, error: statusError(status, json) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}

const TOTP_CODE = /^\d{6}$/;

export async function executeMfaReset(requestId: string, username: string, code: string): Promise<ExecuteResult> {
  try {
    await requireAdmin();
    if (typeof requestId !== "string" || !UUID_PATTERN.test(requestId)) return { ok: false, error: "Netinkamas prašymas." };
    const name = typeof username === "string" ? username.trim() : "";
    if (!name || name.length > 100) return { ok: false, error: "Pakartokite paskyros vardą." };
    const totp = typeof code === "string" ? code.replace(/\s/g, "") : "";
    if (!TOTP_CODE.test(totp)) return { ok: false, error: "Įveskite šešių skaitmenų kodą iš autentifikavimo programėlės." };

    // Šviežias TOTP: ta pati sesija patvirtinama dar kartą; nauji žetonai įrašomi į slapukus.
    const supabase = await createSupabaseServerClient();
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp[0];
    if (listError || !factor) return { ok: false, error: "Nepavyko rasti jūsų 2FA faktoriaus – prisijunkite iš naujo." };
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: totp });
    if (verifyError) return { ok: false, error: "Kodas netinka. Įveskite dabartinį kodą iš autentifikavimo programėlės." };
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return { ok: false, error: "Sesija baigėsi — prisijunkite iš naujo." };

    const { status, json } = await callMfaResetAdmin(session.access_token, {
      action: "execute",
      request_id: requestId,
      username: name,
    });
    if (status === 200 && json?.status === "done") {
      revalidatePath("/admin/mfa-reset");
      return {
        ok: true,
        factors: typeof json.factors === "number" ? json.factors : null,
        sessions: typeof json.sessions === "number" ? json.sessions : null,
      };
    }
    return { ok: false, error: statusError(status, json) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}
