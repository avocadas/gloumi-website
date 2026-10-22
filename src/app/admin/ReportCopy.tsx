"use client";

import { useState, useTransition } from "react";
import { IconEye, IconLock } from "@/components/icons";
import { loadReportCopy, type ReportCopyView } from "./actions";
import { MediaPreview } from "./MediaPreview";
import { formatWhen } from "./format";
import { Alert, STROKE, btnQuiet, eyebrow } from "./ui";

/** Kopijos laukų pavadinimai (Gloumi `20261014210343` `content` raktai); nežinomas – rodomas raktas. */
const FIELD_LABEL: Record<string, string> = {
  body: "Tekstas",
  description: "Aprašymas",
  service_title: "Paslauga",
  category: "Kategorija",
  price: "Kaina",
  layout: "Išdėstymas",
  caption: "Aprašymas",
  overlays: "Užrašai ant Story",
  music: "Muzika",
  author_role: "Autoriaus vaidmuo",
  expires_at: "Galiojo iki",
  rating: "Įvertinimas",
  username: "Naudotojo vardas",
  display_name: "Vardas",
  bio: "Aprašymas",
  master_display_name: "Meistro vardas",
  master_bio: "Meistro aprašymas",
  specialty: "Specialybė",
  hidden_at: "Paslėptas",
  edited_at: "Redaguota",
  sender_role: "Siuntėjo vaidmuo",
  chat_id: "Pokalbis",
  reply_to_id: "Atsakymas į",
  post_id: "Įrašas",
  review_id: "Atsiliepimas",
  master_id: "Meistras",
};

/*
 * Skundžiamo turinio kopija (L-24): kas buvo pranešta tą akimirką. Atidaroma
 * tik paspaudus, nes kiekviena peržiūra įrašoma į administratorių žurnalą –
 * mygtukas tai ir sako. Sulaikytos kopijos (`child_sexual_abuse`) medija
 * nerodoma: serveris jos nepasirašo ir id neatsiunčia.
 */
export function ReportCopy({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();
  const [copy, setCopy] = useState<ReportCopyView | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const open = () =>
    startTransition(async () => {
      setError(null);
      const res = await loadReportCopy(reportId);
      if (res.ok) setCopy(res.copy);
      else setError(res.error);
    });

  if (copy === undefined) {
    return (
      <div className="mt-3">
        <button type="button" disabled={pending} onClick={open} className={`${btnQuiet} text-xs`}>
          <IconEye size={15} strokeWidth={STROKE} aria-hidden />
          {pending ? "Kraunama…" : "Rodyti kopiją"}
        </button>
        <p className="mt-0.5 px-4 text-xs text-app-faint">Pranešimo metu išsaugota kopija; atidarymas įrašomas žurnale.</p>
        {error ? (
          <Alert className="mt-2">{error}</Alert>
        ) : null}
      </div>
    );
  }

  if (copy === null) {
    return <p className="mt-3 text-xs italic text-app-muted">Šiam pranešimui kopijos nėra (pateiktas iki kopijų įjungimo).</p>;
  }

  return (
    <div className="mt-3 rounded-[14px] border border-app-hairline p-4">
      <p className={`${eyebrow} text-app-muted`}>Kopija pranešimo metu</p>
      <p className="mt-1 text-xs text-app-muted">
        Išsaugota {formatWhen(copy.copiedAt)}
        {copy.targetCreatedAt ? ` · turinys sukurtas ${formatWhen(copy.targetCreatedAt)}` : ""}
      </p>

      {copy.withheld ? (
        <p className="mt-3 flex items-start gap-2 rounded-[10px] bg-app-danger-bg px-3 py-2 text-sm font-semibold text-app-danger-text">
          <IconLock size={16} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0" />
          Pranešta apie vaikų seksualinę prievartą. Turinys ir medija ({copy.mediaCount}) portale nerodomi.
        </p>
      ) : !copy.targetFound ? (
        <p className="mt-3 text-sm italic text-app-muted">
          Pranešimo metu turinio jau nebuvo{copy.copyError ? ` (${copy.copyError})` : ""}.
        </p>
      ) : (
        <>
          {copy.fields.length ? (
            <dl className="mt-3 space-y-2 text-sm">
              {copy.fields.map((f) => (
                <div key={f.key}>
                  <dt className="text-[11px] font-semibold text-app-muted">{FIELD_LABEL[f.key] ?? f.key}</dt>
                  <dd className="whitespace-pre-wrap break-words text-app-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-sm italic text-app-muted">Teksto nėra.</p>
          )}
          {copy.mediaCount ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {copy.media.map((m) => (
                <MediaPreview key={m.url} signed={m} />
              ))}
              {copy.media.length < copy.mediaCount ? (
                <p className="w-full text-xs text-app-muted">
                  Nepasirašyta: {copy.mediaCount - copy.media.length} iš {copy.mediaCount}.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
