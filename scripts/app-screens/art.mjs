// The app's category icons (gloumi-app src/components/common/CategoryIcons.js) as plain SVG in
// their 48-unit frame, and the colours the invented work pictures and avatars are drawn in.
// Makeup leaves out the brush: in the app it cuts the face lines through an SVG mask.

export const ICONS = {
  nails: `
    <path d="M23.4 46 V25.6 a4.6 4.6 0 0 1 9.2 0 V46"/>
    <path d="M25 30 V25 Q28 18.5 31 25 V30 Q28 32 25 30Z"/>
    <path d="M25.6 41 q2.4 1.2 4.8 0"/>
    <g transform="translate(21.6 14.6) rotate(-45)">
      <rect x="-1.9" y="-17" width="3.8" height="14.5" rx="1.9"/>
      <rect x="-2.4" y="-2.5" width="4.8" height="3.4" rx="0.8"/>
      <path d="M-2.2 0.9 L-1.3 5 Q0 7.2 1.3 5 L2.2 0.9"/>
    </g>
    <path d="M40 5.8 Q40.67 9.33 44.2 10 Q40.67 10.67 40 14.2 Q39.33 10.67 35.8 10 Q39.33 9.33 40 5.8Z"/>
    <path d="M42 18.6 Q42.38 20.62 44.4 21 Q42.38 21.38 42 23.4 Q41.62 21.38 39.6 21 Q41.62 20.62 42 18.6Z"/>`,
  hair: `
    <g transform="translate(12 24) rotate(-18)">
      <rect x="-3.2" y="-18" width="6.4" height="36" rx="2.4"/>
      <path d="M3.2 -14.5 h4.2 M3.2 -10.5 h4.2 M3.2 -6.5 h4.2 M3.2 -2.5 h4.2 M3.2 1.5 h4.2 M3.2 5.5 h4.2 M3.2 9.5 h4.2 M3.2 13.5 h4.2"/>
    </g>
    <g transform="translate(35 24)">
      <circle cx="-5" cy="14.5" r="4.2"/>
      <circle cx="5" cy="14.5" r="4.2"/>
      <path d="M-2.6 11.1 L1.3 -1.2 Q4.4 -10 6.2 -19 Q2.2 -11 -0.9 -3.6"/>
      <path d="M2.6 11.1 L-1.3 -1.2 Q-4.4 -10 -6.2 -19 Q-2.2 -11 0.9 -3.6"/>
      <circle cx="0" cy="3.2" r="1"/>
    </g>`,
  brows_lashes: `
    <path d="M7 17 Q20 6 39 11.5 Q24 10.5 9 19.5Z"/>
    <path d="M7 28 Q24 39 41 28"/>
    <path d="M13.8 31.5 l-2.5 5 M19 33.3 l-1.3 5.4 M24 33.8 v5.6 M29 33.3 l1.3 5.4 M34.2 31.5 l2.5 5 M38.4 29.6 l3.8 3.6"/>`,
  makeup: `
    <circle cx="24" cy="6.8" r="3.8"/>
    <path d="M12 24 C12 15.5 17.2 10.6 24 10.6 C30.8 10.6 36 15.5 36 24"/>
    <path d="M13.6 22.5 C13.6 31.5 18 37 24 37 C30 37 34.4 31.5 34.4 22.5"/>
    <path d="M13.6 22.5 C17.5 21.8 21.4 19.6 23.6 15.8 C25.8 19.6 30 21.8 34.4 22.5"/>
    <path d="M17.6 26.4 q1.8 1.3 3.6 0 M26.8 26.4 q1.8 1.3 3.6 0"/>
    <path d="M21.8 31.6 q2.2 1.5 4.4 0"/>
    <path d="M20.6 36.4 V40.6 M27.4 36.4 V40.6"/>
    <path d="M8 46.5 C10 43.2 14.4 41.6 20.6 40.6 M40 46.5 C38 43.2 33.6 41.6 27.4 40.6"/>`,
  skincare: `
    <path d="M9.5 24 q1 -5 5.5 -4.2 q2.5 -3.8 6 0 q4 -0.6 5 4.2"/>
    <rect x="6" y="24" width="21" height="6" rx="2"/>
    <path d="M7.8 30 V39.5 a4.5 4.5 0 0 0 4.5 4.5 h8.4 a4.5 4.5 0 0 0 4.5 -4.5 V30"/>
    <path d="M11.5 36.5 h10"/>
    <path d="M29 4.5 H43 L41.2 31.5 Q40.8 34 38.3 34 H33.7 Q31.2 34 30.8 31.5 Z"/>
    <path d="M29.2 8 H42.8"/>
    <rect x="32" y="34" width="8" height="10" rx="1.6"/>
    <circle cx="36" cy="19" r="3.8"/>`,
  massage_body: `
    <ellipse cx="18" cy="39.5" rx="13.5" ry="4.5"/>
    <ellipse cx="18" cy="31" rx="10.5" ry="4"/>
    <ellipse cx="18" cy="23.8" rx="7" ry="3.2"/>
    <path d="M14 17 q-2.2 -3 0 -6 q2.2 -3 0 -6 M21.5 16 q-2.2 -3 0 -6 q2.2 -3 0 -5"/>
    <rect x="33" y="27" width="10" height="17" rx="1.4"/>
    <path d="M38 26.5 v-2"/>
    <path d="M38 14.5 q-3.2 4.2 -3.2 6.6 a3.2 3.2 0 0 0 6.4 0 q0 -2.4 -3.2 -6.6z"/>`
};

