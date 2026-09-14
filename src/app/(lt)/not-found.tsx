import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteShell } from "@/components/layout/SiteShell";
import { alternates } from "@/content/lang";
import { getCopy } from "@/content/copy";
import { homePath } from "@/content/lang";

const copy = getCopy("lt");

export const metadata: Metadata = {
  title: copy.notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell lang="lt" alternates={alternates({ kind: "home" })}>
    <Container className="py-28 text-center sm:py-40">
      <p className="font-serif text-6xl text-terracotta-300" aria-hidden="true">
        {copy.notFound.eyebrow}
      </p>
      <h1 className="mt-4 font-serif text-4xl font-medium text-espresso-900 sm:text-5xl">{copy.notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-espresso-500">{copy.notFound.text}</p>
      <ButtonLink href={homePath("lt")} className="mt-8">
        {copy.notFound.cta}
      </ButtonLink>
    </Container>
    </SiteShell>
  );
}
