import { notFound } from "next/navigation";
import { BadgePercent } from "lucide-react";
import { checkAdmin } from "@/lib/admin-guard";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { EmptyState, STROKE } from "../ui";
import { GrantRows } from "./GrantRows";
import { loadGrants } from "./load";

/*
 * Individualios sąlygos (#179): kam Gloumi neima komisinio ir kam suteiktas
 * nemokamas Pro ar VIP — ir iki kada. Suteikiama meistro paskyros puslapyje
 * (`users/[id]`), čia — visų sąrašas ir galiojančių pabaiga.
 */
export const dynamic = "force-dynamic";

export default async function GrantsPage() {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") {
      return <MfaNotice reason={check.reason} />;
    }
    notFound();
  }

  const result = await loadGrants(check.userId);

  return (
    <AdminShell
      section="data"
      title="Individualios sąlygos"
      subtitle="Kam neimamas komisinis ir kam suteiktas nemokamas Pro ar VIP – ir iki kada. Suteikiama meistro paskyroje."
      username={check.username ?? check.userId}
      back={{ href: "/admin/data", label: "Duomenys" }}
    >
      {!result.ok ? (
        <p role="alert" className="rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          Sąrašo gauti nepavyko: {result.error}
        </p>
      ) : result.grants.length === 0 ? (
        <EmptyState tone="lavender" icon={<BadgePercent size={24} strokeWidth={STROKE} aria-hidden />} title="Individualių sąlygų dar niekam nėra">
          Komisinio atsisakymą ar nemokamą planą galima suteikti meistro paskyros puslapyje.
        </EmptyState>
      ) : (
        <GrantRows grants={result.grants} showMaster />
      )}
    </AdminShell>
  );
}
