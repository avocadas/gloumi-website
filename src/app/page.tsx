import type { Metadata } from "next";
import { CategoriesSection } from "@/components/sections/Categories";
import { FinalCta } from "@/components/sections/FinalCta";
import { ForMasters } from "@/components/sections/ForMasters";
import { Hero } from "@/components/sections/Hero";
import { WhyGloumi } from "@/components/sections/WhyGloumi";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <CategoriesSection />
      <WhyGloumi />
      <ForMasters />
      <FinalCta />
    </>
  );
}
