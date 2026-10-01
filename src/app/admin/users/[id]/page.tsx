import { notFound } from "next/navigation";
import { UserX } from "lucide-react";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { loadCatalog, signMedia } from "@/lib/admin-data";
import { AdminShell } from "../../AdminShell";
import { MfaNotice } from "../../MfaNotice";
import { UUID_PATTERN } from "../../format";
import { EmptyState, STROKE } from "../../ui";
import { UserOverview, asString, identityOf, type Overview } from "./UserOverview";

/*
 * Vieno žmogaus apžvalga (#129): kas jis, ir kiek ko sukūrė kiekvienoje
 * lentelėje — su nuoroda į naršyklę, kurioje tos eilutės filtruotos pagal jį.
 * Iš čia paskyrą galima užblokuoti arba ištrinti visą.
 *
 * Duomenys ateina iš `admin_user_overview`, kuri meistro profilyje IBAN,
 * mokesčių kodo ir Stripe paskyros negrąžina iš viso. Šis failas tik gauna
 * duomenis; išdėstymas — `UserOverview`.
 */
export const dynamic = "force-dynamic";

// Atskirai nuo komponento: laikrodžio skaitymas piešiant yra šalutinis poveikis.
const isBanned = (until: string | null) => !!until && new Date(until).getTime() > Date.now();

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const db = createSupabaseAdminClient();
  const [{ data, error }, catalog] = await Promise.all([
    db.rpc("admin_user_overview", { _admin_id: check.userId, _user_id: id }),
    loadCatalog(),
  ]);
  const overview = error ? null : (data as Overview);
  const username = check.username ?? check.userId;
  const back = { href: "/admin/data?table=profiles", label: "Paskyros" };

  if (!overview) {
    return (
      <AdminShell section="data" tone="mint" title="Paskyra" username={username} back={back}>
        <EmptyState tone="mint" icon={<UserX size={24} strokeWidth={STROKE} aria-hidden />} title="Tokios paskyros nėra">
          Gal ji jau ištrinta.
        </EmptyState>
      </AdminShell>
    );
  }

  const { user } = overview;
  const avatarId = asString(user.master?.avatar_media_id) ?? asString(user.profile?.avatar_media_id);
  const media = avatarId ? await signMedia(check.userId, [avatarId]) : {};
  const { name, handle } = identityOf(user);

  return (
    <AdminShell
      section="data"
      tone="mint"
      title={name}
      subtitle={handle ? `@${handle}` : "Be naudotojo vardo"}
      username={username}
      back={back}
    >
      <UserOverview
        overview={overview}
        catalog={catalog}
        avatar={avatarId ? media[avatarId] : undefined}
        banned={isBanned(user.banned_until)}
      />
    </AdminShell>
  );
}
