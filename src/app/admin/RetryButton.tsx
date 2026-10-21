"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * „Bandyti dar kartą“ klaidos juostelėje (design `admin-portalas.md` 4.7, D13):
 * iš naujo paprašo serverio to paties puslapio duomenų (`router.refresh()`),
 * nepraradant filtrų ir slinkties.
 */
export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className="-my-2.5 min-h-11 shrink-0 rounded-[10px] px-2.5 text-[13px] font-semibold underline-offset-2 hover:underline disabled:opacity-60"
    >
      {pending ? "Kraunama…" : "Bandyti dar kartą"}
    </button>
  );
}
