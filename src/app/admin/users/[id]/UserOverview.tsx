import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { CatalogEntry, SignedMedia } from "@/lib/admin-data";
import { columnLabel, formatDate, formatValue, formatWhen } from "../../format";
import { STROKE, SectionTitle, Tag, card } from "../../ui";
import { AccountActions } from "./AccountActions";
import { CopyButton } from "./CopyButton";
import { PhoneReveal } from "./PhoneReveal";

export type Overview = {
  user: {
    id: string;
    email: string | null;
    created_at: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
    is_admin: boolean;
    /** Ar profilyje yra telefonas – pats numeris tik per `admin_reveal_phone` (U-27). */
    has_phone?: boolean;
    profile: Record<string, unknown> | null;
    master: Record<string, unknown> | null;
  };
  counts: Record<string, number>;
};

// Telefonas – viršuje, prie el. pašto, už „Rodyti“ (K-T3, U-27); čia lieka tik, ar jis patvirtintas.
const PROFILE_FIELDS = ["display_name", "username", "bio", "phone_verified", "deletion_requested_at"];

/**
 * Laukai, kurių puslapis niekada nerodo, net jei bazė juos atsiųstų: numeris
 * matomas tik per „Rodyti“, kad kiekvienas atvėrimas būtų žurnale (U-27).
 */
const NEVER_RENDERED = new Set(["phone_number"]);
const MASTER_FIELDS = ["display_name", "specialty", "city", "bio", "verified", "subscribed_plan"];

/** Skaičių juosta: tai, ko apie žmogų klausiama pirmiausia. */
const BAND: { tbl: string; label: string }[] = [
  { tbl: "posts", label: "Įrašai" },
  { tbl: "bookings", label: "Vizitai" },
  { tbl: "reviews", label: "Atsiliepimai" },
];

export const asString = (v: unknown) => (typeof v === "string" && v ? v : null);

/** Vardas ir @vardas antgalviui — tas pats, ką rodo kortelė. */
export function identityOf(user: Overview["user"]) {
  const profile = user.profile ?? {};
  const name =
    asString(profile.display_name) ?? asString(user.master?.display_name) ?? asString(profile.username) ?? user.id;
  return { name, handle: asString(profile.username) };
}

/*
 * Vieno žmogaus apžvalga (#129) — kaip programėlės profilis: tapatybė
 * (avataras baltame guolyje, vardas, žymos), po ja skaičių juosta
 * (`SHEET.bandBg`), tada skyriai. Kompiuteryje du stulpeliai: kairėje — kas
 * tas žmogus ir ką su juo daryti, dešinėje — kas jam priklauso.
 *
 * `banned` skaičiuoja puslapis: laikrodžio skaitymas piešiant yra šalutinis
 * poveikis.
 */
