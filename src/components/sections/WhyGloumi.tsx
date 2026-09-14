import { BadgeCheck, CalendarCheck, Receipt, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCopy } from "@/content/copy";
import { sectionId, type Lang } from "@/content/lang";

const ICONS = [CalendarCheck, Sparkles, Receipt, BadgeCheck];

export function WhyGloumi({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  return (
    <section id={sectionId(lang, "why")} aria-labelledby="kodel-title" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading id="kodel-title" eyebrow={copy.why.eyebrow} title={copy.why.title} lead={copy.why.lead} />

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {copy.why.items.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <li key={item.title}>
                <Reveal delay={index * 0.08} className="h-full">
                  <article className="flex h-full flex-col rounded-3xl bg-cream-100 p-7 ring-1 ring-espresso-900/5 sm:p-8">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-terracotta-600 shadow-card">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-serif text-2xl font-medium text-espresso-900 text-balance">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-espresso-500 text-pretty">{item.text}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-20">
          <Reveal>
            <h3 className="font-serif text-3xl font-medium text-espresso-900">{copy.why.howTitle}</h3>
          </Reveal>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {copy.why.steps.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 0.1}>
                  <div className="flex gap-5 sm:flex-col sm:gap-4">
                    <span className="font-serif text-5xl font-medium leading-none text-terracotta-300" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-espresso-900">{step.title}</p>
                      <p className="mt-1.5 leading-relaxed text-espresso-500">{step.text}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
