import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { RetryButton } from "./RetryButton";
import { ICON_STROKE, IconAlert, IconChevronRight } from "@/components/icons";

/*
 * Portalo statybiniai blokai programėlės kalba (`gloumi-app/src/theme/theme.js`,
 * `ScreenScaffold.js`). Vienoje vietoje, kad kiekvienas puslapis dėliotų tą
 * patį — antgalvį, korteles, mygtukus, žymas — vienodai: būtent skirtingai
 * nupieštas tas pats daiktas ir daro skydelį netvarkingą.
 *
 * Paletė B ir design `admin-portalas.md` 4 sk. (developeris 2026-10-20
 * „design tinka, darom dabar“). Taisyklės, kurias čia lengva sulaužyti:
 *  - vienoje kortelėje – ne daugiau kaip vienas pagrindinis (BORDO) mygtukas;
 *  - pavojingas veiksmas kortelėje – tylus raudonu tekstu, užpildytas – tik
 *    patvirtinimo dialoge;
 *  - žymos – pagal prasmę (galioja, laukia, sustabdyta, informacija,
 *    baigėsi), ne pagal skyrių; sakinio raidėmis;
 *  - pastelė – tik burbulams (Apžvalga, prisijungimas);
 *  - skaičiai rašomi sansu su `tabular-nums`, ne serifu.
 */

/** `Icons.js` `ICON_STROKE` – ikonų (`@/components/icons`) linijos storis. */
export const STROKE = ICON_STROKE;

export type Tone = "lavender" | "mint" | "rose" | "neutral" | "peach";

export const FIELD_BG: Record<Tone, string> = {
  lavender: "bg-app-lavender",
  mint: "bg-app-mint",
  rose: "bg-app-rose",
  neutral: "bg-app-neutral",
  peach: "bg-app-peach",
};

type Circle = { size: number; color: string; opacity?: number } & Pick<
  CSSProperties,
  "top" | "left" | "right" | "bottom"
>;

/*
 * `ScreenScaffold` `SCAFFOLD_DECOR`: kiekvienas skirtukas turi tris skritulius,
 * didžiausias — gilesniu savo pastelės tonu, kiti du — kaimynų spalvomis.
 * Dydžiai padidinti, nes antgalvis čia platus, ne telefono pločio.
 */
const DECOR: Record<Tone, Circle[]> = {
  lavender: [
    { size: 300, color: "#B8A4DA", top: -150, right: -70 },
    { size: 190, color: "#E9B7C8", opacity: 0.85, top: -110, left: -70 },
    { size: 70, color: "#B3D3BF", bottom: -20, right: "28%" },
  ],
  mint: [
    { size: 320, color: "#A1C3AD", top: -170, left: -100 },
    { size: 210, color: "#C6B4E6", opacity: 0.9, top: -80, right: -80 },
    { size: 84, color: "#E4E4E7", bottom: -30, right: "32%" },
  ],
  rose: [
    { size: 320, color: "#DFA3B8", top: -180, left: -100 },
    { size: 240, color: "#C6B4E6", top: -100, right: -90 },
    // Programėlėje čia `#F4F4F5`, bet ant plataus rožinio lauko jis atrodė kaip
    // pilka dėmė, ne skritulys. Developeris 2026-10-01: ruda iš programėlės
    // kalendoriaus burbulo — `ScreenScaffold` `SCAFFOLD_DECOR.Vizitai`.
    { size: 120, color: "#E5AF97", bottom: -56, left: "42%" },
  ],
  neutral: [
    { size: 300, color: "#D4D4D8", top: -150, right: -80 },
    { size: 180, color: "#E9B7C8", opacity: 0.9, top: -90, left: -70 },
    { size: 74, color: "#B3D3BF", bottom: -26, left: "30%" },
  ],
  // `SCAFFOLD_DECOR.Vizitai` po rudos grąžinimo (prod 90a5145).
  peach: [
    { size: 300, color: "#E5AF97", top: -150, right: -80 },
    { size: 180, color: "#E9B7C8", opacity: 0.9, top: -90, left: -70 },
    { size: 74, color: "#B3D3BF", bottom: -26, left: "30%" },
  ],
};

