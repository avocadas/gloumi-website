import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronLeft, IconLock, IconLogOut } from "@/components/icons";
import { checkAdmin } from "@/lib/admin-guard";
import { NavDrawer } from "./NavDrawer";
import { ALL_ITEMS, BOTTOM_KEYS, NAV_GROUPS, type NavItem, type Section } from "./nav";
import { loadQueueCounts, type QueueCounts } from "./queue-counts";
import { signOutAdmin } from "./sign-out";
import { Brand, Bubbles, STROKE, type Tone } from "./ui";

export type { Section } from "./nav";

/*
 * Bendras portalo karkasas (design `admin-portalas.md` 1, 3; developeris
 * 2026-10-20 „design tinka, darom dabar“).
 *
 * Kompiuteryje (≥ 1024 px) – šoninė juosta, 248 px: visi skyriai trimis
 * grupėmis, eilių skaičiai, apačioje vardas, slaptažodis ir „Atsijungti“.
 * Telefone – viršuje juosta su ☰ (ta pati juosta kaip lapas), apačioje 4
 * dažniausios eilės.
 *
 * Antgalvis: pastelinis laukas su burbulais – tik Apžvalgoje; kitur – puslapio
 * fonas, antraštė serifu ir vienas sakinys po ja.
 *
 * Rodomas vardas, ne el. paštas: administratoriaus adresas atsitiktinis ir
 * yra apsaugos dalis (`admin-guard.ts`). Atsijungimas – forma, ne `onClick`:
 * veikia ir be JavaScript.
 *
 * Eilių skaičiai: `checkAdmin` ir `loadQueueCounts` – su `cache`, tad per
 * užklausą vyksta po kartą, nors klausia ir puslapis.
 */
export async function AdminShell({
  section,
  title,
  subtitle,
  username,
  back,
  children,
}: {
  section: Section;
  /** Nebenaudojamas (buvo skyriaus pastelė); paliktas suderinamumui. */
  tone?: Tone;
  title: string;
  subtitle?: string;
  username: string;
  back?: { href: string; label: string };
  children: ReactNode;
}) {
  const check = await checkAdmin();
  const counts: QueueCounts | null = check.ok ? await loadQueueCounts(check.userId) : null;
  const initial = username.replace(/^admin\./, "").charAt(0).toUpperCase() || "A";
  const hero = section === "overview";

  const sideNav = <SideNav section={section} counts={counts} />;

  return (
    <div className="flex flex-1 flex-col bg-app-sheet font-app-sans text-app-ink lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* Kompiuteris: šoninė juosta. */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-app-hairline bg-white lg:flex">
        <div className="px-5 pt-6 pb-2">
          <Link href="/admin" aria-label="Gloumi administravimas — Apžvalga">
            <Brand />
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{sideNav}</div>
        <AccountFooter username={username} initial={initial} section={section} />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Telefonas ir planšetė: viršutinė juosta. */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-app-hairline bg-white/95 px-2 backdrop-blur lg:hidden">
          <NavDrawer>
            {sideNav}
            <AccountFooter username={username} initial={initial} section={section} />
          </NavDrawer>
          <Link href="/admin" aria-label="Gloumi administravimas — Apžvalga" className="min-w-0">
            <Brand />
          </Link>
          <Link
            href="/admin/password"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-sm font-bold text-app-accent"
            aria-label={`${username} – paskyra ir slaptažodis`}
          >
            {initial}
          </Link>
        </div>

        <header className={`relative ${hero ? "overflow-hidden bg-app-lavender" : ""}`}>
          {hero ? <Bubbles tone="lavender" /> : null}
          <div className={`relative mx-auto w-full max-w-[1040px] px-4 sm:px-8 ${hero ? "pt-10 pb-14" : "pt-6 pb-2 lg:pt-10"}`}>
            {back ? (
              <Link
                href={back.href}
                className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-app-ink/80 hover:text-app-ink"
              >
                <IconChevronLeft size={16} strokeWidth={STROKE} aria-hidden />
                {back.label}
              </Link>
            ) : null}
            <h1 className="font-app-serif text-[26px] leading-tight text-app-ink sm:text-[28px]">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-sm text-app-muted">{subtitle}</p> : null}
          </div>
        </header>

        <main className={`relative flex-1 ${hero ? "-mt-4 rounded-t-[24px] bg-app-sheet" : ""}`}>
          <div className="mx-auto w-full max-w-[1040px] px-4 pt-6 pb-28 sm:px-8 lg:pb-16">{children}</div>
        </main>

        <BottomBar section={section} counts={counts} />
      </div>
    </div>
  );
}

