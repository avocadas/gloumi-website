"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { UUID_PATTERN } from "../format";
import { emailAuthorNotice, noticeEmailNote, type NoticeNote } from "../moderation-email";
import { ruleFor } from "../moderation-rules";

/*
 * Administratorius sulaiko vizitą, įtaręs sukčiavimą: atidaro ginčą, ir
 * nurašymas bei išmoka meistrui sustoja (K-U24-4, developeris 2026-10-05:
 * „Kurti“; Gloumi `20261005211440_admin_open_dispute`). Sprendžiama taip pat,
 * kaip kliento ginčas: „Ginčai“ → grąžinti arba išmokėti.
 *
 * Teisininkas (2026-10-06): meistrui — motyvuotas pranešimas programėlėje ir
 * el. paštu (Meistrų sąlygų 16 sk., DSA 17 str. 1 d. c p., P2B 4 str. 1 d.),
 * todėl priežastis ir taisyklių punktas privalomi, kaip #169. Faktų galima
 * neatskleisti tik tada, kai to reikalauja institucija ar teisės aktas
 * (`withhold`): pranešime tada parašoma, kad priežasties atskleisti negalime,
 * o tikroji lieka ginče ir žurnale.
 *
 * Atskiras failas, ne bendras `actions.ts`: tas pats principas (vienas RPC su
 * žurnalu, veiksmas iš naujo tikrina administratorių).
 */

type ActionResult = { ok: true; note?: NoticeNote } | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  reason_required: "Nurodykite priežastį.",
  "Per ilga priezastis": "Priežastis per ilga — daugiausia 500 ženklų.",
  rule_required: "Pasirinkite taisyklių punktą.",
  bad_rule: "Duomenų bazė atmetė taisyklių punktą — atnaujinkite puslapį ir pasirinkite iš naujo.",
  booking_not_found: "Šio vizito nebėra.",
  visit_not_paid_in_app: "Sulaikyti galima tik vizitą, apmokėtą ar rezervuotą programėlėje.",
  visit_already_paid_out: "Išmoka meistrui jau pervesta — sustabdyti nebėra ko.",
  dispute_exists: "Šis vizitas jau turi ginčą — jį rasite skiltyje „Ginčai“.",
};

async function requireAdmin() {
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

export async function openDispute(
  bookingId: string,
  reason: string,
  rule: string | null,
  withhold: boolean,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof bookingId !== "string" || !UUID_PATTERN.test(bookingId) || typeof withhold !== "boolean") {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const why = typeof reason === "string" ? reason.trim() : "";
    if (!why) return { ok: false, error: ERRORS.reason_required };
    if (why.length > 500) return { ok: false, error: ERRORS["Per ilga priezastis"] };
    const parsed = ruleFor(rule);
    // „Paties naudotojo prašymu“ čia netinka: sulaikymas visada dėl įtarimo (db: `bad_rule`).
    if (!parsed || parsed.doc === "request") return { ok: false, error: ERRORS.rule_required };

    const db = createSupabaseAdminClient();
    const { data: auditLogId, error } = await db.rpc("admin_open_dispute", {
      _admin_id: admin.userId,
      _booking: bookingId,
      _reason: why,
      _rule: parsed,
      _withhold: withhold,
    });
    if (error) return { ok: false, error: ERRORS[error.message] ?? error.message };

    // Meistrui — laiškas visada (`moderation-email.ts` `HOLD_KINDS`).
    const note = noticeEmailNote(await emailAuthorNotice(db, auditLogId)) ?? undefined;
    revalidatePath("/admin", "layout");
    return { ok: true, note };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}