export function Bubbles({ tone }: { tone: Tone }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {DECOR[tone].map(({ size, color, opacity, ...pos }, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ width: size, height: size, backgroundColor: color, opacity, ...pos }}
        />
      ))}
    </div>
  );
}

/** Kortelė – balta, kampas 20, šešėlis be rėmelio (4.3). */
export const card = "rounded-[20px] bg-white shadow-app-card";

/*
 * Mygtukų bazė – `min-h-11` ir `h-auto`, ne fiksuotas aukštis: ilgas užrašas
 * lūžta į dvi eilutes, o ne išlenda (6 sk.). Fokusas – BORDO žiedas (10 sk.).
 */
const btnBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 py-2 text-center text-sm font-semibold leading-tight transition-colors outline-none focus-visible:ring-2 focus-visible:ring-app-accent disabled:cursor-not-allowed disabled:opacity-40";

/** Pagrindinis – vienas svarbiausias veiksmas kortelėje ar dialoge („Suteikti“, „Išsaugoti“). */
export const btnPrimary = `${btnBase} bg-app-accent text-white shadow-app-primary hover:bg-[#8c0f36]`;

/** Antrinis – kitas veiksmas šalia („Peržiūrėti“, „Kopijuoti“). */
export const btn = `${btnBase} border-[1.5px] border-app-border bg-white text-app-ink hover:bg-app-input`;

/** Tylus – „Atšaukti“ dialoge, „Rodyti daugiau“. */
export const btnQuiet = `${btnBase} text-app-muted hover:bg-app-input`;

/** Pavojingas kortelėje – tylus raudonu tekstu: veiksmas dar tik klausia (dialogas). */
export const btnDanger = `${btnBase} text-app-danger-text hover:bg-app-danger-bg`;

/** Pavojingas patvirtinimo dialoge – užpildytas. */
export const btnDangerFill = `${btnBase} bg-app-danger text-white hover:bg-[#b91c1c]`;

/** Laukas – 44 aukščio, kampas 14, fokusas – 2 px BORDO 30 % žiedas (4.5). */
export const input =
  "h-11 w-full min-w-0 rounded-[14px] bg-app-input px-4 text-sm text-app-ink outline-none placeholder:text-app-placeholder focus:ring-2 focus:ring-app-accent/30 disabled:opacity-40";

/** Datos laukas: 200 px kompiuteryje, telefone – visas plotis; vietos naršyklės kalendoriaus ikonai. */
export const dateInput = `${input} pr-10 sm:max-w-[200px]`;

export const chip =
  "inline-flex h-9 items-center gap-2 rounded-full border border-app-border bg-white px-3.5 text-sm font-semibold text-app-body transition-colors hover:border-app-faint";

/** Pasirinktas filtras – švelnus BORDO fonas, kaip aktyvus skyrius. */
export const chipActive =
  "inline-flex h-9 items-center gap-2 rounded-full border border-transparent bg-app-accent-soft px-3.5 text-sm font-bold text-app-accent";

/*
 * Formų ir blokų užrašai – sakinio raidėmis (design 4.3, 4.5): didžiosios
 * raidės lieka tik ženkle „Administravimas“ (`brandCaps`). Vardas `eyebrow`
 * paliktas, kad visi puslapiai pasikeistų iš karto.
 */
export const eyebrow = "text-[13px] font-semibold";
const brandCaps = "text-[11px] font-bold uppercase tracking-[0.12em]";

/** Apvalus mygtukas ant pastelinio lauko — `ON_FIELD_FILL`, pusiau permatomas baltas. */
export const onField =
  "inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-3 text-sm font-semibold text-app-ink transition-colors hover:bg-white";

