"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { IconLock, IconLogOut } from "@/components/icons";
import { signOutAdmin } from "./sign-out";
import { STROKE } from "./ui";

/**
 * Telefono ir planšetės viršutinės juostos inicialas (design `admin-portalas.md`
 * 1.3, D13): paspaudus – meniu su vardu, „Slaptažodis“ ir „Atsijungti“, kaip
 * šoninės juostos apačioje kompiuteryje. Užsidaro paspaudus šalia, Esc arba
 * pasirinkus punktą.
 */
export function AccountMenu({ username, initial }: { username: string; initial: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative shrink-0">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${username} – paskyros meniu`}
        // Liečiamas plotas 44 (design §9), matomas skritulys – 36.
        className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:outline-none"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-app-accent-soft text-sm font-bold text-app-accent">
          {initial}
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-12 z-40 w-60 rounded-[14px] bg-white p-1.5 shadow-app-card ring-1 ring-app-hairline"
        >
          <p className="truncate px-3 pt-2 pb-2.5 text-[13px] font-semibold text-app-ink" title={username}>
            {username}
          </p>
          <Link
            prefetch={false}
            role="menuitem"
            href="/admin/password"
            onClick={() => setOpen(false)}
            className="flex h-11 items-center gap-2 rounded-[10px] px-3 text-sm font-medium text-app-ink hover:bg-app-input"
          >
            <IconLock size={17} strokeWidth={STROKE} aria-hidden className="text-app-muted" />
            Slaptažodis
          </Link>
          <form action={signOutAdmin}>
            <button
              type="submit"
              role="menuitem"
              className="flex h-11 w-full items-center gap-2 rounded-[10px] px-3 text-left text-sm font-medium text-app-ink hover:bg-app-input"
            >
              <IconLogOut size={17} strokeWidth={STROKE} aria-hidden className="text-app-muted" />
              Atsijungti
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
