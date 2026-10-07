import { IconChevronLeft, IconChevronRight, IconClose, IconProfile, IconSearch } from "@/components/icons";
import { PAGE_SIZE, type CatalogEntry, type CatalogKind, type SearchResult, type SignedMedia } from "@/lib/admin-data";
import { ownerLabel } from "../format";
import { EmptyState, STROKE, Tag, btn, card } from "../ui";
import { RowCard } from "./RowCard";
import { SearchField } from "./SearchField";

/** `admin_search` priima poslinkį iki 100 000. */
export const MAX_PAGE = Math.floor(100000 / PAGE_SIZE);

const KIND_TAG: Record<CatalogKind, { label: string; tone: "rose" | "mint" | "neutral" }> = {
  content: { label: "Galima trinti ir taisyti", tone: "rose" },
  account: { label: "Galima taisyti tekstus", tone: "mint" },
  view: { label: "Tik peržiūra", tone: "neutral" },
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

/*
 * Vienos lentelės vaizdas: paieškos juosta, įjungti filtrai (kiekvieną galima
 * nuimti atskirai), kiek rasta, kortelės ir puslapiai. Duomenis gauna
 * puslapis (`page.tsx`); čia — tik išdėstymas.
 */
export function TableResults({
  entry,
  q,
  owner,
  ownerValid,
  page,
  res,
  mediaByRow,
  signed,
}: {
  entry: CatalogEntry;
  q: string;
  owner: string;
  ownerValid: boolean;
  page: number;
  res: { ok: true; result: SearchResult } | { ok: false; error: string };
  mediaByRow: string[][];
  signed: Record<string, SignedMedia>;
}) {
  const rows = res.ok ? res.result.rows : [];
  const total = res.ok ? res.result.total : 0;
  const from = page * PAGE_SIZE;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const highlight = [...new Set([...entry.edit_cols, ...entry.search_cols])];

  const link = (p: number, keep: { q?: boolean; owner?: boolean } = { q: true, owner: true }) => {
    const sp = new URLSearchParams({ table: entry.tbl });
    if (keep.q && q) sp.set("q", q);
    if (keep.owner && owner) sp.set("owner", owner);
    if (p > 0) sp.set("page", String(p));
    return `/admin/data?${sp.toString()}`;
  };

  const kindTag = KIND_TAG[entry.kind];
  const canSearch = entry.search_cols.length > 0 || entry.owners.length > 0;

  return (
    <div>
      {canSearch ? (
        <section className={`${card} p-4 sm:p-5`}>
          <form action="/admin/data" className="flex flex-wrap gap-2">
            <input type="hidden" name="table" value={entry.tbl} />
            {entry.search_cols.length > 0 ? (
              <SearchField name="q" defaultValue={q} placeholder="Ieškoti teksto" label="Ieškomas tekstas" icon="search" />
            ) : null}
            {entry.owners.length > 0 ? (
              <SearchField name="owner" defaultValue={owner} placeholder="Naudotojo ID" label="Naudotojo ID" icon="user" />
            ) : null}
            <button type="submit" className={`${btn} max-sm:w-full`}>
              Ieškoti
            </button>
          </form>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted">
            <Tag tone={kindTag.tone}>{kindTag.label}</Tag>
            {entry.search_cols.length > 0 ? <span>Tekstas ieškomas: {entry.search_cols.join(", ")}</span> : null}
            {entry.owners.length > 0 ? (
              <span>Naudotojas: {entry.owners.map(ownerLabel).join(" arba ").toLowerCase()}</span>
            ) : null}
          </p>
        </section>
      ) : (
        <p className="flex">
          <Tag tone={kindTag.tone}>{kindTag.label}</Tag>
        </p>
      )}

      {q || (owner && ownerValid) ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {q ? (
            <a
              href={link(0, { owner: true })}
              aria-label={`Nuimti teksto filtrą „${q}“`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-app-ink ring-1 ring-app-border hover:ring-app-faint"
            >
              „{q}“
              <IconClose size={14} strokeWidth={STROKE} aria-hidden />
            </a>
          ) : null}
          {owner && ownerValid ? (
            <span className="inline-flex h-8 items-center gap-2 rounded-full bg-white pr-1 pl-3 text-[13px] font-semibold text-app-ink ring-1 ring-app-border">
              <IconProfile size={14} strokeWidth={STROKE} aria-hidden />
              <a href={`/admin/users/${owner}`} className="hover:underline">
                Tik šio naudotojo eilutės
              </a>
              <a
                href={link(0, { q: true })}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-app-input"
                aria-label="Nuimti naudotojo filtrą"
              >
                <IconClose size={14} strokeWidth={STROKE} aria-hidden />
              </a>
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        {!res.ok ? (
          <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
            {res.error}
          </p>
        ) : rows.length === 0 ? (
          <EmptyState tone="lavender" icon={<IconSearch size={24} strokeWidth={STROKE} aria-hidden />} title="Nieko nerasta">
            {total === 0
              ? q || owner
                ? "Pabandykite kitą žodį arba nuimkite filtrą."
                : "Ši lentelė tuščia."
              : "Šiame puslapyje eilučių nebėra."}
          </EmptyState>
        ) : (
          <>
            <p className="mb-3 text-sm text-app-muted">
              Rasta <span className="font-semibold tabular-nums text-app-ink">{total}</span>
              {total > rows.length ? (
                <>
                  {" "}
                  · rodoma{" "}
                  <span className="tabular-nums">
                    {from + 1}–{from + rows.length}
                  </span>
                </>
              ) : null}
            </p>
            <ul className="space-y-4">
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
            {pages > 1 ? (
              <nav aria-label="Puslapiai" className="mt-6 flex items-center justify-between gap-3">
                {page > 0 ? (
                  <a href={link(page - 1)} className={btn}>
                    <IconChevronLeft size={16} strokeWidth={STROKE} aria-hidden />
                    Ankstesni
                  </a>
                ) : (
                  <span />
                )}
                <span className="text-sm tabular-nums text-app-muted">
                  {page + 1} iš {pages}
                </span>
                {from + rows.length < total && page < MAX_PAGE ? (
                  <a href={link(page + 1)} className={btn}>
                    Kiti
                    <IconChevronRight size={16} strokeWidth={STROKE} aria-hidden />
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function pick(all: Record<string, SignedMedia>, ids: string[]): Record<string, SignedMedia> {
  const out: Record<string, SignedMedia> = {};
  for (const id of ids) if (all[id]) out[id] = all[id];
  return out;
}
