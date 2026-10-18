import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates } from "@/content/lang";
import { mfaResetEnabled } from "@/lib/mfa-reset";
import { requestLang } from "../../request-lang";
import { CancelReset } from "./CancelReset";

/**
 * https://gloumi.lt/2fa-pagalba/atsaukti#t=… – the "It was not me – cancel"
 * link in every warning of a pending 2FA removal (procedure 5.3, step D) or
 * account recovery without the account's email (variant A, step 3); the
 * texts are neutral, as they serve both. One button,
 * so a mail scanner opening the link cancels nothing; the token stays after
 * `#` and goes only to the Edge function. Same headers as /2fa-pagalba.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: getCopy(lang).mfaHelp.cancelTitle,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function CancelResetPage() {
  if (!mfaResetEnabled()) notFound();
  const lang = await requestLang();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 text-center sm:py-28">
        <CancelReset copy={getCopy(lang).mfaHelp} />
      </Container>
    </SiteShell>
  );
}
