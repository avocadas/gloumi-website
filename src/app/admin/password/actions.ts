"use server";

import { checkAdmin } from "@/lib/admin-guard";
import {
  ADMIN_USERNAME,
  MAX_PASSWORD_LENGTH,
  TOTP_CODE,
  UNAVAILABLE,
  begin,
  captchaOrUndefined,
  forGoTrue,
  clientIp,
  finish,
  locked,
  passwordStep,
  revoke,
  unchecked,
} from "@/lib/admin-auth";
import { ADMIN_MAX_PASSWORD_CHARS, ADMIN_MIN_PASSWORD_CHARS, passwordChars } from "@/lib/password-rule";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Administratoriaus slaptažodžio keitimas portale (developeris 2026-10-20;
 * security `ataskaitos/security-admin-slaptazodzio-keitimas-2026-10-20.md`).
 *
 * KODĖL ČIA, O NE „PAMIRŠAU SLAPTAŽODĮ"
 * ------------------------------------
 * Administratoriaus adresas atsitiktinis (`admin_register`) – tokios dėžutės
 * nėra, tad nei atkūrimo laiško, nei GoTrue pakartotinio patvirtinimo kodo
 * gauti negalima. Keičiama tik prisijungus, čia.
 *
 * EILĖ
 * ----
 * 1. Tapatybė – iš naršyklės sesijos (`checkAdmin`: `getUser`, `admin_ids`
 *    pagal `user.id`, `aal2`), formoje vardo nėra.
 * 2. Dabartinis slaptažodis – per tą patį `admin_login_begin` skaitiklį
 *    („password") kaip prisijungimas, nauja tik šiame serveryje gyva sesija.
 *    Jos `user.id` turi sutapti su naršyklės sesijos – kitaip nutraukiama.
 * 3. Kodas – „totp" skaitiklis, `challengeAndVerify`: nauja sesija tampa `aal2`.
 * 4. `updateUser({ password, current_password })` – TIK naujoje sesijoje
 *    (ilgesni nei 72 baitų – išvestiniai, `forGoTrue`):
 *    `secure_password_change` senesnei naršyklės sesijai atsakytų
 *    `reauthentication_needed`, o kodo laiško adminas gauti negali.
 * 5. Pavykus – žurnalas `admin_password_changed`, nauja sesija atjungia visas
 *    paskyros sesijas (`global`), naršyklės slapukai išvalomi, ir žmogus
 *    prisijungia iš naujo. `admin-guard` tikrina `getUser` (ne `getClaims`),
 *    tad atšauktas JWT likusią valandą skydelio neatidaro.
 * Slaptažodžiai, kodas, žetonas ir adresas niekur nerašomi.
 */

/** `partial` – slaptažodis pakeistas, bet kitų sesijų atjungti nepavyko (security L1). */
export type ChangeResult =
  | { ok: true; partial: boolean }
  | { ok: false; error: string; field?: "current" | "code" | "next" };

// Tie patys žodžiai kaip prisijungime (security 8 p.).
const WRONG_PASSWORD = "Neteisingas slaptažodis.";
const WRONG_CODE = "Neteisingas kodas.";
// Prisijungimo „laikinai nepasiekiamas" čia netinka – keičiamas slaptažodis.
const CHANGE_UNAVAILABLE = "Slaptažodžio pakeisti dabar nepavyko. Bandykite po minutės.";
const SIGN_IN_AGAIN = "Sesija pasibaigė. Prisijunkite iš naujo ir bandykite dar kartą.";
const WEAK = "Naujas slaptažodis per silpnas. Pasirinkite ilgesnį ar sudėtingesnį.";
const PWNED = "Šis slaptažodis yra nutekėjusių slaptažodžių sąraše. Pasirinkite kitą.";
const SAME = "Naujas slaptažodis sutampa su dabartiniu.";
const MISMATCH = "Nauji slaptažodžiai nesutampa.";
const LENGTH = `Naujas slaptažodis turi būti nuo ${ADMIN_MIN_PASSWORD_CHARS} iki ${ADMIN_MAX_PASSWORD_CHARS} simbolių.`;

/** GoTrue's refusal of the new password, by code (as /auth/reset), without details. */
function refusal(error: { code?: string; reasons?: unknown }): ChangeResult {
  if (error.code === "same_password") return { ok: false, error: SAME, field: "next" };
  if (error.code === "weak_password") {
    const reasons = Array.isArray(error.reasons) ? error.reasons : [];
    return { ok: false, error: reasons.includes("pwned") ? PWNED : WEAK, field: "next" };
  }
  // Ne nauja sesija ar ne aal2 – klaida mūsų pusėje, ne kodo siuntimas (security 4 p.).
  console.warn("[admin-password] update", error.code ?? "error");
  return { ok: false, error: CHANGE_UNAVAILABLE };
}

export async function changeAdminPassword(
  current: unknown,
  code: unknown,
  next: unknown,
  repeat: unknown,
  captchaToken?: unknown,
): Promise<ChangeResult> {
  if (typeof current !== "string" || current.length === 0 || current.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, error: WRONG_PASSWORD, field: "current" };
  }
  if (typeof code !== "string" || !TOTP_CODE.test(code.trim())) return { ok: false, error: WRONG_CODE, field: "code" };
  if (typeof next !== "string" || typeof repeat !== "string") return { ok: false, error: LENGTH, field: "next" };
  if (next !== repeat) return { ok: false, error: MISMATCH, field: "next" };
  const chars = passwordChars(next);
  if (chars < ADMIN_MIN_PASSWORD_CHARS || chars > ADMIN_MAX_PASSWORD_CHARS) return { ok: false, error: LENGTH, field: "next" };
  if (next === current) return { ok: false, error: SAME, field: "next" };

  const check = await checkAdmin();
  if (!check.ok) return { ok: false, error: SIGN_IN_AGAIN };
  const name = check.username ?? "";
  if (!ADMIN_USERNAME.test(name)) return { ok: false, error: CHANGE_UNAVAILABLE };

  let changed = false;
  let partial = false;
  try {
    const db = createSupabaseAdminClient();
    const ip = await clientIp();
    const step = await passwordStep(db, name, current, ip, captchaOrUndefined(captchaToken), WRONG_PASSWORD);
    if (!step.ok) {
      if (step.error === WRONG_PASSWORD) return { ...step, field: "current" };
      return step.error === UNAVAILABLE ? { ok: false, error: CHANGE_UNAVAILABLE } : step;
    }

    const { auth } = step;
    try {
      const {
        data: { user },
      } = await auth.auth.getUser();
      if (!user || user.id !== check.userId) return { ok: false, error: SIGN_IN_AGAIN };

      const { data: factors, error: listError } = await auth.auth.mfa.listFactors();
      const factor = factors?.totp[0];
      if (listError || !factor) return { ok: false, error: CHANGE_UNAVAILABLE };

      const gate = await begin(db, name, ip, "totp");
      if (!gate.allowed) return locked(gate.retryAfter);

      const { error: verifyError } = await auth.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
      if (verifyError) {
        const skip = unchecked(verifyError.status);
        await finish(db, gate.attemptId, skip ? "error" : "fail");
        return skip ? { ok: false, error: CHANGE_UNAVAILABLE } : { ok: false, error: WRONG_CODE, field: "code" };
      }
      await finish(db, gate.attemptId, "ok");

      // „Require current password" (Supabase skydelis) – dabartinis perduodamas kartu.
      // Ilgesni nei 72 baitų – kaip išvestiniai (`forGoTrue`), abu, kaip ir prisijungiant.
      const { error: updateError } = await auth.auth.updateUser({ password: forGoTrue(next), current_password: forGoTrue(current) });
      if (updateError) return refusal(updateError as { code?: string; reasons?: unknown });
      changed = true;

      const { error: logError } = await db.rpc("log_admin_action", {
        _admin_id: check.userId,
        _action: "admin_password_changed",
        _target_type: "admin",
        _target_id: check.userId,
        _details: {},
      });
      if (logError) console.error("[admin-password] log", logError.code ?? "error");

      // Visos paskyros sesijos, įskaitant naršyklės (security 6 p.).
      const { error: globalError } = await auth.auth.signOut({ scope: "global" });
      if (globalError) {
        // Kitos sesijos liko: bent šią atšaukiame ir žmogui pasakome (security L1).
        console.error("[admin-password] sign out", globalError.code ?? "error");
        partial = true;
      }
    } catch (e) {
      if (!changed) throw e;
      // Pakeista, bet kas nors po to nukrito: kitos sesijos gal neatjungtos.
      console.error("[admin-password] after change", e instanceof Error ? e.message : e);
      partial = true;
    } finally {
      if (!changed || partial) await revoke(auth);
    }
  } catch (e) {
    console.error("[admin-password]", e instanceof Error ? e.message : e);
    return { ok: false, error: CHANGE_UNAVAILABLE };
  }

  // Slapukai išvalomi bet kuriuo atveju: sesija jau atšaukta serveryje.
  const browser = await createSupabaseServerClient();
  await browser.auth.signOut({ scope: "local" }).catch(() => undefined);
  return { ok: true, partial };
}
