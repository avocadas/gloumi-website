import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCalendarCheck } from "@/components/icons";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { formatWhen } from "../format";
import { MfaNotice } from "../MfaNotice";
import { EmptyState, STROKE, Tag, card } from "../ui";

/*
 * Rezervavimo įspėjimai (#207; Gloumi `20261005185534`): bazė juos įrašo
 * pati, kai klientas per 30 d. atšaukia 3 vizitus arba 2 kartus neatvyksta, ir
 * praneša jam programėlėje. Čia – paskutinių 90 d. sąrašas sprendimui:
 * apriboti gali tik žmogus, paskyros puslapyje („Apriboti rezervavimą“) –
 * įspėjimas pats nieko neriboja (developeris, #207).
 *
 * Skirtukas – „Skundai“: tai ta pati moderavimo darbo vieta, o atskiras
 * skirtukas telefono juostoje nebetilptų.
 */
export const dynamic = "force-dynamic";

type Warning = {
  profile_id: string;
  display_name: string | null;
  username: string | null;
  warned_at: string;
  cancellations: number;
  no_shows: number;
  restricted_until: string | null;
};

export default async function WarningsPage() {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("admin_list_booking_warnings", { _admin_id: check.userId });
  const warnings = (data ?? []) as Warning[];

  return (
    <AdminShell
      section="reports"
      title="Rezervavimo įspėjimai"
      subtitle="Klientai, kurie per 30 d. atšaukė 3 vizitus ar 2 kartus neatvyko. Apriboti gali tik žmogus – paskyros puslapyje."
      username={check.username ?? check.userId}
      back={{ href: "/admin", label: "Skundai" }}
    >
      {error ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Įspėjimų gauti nepavyko: {error.message}
        </p>
      ) : warnings.length === 0 ? (
        <EmptyState tone="rose" icon={<IconCalendarCheck size={24} strokeWidth={STROKE} aria-hidden />} title="Įspėjimų nėra">
          Per 90 dienų nė vienas klientas neviršijo atšaukimų ar neatvykimų ribos.
        </EmptyState>
      ) : (
        <ul className={`${card} divide-y divide-app-hairline`}>
          {warnings.map((w) => (
            <li key={`${w.profile_id}-${w.warned_at}`} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link href={`/admin/users/${w.profile_id}`} className="text-sm font-semibold text-app-ink hover:underline">
                  {w.display_name || (w.username ? `@${w.username}` : "Be vardo")}
                </Link>
                <p className="mt-0.5 text-[13px] text-app-muted">
                  Įspėta {formatWhen(w.warned_at)} · atšaukimai: {w.cancellations} · neatvykimai: {w.no_shows}
                </p>
              </div>
              {w.restricted_until ? (
                <Tag tone="warn">Apribota iki {formatWhen(w.restricted_until)}</Tag>
              ) : (
                <Tag tone="neutral">Neapribota</Tag>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
