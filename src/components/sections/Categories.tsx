import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategoryViews } from "@/content/categories";
import { getCopy } from "@/content/copy";
import { sectionHref, sectionId, type Lang } from "@/content/lang";
import { CategoryPicker } from "./CategoryPicker";

/**
 * The app's circular "highlight" categories, at the site's size and in the
 * site's frame (developer 2026-10-07: the icons as big as they were, only the
 * app's): the icon and its two colours are the app's (categories.ts), the
 * white ring, the shadow and the gradient ring that lights up on hover and
 * spins slowly while selected are the site's. The panel below shows what the
 * selected category holds.
 *
 * A server component (web audit 2026-10-22): the heading is plain HTML, and
 * only the picker below is a client component, which gets one language's
 * texts instead of importing every language's dictionary.
 */
export function CategoriesSection({ lang }: { lang: Lang }) {
  const copy = getCopy(lang).categories;
  return (
    <section id={sectionId(lang, "categories")} aria-labelledby="kategorijos-title" className="scroll-mt-24 bg-cream-200 py-20 sm:py-28">
      <Container>
        <SectionHeading id="kategorijos-title" align="center" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        <CategoryPicker
          items={getCategoryViews(lang)}
          listLabel={copy.listLabel}
          cta={copy.cta}
          downloadHref={sectionHref(lang, "download")}
        />
      </Container>
    </section>
  );
}