export const PALETTES = {
  nails: [
    ['#F9D9E3', '#E8D5F5', '#F3B6CB', '#7A2E4C'],
    ['#FBE4D8', '#F6C9D6', '#F0A9BE', '#6E2A44'],
    ['#E4E0FA', '#F8DCE8', '#C9BDF2', '#4B3A7A']
  ],
  hair: [
    ['#FCE6D6', '#F7D2DE', '#F2B79A', '#7A3B2A'],
    ['#F3E3D3', '#E9D6F2', '#DDBB97', '#5E4030'],
    ['#FBE0E6', '#FFF1DC', '#F5B9C6', '#7A2E40']
  ],
  brows_lashes: [
    ['#E9E1F7', '#DCE7F8', '#CDBDEE', '#4E3A80'],
    ['#EFE4F8', '#F9E1EB', '#D9C2EF', '#5A3672'],
    ['#E1E6FA', '#EEE0F6', '#BFCBF2', '#36407A']
  ],
  makeup: [
    ['#FBE0E9', '#FCEBDD', '#F4AFC6', '#8A2E52'],
    ['#F8D7E2', '#EFDDF8', '#EBA7C0', '#742A57'],
    ['#FDE5DF', '#F9D3E1', '#F5B3A8', '#7C3036']
  ],
  skincare: [
    ['#DFF2EC', '#E8EEF9', '#B9E2D5', '#2F5E55'],
    ['#E6F4EA', '#FFF4E3', '#C6E6CF', '#3B6247'],
    ['#E2EEF8', '#E9F5EE', '#BCD6EF', '#2E4F6E']
  ],
  massage_body: [
    ['#DCEDE2', '#F1EBDD', '#B9DCC5', '#355E45'],
    ['#E5F0DD', '#E0ECEF', '#C6DFB4', '#3E5B33'],
    ['#EAE6DA', '#DCEDE2', '#D6CDB4', '#4F4A35']
  ]
};

export const AVATAR_TONES = [
  ['#F4B6C8', '#C9A8EE'],
  ['#F7C9A8', '#F2A7BE'],
  ['#BFD9F2', '#C9B8F0'],
  ['#B9E2D0', '#A9CBEB'],
  ['#E7B8D9', '#F5C6B1'],
  ['#C6DDB4', '#9FCFC2'],
  ['#D9C2EF', '#F3B6CB']
];
