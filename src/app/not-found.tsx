import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: copy.notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="py-28 text-center sm:py-40">
      <p className="font-serif text-6xl text-terracotta-300" aria-hidden="true">
        {copy.notFound.eyebrow}
      </p>
      <h1 className="mt-4 font-serif text-4xl font-medium text-espresso-900 sm:text-5xl">{copy.notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-espresso-500">{copy.notFound.text}</p>
      <ButtonLink href="/" className="mt-8">
        {copy.notFound.cta}
      </ButtonLink>
    </Container>
  );
}
