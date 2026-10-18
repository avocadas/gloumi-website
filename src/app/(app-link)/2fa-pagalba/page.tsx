import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates } from "@/content/lang";
import { mfaResetEnabled } from "@/lib/mfa-reset";
import { requestLang } from "../request-lang";
import { MfaHelp } from "./MfaHelp";

/**
 * https://gloumi.lt/2fa-pagalba#k=… – where the code email of the 2FA removal
 * through support lands (security procedure 2026-10-18, step C). The code is
 * after `#`, so it never reaches a server log or a `Referer`; the page reads
 * it in the browser and sends it, with the optional password, straight to the
 * Edge function `mfa-reset`. Nothing is read or kept on gloumi.lt.
 *
 * Strict CSP with Turnstile, `Referrer-Policy: no-referrer`, noindex and
 * no-store come from the proxy (`mfaHelpCsp`). Until `MFA_RESET_ENABLED=1`
 * the page does not exist.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: getCopy(lang).mfaHelp.title,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function MfaHelpPage() {
  if (!mfaResetEnabled()) notFound();
  const lang = await requestLang();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 sm:py-28">
        <MfaHelp copy={getCopy(lang).mfaHelp} lang={lang} />
      </Container>
    </SiteShell>
  );
}
