"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Pranešimas po veiksmo (design `admin-portalas.md` 4.7, D13): trumpas toast
 * apačioje centre, 3 s – „Pranešta programėlėje ir el. paštu“, „Išsaugota“.
 * Telefone – virš apatinės juostos. Perspėjimai (laiškas neišėjo ir pan.)
 * lieka kortelėje (`ActionNote` su `warn`): juos reikia perskaityti, ne praleisti.
 */

type Toast = { id: number; text: string };

const ToastContext = createContext<(text: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const next = useRef(0);

  const show = useCallback((text: string) => {
    if (timer.current) clearTimeout(timer.current);
    next.current += 1;
    setToast({ id: next.current, text });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-6">
        {toast ? (
          <p
            key={toast.id}
            className="max-w-md rounded-[14px] bg-app-ink px-4 py-3 text-center text-[13px] font-semibold text-white shadow-app-card"
          >
            {toast.text}
          </p>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

/** Parodo toast po veiksmo. */
export const useToast = () => useContext(ToastContext);

/**
 * Pastaba po veiksmo: `info` – toast (ir nieko kortelėje), `warn` – lieka
 * kortelėje, kad administratorius jos nepraleistų.
 */
export function ActionNote({ note }: { note: { text: string; tone: "info" | "warn" } | null | undefined }) {
  const show = useToast();
  const info = note && note.tone === "info" ? note.text : null;
  useEffect(() => {
    if (info) show(info);
  }, [info, note, show]);
  if (!note || note.tone !== "warn") return null;
  return (
    <p role="status" className="mt-4 rounded-[14px] bg-app-warn-bg px-4 py-3 text-[13px] font-semibold text-app-warn">
      {note.text}
    </p>
  );
}
