import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCopy } from "@/content/copy";
import { alternates, homePath, type Lang } from "@/content/lang";

/*
 * Sisteminiai puslapiai – 404 ir klaida – savu Gloumi dizainu, ne Next ar
 * naršyklės numatytaisiais (developeris 2026-10-17: „reikia ir website visko
 * custom, kaip appse, pvz error 404 turi buti custom“). Tas pats išdėstymas
 * visuose medžiuose: antraštė ir poraštė, didelis serif ženklas, sakinys ir
 * mygtukas į pradžią. Kalba ateina iš medžio arba, kai adresas nepažįstamas,
 * iš naršyklės.
 */
export function SystemPage({
  lang,
  eyebrow,
  title,
  text,
  actions,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  text: string;
  /** Mygtukai po sakiniu; be jų – vienas „į pradžią“. */
  actions?: ReactNode;
}) {
  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="py-28 text-center sm:py-40">
        <p className="font-serif text-6xl text-terracotta-400" aria-hidden="true">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-espresso-500 text-pretty">{text}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions ?? <ButtonLink href={homePath(lang)}>{getCopy(lang).notFound.cta}</ButtonLink>}
        </div>
      </Container>
    </SiteShell>
  );
}

/** 404 viename iš kalbų medžių. */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const copy = getCopy(lang).notFound;
  return <SystemPage lang={lang} eyebrow={copy.eyebrow} title={copy.title} text={copy.text} />;
}
