import { notFound } from "next/navigation";
import { IconChevronRight } from "@/components/icons";
import { checkAdmin } from "@/lib/admin-guard";
import { loadCatalog, mediaIdsOf, PAGE_SIZE, searchTable, signMedia } from "@/lib/admin-data";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { UUID_PATTERN } from "../format";
import { STROKE, card } from "../ui";
import { CatalogIndex } from "./CatalogIndex";
import { MAX_PAGE, TableResults } from "./TableResults";

/*
 * Duomenų naršyklė (#129). Bet kurią katalogo lentelę galima peržiūrėti ir
 * joje ieškoti tekstu ar pagal naudotoją; turinio eilutes — ištrinti ir
 * pataisyti jų tekstus. Ką galima su kuria lentele, sako `admin_catalog()`.
 *
 * Skaitoma per `admin_search`, ne tiesiai iš lentelių, kaip moderavimo
 * puslapyje: RPC pati išima paslėptus stulpelius (IBAN, mokesčių kodą,
 * Stripe paskyrą), tad jie nepatenka net į serverio atsakymą naršyklei.
 *
 * Šis failas tik gauna duomenis; išdėstymas — `CatalogIndex` ir
 * `TableResults`, kad jį būtų galima pamatyti ir be prisijungimo, su
 * netikrais duomenimis.
 */
export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

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
  const username = check.username ?? check.userId;

  if (!entry) {
    return (
      <AdminShell
        section="data"
        title="Duomenys"
        subtitle="Raskite žmogų arba atsidarykite lentelę. Kiekvienas pakeitimas įrašomas į žurnalą."
        username={username}
      >
        {/* #179: individualios sąlygos suteikiamos meistro paskyroje, o čia — kelias į visų sąrašą. */}
        <a
          href="/admin/grants"
          className={`${card} mb-6 flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-app-ink transition-colors hover:bg-app-surface`}
        >
          <span>
            Individualios sąlygos{" "}
            <span className="font-normal text-app-muted">– kam neimamas komisinis ir kam suteiktas nemokamas planas</span>
          </span>
          <IconChevronRight size={16} strokeWidth={STROKE} aria-hidden className="shrink-0 text-app-faint" />
        </a>
        <CatalogIndex catalog={catalog} />
      </AdminShell>
    );
  }

  const q = first(params.q).trim();
  const owner = first(params.owner).trim();
  // Vardas laikomas be „@", o žmogus jį dažnai taip ir įrašo.
  const query = entry.tbl === "profiles" ? q.replace(/^@/, "") : q;
  const ownerValid = owner === "" || UUID_PATTERN.test(owner);

  const res = ownerValid
    ? await searchTable(check.userId, entry.tbl, query || null, owner || null, page * PAGE_SIZE)
    : ({ ok: false, error: "Naudotojo ID turi būti UUID formos." } as const);

  const mediaByRow = res.ok ? res.result.rows.map((r) => mediaIdsOf(entry.tbl, r.row)) : [];
  const signed = await signMedia(check.userId, mediaByRow.flat());

  return (
    <AdminShell
      section="data"
      title={entry.label}
      subtitle={`Lentelė ${entry.tbl}`}
      username={username}
      back={{ href: "/admin/data", label: "Visos lentelės" }}
    >
      <TableResults
        entry={entry}
        q={q}
        owner={owner}
        ownerValid={ownerValid}
        page={page}
        res={res}
        mediaByRow={mediaByRow}
        signed={signed}
      />
    </AdminShell>
  );
}
