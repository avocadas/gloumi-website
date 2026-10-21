"use client";

import { useState, useTransition } from "react";
import { setAppBuild, type AppBuilds } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { Alert, btn, card, eyebrow, input } from "../ui";

type Platform = "ios" | "android";
type Kind = "min" | "latest";

const PLATFORM_LABEL: Record<Platform, string> = { ios: "iOS", android: "Android" };
const KIND_LABEL: Record<Kind, string> = { min: "Privalomas", latest: "Naujausias" };
const KIND_NOTE: Record<Kind, string> = {
  min: "Senesni build'ai nebeatsidaro – rodomas tik „Atnaujinkite programėlę“.",
  latest: "Senesniems rodomas uždaromas priminimas atnaujinti.",
};
const BUILD_LABEL: Record<Platform, string> = { ios: "Build numeris (iOS, buildNumber)", android: "Versijos kodas (Android, versionCode)" };

const keyOf = (platform: Platform, kind: Kind): keyof AppBuilds =>
  kind === "min" ? platform : (`latest_${platform}` as const);

/*
 * Programėlės versijų ribos (developeris 2026-10-16: priverstinis ir švelnus
 * atnaujinimas; Gloumi `20261015231733`). Keturios reikšmės, kiekviena
 * keičiama atskirai ir tik po patvirtinimo su dabartine ir nauja reikšme
 * (security). Privalomam build'ui – dar ir įrašyti naują skaičių: per didelis
 * užrakintų programėlę visiems. Privalomas negali viršyti naujausio, kai šis
 * nustatytas – pirma keliamas naujausias.
 */
export function AppBuildsEditor({ initial }: { initial: AppBuilds }) {
  const [builds, setBuilds] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dialog, ask] = useConfirm();

  const change = async (platform: Platform, kind: Kind) => {
    setError(null);
    setSaved(null);
    const key = keyOf(platform, kind);
    const raw = (drafts[key] ?? "").trim();
    if (!/^\d{1,6}$/.test(raw)) {
      setError("Įveskite build numerį – sveikąjį skaičių nuo 0 iki 999999.");
      return;
    }
    const next = Number(raw);
    const was = builds[key];
    if (next === was) {
      setError("Tokia reikšmė jau nustatyta.");
      return;
    }
    const latest = builds[keyOf(platform, "latest")];
    if (kind === "min" && latest > 0 && next > latest) {
      setError(
        `Privalomas (${next}) negali būti didesnis už naujausią (${latest}) – užrakintų ir naujausią build'ą. Pirma pakelkite naujausią.`,
      );
      return;
    }

    const label = `${PLATFORM_LABEL[platform]} – ${KIND_LABEL[kind].toLowerCase()} build'as`;
    const answer = await ask({
      title: `Keisti: ${label}?`,
      body: [
        `Dabar: ${was || "nenustatyta (0)"} → bus: ${next || "nenustatyta (0)"}.`,
        kind === "min"
          ? next > was
            ? `Visi ${PLATFORM_LABEL[platform]} build'ai žemesni nei ${next} nustos veikti iš karto, kol žmogus neatnaujins. Įsitikinkite, kad build'as ${next} jau parduotuvėje.`
            : "Riba mažinama: senesni build'ai vėl veiks."
          : "Senesniems build'ams bus rodomas priminimas atnaujinti.",
        "Pakeitimas įrašomas į administratorių žurnalą kartu su ankstesne reikšme.",
      ],
      confirmLabel: "Keisti",
      danger: kind === "min" && next > was,
      typeToConfirm: kind === "min" && next > was ? String(next) : undefined,
    });
    if (!answer) return;

    startTransition(async () => {
      const res = await setAppBuild(platform, kind, next);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBuilds(res.builds);
      setDrafts((d) => ({ ...d, [key]: "" }));
      setSaved(`${label}: ${next}.`);
    });
  };

  return (
    <div className="space-y-4">
      {dialog}
      {error ? (
        <Alert>
          {error}
        </Alert>
      ) : null}
      {saved ? <p className="rounded-[14px] bg-app-band px-4 py-3 text-sm text-app-ink">Išsaugota: {saved}</p> : null}

      {(["ios", "android"] as Platform[]).map((platform) => (
        <section key={platform} className={`${card} p-5 sm:p-6`}>
          <h2 className="text-[15px] font-bold text-app-ink">{PLATFORM_LABEL[platform]}</h2>
          <p className="mt-0.5 text-[13px] text-app-muted">{BUILD_LABEL[platform]} – skaičius, ne versijos eilutė.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["min", "latest"] as Kind[]).map((kind) => {
              const key = keyOf(platform, kind);
              return (
                <div key={kind} className="rounded-[14px] bg-app-sheet p-4">
                  <p className={`${eyebrow} text-app-muted`}>{KIND_LABEL[kind]}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-app-ink">{builds[key] || "–"}</p>
                  <p className="mt-1 text-xs leading-relaxed text-app-muted">{KIND_NOTE[kind]}</p>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      aria-label={`Naujas ${KIND_LABEL[kind].toLowerCase()} ${PLATFORM_LABEL[platform]} build'as`}
                      placeholder="Naujas"
                      value={drafts[key] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value.replace(/\D/g, "") }))}
                      className={`${input} min-w-0 flex-1 tabular-nums`}
                    />
                    <button type="button" disabled={pending || !(drafts[key] ?? "")} onClick={() => change(platform, kind)} className={btn}>
                      Keisti
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
