"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { UUID_PATTERN } from "../format";

/*
 * Pagalbos užklausos būsena (#209). Kaip ir kiti portalo veiksmai, pakeitimas
 * ir žurnalo įrašas — viename RPC, vienoje transakcijoje
 * (`admin_set_support_ticket_status`, db), o veiksmas iš naujo tikrina
 * administratorių: serverio veiksmas yra viešas HTTP taškas.
 */

type ActionResult = { ok: true } | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  row_not_found: "Šios užklausos nebėra.",
  bad_status: "Nežinoma būsena.",
  already_closed: "Užklausa jau pažymėta išspręsta — gal tai padarė kitas administratorius.",
  already_open: "Užklausa jau atvira.",
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

export async function setSupportTicketStatus(ticketId: string, status: "open" | "closed"): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (typeof ticketId !== "string" || !UUID_PATTERN.test(ticketId) || (status !== "open" && status !== "closed")) {
      return { ok: false, error: "Netinkamas prašymas." };
    }
    const db = createSupabaseAdminClient();
    const { error } = await db.rpc("admin_set_support_ticket_status", {
      _admin_id: admin.userId,
      _ticket_id: ticketId,
      _status: status,
    });
    if (error) return { ok: false, error: ERRORS[error.message] ?? error.message };

    revalidatePath("/admin/support");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Nepavyko." };
  }
}
