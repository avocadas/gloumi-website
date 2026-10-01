import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import {
  loadCatalog,
  mediaIdsOf,
  PAGE_SIZE,
  searchTable,
  signMedia,
  type CatalogEntry,
  type CatalogKind,
  type SignedMedia,
} from "@/lib/admin-data";
import { AdminHeader } from "../AdminHeader";
import { MfaNotice } from "../MfaNotice";
import { UUID_PATTERN } from "../format";
import { RowCard } from "./RowCard";

/*
 * Duomenų naršyklė (#129). Bet kurią katalogo lentelę galima peržiūrėti ir
 * joje ieškoti tekstu ar pagal naudotoją; turinio eilutes — ištrinti ir
 * pataisyti jų tekstus. Ką galima su kuria lentele, sako `admin_catalog()`.
 *
 * Skaitoma per `admin_search`, ne tiesiai iš lentelių, kaip moderavimo
 * puslapyje: RPC pati išima paslėptus stulpelius (IBAN, mokesčių kodą,
 * Stripe paskyrą), tad jie nepatenka net į serverio atsakymą naršyklei.
 */
export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** `admin_search` priima poslinkį iki 100 000. */
const MAX_PAGE = Math.floor(100000 / PAGE_SIZE);

const KIND_ORDER: CatalogKind[] = ["content", "account", "view"];

const KIND_LABEL: Record<CatalogKind, string> = {
  content: "Turinys",
  account: "Paskyros",
  view: "Tik peržiūra",
};

const KIND_NOTE: Record<CatalogKind, string> = {
  content: "Galima rasti, ištrinti ir pataisyti tekstus.",
  account: "Galima rasti ir pataisyti tekstus. Paskyra trinama tik visa, jos puslapyje.",
  view: "Pinigai, teisiniai įrašai ir žurnalas: tik peržiūra.",
};

/*
 * Kas dingsta kartu su eilute. Išmatuota iš gyvų `pg_constraint`
 * 2026-10-01 (`on delete cascade` ir `set null`); pasikeitus ryšiams, šiuos
 * tekstus reikia atnaujinti, nes jie sako administratoriui, ką jis trina.
 */
const CASCADE_NOTE: Record<string, string> = {
  posts: "Kartu dings įrašo komentarai, pamėgimai, papildomos nuotraukos, išsaugojimai ir statistika.",
  media:
    "Jei tai pagrindinė įrašo nuotrauka arba žinutės priedas, kartu dings ir tas įrašas ar žinutė; papildoma įrašo nuotrauka tiesiog išnyks iš įrašo. Avatarai, Stories ir iškarpos liks be nuotraukos. Pats failas iš saugyklos ištrinamas naktį.",
  chats: "Kartu dings visos pokalbio žinutės ir nariai.",
  messages: "Kartu dings žinutės reakcijos.",
  stories: "Kartu dings Story pamėgimai, paminėjimai ir peržiūros.",
  services: "Kartu dings paslaugos priedai. Vizitų įrašuose paslauga liks be nuorodos.",
  highlights: "Kartu dings iškarpos elementai.",
};

export default async function DataPage({ searchParams }: { searchParams: Promise<Params> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const params = await searchParams;
  const catalog = await loadCatalog();
  const entry = catalog.find((c) => c.tbl === first(params.table));
  const page = Math.min(Math.max(Number.parseInt(first(params.page), 10) || 0, 0), MAX_PAGE);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <AdminHeader title="Duomenys" username={check.username ?? check.userId} active="data" />
      {entry ? (
        <TableView
          entry={entry}
          adminId={check.userId}
          q={first(params.q).trim()}
          owner={first(params.owner).trim()}
          page={page}
        />
      ) : (
        <CatalogIndex catalog={catalog} />
      )}
    </main>
  );
}

const inputClass =
  "min-w-0 flex-1 rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-espresso-900 placeholder:text-espresso-400";
const submitClass = "rounded-full bg-espresso-900 px-4 py-2 text-sm font-semibold text-cream-50";

