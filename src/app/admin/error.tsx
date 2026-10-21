"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuthShell, Brand, btn, btnQuiet } from "./ui";

/*
 * Portalo puslapis nulūžo: savas langas portalo dizainu, ne Next numatytasis
 * (developeris 2026-10-17). „Bandyti dar kartą“ – Next `reset`; `digest` –
 * kad klaidą būtų galima rasti serverio žurnale.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin-error-boundary]", error.digest ?? error.message);
  }, [error]);

  return (
    <AuthShell footnote={error.digest ? <span className="font-mono">#{error.digest}</span> : undefined}>
      <Brand />
      <h1 className="mt-6 font-app-sans font-extrabold tracking-[-0.01em] text-[26px] leading-tight text-app-ink">Kažkas nepavyko</h1>
      <p className="mt-3 text-sm leading-relaxed text-app-body">
        Puslapio nepavyko parodyti. Bandykite dar kartą – jei kartojasi, klaida matoma serverio žurnale pagal žemiau esantį
        numerį.
      </p>
      <button type="button" onClick={reset} className={`${btn} mt-6 h-12 w-full`}>
        Bandyti dar kartą
      </button>
      <Link prefetch={false} href="/admin" className={`${btnQuiet} mt-2 w-full`}>
        Į portalo pradžią
      </Link>
    </AuthShell>
  );
}
