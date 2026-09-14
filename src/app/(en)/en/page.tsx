import type { Metadata } from "next";
import { Home } from "@/components/pages/Home";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { buildMetadata } from "@/content/metadata";

export const metadata: Metadata = buildMetadata("en", { kind: "home" });

export default function Page() {
  return (
    <SiteShell lang="en" alternates={alternates({ kind: "home" })}>
      <Home lang="en" />
    </SiteShell>
  );
}
