import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AppBuilds } from "../actions";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { AppBuildsEditor } from "./AppBuildsEditor";
import { Alert } from "../ui";

/*
 * Programėlės versijų ribos: privalomas ir naujausias build'as abiem
 * platformoms (developeris 2026-10-16; Gloumi `20261015231733`). Skaito
 * `min_supported_build`, keičia `admin_set_app_build` (`setAppBuild`). Kol
 * migracija nepritaikyta, funkcijos nėra (`PGRST202`) – puslapis tai ir sako.
 */
export const dynamic = "force-dynamic";

const num = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : 0);

export default async function AppBuildsPage() {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("min_supported_build");
  const raw = (data ?? {}) as Record<string, unknown>;
  const builds: AppBuilds = {
    ios: num(raw.ios),
    android: num(raw.android),
    latest_ios: num(raw.latest_ios),
    latest_android: num(raw.latest_android),
  };

  return (
    <AdminShell
      section="appBuilds"
      title="Programėlės versijos"
      subtitle="Nuo kurio build'o programėlė dar veikia ir kuris naujausias. 0 – riba nenustatyta."
      username={check.username ?? check.userId}
    >
      {error ? (
        <Alert retry>
          {error.code === "PGRST202"
            ? "Versijų ribos bazėje dar neįjungtos (migracija nepritaikyta)."
            : `Reikšmių gauti nepavyko: ${error.message}`}
        </Alert>
      ) : (
        <AppBuildsEditor initial={builds} />
      )}
    </AdminShell>
  );
}
