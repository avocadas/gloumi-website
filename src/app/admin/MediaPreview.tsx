"use client";

import { IconImage, IconLock } from "@/components/icons";
import type { SignedMedia } from "@/lib/admin-data";
import { STROKE } from "./ui";

/** Įrašo kadras 4:5 (`theme.js` `POST_ASPECT`) — tas pats, kurį mato programėlė. */
export function MediaPreview({ signed, locked = false }: { signed: SignedMedia | undefined; locked?: boolean }) {
  const box = "aspect-[4/5] w-[136px] rounded-[14px] bg-app-input";
  // A-16: pokalbio priedas – kaip ir pokalbio tekstas, tik perskaičius pokalbį su pagrindu.
  if (locked) {
    return (
      <span className={`${box} flex flex-col items-center justify-center gap-1.5 p-3 text-center text-[11px] text-app-muted`}>
        <IconLock size={20} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
        Pokalbio priedas – skaityti su pagrindu
      </span>
    );
  }
  if (!signed) {
    return (
      <span className={`${box} flex flex-col items-center justify-center gap-1.5 p-3 text-center text-[11px] text-app-muted`}>
        <IconImage size={20} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
        Peržiūra nepasiekiama
      </span>
    );
  }
  if (signed.contentType.startsWith("video/")) {
    return <video src={signed.url} controls preload="metadata" className={`${box} object-cover`} />;
  }
  if (signed.contentType.startsWith("audio/")) {
    return <audio src={signed.url} controls preload="none" className="w-full" />;
  }
  return (
    <a href={signed.url} target="_blank" rel="noopener noreferrer" title="Atidaryti visą">
      {/* eslint-disable-next-line @next/next/no-img-element -- naudotojų failai neturi eiti per Vercel optimizatorių, o parašas galioja tik valandą */}
      <img
        src={signed.url}
        alt="Naudotojo įkelta nuotrauka"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${box} object-cover transition-opacity hover:opacity-90`}
      />
    </a>
  );
}