/*
 * Žymos – penki tonai pagal PRASMĘ (4.4): `ok` galioja, `warn` laukia ar
 * baigiasi, `danger` sustabdyta ar atmesta, `info` meistras, planas,
 * `neutral` baigėsi. Senieji vardai (pastelės) palikti, kad puslapiai
 * nelūžtų, ir nukreipti į prasmės toną; naujos vietos jų nenaudoja.
 */
type MeaningTone = "neutral" | "warn" | "ok" | "danger" | "info";
type TagTone = MeaningTone | "lavender" | "rose" | "mint" | "peach" | "dark";

const TAG: Record<MeaningTone, string> = {
  ok: "bg-app-ok-bg text-app-ok",
  warn: "bg-app-warn-bg text-app-warn",
  danger: "bg-app-danger-bg text-app-danger-text",
  info: "bg-app-info-bg text-app-info",
  neutral: "bg-app-band text-app-body",
};

const LEGACY: Record<TagTone, MeaningTone> = {
  ok: "ok",
  warn: "warn",
  danger: "danger",
  info: "info",
  neutral: "neutral",
  lavender: "info",
  rose: "info",
  mint: "ok",
  peach: "warn",
  dark: "info",
};

/** Sakinio raidėmis, 12 / 600, aukštis 22, kampas 8. */
export function Tag({ tone = "neutral", children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span className={`inline-flex min-h-[22px] items-center rounded-lg px-2 text-xs font-semibold ${TAG[LEGACY[tone]]}`}>
      {children}
    </span>
  );
}

/** Skaičius filtre ir navigacijoje (12 / 700, aukštis 20). `hideZero` – 0 nerodomas. */
export function CountPill({ n, label, hideZero = false }: { n: number; label?: string; hideZero?: boolean }) {
  if (hideZero && n === 0) return null;
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-app-accent px-1.5 text-xs font-bold tabular-nums text-white">
      {n}
      {label ? <span className="sr-only"> {label}</span> : null}
    </span>
  );
}

/**
 * Klaida, perspėjimas ar informacija – kampas 14, ikona kairėje (6 sk.).
 * `retry` – „Bandyti dar kartą“ dešinėje (4.7): puslapio duomenų įkėlimo klaidoms.
 */
