import type { ReactNode } from "react";
import type { IconComponent, IconProps } from "./index";

/*
 * Kategorijų ikonos – programėlės detalios linijinės (#115, developeris
 * 2026-09-29), ne lucide: `gloumi-app/src/components/common/CategoryIcons.js`
 * (`ringaudas-prod` @ `f63cef86`). Tinklelis 48, linija 2, galai apvalūs, kaip
 * programėlėje (`CI.js` `STROKE`). Spalvos – svetainės (`categories.ts`).
 */

const STROKE = 2;

function frame(children: ReactNode): IconComponent {
  return function CategoryIcon({ size = 32, strokeWidth = STROKE, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={rest["aria-label"] ? undefined : true}
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

/** `IconCategoryHair` `CategoryIcons.js:62` */
export const IconCategoryHair = frame(
  <>
    <g transform="translate(12 24) rotate(-18)">
      <rect x="-3.2" y="-18" width="6.4" height="36" rx="2.4" />
      <path d="M3.2 -14.5 h4.2 M3.2 -10.5 h4.2 M3.2 -6.5 h4.2 M3.2 -2.5 h4.2 M3.2 1.5 h4.2 M3.2 5.5 h4.2 M3.2 9.5 h4.2 M3.2 13.5 h4.2" />
    </g>
    <g transform="translate(35 24)">
      <circle cx="-5" cy="14.5" r="4.2" />
      <circle cx="5" cy="14.5" r="4.2" />
      <path d="M-2.6 11.1 L1.3 -1.2 Q4.4 -10 6.2 -19 Q2.2 -11 -0.9 -3.6" />
      <path d="M2.6 11.1 L-1.3 -1.2 Q-4.4 -10 -6.2 -19 Q-2.2 -11 0.9 -3.6" />
      <circle cx="0" cy="3.2" r="1" />
    </g>
  </>,
);

/** `IconCategoryNails` `CategoryIcons.js:45` */
export const IconCategoryNails = frame(
  <>
    <path d="M23.4 46 V25.6 a4.6 4.6 0 0 1 9.2 0 V46" />
    <path d="M25 30 V25 Q28 18.5 31 25 V30 Q28 32 25 30Z" />
    <path d="M25.6 41 q2.4 1.2 4.8 0" />
    <g transform="translate(21.6 14.6) rotate(-45)">
      <rect x="-1.9" y="-17" width="3.8" height="14.5" rx="1.9" />
      <rect x="-2.4" y="-2.5" width="4.8" height="3.4" rx="0.8" />
      <path d="M-2.2 0.9 L-1.3 5 Q0 7.2 1.3 5 L2.2 0.9" />
    </g>
    <path d="M40 5.8 Q40.67 9.33 44.2 10 Q40.67 10.67 40 14.2 Q39.33 10.67 35.8 10 Q39.33 9.33 40 5.8Z" />
    <path d="M42 18.6 Q42.38 20.62 44.4 21 Q42.38 21.38 42 23.4 Q41.62 21.38 39.6 21 Q41.62 20.62 42 18.6Z" />
  </>,
);

/** `IconCategoryBrows` `CategoryIcons.js:78` */
export const IconCategoryBrows = frame(
  <>
    <path d="M7 17 Q20 6 39 11.5 Q24 10.5 9 19.5Z" />
    <path d="M7 28 Q24 39 41 28" />
    <path d="M13.8 31.5 l-2.5 5 M19 33.3 l-1.3 5.4 M24 33.8 v5.6 M29 33.3 l1.3 5.4 M34.2 31.5 l2.5 5 M38.4 29.6 l3.8 3.6" />
  </>,
);

/** `IconCategoryMassage` `CategoryIcons.js:144` */
export const IconCategoryMassage = frame(
  <>
    <ellipse cx="18" cy="39.5" rx="13.5" ry="4.5" />
    <ellipse cx="18" cy="31" rx="10.5" ry="4" />
    <ellipse cx="18" cy="23.8" rx="7" ry="3.2" />
    <path d="M14 17 q-2.2 -3 0 -6 q2.2 -3 0 -6 M21.5 16 q-2.2 -3 0 -6 q2.2 -3 0 -5" />
    <rect x="33" y="27" width="10" height="17" rx="1.4" />
    <path d="M38 26.5 v-2" />
    <path d="M38 14.5 q-3.2 4.2 -3.2 6.6 a3.2 3.2 0 0 0 6.4 0 q0 -2.4 -3.2 -6.6z" />
  </>,
);

const MAKEUP_BRUSH = (
  <g transform="translate(31.5 30) rotate(-50)">
    <path d="M-3 0.5 Q-3.6 -4.6 0 -7.2 Q3.6 -4.6 3 0.5Z" />
    <rect x="-2.3" y="0.5" width="4.6" height="3.4" rx="0.8" />
    <path d="M-1.4 3.9 L-0.8 16 h1.6 L1.4 3.9" />
  </g>
);

/*
 * `IconCategoryMakeup` `CategoryIcons.js:103`: veidas su tarpu aplink teptuką (kaukė, kaip programėlėje).
 * Kaukės id pastovus, ne `useId`: visos kopijos puslapyje vienodos (tas pats
 * storis), o pastovus id veikia ir serverio komponente.
 */
const MAKEUP_MASK = "gloumi-category-makeup-mask";
export const IconCategoryMakeup = frame(
  <>
    <defs>
      <mask id={MAKEUP_MASK} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect x="0" y="0" width="48" height="48" fill="#fff" stroke="none" />
        <g fill="#000" stroke="#000" strokeWidth={STROKE + 3.2}>
          {MAKEUP_BRUSH}
        </g>
      </mask>
    </defs>
    <g mask={`url(#${MAKEUP_MASK})`}>
      <circle cx="24" cy="6.8" r="3.8" />
      <path d="M12 24 C12 15.5 17.2 10.6 24 10.6 C30.8 10.6 36 15.5 36 24" />
      <path d="M13.6 22.5 C13.6 31.5 18 37 24 37 C30 37 34.4 31.5 34.4 22.5" />
      <path d="M13.6 22.5 C17.5 21.8 21.4 19.6 23.6 15.8 C25.8 19.6 30 21.8 34.4 22.5" />
      <path d="M17.6 26.4 q1.8 1.3 3.6 0 M26.8 26.4 q1.8 1.3 3.6 0" />
      <path d="M21.8 31.6 q2.2 1.5 4.4 0" />
      <path d="M20.6 36.4 V40.6 M27.4 36.4 V40.6" />
      <path d="M8 46.5 C10 43.2 14.4 41.6 20.6 40.6 M40 46.5 C38 43.2 33.6 41.6 27.4 40.6" />
    </g>
    {MAKEUP_BRUSH}
  </>,
);

/** `IconCategorySkincare` `CategoryIcons.js:131` */
export const IconCategorySkincare = frame(
  <>
    <path d="M9.5 24 q1 -5 5.5 -4.2 q2.5 -3.8 6 0 q4 -0.6 5 4.2" />
    <rect x="6" y="24" width="21" height="6" rx="2" />
    <path d="M7.8 30 V39.5 a4.5 4.5 0 0 0 4.5 4.5 h8.4 a4.5 4.5 0 0 0 4.5 -4.5 V30" />
    <path d="M11.5 36.5 h10" />
    <path d="M29 4.5 H43 L41.2 31.5 Q40.8 34 38.3 34 H33.7 Q31.2 34 30.8 31.5 Z" />
    <path d="M29.2 8 H42.8" />
    <rect x="32" y="34" width="8" height="10" rx="1.6" />
    <circle cx="36" cy="19" r="3.8" />
  </>,
);
