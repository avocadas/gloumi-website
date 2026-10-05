import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { SUPPORT_FILTERS, SupportQueue } from "./SupportQueue";
import type { TicketView } from "./TicketCard";

/*
 * Pagalbos eilė (Gloumi #209). Žmogus programėlėje rašo „Pagalba → Neradote
 * atsakymo?“, o užklausa atsiduria `support_tickets`. Iki šiol ją buvo galima
 * pamatyti tik duomenų naršyklėje, o uždaryti — tik Supabase skydelyje; dabar
 * eilė čia, su mygtuku „Išspręsta“.
 *
 * Skaitoma tiesiai iš lentelės servisiniu raktu, kaip skundai (`page.tsx`):
 * tai tik skaitymas. Būsenos keitimas — `actions.ts`, per vieną RPC kartu su
 * žurnalu. Vienu kvietimu iki 200 naujausių: iš jų ir skaičiai prie būsenų,
 * ir filtruotas sąrašas — užklausų mažai.
 *
 * Atsakymo adresas imamas tik atviroms užklausoms ir tik serveryje: jis
 * reikalingas „Atsakyti el. paštu“ mygtukui, o uždarytoms — ne.
 */
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  author_id: string;
  author_role: string;
  booking_id: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { status = "open" } = await searchParams;
  const wanted = SUPPORT_FILTERS.some((f) => f.key === status) ? status : "open";

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("support_tickets")
    .select("id, author_id, author_role, booking_id, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (error ? [] : (data ?? [])) as Row[];
  const counts: Record<string, number> = { all: rows.length };
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const shown = rows.filter((r) => wanted === "all" || r.status === wanted);

  const authorIds = [...new Set(shown.map((r) => r.author_id))];
  const openAuthors = [...new Set(shown.filter((r) => r.status === "open").map((r) => r.author_id))];
  const [{ data: profiles }, { data: masters }, emails] = await Promise.all([
    authorIds.length
      ? db.from("profiles").select("id, display_name, username").in("id", authorIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string | null; username: string | null }[] }),
    authorIds.length
      ? db.from("master_profiles").select("profile_id, display_name").in("profile_id", authorIds)
      : Promise.resolve({ data: [] as { profile_id: string; display_name: string | null }[] }),
    Promise.all(
      openAuthors.map(async (id) => {
        const { data: account } = await db.auth.admin.getUserById(id);
        return [id, account?.user?.email ?? null] as const;
      }),
    ),
  ]);

  const names = new Map<string, { name: string | null; handle: string | null }>();
  for (const p of profiles ?? []) names.set(p.id, { name: p.display_name, handle: p.username });
  for (const m of masters ?? []) {
    const known = names.get(m.profile_id);
    if (m.display_name) names.set(m.profile_id, { name: m.display_name, handle: known?.handle ?? null });
  }
  const emailOf = new Map(emails);

  const tickets: TicketView[] = shown.map((r) => ({
    id: r.id,
    authorId: r.author_id,
    authorRole: r.author_role === "master" ? "master" : "client",
    authorName: names.get(r.author_id)?.name ?? null,
    authorHandle: names.get(r.author_id)?.handle ?? null,
    authorEmail: emailOf.get(r.author_id) ?? null,
    bookingId: r.booking_id,
    subject: r.subject,
    message: r.message,
    status: r.status === "closed" ? "closed" : "open",
    createdAt: r.created_at,
  }));

  return (
    <AdminShell
      section="support"
      title="Pagalba"
      subtitle="Užklausos iš programėlės „Pagalba → Neradote atsakymo?“. Taisyklės žada patvirtinti gavimą per 2 darbo dienas."
      username={check.username ?? check.userId}
    >
      {error ? (
        <p role="alert" className="mb-6 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Užklausų gauti nepavyko: {error.message}
        </p>
      ) : null}
      <SupportQueue wanted={wanted} counts={counts} tickets={tickets} />
    </AdminShell>
  );
}
