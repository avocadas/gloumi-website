import Link from "next/link";
import { notFound } from "next/navigation";
import { IconBadgePercent } from "@/components/icons";
import { checkAdmin } from "@/lib/admin-guard";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { Alert, EmptyState, STROKE, chip, chipActive } from "../ui";
import { GrantRows } from "./GrantRows";
import { loadGrants } from "./load";

/*
 * Individualios sąlygos (#179): kam Gloumi neima komisinio ir kam suteiktas
 * nemokamas Pro ar VIP — ir iki kada. Suteikiama meistro paskyros puslapyje
 * (`users/[id]`), čia — visų sąrašas ir galiojančių pabaiga.
 *
 * Filtras „Galioja · Baigėsi · Visos“, galiojančios pirmos (design 5.3).
 */
export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "active", label: "Galioja" },
  { key: "ended", label: "Baigėsi" },
  { key: "all", label: "Visos" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

export default async function GrantsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const { filter: raw } = await searchParams;
  const filter: FilterKey = FILTERS.some((f) => f.key === raw) ? (raw as FilterKey) : "active";
  const result = await loadGrants(check.userId);
  const all = result.ok ? result.grants : [];
  const counts: Record<FilterKey, number> = {
    active: all.filter((g) => g.active).length,
    ended: all.filter((g) => !g.active).length,
    all: all.length,
  };
  const shown = all
    .filter((g) => filter === "all" || (filter === "active" ? g.active : !g.active))
    .sort((a, b) => Number(b.active) - Number(a.active));

  return (
    <AdminShell
      section="grants"
      title="Individualios sąlygos"
      subtitle="Kam neimamas komisinis ir kam suteiktas nemokamas Pro ar VIP. Suteikiama meistro paskyroje."
      username={check.username ?? check.userId}
    >
      {!result.ok ? (
        <Alert>Sąrašo gauti nepavyko: {result.error}</Alert>
      ) : all.length === 0 ? (
        <EmptyState icon={<IconBadgePercent size={24} strokeWidth={STROKE} aria-hidden />} title="Individualių sąlygų dar niekam nėra">
          Komisinio atsisakymą ar nemokamą planą galima suteikti meistro paskyros puslapyje.
        </EmptyState>
      ) : (
        <>
          <nav aria-label="Filtras" className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <Link prefetch={false}
                key={f.key}
                href={f.key === "active" ? "/admin/grants" : `/admin/grants?filter=${f.key}`}
                aria-current={filter === f.key ? "page" : undefined}
                className={filter === f.key ? chipActive : chip}
              >
                {f.label}
                <span className="tabular-nums">{counts[f.key]}</span>
              </Link>
            ))}
          </nav>
          {shown.length === 0 ? (
            <p className="text-sm text-app-muted">{filter === "active" ? "Šiuo metu niekam nieko negalioja." : "Baigusių sąlygų nėra."}</p>
          ) : (
            <GrantRows grants={shown} showMaster />
          )}
        </>
      )}
    </AdminShell>
  );
}
