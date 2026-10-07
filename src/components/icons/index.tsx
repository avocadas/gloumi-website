import type { ReactNode, SVGProps } from "react";

/*
 * Svetainės ikonos – tos pačios, kaip programėlėje (Gloumi #20; developeris:
 * „ikonos website turi buti tokios pat, kaip ir appse“; design specifikacija
 * `docs/design/specifikacijos/svetaines-ikonos.md`).
 *
 * TIESA – programėlės `gloumi-app/src/components/common/Icons.js`
 * (`ringaudas-prod` @ `f63cef86`). Čia – jos `path` ir `viewBox` kopijos, ne
 * importas: svetainė yra kita repozitorija. Prie kiekvienos ikonos – iš kurios
 * programėlės ikonos ji nukopijuota; pasikeitus ten, keičiama ir čia.
 *
 * Stilius visur vienas, kaip programėlėje: tinklelis 24, linija 2,2
 * (`ICON_STROKE`), galai ir sujungimai apvalūs, be užpildo, spalva – teksto
 * (`currentColor`). Išimtys – tos pačios: varnelė 2,4, pilna žvaigždutė.
 *
 * Kur programėlė ikonos neturi (portalo skirtukai, kopijavimas, įspėjimas ir
 * pan.), piešiama lucide forma tuo pačiu stiliumi – apačioje.
 */

export const ICON_STROKE = 2.2;

export type IconProps = Omit<SVGProps<SVGSVGElement>, "stroke" | "fill"> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export type IconComponent = (props: IconProps) => ReactNode;

/*
 * Programėlės `croppedViewBox` (`Icons.js`, #110): X, rodyklės ir chevron'ai
 * piešiami apkirptame kadre, kad būtų 15 % didesni, o meniu – 8 %. Be jo jie
 * atrodytų mažesni nei programėlėje.
 */
const cropped = (scale: number) => {
  const side = 24 / scale;
  const inset = (24 - side) / 2;
  return `${inset.toFixed(3)} ${inset.toFixed(3)} ${side.toFixed(3)} ${side.toFixed(3)}`;
};
const VIEWBOX_LARGE = cropped(1.15);
const VIEWBOX_SLIGHT = cropped(1.08);

