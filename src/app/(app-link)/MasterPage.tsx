import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { getCopy } from "@/content/copy";
import { alternates, type Lang } from "@/content/lang";
import { isShowableWork, type PublicMaster, type PublicService } from "@/lib/public-master";

/*
 * Viešas meistro puslapis (#210, U-22): tik U-22 lentelės „Rodo“ stulpelis –
 * vardas, nuotrauka, pareigos, aprašymas, paslaugos su kainomis, trukmėmis ir
 * avansu, atšaukimo sąlygos ir taisyklės, darbai, darbo laikas, mokėjimo būdai,
 * patogumai, miestas ir rajonas (K-W2: be adreso ir žemėlapio). Atsiliepimai –
 * `children` (V-9). Jokių sekimo ar analitikos įrankių.
 *
 * Nuotraukos rodomos tik tada, kai `media` turi pasirašytą adresą: R2 privatus,
 * o be adreso puslapis lieka teisingas – tik be vaizdų.
 */

const LOCALE: Record<Lang, string> = { lt: "lt-LT", en: "en-GB" };

function money(lang: Lang, value: number): string {
  return value.toLocaleString(LOCALE[lang], { style: "currency", currency: "EUR", minimumFractionDigits: value % 1 ? 2 : 0 });
}

const fill = (template: string, n: number | string) => template.replace("{n}", String(n));

/** `getDay()` numeracija (0 – sekmadienis), kaip programėlėje; rodoma nuo pirmadienio. */
const mondayFirst = (weekday: number) => (weekday + 6) % 7;

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : "");

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-medium text-espresso-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ServiceRow({ lang, s }: { lang: Lang; s: PublicService }) {
  const copy = getCopy(lang).masterPage;
  const deposit =
    s.depositValue && s.depositValue > 0
      ? s.depositKind === "percent"
        ? fill(copy.depositPercent, s.depositValue)
        : `${copy.deposit} ${money(lang, s.depositValue)}`
      : null;
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-espresso-900">{s.title}</p>
        {s.description ? <p className="mt-1 text-sm leading-relaxed text-espresso-500">{s.description}</p> : null}
        <p className="mt-1 text-sm text-espresso-500">
          {[s.durationMinutes ? `${s.durationMinutes} ${copy.minutes}` : null, deposit].filter(Boolean).join(" · ")}
        </p>
      </div>
      {s.price !== null ? <p className="shrink-0 font-semibold tabular-nums text-espresso-900">{money(lang, s.price)}</p> : null}
    </li>
  );
}

