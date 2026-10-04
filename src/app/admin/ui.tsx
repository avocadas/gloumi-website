import type { CSSProperties, ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";

/*
 * Portalo statybiniai blokai programėlės kalba (`gloumi-app/src/theme/theme.js`,
 * `ScreenScaffold.js`). Vienoje vietoje, kad kiekvienas puslapis dėliotų tą
 * patį — antgalvį, korteles, mygtukus, žymas — vienodai: būtent skirtingai
 * nupieštas tas pats daiktas ir daro skydelį netvarkingą.
 *
 * Trys programėlės taisyklės, kurias čia lengva sulaužyti:
 *  - mygtukai BALTI su juodu apvadu, juodo užpildo nėra niekur (#130);
 *  - pastelė dažo tik plotą (antgalvį, aktyvų skirtuką), tekstui — rašalas;
 *  - skaičiai rašomi sansu su `tabular-nums`, ne serifu (`theme.js` `FIGURES`).
 */

/** `Icons.js` `ICON_STROKE` — lucide piktogramos piešiamos tuo pačiu storiu. */
export const STROKE = 2.2;

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

export const card = "rounded-[22px] bg-white shadow-app-card ring-1 ring-app-hairline";

const btnBase =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/** `OUTLINED` — vienintelis mygtuko pavidalas programėlėje. */
export const btn = `${btnBase} border-[1.5px] border-app-accent bg-white text-app-accent hover:bg-app-sheet`;

/** Trynimas, blokavimas: tas pats pavidalas, `DANGER` apvadas ir `DANGER_TEXT` raidės. */
export const btnDanger = `${btnBase} border-[1.5px] border-app-danger bg-white text-app-danger-text hover:bg-app-danger-bg`;

/** Antraeilis veiksmas be apvado: „Atšaukti", „Taisyti". */
export const btnQuiet = `${btnBase} text-app-body hover:bg-app-input`;

export const input =
  "h-11 w-full min-w-0 rounded-[14px] bg-app-input px-4 text-sm text-app-ink outline-none placeholder:text-app-faint focus:ring-4 focus:ring-app-accent/10";

export const chip =
  "inline-flex h-9 items-center gap-2 rounded-full border border-app-border bg-white px-3.5 text-sm font-semibold text-app-body transition-colors hover:border-app-faint";

/** Pasirinktas — baltas su juodu apvadu, kaip programėlės pasirinkimai (#130). */
export const chipActive =
  "inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] border-app-accent bg-white px-3.5 text-sm font-bold text-app-accent";

export const eyebrow = "text-[11px] font-bold uppercase tracking-[0.12em]";

/** Apvalus mygtukas ant pastelinio lauko — `ON_FIELD_FILL`, pusiau permatomas baltas. */
export const onField =
  "inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-3 text-sm font-semibold text-app-ink transition-colors hover:bg-white";

type TagTone = "neutral" | "warn" | "ok" | "danger" | "lavender" | "rose" | "mint" | "peach" | "dark";

/*
 * Žymos rašalas kai kur vienu laipteliu tamsesnis už programėlės žetoną: 10 px
 * raidėms ant pastelės reikia bent 4,5, o `badgeOkText`, `DANGER_TEXT` ir
 * skirtukų rašalai ant savo fonų davė 4,25–4,41 (išmatuota 2026-10-01).
 * Tamsesnis tos pačios spalvos tonas — 5,4–5,9.
 */

const TAG: Record<TagTone, string> = {
  neutral: "bg-app-band text-[#52525B]",
  warn: "bg-app-warn-bg text-app-warn",
  ok: "bg-app-ok-bg text-[#3F6A4D]",
  danger: "bg-app-danger-bg text-[#B91C1C]",
  lavender: "bg-[#EFE9F8] text-[#6B4C96]",
  rose: "bg-[#F8E7ED] text-app-content",
  mint: "bg-[#E6F1EA] text-[#3F6A4D]",
  peach: "bg-[#FBEAE1] text-app-peach-ink",
  dark: "border border-app-accent text-app-accent",
};

/** `TYPE.tag` ir `RADII.tag` — „ŠIANDIEN", „PRO". */
export function Tag({ tone = "neutral", children }: { tone?: TagTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] ${TAG[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * Pastaba po pavykusio veiksmo — pvz. ar autoriui išsiųstas laiškas (#169).
 * `warn` — kai kas nepavyko, nors pats veiksmas atliktas; klaida (`role="alert"`)
 * lieka tam, kas neįvyko visai.
 */
export function ActionNote({ note }: { note: { text: string; tone: "info" | "warn" } | null | undefined }) {
  if (!note) return null;
  return (
    <p
      role="status"
      className={`mt-4 rounded-[14px] px-4 py-3 text-[13px] font-semibold ${
        note.tone === "warn" ? "bg-app-warn-bg text-app-warn" : "bg-app-band text-app-ink"
      }`}
    >
      {note.text}
    </p>
  );
}

type Accent = "content" | "account" | "value";

const DASH: Record<Accent, string> = {
  content: "bg-app-content",
  account: "bg-app-account",
  value: "bg-app-accent",
};

/*
 * Sekcijos antraštė su spalvotu brūkšneliu (`SHEET` drobė, `SECTION_ACCENTS`):
 * spalva sako temą — turinys, paskyra, pinigai, — o tekstas lieka paprastu
 * sakiniu, ne didžiosiomis (#110: keturios tokios antraštės ekraną paverčia
 * plakatu).
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
        <h2 className="flex items-center gap-2.5 text-[15px] font-semibold text-app-ink">
          {accent ? <span aria-hidden className={`h-[3px] w-4 rounded-full ${DASH[accent]}`} /> : null}
          {title}
        </h2>
        {note ? <p className="mt-1 text-[13px] text-app-muted">{note}</p> : null}
      </div>
      {aside}
    </div>
  );
}

/** Tuščia būsena — `RADII.cardLarge`, piktograma pastelės skritulyje. */
export function EmptyState({
  icon,
  tone = "lavender",
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
      <span className={`flex h-14 w-14 items-center justify-center rounded-full text-app-ink ${FIELD_BG[tone]}`}>
        {icon}
      </span>
      <p className="mt-4 font-app-serif text-xl text-app-ink">{title}</p>
      {children ? <div className="mt-1 max-w-sm text-sm text-app-muted">{children}</div> : null}
    </div>
  );
}

/** Žymė ir vardas vienoje vietoje: tas pats ženklas, kurį rodo programėlė. */
export function Brand({ label = "Administravimas" }: { label?: string }) {
  return (
    <span className="flex items-baseline gap-2.5">
      <Wordmark title="Gloumi" className="h-6 w-auto text-app-ink" />
      <span className={`${eyebrow} text-app-ink/80`}>{label}</span>
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
        <div className={`${card} p-6 sm:p-8`}>{children}</div>
        {footnote ? <p className="mt-6 text-center text-xs text-app-faint">{footnote}</p> : null}
      </main>
    </div>
  );
}
