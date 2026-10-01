"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { STROKE } from "../../ui";

/*
 * ID kopijavimas vienu paspaudimu: administratorius jį dažniausiai perduoda
 * kitam — į pokalbį, į užklausą, į paieškos lauką, — o pažymėti 36 simbolius
 * pele lengva su vienu trūkstamu.
 */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Naršyklė neleido (ne HTTPS ar uždrausta) — reikšmė vis tiek matoma ir pažymima ranka.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Nukopijuota" : label}
      title={copied ? "Nukopijuota" : label}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-app-faint transition-colors hover:bg-app-input hover:text-app-ink"
    >
      {copied ? <Check size={14} strokeWidth={STROKE} aria-hidden /> : <Copy size={14} strokeWidth={STROKE} aria-hidden />}
    </button>
  );
}
