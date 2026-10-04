import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { getErrorIssue } from "@/lib/sentry";
import { AdminShell } from "../../AdminShell";
import { MfaNotice } from "../../MfaNotice";
import { ErrorDetail, SentryNotice } from "../ErrorList";

/*
 * Viena klaidų grupė ir jos naujausias įvykis (Gloumi #29). Nežinomas ar ne
 * programėlės projekto ID — 404, kaip ir kitur portale.
 */
export const dynamic = "force-dynamic";

export default async function ErrorPage({ params }: { params: Promise<{ id: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { id } = await params;
  const result = await getErrorIssue(id);
  if (!result.ok && result.failure === "not_found") notFound();

  return (
    <AdminShell
      section="errors"
      title={result.ok ? `Klaida ${result.data.issue.shortId}` : "Klaida"}
      back={{ href: "/admin/errors", label: "Klaidos" }}
      username={check.username ?? check.userId}
    >
      {result.ok ? (
        <ErrorDetail issue={result.data.issue} event={result.data.event} />
      ) : (
        <SentryNotice failure={result.failure} />
      )}
    </AdminShell>
  );
}
