import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates } from "@/content/lang";
import { requestLang } from "../request-lang";
import { ConfirmEmail } from "./ConfirmEmail";

/**
 * https://gloumi.lt/patvirtinta#token_hash=…&type=email – where the email
 * confirmation link lands (db `office/db-signup-code`). Opened on a computer,
 * the old link tried to open the app and left an empty page.
 *
 * The page itself confirms nothing: the address is confirmed when the reader
 * presses the button (`confirmEmail`, a POST), so a mail scanner opening the
 * link does not use it up. It reads nothing on the server, keeps no session,
 * and passes none to the app – the app is only opened, and the person signs
 * in there (security). LT or EN from the browser, noindex, no referrer.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: getCopy(lang).emailConfirm.askTitle,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function ConfirmEmailPage() {
  const lang = await requestLang();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 text-center sm:py-28">
        <ConfirmEmail copy={getCopy(lang).emailConfirm} />
      </Container>
    </SiteShell>
  );
}