function make(
  viewBox: string,
  children: ReactNode,
  { stroke = ICON_STROKE, join = true }: { stroke?: number; join?: boolean } = {},
): IconComponent {
  return function Icon({ size = 24, strokeWidth = stroke, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin={join ? "round" : undefined}
        aria-hidden={rest["aria-label"] ? undefined : true}
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

/** `IconClose` `Icons.js:263` */
export const IconClose = make(
  VIEWBOX_LARGE,
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>,
);

/** `IconCheck` `Icons.js:441` – storesnė, 2,4, kaip programėlėje. */
export const IconCheck = make("0 0 24 24", <polyline points="20 6 9 17 4 12" />, { stroke: 2.4 });

/** `IconChevronLeft` `Icons.js:1020` */
export const IconChevronLeft = make(VIEWBOX_LARGE, <polyline points="15 18 9 12 15 6" />);

/** `IconChevronRight` `Icons.js:1035` */
export const IconChevronRight = make(VIEWBOX_LARGE, <polyline points="9 6 15 12 9 18" />);

/** `IconChevronRight` `Icons.js:1035`, pasukta žemyn – kaip programėlės išskleidžiami laukai. */
export const IconChevronDown = make(VIEWBOX_LARGE, <polyline points="9 6 15 12 9 18" transform="rotate(90 12 12)" />);

/** `IconArrowRight` `Icons.js:608` */
export const IconArrowRight = make(
  VIEWBOX_LARGE,
  <>
    <path d="M5 12h13" />
    <path d="M12.5 6l6 6-6 6" />
  </>,
);

/** `IconLock` `Icons.js:351` */
export const IconLock = make(
  "0 0 24 24",
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
);

/** `IconMail` `Icons.js:335` – ir „Pagalba“: programėlės šoniniame meniu pagalba žymima laišku. */
export const IconMail = make(
  "0 0 24 24",
  <>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </>,
);

/** `IconMenu` `Icons.js:514` – be `strokeLinejoin`, kaip programėlėje. */
export const IconMenu = make(
  VIEWBOX_SLIGHT,
  <>
    <line x1="4" y1="6.5" x2="20" y2="6.5" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17.5" x2="20" y2="17.5" />
  </>,
  { join: false },
);

/** `IconSearch` `Icons.js:779` (neaktyvi). */
export const IconSearch = make(
  "0 0 24 24",
  <>
    <circle cx="10.6" cy="10.6" r="7" />
    <line x1="20.4" y1="20.4" x2="15.6" y2="15.6" />
  </>,
);

/** `IconClock` `Icons.js:1095` */
export const IconClock = make(
  "0 0 24 24",
  <>
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="12 7 12 12 15.5 14" />
  </>,
);

const CALENDAR = (
  <>
    <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
    <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
    <line x1="8" y1="2.5" x2="8" y2="6.5" />
    <line x1="16" y1="2.5" x2="16" y2="6.5" />
  </>
);

/** `IconCalendar` `Icons.js:1050` */
export const IconCalendar = make("0 0 24 24", CALENDAR);

/**
 * `IconCalendar` `Icons.js:1050` su varnele po antraštės linija – programėlė tokios neturi, tad
 * sudėta iš jos dalių: varnelė – `IconPhoneCheck` `Icons.js:1304` forma, nuleista į kalendoriaus vidurį.
 */
export const IconCalendarCheck = make(
  "0 0 24 24",
  <>
    {CALENDAR}
    <path d="M9.4 15l1.8 1.8 3.4-3.6" />
  </>,
);

/** `IconBan` `Icons.js:1111` – ir „rezervacijos apribotos“, kaip programėlėje. */
export const IconBan = make(
  "0 0 24 24",
  <>
    <circle cx="12" cy="12" r="9.5" />
    <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" />
  </>,
);

/** `IconEye` `Icons.js:367` */
export const IconEye = make(
  "0 0 24 24",
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);

/** `IconEyeOff` `Icons.js:383` */
export const IconEyeOff = make(
  "0 0 24 24",
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>,
);

/** `IconPencil` `Icons.js:640` */
export const IconPencil = make("0 0 24 24", <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />);

/** `IconTrash` `Icons.js:456` */
export const IconTrash = make(
  "0 0 24 24",
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </>,
);

/** `IconProfile` `Icons.js:843` (neaktyvi) – tik `Svg` turinys, be programėlės `View`. */
export const IconProfile = make(
  "0 0 24 24",
  <>
    <circle cx="12" cy="7.8" r="4" />
    <path d="M4.4 20.4c.9-3.9 4.1-6.2 7.6-6.2s6.7 2.3 7.6 6.2" />
  </>,
);

/** `IconUsers` `Icons.js:1177` */
export const IconUsers = make(
  "0 0 24 24",
  <>
    <path d="M16 20v-1.6a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.4V20" />
    <circle cx="9.5" cy="8" r="3.3" />
    <path d="M21 20v-1.6a3.6 3.6 0 0 0-2.7-3.5" />
    <path d="M15.5 4.9a3.3 3.3 0 0 1 0 6.2" />
  </>,
);

const STAR = (
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
);

/** `IconStar` `Icons.js:179`; `filled` – pilna, kaip programėlės įvertinimuose. */
export function IconStar({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  const Star = filled ? FilledStar : OutlineStar;
  return <Star {...props} />;
}
const OutlineStar = make("0 0 24 24", STAR);
const FilledStar = make("0 0 24 24", <g fill="currentColor">{STAR}</g>);

/** `IconSparkles` `Icons.js:231` */
export const IconSparkles = make(
  "0 0 24 24",
  <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />,
);

/** `IconReceipt` `Icons.js:1234` */
export const IconReceipt = make(
  "0 0 24 24",
  <>
    <path d="M5 3.5h14v17l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L7.3 19 5 20.5z" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="8.5" />
    <line x1="8.5" y1="12.5" x2="13" y2="12.5" />
  </>,
);

/** `IconBell` `Icons.js:662` – tik `Svg` turinys, be skaičiaus ženkliuko. */
export const IconBell = make(
  "0 0 24 24",
  <>
    <path d="M18.2 9.2a6.2 6.2 0 0 0-12.4 0c0 5.4-2 7.6-2.6 8.1-.2.2-.1.6.2.6h17.2c.3 0 .4-.4.2-.6-.6-.5-2.6-2.7-2.6-8.1z" />
    <path d="M10 20.8a2.3 2.3 0 0 0 4 0" />
  </>,
);

/** `IconImage` `Icons.js:1419` */
export const IconImage = make(
  "0 0 24 24",
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.8" cy="9" r="1.6" />
    <path d="M21 15.5 16.2 11 6 21" />
  </>,
);

/** `IconUndo` `Icons.js:910` */
export const IconUndo = make(
  "0 0 24 24",
  <>
    <polyline points="3 7 3 13 9 13" />
    <path d="M3 13a9 9 0 1 0 3-7.7L3 7" />
  </>,
);

/** `IconReply` `Icons.js:891` */
export const IconReply = make(
  "0 0 24 24",
  <>
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </>,
);

/** `IconWallet` `Icons.js:1251` – programėlė juo žymi išmokas ir jų sulaikymą. */
export const IconWallet = make(
  "0 0 24 24",
  <>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v2.5" />
    <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
    <circle cx="17" cy="13.5" r="1.4" />
  </>,
);

/**
 * `IconVerified` `Icons.js:1002` – pilnas skritulys su balta varnele (programėlės „patvirtinta“).
 * Skritulys – teksto spalva, varnelė – `checkColor` (numatytoji balta).
 */
export function IconVerified({ size = 24, checkColor = "#FFFFFF", ...rest }: IconProps & { checkColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden={rest["aria-label"] ? undefined : true} {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <polyline
        points="7.5 12.3 10.6 15.2 16.5 8.9"
        fill="none"
        stroke={checkColor}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Krovimas – žiedas, kaip programėlės įkėlimo žiedas (#200 sprendimas): blankus
 * takelis ir besisukantis lankas. Sukimas – `animate-spin` iš kvietėjo.
 */
export function IconSpinner({ size = 24, strokeWidth = ICON_STROKE, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  );
}

/*
 * Programėlėje šių ikonų nėra (portalo skirtukai, kopijavimas, įspėjimas ir
 * pan.): piešiama lucide forma, bet programėlės stiliumi – 2,2, apvalūs galai.
 * Formos nukopijuotos iš `lucide-react` 1.45.0, todėl paketo nebereikia.
 * Licencijų pranešimai žemiau – nukopijuoti pažodžiui, kaip jos reikalauja.
 */

/*
 * Lucide icons (building-2, circle-alert, copy, database, flag, inbox,
 * landmark, layout-grid, log-out, scale, shield-check, user-x) – ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * database and log-out are derived from the Feather project – MIT License
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** lucide `building-2` */
export const IconBuilding = make(
  "0 0 24 24",
  <>
    <path d="M10 12h4" />
    <path d="M10 8h4" />
    <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
  </>,
);

/** lucide `circle-alert` */
export const IconAlert = make(
  "0 0 24 24",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </>,
);

/** lucide `copy` */
export const IconCopy = make(
  "0 0 24 24",
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>,
);

/** lucide `database` */
export const IconDatabase = make(
  "0 0 24 24",
  <>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </>,
);

/** lucide `flag` */
export const IconFlag = make(
  "0 0 24 24",
  <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />,
);

/** lucide `inbox` */
export const IconInbox = make(
  "0 0 24 24",
  <>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>,
);

/** lucide `landmark` */
export const IconLandmark = make(
  "0 0 24 24",
  <>
    <path d="M10 18v-7" />
    <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
  </>,
);

/** lucide `layout-grid` */
export const IconLayoutGrid = make(
  "0 0 24 24",
  <>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </>,
);

/** lucide `log-out` */
export const IconLogOut = make(
  "0 0 24 24",
  <>
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  </>,
);

/** lucide `scale` */
export const IconScale = make(
  "0 0 24 24",
  <>
    <path d="M12 3v18" />
    <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
    <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
    <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
    <path d="M7 21h10" />
  </>,
);

/** lucide `shield-check` */
export const IconShieldCheck = make(
  "0 0 24 24",
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

/** lucide `user-x` */
export const IconUserX = make(
  "0 0 24 24",
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" x2="22" y1="8" y2="13" />
    <line x1="22" x2="17" y1="8" y2="13" />
  </>,
);