export function UserOverview({
  overview,
  catalog,
  avatar,
  banned,
  restrictedUntil,
}: {
  overview: Overview;
  catalog: CatalogEntry[];
  avatar: SignedMedia | undefined;
  /** Ar dabar sustabdyta – skaičiuoja puslapis; iki kada – `user.banned_until`. */
  banned: boolean;
  /** Iki kada apribotas rezervavimas, jei apribotas dabar (#207); kitaip `null`. */
  restrictedUntil: string | null;
}) {
  const { user, counts } = overview;
  const profile = Object.fromEntries(Object.entries(user.profile ?? {}).filter(([f]) => !NEVER_RENDERED.has(f)));
  const master = user.master;
  const { name, handle } = identityOf(user);
  const owned = catalog.filter((c) => (counts[c.tbl] ?? 0) > 0);
  const profileFields = PROFILE_FIELDS.filter((f) => f in profile);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-6">
        <section className={`${card} overflow-hidden`}>
          <div className="flex items-center gap-4 p-5 sm:p-6">
            {avatar && !avatar.contentType.startsWith("video/") ? (
              // eslint-disable-next-line @next/next/no-img-element -- žr. RowCard: parašas galioja valandą, optimizatorius čia nereikalingas
              <img
                src={avatar.url}
                alt=""
                referrerPolicy="no-referrer"
                className="h-[72px] w-[72px] shrink-0 rounded-full bg-white object-cover ring-4 ring-app-mint"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white font-app-serif text-2xl text-app-faint ring-4 ring-app-mint"
              >
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-app-serif text-xl text-app-ink">{name}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {user.is_admin ? <Tag tone="dark">Administratorius</Tag> : null}
                {banned ? <Tag tone="danger">Sustabdyta iki {formatWhen(user.banned_until)}</Tag> : <Tag tone="ok">Aktyvi</Tag>}
                {restrictedUntil ? <Tag tone="warn">Rezervavimas apribotas iki {formatWhen(restrictedUntil)}</Tag> : null}
                {master ? <Tag tone="lavender">Meistras</Tag> : <Tag tone="neutral">Klientas</Tag>}
                {profile.deletion_requested_at ? <Tag tone="warn">Paprašė ištrinti</Tag> : null}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-app-band-line border-y border-app-band-line bg-app-band">
            {BAND.map((b) => (
              // `dt` pirma, kaip reikalauja `dl`; skaičius virš užrašo — `flex-col-reverse`.
              <div key={b.tbl} className="flex flex-col-reverse px-3 py-3 text-center">
                <dt className="text-[11px] text-app-muted">{b.label}</dt>
                <dd className="text-lg font-semibold tabular-nums text-app-ink">{counts[b.tbl] ?? 0}</dd>
              </div>
            ))}
          </dl>

          <dl className="divide-y divide-app-hairline px-5 sm:px-6">
            <Fact label="ID" stacked>
              <span className="min-w-0 font-mono text-xs break-all">{user.id}</span>
              <CopyButton value={user.id} label="Kopijuoti ID" />
            </Fact>
            {/* Administratoriaus adresas atsitiktinis ir yra apsaugos dalis (#105) — jo nerodome. */}
            {!user.is_admin ? (
              <Fact label="El. paštas" stacked>
                <span className="min-w-0 break-all">{formatValue(user.email)}</span>
                {user.email ? <CopyButton value={user.email} label="Kopijuoti el. paštą" /> : null}
              </Fact>
            ) : null}
            {/* K-T3 (developeris 2026-10-05): skubiu atveju administratorius skambina; numeris – tik paspaudus (U-27). */}
            {user.has_phone && !user.is_admin ? (
              <Fact label="Telefonas" stacked>
                <PhoneReveal userId={user.id} />
              </Fact>
            ) : null}
            <Fact label="Sukurta" stacked>{formatDate(user.created_at)}</Fact>
            <Fact label="Paskutinis prisijungimas" stacked>{formatDate(user.last_sign_in_at)}</Fact>
          </dl>
        </section>

        {user.is_admin ? (
          <p className="px-1 text-sm text-app-muted">Administratorių paskyros portale neblokuojamos ir netrinamos.</p>
        ) : (
          <AccountActions
            userId={user.id}
            banned={banned}
            bannedUntil={banned ? user.banned_until : null}
            restrictedUntil={restrictedUntil}
            confirmName={handle ?? "IŠTRINTI"}
            isMaster={Boolean(master)}
          />
        )}
      </div>

      <div className="space-y-6">
        <section>
          <SectionTitle
            accent="content"
            title="Kas su šia paskyra susiję"
            note="Paspaudus atsidaro lentelė, kurioje rodomos tik šio žmogaus eilutės."
          />
          {owned.length === 0 ? (
            <p className={`${card} p-5 text-sm text-app-muted`}>Nieko.</p>
          ) : (
            <ul className={`${card} divide-y divide-app-hairline overflow-hidden`}>
              {owned.map((c) => (
                <li key={c.tbl}>
                  <a
                    href={`/admin/data?table=${encodeURIComponent(c.tbl)}&owner=${user.id}`}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-app-surface"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-app-ink">{c.label}</span>
                    <span className="rounded-full bg-app-band px-2.5 py-0.5 text-xs font-bold tabular-nums text-app-ink">
                      {counts[c.tbl]}
                    </span>
                    <ChevronRight
                      size={18}
                      strokeWidth={STROKE}
                      aria-hidden
                      className="shrink-0 text-app-faint transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Administratorius profilio neturi (#105) — tuščios kortelės nerodome. */}
        {profileFields.length > 0 ? (
          <section>
            <SectionTitle accent="account" title="Profilis" />
            <dl className={`${card} divide-y divide-app-hairline px-5`}>
              {profileFields.map((f) => (
                <Fact key={f} label={columnLabel(f)} column={f}>
                  {formatValue(profile[f])}
                </Fact>
              ))}
            </dl>
          </section>
        ) : null}

        {master ? (
          <section>
            <SectionTitle accent="account" title="Meistro profilis" />
            <dl className={`${card} divide-y divide-app-hairline px-5`}>
              {MASTER_FIELDS.filter((f) => f in master).map((f) => (
                <Fact key={f} label={columnLabel(f)} column={f}>
                  {formatValue(master[f])}
                </Fact>
              ))}
            </dl>
          </section>
        ) : null}

        <details className={`${card} group overflow-hidden`}>
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-app-ink [&::-webkit-details-marker]:hidden">
            Visi laukai
            <ChevronDown
              size={18}
              strokeWidth={STROKE}
              aria-hidden
              className="text-app-faint transition-transform group-open:rotate-180"
            />
          </summary>
          <dl className="divide-y divide-app-hairline border-t border-app-hairline px-5 text-xs">
            {Object.entries(profile).map(([f, v]) => (
              <Fact key={`p-${f}`} label={`profiles.${f}`} mono>
                {formatValue(v)}
              </Fact>
            ))}
            {master
              ? Object.entries(master).map(([f, v]) => (
                  <Fact key={`m-${f}`} label={`master_profiles.${f}`} mono>
                    {formatValue(v)}
                  </Fact>
                ))
              : null}
          </dl>
        </details>
      </div>
    </div>
  );
}

/** Viena eilutė „pavadinimas — reikšmė", kaip programėlės meniu eilutės. */
function Fact({
  label,
  column,
  mono,
  stacked,
  children,
}: {
  label: string;
  column?: string;
  mono?: boolean;
  /** Siaurame stulpelyje etiketė virš reikšmės: šalia jos reikšmei nelieka vietos. */
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`grid grid-cols-1 gap-1 py-3 ${stacked ? "" : "sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4"}`}>
      <dt className={mono ? "font-mono text-[11px] text-app-faint" : "text-[13px] text-app-muted"} title={column}>
        {label}
      </dt>
      <dd className="flex min-w-0 items-center gap-2 text-sm whitespace-pre-wrap break-words text-app-ink">{children}</dd>
    </div>
  );
}
