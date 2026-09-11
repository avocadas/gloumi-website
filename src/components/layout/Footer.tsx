import Link from "next/link";
import { Mail } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { copy } from "@/content/copy";
import { site } from "@/content/site";

type FooterLink = { readonly href: string; readonly label: string };
type SocialKey = keyof typeof site.social;

function SocialIcon({ name }: { name: SocialKey }) {
  const common = { className: "h-4.5 w-4.5", "aria-hidden": true as const, focusable: "false" as const };
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
      <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />
    </svg>
  );
}

function Column({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-espresso-700 transition-colors hover:text-terracotta-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const socials = (Object.keys(site.social) as SocialKey[]).filter((key) => site.social[key]);

  return (
    <footer id="kontaktai" className="scroll-mt-24 border-t border-espresso-900/8 bg-cream-200">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-md text-plum-700" aria-label={copy.nav.home}>
              <BrandMark title="" className="h-10 w-10 rounded-xl" />
              <Wordmark title="" className="h-7 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-espresso-500">{copy.footer.tagline}</p>
            {socials.length > 0 ? (
              <ul aria-label={copy.footer.socialLabel} className="mt-5 flex gap-2">
                {socials.map((key) => (
                  <li key={key}>
                    <a
                      href={site.social[key] ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={copy.footer.social[key]}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-espresso-700 shadow-card transition-colors hover:text-terracotta-600"
                    >
                      <SocialIcon name={key} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Column title={copy.footer.clients} links={copy.footer.clientLinks} />
          <Column title={copy.footer.masters} links={copy.footer.masterLinks} />
          <Column title={copy.footer.legal} links={copy.footer.legalLinks} />
        </div>

        <div className="mt-12 grid gap-8 border-t border-espresso-900/8 pt-8 md:grid-cols-[1.2fr_2fr]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-espresso-400">{copy.footer.contacts}</h2>
            <p className="mt-3 text-sm font-semibold text-espresso-900">{site.legalName}</p>
            {site.company.code ? (
              <p className="text-sm text-espresso-500">
                {copy.footer.companyLabel} {site.company.code}
              </p>
            ) : null}
            {site.company.vatCode ? (
              <p className="text-sm text-espresso-500">
                {copy.footer.vatLabel} {site.company.vatCode}
              </p>
            ) : null}
            {site.company.address ? <p className="text-sm text-espresso-500">{site.company.address}</p> : null}
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {site.email}
            </a>
          </div>
          <div className="text-sm leading-relaxed text-espresso-500">
            <p>
              {copy.footer.operator} {site.legalName},{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-terracotta-600 hover:text-terracotta-700">
                {site.email}
              </a>
              .
            </p>
            <p className="mt-3 text-xs text-espresso-400">{copy.footer.trademarks}</p>
          </div>
        </div>

        <p className="mt-8 text-xs text-espresso-400">
          © {year} {site.legalName}. {copy.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
