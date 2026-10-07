"use client";

import { useState, useTransition } from "react";
import { IconEye } from "@/components/icons";
import { revealPhone } from "../../actions";
import { STROKE } from "../../ui";
import { CopyButton } from "./CopyButton";

/*
 * Telefonas paslėptas, kol administratorius paspaudžia „Rodyti“ (teisininkas
 * U-27): numeris į puslapį patenka tik tada, ir atvėrimą bazė įrašo į
 * žurnalą. Atvėrus – skambinimo nuoroda (skubiu atveju skambinama iš
 * telefono vienu paspaudimu) ir kopijavimas.
 */
export function PhoneReveal({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const [phone, setPhone] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const reveal = () => {
    setError(null);
    startTransition(async () => {
      const res = await revealPhone(userId);
      if (res.ok) setPhone(res.phone);
      else setError(res.error);
    });
  };

  if (phone) {
    return (
      <>
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="min-w-0 break-all hover:underline">
          {phone}
        </a>
        <CopyButton value={phone} label="Kopijuoti telefoną" />
      </>
    );
  }
  if (phone === null) return <span className="text-app-muted">Numerio nebėra</span>;

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={reveal}
        disabled={pending}
        className="inline-flex items-center gap-1.5 font-semibold text-app-accent hover:underline disabled:opacity-60"
      >
        <IconEye size={16} strokeWidth={STROKE} aria-hidden />
        Rodyti
      </button>
      <span className="text-[12px] text-app-faint">Atvėrimas įrašomas į žurnalą</span>
      {error ? (
        <span role="alert" className="basis-full text-[13px] font-semibold text-app-danger-text">
          {error}
        </span>
      ) : null}
    </span>
  );
}
