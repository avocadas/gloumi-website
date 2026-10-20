import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { ERROR_PERIODS, listErrorIssues } from "@/lib/sentry";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { ErrorList } from "./ErrorList";

/*
 * Programėlės klaidos (Gloumi #29): ką Sentry gavo iš production build'ų.
 * Tik skaitymas; kokiu raktu ir kokius laukus imame — `src/lib/sentry.ts`.
 * Numatytai — neišspręstos per 7 dienas.
 */
export const dynamic = "force-dynamic";

export default async function ErrorsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; state?: string }>;
}) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { period, state } = await searchParams;
  const wantedPeriod = ERROR_PERIODS.find((p) => p === period) ?? "7d";
  const wantedState = state === "all" ? "all" : "unresolved";
  const result = await listErrorIssues(wantedPeriod, wantedState === "unresolved");

  return (
    <AdminShell
      section="errors"
      title="Klaidos"
      subtitle="Programėlės klaidos iš Sentry – tik skaitymas, be naudotojų duomenų."
      username={check.username ?? check.userId}
    >
      <ErrorList period={wantedPeriod} state={wantedState} result={result} />
    </AdminShell>
  );
}