function CatalogIndex({ catalog }: { catalog: CatalogEntry[] }) {
  return (
    <div className="space-y-8">
      {/* Dažniausias kelias — rasti žmogų, tad jis pirmas ir be lentelės pasirinkimo. */}
      <form action="/admin/data" className="flex flex-wrap gap-2">
        <input type="hidden" name="table" value="profiles" />
        <input
          name="q"
          required
          maxLength={200}
          placeholder="Ieškoti naudotojo: vardas, @vardas ar telefonas"
          aria-label="Ieškoti naudotojo"
          className={inputClass}
        />
        <button type="submit" className={submitClass}>
          Ieškoti
        </button>
      </form>

      {KIND_ORDER.map((kind) => {
        const tables = catalog.filter((c) => c.kind === kind);
        if (tables.length === 0) return null;
        return (
          <section key={kind}>
            <h2 className="font-serif text-xl text-espresso-900">{KIND_LABEL[kind]}</h2>
            <p className="mt-1 text-sm text-espresso-500">{KIND_NOTE[kind]}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tables.map((t) => (
                <li key={t.tbl}>
                  <a
                    href={`/admin/data?table=${encodeURIComponent(t.tbl)}`}
                    className="inline-block rounded-full border border-sand-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-espresso-700 hover:bg-sand-100"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

async function TableView({
  entry,
  adminId,
  q,
  owner,
  page,
}: {
  entry: CatalogEntry;
  adminId: string;
  q: string;
  owner: string;
  page: number;
}) {
  // Vardas laikomas be „@", o žmogus jį dažnai taip ir įrašo.
  const query = entry.tbl === "profiles" ? q.replace(/^@/, "") : q;
  const ownerValid = owner === "" || UUID_PATTERN.test(owner);

  const res = ownerValid
    ? await searchTable(adminId, entry.tbl, query || null, owner || null, page * PAGE_SIZE)
    : ({ ok: false, error: "Naudotojo ID turi būti UUID formos." } as const);

  const rows = res.ok ? res.result.rows : [];
  const total = res.ok ? res.result.total : 0;
  const from = page * PAGE_SIZE;

  const mediaByRow = rows.map((r) => mediaIdsOf(entry.tbl, r.row));
  const signed = await signMedia(adminId, mediaByRow.flat());
  const highlight = [...new Set([...entry.edit_cols, ...entry.search_cols])];

  const link = (p: number, withFilters = true) => {
    const sp = new URLSearchParams({ table: entry.tbl });
    if (withFilters && q) sp.set("q", q);
    if (withFilters && owner) sp.set("owner", owner);
    if (p > 0) sp.set("page", String(p));
    return `/admin/data?${sp.toString()}`;
  };

  return (
    <div>
      <a href="/admin/data" className="text-sm font-semibold text-terracotta-600 hover:underline">
        ← Visos lentelės
      </a>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h2 className="font-serif text-2xl text-espresso-900">{entry.label}</h2>
        <code className="text-xs text-espresso-500">{entry.tbl}</code>
        {entry.kind === "view" ? (
          <span className="rounded bg-sand-200 px-2 py-1 text-xs font-bold uppercase tracking-wide text-espresso-700">
            Tik peržiūra
          </span>
        ) : null}
      </div>

      {entry.search_cols.length > 0 || entry.owners.length > 0 ? (
        <form action="/admin/data" className="mt-4 flex flex-wrap gap-2">
          <input type="hidden" name="table" value={entry.tbl} />
          {entry.search_cols.length > 0 ? (
            <input
              name="q"
              defaultValue={q}
              maxLength={200}
              placeholder={`Tekstas (${entry.search_cols.join(", ")})`}
              aria-label="Ieškomas tekstas"
              className={inputClass}
            />
          ) : null}
          {entry.owners.length > 0 ? (
            <input
              name="owner"
              defaultValue={owner}
              placeholder={`Naudotojo ID (${entry.owners.join(" arba ")})`}
              aria-label="Naudotojo ID"
              className={inputClass}
            />
          ) : null}
          <button type="submit" className={submitClass}>
            Ieškoti
          </button>
          {q || owner ? (
            <a
              href={link(0, false)}
              className="rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-espresso-600 hover:bg-sand-100"
            >
              Išvalyti
            </a>
          ) : null}
        </form>
      ) : null}

      {owner && ownerValid ? (
        <p className="mt-3 text-sm text-espresso-600">
          Rodomos tik{" "}
          <a href={`/admin/users/${owner}`} className="font-semibold text-terracotta-600 hover:underline">
            šio naudotojo
          </a>{" "}
          eilutės.
        </p>
      ) : null}

      {!res.ok ? (
        <p role="alert" className="mt-6 rounded-2xl border border-sand-300 bg-cream-50 p-4 text-sm font-semibold text-terracotta-500">
          {res.error}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-sand-300 bg-cream-50 p-8 text-center text-sm text-espresso-500">
          {total === 0 ? "Nieko nerasta." : "Šiame puslapyje eilučių nebėra."}
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-espresso-500">
            Rasta {total}. Rodoma {from + 1}–{from + rows.length}.
          </p>
          <ul className="mt-3 space-y-4">
            {rows.map((r, i) => (
              <li key={JSON.stringify(r.key)}>
                <RowCard
                  table={entry.tbl}
                  kind={entry.kind}
                  editCols={entry.edit_cols}
                  owners={entry.owners}
                  highlightCols={highlight}
                  entry={r}
                  mediaIds={mediaByRow[i]}
                  media={pick(signed, mediaByRow[i])}
                  cascadeNote={CASCADE_NOTE[entry.tbl] ?? null}
                />
              </li>
            ))}
          </ul>
          <nav className="mt-6 flex justify-between text-sm font-semibold">
            {page > 0 ? (
              <a href={link(page - 1)} className="text-terracotta-600 hover:underline">
                ← Ankstesni
              </a>
            ) : (
              <span />
            )}
            {from + rows.length < total && page < MAX_PAGE ? (
              <a href={link(page + 1)} className="text-terracotta-600 hover:underline">
                Kiti →
              </a>
            ) : null}
          </nav>
        </>
      )}
    </div>
  );
}

function pick(all: Record<string, SignedMedia>, ids: string[]): Record<string, SignedMedia> {
  const out: Record<string, SignedMedia> = {};
  for (const id of ids) if (all[id]) out[id] = all[id];
  return out;
}
