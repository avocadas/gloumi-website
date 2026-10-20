import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { callMfaResetAdmin, maskEmail, mfaResetEnabled, type MfaResetRow } from "@/lib/mfa-reset";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { MfaResetDesk } from "./MfaResetDesk";

/*
 * 2FA pagalba (security procedūra 2026-10-18, 5.3): žmogus be telefono ir be
 * atkūrimo kodų rašo support@, administratorius čia atidaro prašymą, savininkas
 * patvirtina kodą iš laiško gloumi.lt/2fa-pagalba, o praėjus laukimui (72 val.
 * arba 7 d.) čia paspaudžiamas „Nuimti 2FA“.
 *
 * Toje pačioje eilėje – ir paskyros atkūrimas be el. pašto (variantas A,
 * security 2026-10-18): jį pradeda pats žmogus programėlėje, čia jis tik
 * įvykdomas („Atkurti paskyrą“).
 *
 * Eilė ateina iš Edge `mfa-reset` („list“, paskutinės 90 d.): vardas, rūšis,
 * būdas, būsena ir laikai. Paskyros el. pašto portalas negauna; naujas
 * atkūrimo adresas slepiamas čia, serveryje (`maskEmail`), jei Edge atsiuntė
 * visą, todėl į naršyklę jis nepatenka.
 */
export const dynamic = "force-dynamic";

const str = (v: unknown) => (typeof v === "string" ? v : null);

function toRow(raw: unknown): MfaResetRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = str(r.id);
  if (!id) return null;
  return {
    id,
    username: str(r.username),
    kind: str(r.kind) ?? "mfa_reset",
    method: str(r.method),
    remove_mfa: r.remove_mfa === true,
    new_email_masked: str(r.new_email_masked) ?? maskEmail(str(r.new_email)),
    status: str(r.status) ?? "unknown",
    opened_by: str(r.opened_by),
    created_at: str(r.created_at),
    email_sent_at: str(r.email_sent_at),
    confirmed_at: str(r.confirmed_at),
    ready_at: str(r.ready_at),
    cancelled_at: str(r.cancelled_at),
    done_at: str(r.done_at),
  };
}

export default async function MfaResetPage() {
  if (!mfaResetEnabled()) notFound();
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  let rows: MfaResetRow[] = [];
  let loadError: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("be sesijos");
    const { status, json } = await callMfaResetAdmin(session.access_token, { action: "list" });
    const list = Array.isArray(json) ? json : Array.isArray(json?.requests) ? json.requests : null;
    if (status !== 200 || !list) throw new Error(typeof json?.error === "string" ? json.error : "paslauga neatsakė");
    rows = list.map(toRow).filter((r: MfaResetRow | null): r is MfaResetRow => r !== null);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "nežinoma klaida";
  }

  return (
    <AdminShell
      section="mfaReset"
      title="2FA pagalba"
      subtitle="2FA nuėmimas ir paskyros atkūrimas be el. pašto. Tapatybę tikrina serveris, ne mes; el. pašto ranka niekas nekeičia."
      username={check.username ?? check.userId}
    >
      {loadError ? (
        <p role="alert" className="mb-6 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Prašymų gauti nepavyko: {loadError}
        </p>
      ) : null}
      <MfaResetDesk rows={rows} />
    </AdminShell>
  );
}
