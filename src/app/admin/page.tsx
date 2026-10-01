import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ReportView } from "./ReportCard";
import { ReportQueue, STATUS_LABEL } from "./ReportQueue";
import { MfaNotice } from "./MfaNotice";
import { AdminShell } from "./AdminShell";

/**
 * Moderation queue.
 *
 * WHY THIS PAGE READS TABLES DIRECTLY INSTEAD OF CALLING `admin_list_reports`
 * --------------------------------------------------------------------------
 * That RPC exists and works — but it guards itself with `is_admin(auth.uid())`,
 * and with a service-role key `auth.uid()` is NULL. It was written for the
 * phone, where the caller had a session. Here the caller is a server, and its
 * identity was established one layer up by `checkAdmin()`. Calling the RPC
 * would mean forwarding the operator's JWT, which would undo the whole reason
 * destructive work happens server-side.
 *
 * Writes are the opposite: they go through `admin_moderate()` precisely
 * because it also writes the audit row in the same transaction.
 *
 * WHY A NON-ADMIN GETS 404 AND NOT 403
 * ------------------------------------
 * 403 confirms the page exists. For an internal tool there is no reason to
 * confirm anything to someone who should not be here.
 */
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { status = "open" } = await searchParams;
  const wanted = status in STATUS_LABEL ? status : "open";

  const db = createSupabaseAdminClient();

  /*
   * Kiek kiekvienoje būsenoje — `head: true` skaičiuoja, eilučių nesiunčia.
   * Be skaičių žmogus turėtų atidaryti kiekvieną būseną, kad sužinotų, ar
   * ten išvis kas nors yra.
   */
  const countOf = (s: string) =>
    db.from("content_reports").select("id", { count: "exact", head: true }).eq("status", s);

  const [{ data: reports }, ...counted] = await Promise.all([
    db
      .from("content_reports")
      .select("id, reporter_id, target_type, target_id, reason, details, created_at, status")
      .eq("status", wanted)
      .order("created_at", { ascending: false })
      .limit(100),
    ...Object.keys(STATUS_LABEL).map(countOf),
  ]);
  const counts = Object.fromEntries(Object.keys(STATUS_LABEL).map((s, i) => [s, counted[i].count ?? null]));

  const rows = reports ?? [];

  /*
   * Reporter names and content previews are fetched in TWO batched queries,
   * not one per row. With a hundred reports the per-row shape would be two
   * hundred round trips, and the page would be slower than the thing it is
   * moderating.
   */
  const reporterIds = [...new Set(rows.map((r) => r.reporter_id).filter(Boolean))];
  const postIds = rows.filter((r) => r.target_type === "post").map((r) => r.target_id);
  const commentIds = rows.filter((r) => r.target_type === "comment").map((r) => r.target_id);

  const [{ data: reporters }, { data: posts }, { data: comments }] = await Promise.all([
    reporterIds.length
      ? db.from("profiles").select("id, display_name, username").in("id", reporterIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string | null; username: string | null }[] }),
    postIds.length
      ? db.from("posts").select("id, service_title, description, master_id").in("id", postIds)
      : Promise.resolve({ data: [] as { id: string; service_title: string | null; description: string | null; master_id: string }[] }),
    commentIds.length
      ? db.from("post_comments").select("id, body, author_id").in("id", commentIds)
      : Promise.resolve({ data: [] as { id: string; body: string | null; author_id: string }[] }),
  ]);

  const reporterById = new Map((reporters ?? []).map((p) => [p.id, p]));
  const postById = new Map((posts ?? []).map((p) => [p.id, p]));
  const commentById = new Map((comments ?? []).map((c) => [c.id, c]));

  const views: ReportView[] = rows.map((r) => {
    const post = postById.get(r.target_id);
    const comment = commentById.get(r.target_id);
    const reporter = reporterById.get(r.reporter_id);
    return {
      id: r.id,
      targetType: r.target_type,
      targetId: r.target_id,
      reason: r.reason,
      details: r.details,
      createdAt: r.created_at,
      status: r.status,
      reporterName: reporter?.display_name || reporter?.username || null,
      reporterId: r.reporter_id ?? null,
      // NULL preview means the content is already gone — that is information,
      // not a gap, and the card says so rather than showing an empty box.
      preview:
        post ? [post.service_title, post.description].filter(Boolean).join(" · ") || null
        : comment ? comment.body
        : null,
      authorId: post?.master_id ?? comment?.author_id ?? null,
    };
  });

  return (
    <AdminShell
      section="reports"
      title="Skundai"
      subtitle="Ką naudotojai pranešė apie įrašus, komentarus ir paskyras."
      username={check.username ?? check.userId}
    >
      <ReportQueue wanted={wanted} counts={counts} views={views} />
    </AdminShell>
  );
}
