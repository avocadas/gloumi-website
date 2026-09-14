import type { Metadata } from "next";
import { Home } from "@/components/pages/Home";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";

export const metadata: Metadata = buildMetadata("lt", { kind: "home" });

export default function Page() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "home" })}>
      <Home lang="lt" />
    </SiteShell>
  );
}
