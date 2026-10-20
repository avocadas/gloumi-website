import Link from "next/link";
import { notFound } from "next/navigation";
import { IconShieldCheck } from "@/components/icons";
import { checkAdmin } from "@/lib/admin-guard";
import { signMedia } from "@/lib/admin-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { EmptyState, STROKE, chip, chipActive } from "../ui";
import { ReviewCard, type ReviewView } from "./ReviewCard";

/*
 * Turinio peržiūra (#230, LV 4; Apple gairė 1.2). Filtras prieš paskelbimą
 * (`guard_content_filter`, Gloumi `20261020102439`) sulaiko tekstą, o kai
 * kategorija leidžia, autorius programėlėje paspaudžia „Paprašyti peržiūros“.
 * Prašymas atsiduria čia, ir sprendžia žmogus: „Leisti skelbti“ arba „Atmesti“.
 *
 * Eilė – iš `admin_content_review_list` (Gloumi `20261020121647`; senesni
 * pirmi, iki 200). Autoriaus vardas – iš `profiles`, servisiniu raktu, kaip
 * pagalbos eilėje. Tekstas – naudotojo, rodomas kaip tekstas, ne HTML.
 *
 * Nuotraukos ir vaizdo įrašai (Gloumi `20261020124647`): telefone modelis
 * įspėja (`media_warn`) arba blokuoja (`media_requested`, autorius paprašė
 * peržiūros); medija kol kas privati ir matoma tik autoriui. Ji pasirašoma
 * per `admin-media-urls` (galioja valandą) ir kortelėje rodoma užtamsinta,
 * kol administratorius pats jos neatidengia.
 */
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  open: "Laukia",
  approved: "Leista",
  rejected: "Atmesta",
};

type Row = {
  id: string;
  author_id: string;
  context: string;
  body: string;
  category: string;
  status: string;
  created_at: string;
  decided_at: string | null;
  note: string | null;
  /* 20261020124647: `text` | `media_warn` | `media_requested`; medijai `context`, `body`, `category` – null. */
  kind?: string | null;
  media_id?: string | null;
  media_type?: string | null;
  content_type?: string | null;
  model_version?: string | null;
};

export default async function ContentReviewPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  const { status = "open" } = await searchParams;
  const wanted = status in STATUS_LABEL ? status : "open";

  const db = createSupabaseAdminClient();
  const [{ data, error }, ...counted] = await Promise.all([
    db.rpc("admin_content_review_list", { _admin_id: check.userId, _status: wanted, _limit: 200 }),
    ...Object.keys(STATUS_LABEL).map((s) =>
      db.from("content_review_requests").select("id", { count: "exact", head: true }).eq("status", s),
    ),
  ]);
  const counts = Object.fromEntries(Object.keys(STATUS_LABEL).map((s, i) => [s, counted[i].count ?? null]));
  const rows = (Array.isArray(data) ? data : []) as Row[];

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: profiles } = authorIds.length
    ? await db.from("profiles").select("id, display_name, username").in("id", authorIds)
    : { data: [] as { id: string; display_name: string | null; username: string | null }[] };
  const names = new Map((profiles ?? []).map((p) => [p.id, p]));
  // Pasirašoma tik laukiančių prašymų medija: išspręstos jau arba vieša, arba ištrinta.
  const signed = await signMedia(
    check.userId,
    rows.filter((r) => r.status === "open" && r.media_id).map((r) => r.media_id as string),
  );

  const views: ReviewView[] = rows.map((r) => ({
    id: r.id,
    authorId: r.author_id,
    authorName: names.get(r.author_id)?.display_name ?? null,
    authorHandle: names.get(r.author_id)?.username ?? null,
    kind: r.kind ?? "text",
    context: r.context,
    body: r.body,
    category: r.category,
    mediaType: r.media_type ?? null,
    modelVersion: r.model_version ?? null,
    media: r.media_id ? (signed[r.media_id] ?? null) : null,
    status: r.status,
    createdAt: r.created_at,
    decidedAt: r.decided_at,
    note: r.note,
  }));

  return (
    <AdminShell
      section="reports"
      title="Turinio peržiūra"
      subtitle="Tekstai, nuotraukos ir vaizdo įrašai, kuriuos sulaikė patikra prieš paskelbimą. Sprendžia žmogus."
      username={check.username ?? check.userId}
      back={{ href: "/admin", label: "Skundai" }}
    >
      <nav aria-label="Peržiūros būsena" className="mb-6 flex flex-wrap gap-2">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/content-review?status=${key}`}
            aria-current={key === wanted ? "page" : undefined}
            className={key === wanted ? chipActive : chip}
          >
            {label}
            {counts[key] !== null ? (
              <span className="rounded-full bg-app-band px-2 py-0.5 text-xs font-bold tabular-nums text-app-ink">
                {counts[key]}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {error ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error.code === "PGRST202"
            ? "Turinio peržiūra bazėje dar neįjungta (migracija nepritaikyta)."
            : `Prašymų gauti nepavyko: ${error.message}`}
        </p>
      ) : views.length === 0 ? (
        <EmptyState tone="rose" icon={<IconShieldCheck size={24} strokeWidth={STROKE} aria-hidden />} title="Tuščia">
          {wanted === "open" ? "Peržiūros niekas nelaukia." : "Šioje būsenoje prašymų nėra."}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {views.map((view) => (
            <ReviewCard key={view.id} view={view} />
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