export function Alert({
  tone = "danger",
  retry = false,
  children,
  className = "",
}: {
  tone?: "danger" | "warn" | "info" | "ok";
  retry?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const look = {
    danger: "bg-app-danger-bg text-app-danger-text",
    warn: "bg-app-warn-bg text-app-warn",
    info: "bg-app-info-bg text-app-info",
    ok: "bg-app-ok-bg text-app-ok",
  }[tone];
  return (
    <p
      role={tone === "danger" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-[14px] px-4 py-3 text-sm font-semibold ${look} ${className}`}
    >
      <IconAlert size={18} strokeWidth={STROKE} aria-hidden className="mt-px shrink-0" />
      <span className="min-w-0 flex-1 break-words">{children}</span>
      {retry ? <RetryButton /> : null}
    </p>
  );
}

/**
 * Užrašas virš lauko (13 / 600), paaiškinimas po užrašu, klaida po lauku (4.5).
 * `children` – pats laukas; `htmlFor` sieja užrašą su juo.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-app-ink">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-[13px] text-app-muted">{hint}</p> : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-[13px] font-semibold text-app-danger-text">
          <IconAlert size={14} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Pasirinkimas iš 2–4 variantų vietoje radijo mygtukų ar sąrašo (4.5):
 * „Pro | VIP“, „Iki datos | Neribotai“. Radio grupė prieinamumui.
 */
export function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[14px] bg-app-track p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(o.value)}
            className={`min-h-9 flex-1 rounded-[10px] px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-app-accent disabled:opacity-40 ${
              active ? "bg-white font-semibold text-app-ink shadow-app-card" : "font-medium text-app-muted hover:text-app-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Kortelė-nuoroda: pavadinimas, paaiškinimas, ›. */
export function LinkCard({ href, title, note, aside }: { href: string; title: string; note?: string; aside?: ReactNode }) {
  return (
    <Link prefetch={false}
      href={href}
      className={`${card} flex items-center justify-between gap-3 px-5 py-4 text-sm transition-colors hover:bg-app-input`}
    >
      <span className="min-w-0">
        <span className="font-semibold text-app-ink">{title}</span>
        {note ? <span className="mt-0.5 block text-[13px] text-app-muted">{note}</span> : null}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {aside}
        <IconChevronRight size={16} strokeWidth={STROKE} aria-hidden className="text-app-faint" />
      </span>
    </Link>
  );
}

/** Pastaba po veiksmo – `Toaster.tsx` (info – toast, warn – kortelėje). */
export { ActionNote } from "./Toaster";

type Accent = "content" | "account" | "value" | "system";

/* Taškas grupės spalva (kaip programėlės `DotLabel`): turinys – rožinė, paskyra – violetinė, pinigai – gintarinė, sistema – žalia. */
const DOT: Record<Accent, string> = {
  content: "bg-[#D6457A]",
  account: "bg-[#7A5AC8]",
  value: "bg-[#D08A1A]",
  system: "bg-[#1F9D7A]",
};

/*
 * Sekcijos antraštė su tašku (4.3): spalva sako temą, tekstas – 15 / 700
 * sakinio raidėmis (#110: kelios antraštės didžiosiomis ekraną paverčia plakatu).
 */
export function SectionTitle({
  accent,
  title,
  note,
  aside,
}: {
  accent?: Accent;
  title: string;
  note?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-app-ink">
          {accent ? <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${DOT[accent]}`} /> : null}
          {title}
        </h2>
        {note ? <p className="mt-1 text-[13px] text-app-muted">{note}</p> : null}
      </div>
      {aside}
    </div>
  );
}

/** Tuščia būsena (4.7): ikona pilkame skritulyje, antraštė 17 / 600, be pastelės. `tone` – nebenaudojamas. */
export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  tone?: Tone;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${card} flex flex-col items-center px-6 py-12 text-center`}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-app-band text-app-faint">{icon}</span>
      <p className="mt-4 text-[17px] font-semibold text-app-ink">{title}</p>
      {children ? <div className="mt-1 max-w-sm text-sm text-app-muted">{children}</div> : null}
    </div>
  );
}

/** Žymė ir vardas vienoje vietoje: tas pats ženklas, kurį rodo programėlė. */
export function Brand({ label = "Administravimas" }: { label?: string }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <Wordmark title="Gloumi" className="h-6 w-auto text-app-ink" />
      <span className={`${brandCaps} text-app-ink/80`}>{label}</span>
    </span>
  );
}

/*
 * Prisijungimo ir „sesija baigėsi" lango karkasas: pastelinis laukas su
 * skrituliais, ant jo — viena kortelė. Tas pats, kuo programėlė pasitinka
 * žmogų, tik be skirtukų: čia dar nėra kur eiti.
 */
export function AuthShell({ children, footnote }: { children: ReactNode; footnote?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-app-sheet">
      <div className="relative h-64 overflow-hidden bg-app-lavender">
        <Bubbles tone="lavender" />
      </div>
      <main className="relative mx-auto -mt-44 w-full max-w-md flex-1 px-4 pb-16">
        {/* Telefone vidus 20 (design): 375 px pločiu Turnstile „flexible“ (≥ 300 px) tada telpa. */}
        <div className={`${card} p-5 sm:p-8`}>{children}</div>
        {footnote ? <p className="mt-6 text-center text-xs text-app-faint">{footnote}</p> : null}
      </main>
    </div>
  );
}
