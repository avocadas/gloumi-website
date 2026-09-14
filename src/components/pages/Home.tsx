import { CategoriesSection } from "@/components/sections/Categories";
import { FinalCta } from "@/components/sections/FinalCta";
import { ForMasters } from "@/components/sections/ForMasters";
import { Hero } from "@/components/sections/Hero";
import { WhyGloumi } from "@/components/sections/WhyGloumi";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Lang } from "@/content/lang";

/** The landing page itself, shared by both languages. */
export function Home({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd lang={lang} />
      <Hero lang={lang} />
      <CategoriesSection lang={lang} />
      <WhyGloumi lang={lang} />
      <ForMasters lang={lang} />
      <FinalCta lang={lang} />
    </>
  );
}
