import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates } from "@/content/lang";
import { requestLang } from "../../request-lang";
import { EmailConfirmed } from "./EmailConfirmed";

/**
 * https://gloumi.lt/auth/confirmed – where the email confirmation link lands
 * (Supabase Auth `redirect_to`). The address is confirmed by Supabase before
 * the redirect, but when the email is opened on another device the app link
 * goes nowhere and the reader saw an empty page. This one says it worked and
 * offers the app – a button, not an automatic redirect, which on a computer
 * would end on the same blank page.
 *
 * It reads nothing from the database and keeps nothing: what the address
 * carries is read in the browser (`EmailConfirmed`). No referrer leaves it,
 * so a code in the address never reaches the store pages behind the badges.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return {
    title: getCopy(lang).emailConfirm.title,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function EmailConfirmedPage() {
  const lang = await requestLang();
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 text-center sm:py-28">
        <EmailConfirmed copy={getCopy(lang).emailConfirm} />
      </Container>
    </SiteShell>
  );
}
