import type { Metadata } from "next";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import { loadPublicReviews } from "@/lib/public-reviews";
import { AppLinkPage } from "../../AppLinkPage";
import { APP_SCHEME, masterCode, profileId } from "../../codes";
import { MasterReviews } from "../../MasterReviews";
import { requestLang } from "../../request-lang";

/** https://gloumi.lt/profile/<id>[?mk=<master code>] – a master's shared profile link (#210). */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  return { title: getCopy(lang).appLink.profileTitle, robots: { index: false, follow: false } };
}

export default async function ProfileLink({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id: rawId }, query, lang] = await Promise.all([params, searchParams, requestLang()]);
  // A mangled id (a link cut short in a chat) still gets the page: the app and
  // the stores are what the visitor needs, only the profile itself is lost.
  const id = profileId(rawId);
  const code = masterCode(query.mk);
  const appHref = id ? `${APP_SCHEME}://profile/${id}${code ? `?mk=${code}` : ""}` : `${APP_SCHEME}://`;
  // Reviews only for an existing master; a missing one, or a database that did
  // not answer, leaves the page as the plain link it always was.
  const reviews = id ? await loadPublicReviews(id) : null;
  return (
    <AppLinkPage lang={lang} kind="profile" appHref={appHref} code={code}>
      {reviews ? <MasterReviews lang={lang} data={reviews} pageUrl={`${site.url}/profile/${id}`} /> : null}
    </AppLinkPage>
  );
}
