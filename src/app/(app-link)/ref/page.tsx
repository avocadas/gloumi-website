import type { Metadata } from "next";
import { getCopy } from "@/content/copy";
import { AppLinkPage } from "../AppLinkPage";
import { APP_SCHEME, referralCode } from "../codes";
import { requestLang } from "../request-lang";

/** https://gloumi.lt/ref?code=<referral code> – an invitation link (#210). */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return { title: getCopy(lang).appLink.refTitle, robots: { index: false, follow: false } };
}

export default async function ReferralLink({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [query, lang] = await Promise.all([searchParams, requestLang()]);
  const code = referralCode(query.code);
  const appHref = `${APP_SCHEME}://ref${code ? `?code=${code}` : ""}`;
  return <AppLinkPage lang={lang} kind="ref" appHref={appHref} code={code} />;
}
