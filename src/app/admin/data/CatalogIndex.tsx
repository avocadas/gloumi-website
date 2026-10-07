import { IconChevronRight } from "@/components/icons";
import type { CatalogEntry, CatalogKind } from "@/lib/admin-data";
import { STROKE, SectionTitle, btn, card } from "../ui";
import { SearchField } from "./SearchField";

const KIND_SECTION: Record<CatalogKind, { title: string; note: string; accent: "content" | "account" | "value" }> = {
  content: { title: "Turinys", note: "Galima rasti, ištrinti ir pataisyti tekstus.", accent: "content" },
  account: {
    title: "Paskyros",
    note: "Galima rasti ir pataisyti tekstus. Paskyra trinama tik visa, jos puslapyje.",
    accent: "account",
  },
  view: { title: "Tik peržiūra", note: "Pinigai, teisiniai įrašai ir žurnalas: tik žiūrėti.", accent: "value" },
};

/*
 * Lentelių grupės sąraše — tik tam, kad 51 lentelė nebūtų viena siena.
 * Ką su lentele galima daryti, vis tiek sako katalogas; lentelė, kurios čia
 * nėra, atsiduria grupėje „Kita", tad nauja katalogo eilutė portale atsiranda
 * be jokio pakeitimo šiame faile.
 */
const GROUPS: Record<CatalogKind, { title: string; tables: string[] }[]> = {
  content: [
    {
      title: "Įrašai ir Stories",
      tables: [
        "posts",
        "post_media",
        "post_comments",
        "post_likes",
        "media",
        "stories",
        "story_likes",
        "story_mentions",
        "story_views",
        "highlights",
        "highlight_items",
      ],
    },
    {
      title: "Paslaugos ir darbo laikas",
      tables: [
        "services",
        "service_addons",
        "master_service_categories",
        "master_categories",
        "flash_slots",
        "working_hours_weekly",
        "working_hours_breaks",
        "working_hours_overrides",
        "blocked_time",
        "booking_waitlist",
      ],
    },
    { title: "Atsiliepimai", tables: ["reviews", "client_reviews", "client_ratings"] },
    {
      title: "Bendravimas",
      tables: ["chats", "chat_members", "messages", "message_reactions", "notifications", "support_tickets"],
    },
    {
      title: "Ryšiai ir išsaugojimai",
      tables: [
        "follows",
        "blocked_users",
        "saved_masters",
        "saved_posts",
        "saved_collections",
        "private_notes",
        "master_client_colors",
      ],
    },
  ],
  account: [{ title: "Paskyros", tables: ["profiles", "master_profiles"] }],
  view: [
    {
      title: "Vizitai ir pinigai",
      tables: ["bookings", "booking_services", "gift_cards", "subscriptions", "app_invoices", "commission_first_visits"],
    },
    { title: "Lojalumas ir rekomendacijos", tables: ["loyalty_ledger", "referral_credits", "referrals", "referral_codes"] },
    { title: "Skundai ir žurnalas", tables: ["content_reports", "admin_audit_logs"] },
  ],
};

function groupsOf(catalog: CatalogEntry[], kind: CatalogKind) {
  const entries = catalog.filter((c) => c.kind === kind);
  const byName = new Map(entries.map((e) => [e.tbl, e]));
  const placed = new Set<string>();
  const groups = GROUPS[kind]
    .map((g) => ({
      title: g.title,
      entries: g.tables.flatMap((t) => {
        const e = byName.get(t);
        if (!e) return [];
        placed.add(t);
        return [e];
      }),
    }))
    .filter((g) => g.entries.length > 0);
  const rest = entries.filter((e) => !placed.has(e.tbl));
  if (rest.length > 0) groups.push({ title: "Kita", entries: rest });
  return groups;
}

/*
 * Naršyklės pradžia. Dažniausias kelias — rasti žmogų, tad jis pirmas ir be
 * lentelės pasirinkimo; po juo lentelės, sudėtos pagal tai, ką su jomis
 * galima daryti (katalogo `kind`), o viduje — pagal temą.
 */
export function CatalogIndex({ catalog }: { catalog: CatalogEntry[] }) {
  return (
    <div className="space-y-10">
      <section className={`${card} p-5 sm:p-6`}>
        <SectionTitle accent="account" title="Rasti naudotoją" note="Pagal vardą, @vardą ar telefono numerį." />
        <form action="/admin/data" className="flex flex-wrap gap-2">
          <input type="hidden" name="table" value="profiles" />
          <SearchField name="q" required placeholder="Vardas, @vardas ar telefonas" label="Ieškoti naudotojo" icon="search" />
          <button type="submit" className={`${btn} max-sm:w-full`}>
            Ieškoti
          </button>
        </form>
      </section>

      {(["content", "account", "view"] as CatalogKind[]).map((kind) => {
        const groups = groupsOf(catalog, kind);
        if (groups.length === 0) return null;
        const s = KIND_SECTION[kind];
        return (
          <section key={kind}>
            <SectionTitle accent={s.accent} title={s.title} note={s.note} />
            {/* Stulpeliai, ne tinklelis: grupės skirtingo ilgio, ir tinklelyje po
                trumpa kortele liktų skylė iki ilgiausios kaimynės apačios. */}
            <div className="gap-4 sm:columns-2 lg:columns-3">
              {groups.map((g) => (
                <div key={g.title} className={`${card} mb-4 break-inside-avoid overflow-hidden`}>
                  {/* Vienintelė grupė skyriumi pavadinta taip pat — antrą kartą to nekartojame. */}
                  {g.title !== s.title ? (
                    <p className="px-4 pt-4 pb-2 text-[13px] font-semibold text-app-muted">{g.title}</p>
                  ) : null}
                  <ul className="divide-y divide-app-hairline">
                    {g.entries.map((t) => (
                      <li key={t.tbl}>
                        <a
                          href={`/admin/data?table=${encodeURIComponent(t.tbl)}`}
                          className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-app-surface"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-app-ink">{t.label}</span>
                            <code className="block truncate text-[11px] text-app-faint">{t.tbl}</code>
                          </span>
                          <IconChevronRight
                            size={18}
                            strokeWidth={STROKE}
                            aria-hidden
                            className="shrink-0 text-app-faint transition-transform group-hover:translate-x-0.5"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
