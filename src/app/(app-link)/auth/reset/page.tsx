import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates } from "@/content/lang";
import { requestLang } from "../../request-lang";
import { ResetPassword } from "./ResetPassword";

/**
 * https://gloumi.lt/auth/reset#token_hash=…&type=recovery – where the
 * password recovery email lands (db `office/db-email-report`). It used to
 * open Supabase's own blank page (developer, 2026-10-17).
 *
 * A Gloumi page with the new-password form. Nothing happens on opening it:
 * the password is set when the form is sent (`resetPassword`, one POST), so
 * a mail scanner cannot use the link up. No session is kept on gloumi.lt or
 * handed to the app; the person signs in in the app with the new password.
 * LT or EN from the browser, noindex, no referrer.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: getCopy(lang).passwordReset.title,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function ResetPasswordPage() {
  const lang = await requestLang();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 sm:py-28">
        <ResetPassword copy={getCopy(lang).passwordReset} />
      </Container>
    </SiteShell>
  );
}
