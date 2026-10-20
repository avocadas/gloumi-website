"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconClose, IconMenu } from "@/components/icons";
import { STROKE } from "./ui";

/*
 * Telefone ir planšetėje (< 1024 px) – ☰ atidaro tą pačią šoninę juostą kaip
 * lapą iš kairės (design `admin-portalas.md` 1.3). Tikras `<dialog>`: naršyklė
 * pati laiko fokusą viduje ir uždaro Esc. Paspaudus nuorodą – užsidaro.
 */
export function NavDrawer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Atidaryti meniu"
        className="flex h-11 w-11 items-center justify-center rounded-[14px] text-app-ink hover:bg-app-input focus-visible:ring-2 focus-visible:ring-app-accent/40 focus-visible:outline-none"
      >
        <IconMenu size={22} strokeWidth={STROKE} aria-hidden />
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Paspaudus užtamsintą foną (ne patį lapą) – užsidaro.
          if (e.target === ref.current) setOpen(false);
        }}
        aria-label="Meniu"
        className="m-0 h-dvh max-h-dvh w-[300px] max-w-[85vw] bg-white p-0 text-app-ink shadow-app-bar backdrop:bg-app-ink/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end px-3 pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Uždaryti meniu"
              className="flex h-11 w-11 items-center justify-center rounded-[14px] hover:bg-app-input"
            >
              <IconClose size={20} strokeWidth={STROKE} aria-hidden />
            </button>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            onClickCapture={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
