import type { ReactNode } from "react";
import { ChevronLeft, Database, Flag, LifeBuoy, LogOut, Scale, type LucideIcon } from "lucide-react";
import { signOutAdmin } from "./sign-out";
import { Bubbles, Brand, FIELD_BG, STROKE, onField, type Tone } from "./ui";

type Section = "reports" | "support" | "disputes" | "data";

/*
 * Skirtukai kaip programėlės juostoje (`navigation/tabs.js`): kiekvienas turi
 * savo pastelę, ir ta pati pastelė dažo jo puslapio antgalvį — taip žmogus
 * iš spalvos žino, kur yra. Skundai — rožinė („turinys", `SECTION_FIELDS`),
 * pagalba — mėtinė (žmonių klausimai, #209), ginčai — persikinė („Vizitai",
 * pinigai ir vizitai), duomenys — levandinė.
 */
const SECTIONS: { key: Section; href: string; label: string; Icon: LucideIcon; tone: Tone }[] = [
  { key: "reports", href: "/admin", label: "Skundai", Icon: Flag, tone: "rose" },
  { key: "support", href: "/admin/support", label: "Pagalba", Icon: LifeBuoy, tone: "mint" },
  { key: "disputes", href: "/admin/disputes", label: "Ginčai", Icon: Scale, tone: "peach" },
  { key: "data", href: "/admin/data", label: "Duomenys", Icon: Database, tone: "lavender" },
];

const ACTIVE_BG: Record<Tone, string> = FIELD_BG;

/*
 * Bendras portalo puslapio karkasas (#129), sudėtas kaip programėlės ekranas
 * (`ScreenScaffold`): pastelinis laukas su skrituliais viršuje, jame —
 * pavadinimas; po juo smėlinis lapas suapvalintais kampais, užlipantis ant
 * lauko, o jame kortelės.
 *
 * Skirtukų juosta — balta kapsulė su šešėliu, kaip `TabBar`. Telefone ji
 * plaukioja apačioje, kur ją pasiekia nykštys, kompiuteryje stovi antgalvyje.
 *
 * Rodomas vardas, ne el. paštas: administratoriaus adresas atsitiktinis ir
 * yra apsaugos dalis (`admin-guard.ts`). Atsijungimas — forma, ne `onClick`:
 * veikia ir be JavaScript.
 */
export function AdminShell({
  section,
  tone,
  title,
  subtitle,
  username,
  back,
  children,
}: {
  section: Section;
  /** Antgalvio pastelė; numatytoji — skirtuko. Paskyrai — mėtinė („paskyra"). */
  tone?: Tone;
  title: string;
  subtitle?: string;
  username: string;
  back?: { href: string; label: string };
  children: ReactNode;
}) {
  const field = tone ?? SECTIONS.find((s) => s.key === section)!.tone;
  const initial = username.replace(/^admin\./, "").charAt(0).toUpperCase() || "A";

  return (
    <div className="flex flex-1 flex-col bg-app-sheet font-app-sans text-app-ink">
      <header className={`relative overflow-hidden ${FIELD_BG[field]}`}>
        <Bubbles tone={field} />
        <div className="relative mx-auto w-full max-w-5xl px-4 pt-5 pb-12 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <a href="/admin" className="shrink-0" aria-label="Gloumi administravimas — pradžia">
              <Brand />
            </a>

            <nav
              aria-label="Skydelio skyriai"
              className="fixed inset-x-4 bottom-4 z-40 flex h-16 items-center gap-1 rounded-3xl bg-white p-1.5 shadow-app-bar sm:static sm:inset-auto sm:h-14 sm:w-auto sm:rounded-[20px]"
            >
              {SECTIONS.map(({ key, href, label, Icon, tone: t }) => {
                const active = key === section;
                return (
                  <a
                    key={key}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-[18px] px-4 text-[11px] transition-colors sm:flex-row sm:gap-2 sm:rounded-2xl sm:text-sm ${
                      active ? `${ACTIVE_BG[t]} font-bold text-app-plum` : "font-medium text-app-muted hover:text-app-ink"
                    }`}
                  >
                    <Icon size={20} strokeWidth={STROKE} aria-hidden />
                    {label}
                  </a>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {/* Atskiras gaubtas: `hidden` ir `onField` `inline-flex` vienoje klasėje
                  nesutaria, ir telefone vardas išstumdavo „Atsijungti" už ekrano. */}
              <span className="hidden md:block">
                <span className={`${onField} pl-1.5`}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-app-ink">
                    {initial}
                  </span>
                  {username}
                </span>
              </span>
              <form action={signOutAdmin}>
                <button type="submit" className={onField} title="Atsijungti">
                  <LogOut size={18} strokeWidth={STROKE} aria-hidden />
                  <span className="hidden sm:inline">Atsijungti</span>
                  <span className="sr-only sm:hidden">Atsijungti</span>
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            {back ? (
              <a
                href={back.href}
                className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-app-ink/80 hover:text-app-ink"
              >
                <ChevronLeft size={16} strokeWidth={STROKE} aria-hidden />
                {back.label}
              </a>
            ) : null}
            <h1 className="font-app-serif text-[32px] leading-tight text-app-ink sm:text-[36px]">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-sm text-app-ink/80">{subtitle}</p> : null}
          </div>
        </div>
      </header>

      {/* Lapas užlipa ant lauko 16 px ir turi 24 px kampus — `SHEET_OVERLAP`, `SHEET_RADIUS`. */}
      <main className="relative -mt-4 flex-1 rounded-t-[24px] bg-app-sheet">
        <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 sm:px-6 sm:pb-16">{children}</div>
      </main>
    </div>
  );
}
