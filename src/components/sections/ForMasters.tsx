import { BellRing, ChartColumn, LayoutGrid, ShieldCheck } from "lucide-react";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCopy } from "@/content/copy";
import { sectionId, type Lang } from "@/content/lang";

const ICONS = [ShieldCheck, BellRing, LayoutGrid, ChartColumn];

export function ForMasters({ lang }: { lang: Lang }) {
  const copy = getCopy(lang);
  return (
    <section id={sectionId(lang, "masters")} aria-labelledby="meistrams-title" className="scroll-mt-20 py-6 sm:py-10">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-espresso-900 px-6 py-14 text-cream-100 sm:px-12 sm:py-20 lg:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-terracotta-600/25 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full bg-plum-500/30 blur-3xl" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <SectionHeading
                id="meistrams-title"
                tone="dark"
                eyebrow={copy.masters.eyebrow}
                title={copy.masters.title}
                lead={copy.masters.lead}
              />

              <ul className="mt-10 grid gap-7 sm:grid-cols-2">
                {copy.masters.items.map((item, index) => {
                  const Icon = ICONS[index];
                  return (
                    <li key={item.title}>
                      <Reveal delay={index * 0.08}>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-terracotta-300 ring-1 ring-white/10">
                          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <h3 className="mt-4 font-serif text-xl font-medium text-cream-50 sm:text-2xl">{item.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-sand-400 text-pretty">{item.text}</p>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-10 flex flex-wrap gap-2" aria-label={copy.masters.chipsLabel}>
                {copy.masters.chips.map((chip) => (
                  <li key={chip} className="rounded-full bg-white/6 px-3.5 py-1.5 text-sm text-sand-200 ring-1 ring-white/10">
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <div id={sectionId(lang, "join")} className="scroll-mt-28 lg:pt-2">
              <WaitlistForm lang={lang} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
