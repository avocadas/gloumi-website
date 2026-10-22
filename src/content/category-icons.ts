import type { IconComponent } from "@/components/icons";
import {
  IconCategoryBrows,
  IconCategoryHair,
  IconCategoryMakeup,
  IconCategoryMassage,
  IconCategoryNails,
  IconCategorySkincare,
} from "@/components/icons/categories";
import type { CategoryId } from "./categories";

/**
 * The category icons on their own, without any text (web audit 2026-10-22).
 *
 * A client component that draws the category discs imports this, not
 * categories.ts: that module holds every language's category texts, and a
 * client import would ship all of them to every visitor. The texts reach the
 * client as props, for one language. categories.ts takes its icons from here,
 * so there is one place that says which icon a category has.
 */
export const CATEGORY_ICONS: Record<CategoryId, IconComponent> = {
  hair: IconCategoryHair,
  nails: IconCategoryNails,
  brows_lashes: IconCategoryBrows,
  massage_body: IconCategoryMassage,
  makeup: IconCategoryMakeup,
  skincare: IconCategorySkincare,
};
