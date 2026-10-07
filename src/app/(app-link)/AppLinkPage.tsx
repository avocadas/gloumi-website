import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { getCopy } from "@/content/copy";
import { alternates, homePath, type Lang } from "@/content/lang";

/*
 * What a share link shows when the app did not open it: no app on the phone,
 * or the link opened inside a browser (Instagram, Messenger) that does not
 * hand it to the app. Nothing about the person is shown – the page reads no
 * data, it only says where to go and offers the same link in the app's own
 * scheme, which opens the app when it is installed.
 *
 * The code, when the link carries one, is shown because a freshly installed
 * app does not receive the link it was installed from: without it the
 * invitation would be lost on the way.
 */
export function AppLinkPage({
  lang,
  kind,
  appHref,
  code,
}: {
  lang: Lang;
  kind: "profile" | "ref";
  /** The same link in the app's scheme; built only from validated parts. */
  appHref: string;
  code: string | null;
}) {
  const copy = getCopy(lang).appLink;
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-20 text-center sm:py-28">
        <h1 className="mx-auto max-w-xl font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl">
          {kind === "profile" ? copy.profileTitle : copy.refTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-espresso-500 text-pretty">{copy.text}</p>

        <ButtonLink href={appHref} size="lg" className="mt-8">
          {copy.open}
        </ButtonLink>

        {code ? (
          <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-white px-6 py-5 shadow-card ring-1 ring-espresso-900/5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">
              {kind === "profile" ? copy.masterCode : copy.referralCode}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.12em] text-espresso-900">{code}</p>
            <p className="mt-2 text-sm leading-relaxed text-espresso-500">{copy.codeHint}</p>
          </div>
        ) : null}

        <StoreBadges lang={lang} className="mt-10 justify-center" />

        <p className="mt-10">
          <a href={homePath(lang)} className="font-medium text-terracotta-600 underline-offset-2 hover:underline">
            {copy.home}
          </a>
        </p>
      </Container>
    </SiteShell>
  );
}