function SideNav({ section, counts }: { section: Section; counts: QueueCounts | null }) {
  return (
    <nav aria-label="Portalo skyriai" className="px-3 pb-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="mt-6 first:mt-3">
          <p className="px-3 text-xs font-semibold text-app-muted">{group.title}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => (
              <li key={item.key}>
                <NavLink item={item} active={item.key === section} n={item.count ? (counts?.[item.count] ?? null) : null} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NavLink({ item, active, n }: { item: NavItem; active: boolean; n: number | null }) {
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-app-accent/40 focus-visible:outline-none ${
        active ? "bg-app-accent-soft font-semibold text-app-accent" : "font-medium text-app-ink hover:bg-app-input"
      }`}
    >
      <Icon size={18} strokeWidth={STROKE} aria-hidden className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {n ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-app-accent px-1.5 text-xs font-bold tabular-nums text-white">
          {n}
          <span className="sr-only"> laukia</span>
        </span>
      ) : null}
    </Link>
  );
}

function AccountFooter({ username, initial, section }: { username: string; initial: string; section: Section }) {
  return (
    <div className="border-t border-app-hairline px-4 py-3">
      {/* Vardas – atskira eilutė: šalia veiksmų jis nukirpdavo iki „ad…“ (design). */}
      <p className="flex min-w-0 items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-xs font-bold text-app-accent">
          {initial}
        </span>
        <span className="min-w-0 truncate text-[13px] font-semibold text-app-ink" title={username}>
          {username}
        </span>
      </p>
      <div className="mt-2 flex items-center gap-1">
        <Link
          href="/admin/password"
          aria-current={section === "account" ? "page" : undefined}
          title="Keisti slaptažodį"
          className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold text-app-muted hover:bg-app-input hover:text-app-ink"
        >
          <IconLock size={17} strokeWidth={STROKE} aria-hidden />
          Slaptažodis
        </Link>
        <form action={signOutAdmin}>
          <button
            type="submit"
            title="Atsijungti"
            className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold text-app-ink hover:bg-app-input"
          >
            <IconLogOut size={17} strokeWidth={STROKE} aria-hidden />
            Atsijungti
          </button>
        </form>
      </div>
    </div>
  );
}

/** Telefono apačia: 4 dažniausios eilės, skaičius – taškas ant ikonos (1.3). */
function BottomBar({ section, counts }: { section: Section; counts: QueueCounts | null }) {
  const items = BOTTOM_KEYS.map((k) => ALL_ITEMS.find((i) => i.key === k)!);
  return (
    <nav
      aria-label="Dažniausios eilės"
      className="fixed inset-x-3 bottom-3 z-40 flex h-16 items-center gap-1 rounded-3xl bg-white p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-app-bar lg:hidden"
    >
      {items.map((item) => {
        const active = item.key === section;
        const n = item.count ? (counts?.[item.count] ?? 0) : 0;
        const { Icon } = item;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[11px] transition-colors ${
              active ? "bg-app-accent-soft font-bold text-app-accent" : "font-medium text-app-muted"
            }`}
          >
            <span className="relative">
              <Icon size={20} strokeWidth={STROKE} aria-hidden />
              {n ? (
                <span className="absolute -top-1.5 -right-2.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-app-accent px-1 text-[10px] font-bold tabular-nums text-white">
                  {n}
                  <span className="sr-only"> laukia</span>
                </span>
              ) : null}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
