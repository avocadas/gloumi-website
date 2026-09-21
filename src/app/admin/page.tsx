import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ReportCard, type ReportView } from "./ReportCard";
import { MfaNotice } from "./MfaNotice";

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

const STATUS_LABEL: Record<string, string> = {
  open: "Atviri",
  reviewed: "Peržiūrėti",
  dismissed: "Atmesti",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required") return <MfaNotice />;
    notFound();
  }

  const { status = "open" } = await searchParams;
  const wanted = status in STATUS_LABEL ? status : "open";

  const db = createSupabaseAdminClient();

  const { data: reports } = await db
    .from("content_reports")
    .select("id, reporter_id, target_type, target_id, reason, details, created_at, status")
    .eq("status", wanted)
    .order("created_at", { ascending: false })
    .limit(100);

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
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">
          Gloumi
        </p>
        <h1 className="mt-1 font-serif text-3xl text-espresso-900">Moderavimas</h1>
        <p className="mt-2 text-sm text-espresso-500">
          Prisijungęs: {check.email ?? check.userId}
        </p>
      </header>

      <nav className="mb-6 flex gap-2">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <a
            key={key}
            href={`/admin?status=${key}`}
            className={
              key === wanted
                ? "rounded-full bg-espresso-900 px-4 py-2 text-sm font-semibold text-cream-50"
                : "rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-espresso-600 hover:bg-sand-100"
            }
          >
            {label}
          </a>
        ))}
      </nav>

      {views.length === 0 ? (
        <p className="rounded-2xl border border-sand-300 bg-cream-50 p-8 text-center text-sm text-espresso-500">
          Šioje būsenoje pranešimų nėra.
        </p>
      ) : (
        <ul className="space-y-4">
          {views.map((v) => (
            <li key={v.id}>
              <ReportCard report={v} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
