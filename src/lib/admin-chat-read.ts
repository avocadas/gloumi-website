import "server-only";
import type { ChatTarget } from "@/app/admin/chat-read";
import { UUID_PATTERN } from "@/app/admin/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Ar bazėje jau yra `admin_read_chat` (A-16). Kol migracija nepritaikyta,
 * PostgREST atsako `PGRST202`, ir mygtuko „Skaityti“ nerodome (db prašymas).
 *
 * Tikrinama kvietimu su tuščiu pagrindu: funkcija jį atmeta
 * (`chat_read_basis_invalid`) dar prieš skaitydama pokalbį ar rašydama į
 * žurnalą, o klaida atšaukia visą transakciją. Atsakymas laikomas 5 minutes –
 * funkcija atsiranda vieną kartą, o puslapis kiekvieną kartą jos neklausia.
 */
const TTL_MS = 5 * 60 * 1000;
const MISSING = new Set(["PGRST202", "42883"]);
let cached: { at: number; ok: boolean } | null = null;

export async function chatReadAvailable(adminId: string): Promise<boolean> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.ok;
  try {
    const db = createSupabaseAdminClient();
    const { error } = await db.rpc("admin_read_chat", {
      _admin_id: adminId,
      _chat: "00000000-0000-0000-0000-000000000000",
      _basis: "",
      _basis_ref: "",
    });
    const ok = !error || !MISSING.has(error.code ?? "");
    cached = { at: Date.now(), ok };
    return ok;
  } catch {
    return false;
  }
}

/** `admin_read_chat` klaidos → ką daryti administratoriui. */
export const CHAT_READ_ERRORS: Record<string, string> = {
  chat_read_basis_invalid: "Pasirinkite pagrindą iš sąrašo.",
  chat_read_basis_ref_required: "Nurodykite pagrindo nuorodą (iki 200 ženklų).",
  chat_read_basis_ref_invalid: "Skundo ar vizito ID turi būti UUID formos.",
  chat_read_basis_mismatch:
    "Šis pagrindas su šiuo pokalbiu nesusijęs: skundas turi būti dėl šio pokalbio žinutės ar nario, ginčas – tarp šio pokalbio narių.",
  chat_not_found: "Šio pokalbio nebėra.",
};

/**
 * Pokalbį randame pagal tai, ką žino langas: jo id, praneštą žinutę arba du
 * narius (skundas dėl profilio, ginčas). Skaitomas tik `chat_id`, ne turinys.
 * Kai bendrų pokalbių keli – naujausias.
 */
export async function chatOf(
  db: ReturnType<typeof createSupabaseAdminClient>,
  target: ChatTarget,
): Promise<{ id: string } | { error: string }> {
  if (target && "chatId" in target) {
    return UUID_PATTERN.test(target.chatId) ? { id: target.chatId } : { error: "Netinkamas prašymas." };
  }
  if (target && "messageId" in target) {
    if (!UUID_PATTERN.test(target.messageId)) return { error: "Netinkamas prašymas." };
    const { data, error } = await db.from("messages").select("chat_id").eq("id", target.messageId).maybeSingle();
    if (error) return { error: "Nepavyko rasti pokalbio." };
    return typeof data?.chat_id === "string" ? { id: data.chat_id } : { error: "Žinutės nebėra – pokalbio pagal ją rasti nepavyko." };
  }
  if (target && "memberIds" in target && Array.isArray(target.memberIds)) {
    const [a, b] = target.memberIds;
    if (!UUID_PATTERN.test(a) || !UUID_PATTERN.test(b) || a === b) return { error: "Netinkamas prašymas." };
    const { data, error } = await db.from("chat_members").select("chat_id, profile_id").in("profile_id", [a, b]);
    if (error) return { error: "Nepavyko rasti pokalbio." };
    const members = new Map<string, Set<string>>();
    for (const r of (data ?? []) as Array<{ chat_id: string; profile_id: string }>) {
      members.set(r.chat_id, (members.get(r.chat_id) ?? new Set()).add(r.profile_id));
    }
    const shared = [...members].filter(([, who]) => who.size === 2).map(([id]) => id);
    if (shared.length === 0) return { error: "Šie du žmonės bendro pokalbio neturi." };
    if (shared.length === 1) return { id: shared[0] };
    const { data: latest } = await db
      .from("chats")
      .select("id")
      .in("id", shared)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    return { id: typeof latest?.id === "string" ? latest.id : shared[0] };
  }
  return { error: "Netinkamas prašymas." };
}

/** `admin_read_chat` klaida → tekstas administratoriui. */
export function chatReadErrorText(error: { code?: string | null; message: string }): string {
  if (error.code === "PGRST202") return "Pokalbių skaitymas su pagrindu bazėje dar neįjungtas.";
  const known = Object.keys(CHAT_READ_ERRORS).find((k) => error.message.startsWith(k));
  return known ? CHAT_READ_ERRORS[known] : error.message;
}
