import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { loadCatalog, signMedia } from "@/lib/admin-data";
import { AdminHeader } from "../../AdminHeader";
import { MfaNotice } from "../../MfaNotice";
import { formatDate, formatValue, UUID_PATTERN } from "../../format";
import { AccountActions } from "./AccountActions";

/*
 * Vieno žmogaus apžvalga (#129): kas jis, ir kiek ko sukūrė kiekvienoje
 * lentelėje — su nuoroda į naršyklę, kurioje tos eilutės filtruotos pagal jį.
 * Iš čia paskyrą galima užblokuoti arba ištrinti visą.
 *
 * Duomenys ateina iš `admin_user_overview`, kuri meistro profilyje IBAN,
 * mokesčių kodo ir Stripe paskyros negrąžina iš viso.
 */
export const dynamic = "force-dynamic";

type Overview = {
  user: {
    id: string;
    email: string | null;
    created_at: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
    is_admin: boolean;
    profile: Record<string, unknown> | null;
    master: Record<string, unknown> | null;
  };
  counts: Record<string, number>;
};

const PROFILE_FIELDS = ["display_name", "username", "bio", "phone_number", "phone_verified", "deletion_requested_at"];
const MASTER_FIELDS = ["display_name", "specialty", "city", "bio", "verified", "subscribed_plan"];

// Atskirai nuo komponento: laikrodžio skaitymas piešiant yra šalutinis poveikis.
const isBanned = (until: string | null) => !!until && new Date(until).getTime() > Date.now();

const asString = (v: unknown) => (typeof v === "string" && v ? v : null);

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

  if (!overview) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <AdminHeader title="Paskyra" username={username} active="data" />
        <p className="rounded-2xl border border-sand-300 bg-cream-50 p-8 text-center text-sm text-espresso-500">
          Tokios paskyros nėra — gal ji jau ištrinta.
        </p>
      </main>
    );
  }

  const { user, counts } = overview;
  const profile = user.profile ?? {};
  const master = user.master;
  const avatarId = asString(master?.avatar_media_id) ?? asString(profile.avatar_media_id);
  const media = avatarId ? await signMedia(check.userId, [avatarId]) : {};
  const avatar = avatarId ? media[avatarId] : undefined;

  const name =
    asString(profile.display_name) ?? asString(master?.display_name) ?? asString(profile.username) ?? user.id;
  const handle = asString(profile.username);
  const banned = isBanned(user.banned_until);
  const owned = catalog.filter((c) => (counts[c.tbl] ?? 0) > 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <AdminHeader title="Paskyra" username={username} active="data" />

      <a href="/admin/data?table=profiles" className="text-sm font-semibold text-terracotta-600 hover:underline">
        ← Paskyros
      </a>

      <section className="mt-4 rounded-2xl border border-sand-300 bg-cream-50 p-5">
        <div className="flex items-center gap-4">
          {avatar && !avatar.contentType.startsWith("video/") ? (
            // eslint-disable-next-line @next/next/no-img-element -- žr. RowCard: parašas galioja valandą, optimizatorius čia nereikalingas
            <img
              src={avatar.url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-full bg-sand-200 object-cover"
            />
          ) : (
            <span className="h-16 w-16 shrink-0 rounded-full bg-sand-200" aria-hidden />
          )}
          <div className="min-w-0">
            <h2 className="truncate font-serif text-2xl text-espresso-900">{name}</h2>
            <p className="text-sm text-espresso-500">{handle ? `@${handle}` : "be naudotojo vardo"}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
          {user.is_admin ? <span className="rounded bg-espresso-900 px-2 py-1 text-cream-50">Administratorius</span> : null}
          {banned ? (
            <span className="rounded bg-terracotta-600 px-2 py-1 text-white">Užblokuota</span>
          ) : (
            <span className="rounded bg-sand-200 px-2 py-1 text-espresso-700">Aktyvi</span>
          )}
          {master ? <span className="rounded bg-sand-200 px-2 py-1 text-espresso-700">Meistras</span> : null}
          {profile.deletion_requested_at ? (
            <span className="rounded bg-sand-200 px-2 py-1 text-espresso-700">Paprašė ištrinti</span>
          ) : null}
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]">
          <dt className="font-semibold text-espresso-600">ID</dt>
          <dd className="min-w-0 break-words text-espresso-900">{user.id}</dd>
          {/* Administratoriaus adresas atsitiktinis ir yra apsaugos dalis (#105) — jo nerodome. */}
          {!user.is_admin ? (
            <>
              <dt className="font-semibold text-espresso-600">El. paštas</dt>
              <dd className="min-w-0 break-words text-espresso-900">{formatValue(user.email)}</dd>
            </>
          ) : null}
          <dt className="font-semibold text-espresso-600">Sukurta</dt>
          <dd className="text-espresso-900">{formatDate(user.created_at)}</dd>
          <dt className="font-semibold text-espresso-600">Paskutinis prisijungimas</dt>
          <dd className="text-espresso-900">{formatDate(user.last_sign_in_at)}</dd>
          {PROFILE_FIELDS.filter((f) => f in profile).map((f) => (
            <Field key={`p-${f}`} label={f} value={profile[f]} />
          ))}
        </dl>

        {master ? (
          <>
            <h3 className="mt-6 font-serif text-lg text-espresso-900">Meistro profilis</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]">
              {MASTER_FIELDS.filter((f) => f in master).map((f) => (
                <Field key={`m-${f}`} label={f} value={master[f]} />
              ))}
            </dl>
          </>
        ) : null}

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-espresso-600">Visi laukai</summary>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-[minmax(0,12rem)_1fr]">
            {Object.entries(profile).map(([f, v]) => (
              <Field key={`ap-${f}`} label={`profiles.${f}`} value={v} />
            ))}
            {master
              ? Object.entries(master).map(([f, v]) => (
                  <Field key={`am-${f}`} label={`master_profiles.${f}`} value={v} />
                ))
              : null}
          </dl>
        </details>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl text-espresso-900">Kas su šia paskyra susiję</h2>
        {owned.length === 0 ? (
          <p className="mt-2 text-sm text-espresso-500">Nieko.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {owned.map((c) => (
              <li key={c.tbl}>
                <a
                  href={`/admin/data?table=${encodeURIComponent(c.tbl)}&owner=${user.id}`}
                  className="inline-block rounded-full border border-sand-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-espresso-700 hover:bg-sand-100"
                >
                  {c.label}: {counts[c.tbl]}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {user.is_admin ? (
        <p className="mt-8 text-sm text-espresso-500">
          Administratorių paskyros portale neblokuojamos ir netrinamos.
        </p>
      ) : (
        <AccountActions userId={user.id} banned={banned} confirmName={handle ?? "IŠTRINTI"} />
      )}
    </main>
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <>
      <dt className="font-semibold text-espresso-600">{label}</dt>
      <dd className="min-w-0 whitespace-pre-wrap break-words text-espresso-900">{formatValue(value)}</dd>
    </>
  );
}
