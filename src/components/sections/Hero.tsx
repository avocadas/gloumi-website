import { CalendarCheck, Check, Star } from "lucide-react";
import { PhoneMockup } from "@/components/sections/PhoneMockup";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { copy } from "@/content/copy";

export function Hero() {
  const h = copy.hero;
  return (
    <section id="pradzia" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Soft colour fields behind the hero – purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-12%] h-[560px] w-[560px] rounded-full bg-terracotta-100/70 blur-3xl" />
        <div className="absolute bottom-[-25%] left-[-12%] h-[480px] w-[480px] rounded-full bg-sand-200 blur-3xl" />
        <div className="absolute right-[18%] top-[45%] h-[340px] w-[340px] rounded-full bg-mauve-100/70 blur-3xl" />
      </div>

      <Container className="grid items-center gap-14 pb-16 pt-8 sm:pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="max-w-xl animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">{h.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-5 font-serif text-[2.75rem] font-medium leading-[1.02] tracking-[-0.02em] text-espresso-900 text-balance sm:text-6xl lg:text-[4.1rem]"
          >
            {h.titleStart} <em className="text-terracotta-600">{h.titleAccent}</em> {h.titleEnd}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-espresso-500 text-pretty">{h.lead}</p>

          <div id="atsisiusti" className="mt-9 scroll-mt-28">
            <StoreBadges />
            <div className="mt-4">
              <ButtonLink href="/#meistrams" variant="outline">
                {h.masterCta}
              </ButtonLink>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-espresso-500" aria-label={h.trustLabel}>
            {h.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-sage-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[440px] animate-fade-up [animation-delay:150ms] lg:max-w-none">
          <PhoneMockup />

          {/*
            Floating proof cards – decorative echoes of what the app shows.
            Only from xl up: below that the column is too narrow and the cards
            would sit on top of the phone's content instead of its bezel.
          */}
          <div
            aria-hidden="true"
            className="absolute -left-1 top-[13%] hidden animate-float rounded-2xl bg-white/90 p-2.5 pr-4 shadow-card ring-1 ring-espresso-900/5 backdrop-blur [animation-delay:1.2s] xl:block"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-600">
                <Star className="h-4 w-4 fill-current" />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold leading-none text-espresso-900">{h.floatingRating.value}</p>
                <p className="mt-1 text-[11px] text-espresso-500">{h.floatingRating.label}</p>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -right-1 bottom-[10%] hidden animate-float rounded-2xl bg-white/90 p-2.5 pr-4 shadow-card ring-1 ring-espresso-900/5 backdrop-blur [animation-delay:2.6s] xl:block"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sage-500">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-semibold leading-none text-espresso-900">{h.floatingBooking.title}</p>
                <p className="mt-1 text-[11px] text-espresso-500">{h.floatingBooking.sub}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
