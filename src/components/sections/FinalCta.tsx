import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { getCopy } from "@/content/copy";
import { sectionHref, type Lang } from "@/content/lang";

export function FinalCta({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <Container className="text-center">
        <Reveal>
          <h2
            id="cta-title"
            className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-espresso-900 text-balance sm:text-6xl"
          >
            {copy.finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-espresso-500 text-pretty">{copy.finalCta.lead}</p>
          <StoreBadges lang={lang} className="mt-10 justify-center" />
          <ButtonLink href={sectionHref(lang, "join")} variant="ghost" className="mt-4">
            {copy.finalCta.masterLink}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
