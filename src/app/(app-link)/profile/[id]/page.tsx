import type { Metadata } from "next";
import { cache } from "react";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import { loadPublicMaster, loadPublicMedia } from "@/lib/public-master";
import { loadPublicReviews } from "@/lib/public-reviews";
import { AppLinkPage } from "../../AppLinkPage";
import { APP_SCHEME, masterCode, profileId } from "../../codes";
import { MasterPage } from "../../MasterPage";
import { MasterReviews } from "../../MasterReviews";
import { requestLang } from "../../request-lang";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Metaduomenys ir puslapis tą patį meistrą skaito vieną kartą per užklausą. */
const masterOf = cache(async (rawId: string) => {
  const id = profileId(rawId);
  return id ? loadPublicMaster(id) : null;
});

/**
 * https://gloumi.lt/profile/<id>[?mk=<master code>] – a master's shared profile link (#210).
 * A public master gets the full page, indexed (K-W1); anyone else – a hidden,
 * suspended or unknown profile – the plain, unindexed link to the app (U-22).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, lang] = await Promise.all([params, requestLang()]);
  const master = await masterOf(id);
  if (!master) return { title: getCopy(lang).appLink.profileTitle, robots: { index: false, follow: false } };
  const where = [master.city, master.district].filter(Boolean).join(", ");
  return {
    title: [master.name, master.specialty].filter(Boolean).join(" – "),
    description: [master.specialty, where].filter(Boolean).join(" · ") || undefined,
    alternates: { canonical: `${site.url}/profile/${profileId(id)}` },
    robots: { index: true, follow: true },
  };
}

export default async function ProfileLink({ params, searchParams }: Props) {
  const [{ id: rawId }, query, lang] = await Promise.all([params, searchParams, requestLang()]);
  // A mangled id (a link cut short in a chat) still gets the page: the app and
  // the stores are what the visitor needs, only the profile itself is lost.
  const id = profileId(rawId);
  const code = masterCode(query.mk);
  const appHref = id ? `${APP_SCHEME}://profile/${id}${code ? `?mk=${code}` : ""}` : `${APP_SCHEME}://`;
  // Reviews only for an existing master; a missing one, or a database that did
  // not answer, leaves the page as the plain link it always was.
  const [master, reviews] = id ? await Promise.all([masterOf(rawId), loadPublicReviews(id)]) : [null, null];
  // Nuotraukos – tik viešam meistrui ir tik tai, ką pasirašė funkcija; be jų puslapis vis tiek pilnas.
  const media = master && id ? await loadPublicMedia(id) : {};
  const reviewsSection = reviews ? (
    <MasterReviews lang={lang} data={reviews} pageUrl={`${site.url}/profile/${id}`} />
  ) : null;

  if (master) {
    return (
      <MasterPage lang={lang} master={master} appHref={appHref} code={code} media={media}>
        {reviewsSection}
      </MasterPage>
    );
  }
  return (
    <AppLinkPage lang={lang} kind="profile" appHref={appHref} code={code}>
      {reviewsSection}
    </AppLinkPage>
  );
}
