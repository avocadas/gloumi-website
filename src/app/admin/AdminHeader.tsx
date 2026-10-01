import { signOutAdmin } from "./sign-out";

type Section = "reports" | "data";

const SECTIONS: { key: Section; href: string; label: string }[] = [
  { key: "reports", href: "/admin", label: "Skundai" },
  { key: "data", href: "/admin/data", label: "Duomenys" },
];

/*
 * Bendra portalo puslapių antraštė (#129). Rodomas vardas, ne el. paštas:
 * administratoriaus adresas atsitiktinis ir yra apsaugos dalis
 * (`admin-guard.ts`). Atsijungimas — forma, ne `onClick`: veikia ir be
 * JavaScript.
 */
export function AdminHeader({
  title,
  username,
  active,
}: {
  title: string;
  username: string;
  active: Section;
}) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-500">
            Gloumi
          </p>
          <h1 className="mt-1 font-serif text-3xl text-espresso-900">{title}</h1>
          <p className="mt-2 text-sm text-espresso-500">Prisijungęs: {username}</p>
        </div>
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-espresso-600 hover:bg-sand-100"
          >
            Atsijungti
          </button>
        </form>
      </div>

      <nav className="mt-6 flex gap-6 border-b border-sand-300 text-sm font-semibold">
        {SECTIONS.map((s) => (
          <a
            key={s.key}
            href={s.href}
            aria-current={s.key === active ? "page" : undefined}
            className={
              s.key === active
                ? "-mb-px border-b-2 border-espresso-900 pb-3 text-espresso-900"
                : "pb-3 text-espresso-500 hover:text-espresso-900"
            }
          >
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