export function MasterPage({
  lang,
  master,
  appHref,
  code,
  media,
  children,
}: {
  lang: Lang;
  master: PublicMaster;
  appHref: string;
  code: string | null;
  /** Pasirašyti viešų medijų adresai pagal `media_id`; tuščia – be nuotraukų. */
  media: Record<string, string>;
  children?: ReactNode;
}) {
  const all = getCopy(lang);
  const copy = all.masterPage;
  const place = [master.city, master.district].filter(Boolean).join(", ");
  const avatar = master.avatarMediaId ? media[master.avatarMediaId] : undefined;
  const works = master.portfolio.filter((w) => isShowableWork(w) && w.mediaId && media[w.mediaId]);

  // Paslaugos pagal kategoriją, kaip programėlėje; be kategorijos – pabaigoje.
  const groups = new Map<string, PublicService[]>();
  for (const s of master.services) {
    const key = s.category ?? "";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => (a === "" ? 1 : b === "" ? -1 : 0));

  const hours = [...master.hours].sort((a, b) => mondayFirst(a.weekday) - mondayFirst(b.weekday));

  return (
    <SiteShell lang={lang} alternates={alternates({ kind: "home" })}>
      <Container className="max-w-3xl py-14 sm:py-20">
        <header className="flex flex-col items-center text-center">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- pasirašytas adresas galioja ribotai, optimizatorius jo neturi saugoti
            <img
              src={avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-28 w-28 rounded-full bg-white object-cover ring-4 ring-white shadow-card"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-28 w-28 items-center justify-center rounded-full bg-white font-serif text-4xl text-espresso-400 ring-4 ring-white shadow-card"
            >
              {master.name.charAt(0).toUpperCase()}
            </span>
          )}
          <h1 className="mt-6 font-serif text-4xl font-medium text-espresso-900 text-balance sm:text-5xl">{master.name}</h1>
          <p className="mt-2 text-espresso-500">
            {[master.titleGender === "female" ? copy.titleFemale : copy.titleMale, master.specialty].filter(Boolean).join(" · ")}
            {place ? <span className="block text-sm">{place}</span> : null}
          </p>

          <ButtonLink href={appHref} size="lg" className="mt-8">
            {copy.book}
          </ButtonLink>
          {code ? (
            <p className="mt-4 text-sm text-espresso-500">
              {all.appLink.masterCode}: <span className="font-mono font-semibold tracking-[0.12em] text-espresso-900">{code}</span>
            </p>
          ) : null}
          <StoreBadges lang={lang} className="mt-8 justify-center" />
          <p className="mt-4 text-xs text-espresso-400">{copy.addressInApp}</p>
        </header>

        {master.bio || master.styleTags.length ? (
          <Section title={copy.about}>
            {master.bio ? <p className="leading-relaxed whitespace-pre-line text-espresso-700">{master.bio}</p> : null}
            {master.styleTags.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {master.styleTags.map((t) => (
                  <li key={t} className="rounded-full bg-white px-3 py-1 text-sm text-espresso-700 ring-1 ring-espresso-900/10">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>
        ) : null}

        {master.services.length ? (
          <Section title={copy.services}>
            {ordered.map(([category, list]) => (
              <div key={category || "-"} className="mb-6 rounded-2xl bg-white px-6 shadow-card ring-1 ring-espresso-900/5">
                {ordered.length > 1 ? (
                  <p className="pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-terracotta-600">
                    {category || copy.otherServices}
                  </p>
                ) : null}
                <ul className="divide-y divide-espresso-900/5">
                  {list.map((s) => (
                    <ServiceRow key={s.id} lang={lang} s={s} />
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        ) : null}

        {works.length ? (
          <Section title={copy.works}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {works.map((w) => (
                <li key={w.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element -- žr. avatarą */}
                  <img
                    src={media[w.mediaId as string]}
                    alt={w.title ?? ""}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="aspect-square w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {hours.length ? (
          <Section title={copy.hours}>
            <dl className="divide-y divide-espresso-900/5 rounded-2xl bg-white px-6 shadow-card ring-1 ring-espresso-900/5">
              {hours.map((h) => (
                <div key={h.weekday} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-espresso-700">{copy.weekdays[mondayFirst(h.weekday)]}</dt>
                  <dd className="tabular-nums text-espresso-900">
                    {h.off || !h.start || !h.end ? copy.dayOff : `${hhmm(h.start)}–${hhmm(h.end)}`}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        ) : null}

        <Section title={copy.terms}>
          <dl className="space-y-4 text-sm leading-relaxed">
            {master.cancellationPolicy && copy.cancellationPolicies[master.cancellationPolicy] ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.cancellation}</dt>
                <dd className="mt-1 text-espresso-700">{copy.cancellationPolicies[master.cancellationPolicy]}</dd>
              </div>
            ) : null}
            {master.bookingLeadHours ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.booking}</dt>
                <dd className="mt-1 text-espresso-700">{fill(copy.leadTime, master.bookingLeadHours)}</dd>
              </div>
            ) : null}
            {master.paymentMethods.length ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.payment}</dt>
                <dd className="mt-1 text-espresso-700">
                  {master.paymentMethods.map((m) => copy.paymentMethods[m] ?? m).join(", ")}
                </dd>
              </div>
            ) : null}
            {master.workFormats.length ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.workFormat}</dt>
                <dd className="mt-1 text-espresso-700">
                  {master.workFormats.map((f) => copy.workFormats[f] ?? f).join(", ")}
                </dd>
              </div>
            ) : null}
            {master.amenities.length ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.amenities}</dt>
                <dd className="mt-1 text-espresso-700">{master.amenities.join(", ")}</dd>
              </div>
            ) : null}
            {master.rules ? (
              <div>
                <dt className="font-semibold text-espresso-900">{copy.rules}</dt>
                <dd className="mt-1 whitespace-pre-line text-espresso-700">{master.rules}</dd>
              </div>
            ) : null}
          </dl>
        </Section>

        {children}
      </Container>
    </SiteShell>
  );
}
