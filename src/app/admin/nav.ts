import type { IconComponent } from "@/components/icons";
import {
  IconAlert,
  IconBadgePercent,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFlag,
  IconLayoutGrid,
  IconMail,
  IconReceipt,
  IconScale,
  IconShieldCheck,
  IconSparkles,
  IconUsers,
} from "@/components/icons";
import type { QueueCounts } from "./queue-counts";

/*
 * Portalo navigacija (design `admin-portalas.md` 1.1): visi puslapiai, trimis
 * grupėmis. Skaičius – tik ten, kur yra eilė. „Naudotojai“ – dabar paieška
 * Duomenyse; „Duomenų lentelės“ – tas pats puslapis, lentelių sąrašas.
 */
export type Section =
  | "overview"
  | "reports"
  | "contentReview"
  | "support"
  | "disputes"
  | "warnings"
  | "users"
  | "grants"
  | "debts"
  | "mfaReset"
  | "appBuilds"
  | "errors"
  | "data"
  | "account";

export type NavItem = {
  key: Exclude<Section, "account">;
  href: string;
  label: string;
  Icon: IconComponent;
  count?: keyof QueueCounts;
};

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Laukia sprendimo",
    items: [
      { key: "overview", href: "/admin", label: "Apžvalga", Icon: IconLayoutGrid },
      { key: "reports", href: "/admin/reports", label: "Skundai", Icon: IconFlag, count: "reports" },
      { key: "contentReview", href: "/admin/content-review", label: "Turinio peržiūra", Icon: IconEye, count: "contentReview" },
      { key: "support", href: "/admin/support", label: "Pagalba", Icon: IconMail, count: "support" },
      { key: "disputes", href: "/admin/disputes", label: "Ginčai", Icon: IconScale, count: "disputes" },
      { key: "warnings", href: "/admin/warnings", label: "Rezervavimo įspėjimai", Icon: IconCalendar },
    ],
  },
  {
    title: "Žmonės ir pinigai",
    items: [
      { key: "users", href: "/admin/data", label: "Naudotojai", Icon: IconUsers },
      { key: "grants", href: "/admin/grants", label: "Individualios sąlygos", Icon: IconBadgePercent },
      { key: "debts", href: "/admin/debts", label: "Skolos", Icon: IconReceipt, count: "debts" },
      { key: "mfaReset", href: "/admin/mfa-reset", label: "2FA atstatymas", Icon: IconShieldCheck },
    ],
  },
  {
    title: "Sistema",
    items: [
      { key: "appBuilds", href: "/admin/app-builds", label: "Programėlės versijos", Icon: IconSparkles },
      { key: "errors", href: "/admin/errors", label: "Programėlės klaidos", Icon: IconAlert },
      { key: "data", href: "/admin/data#lenteles", label: "Duomenų lentelės", Icon: IconDatabase },
    ],
  },
];

/** Telefono apačios juosta – 4 dažniausios eilės (1.3). */
export const BOTTOM_KEYS: NavItem["key"][] = ["overview", "reports", "support", "disputes"];

export const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
