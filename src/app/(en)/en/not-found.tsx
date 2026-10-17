import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/SystemPage";
import { getCopy } from "@/content/copy";

/* `notFound()` inside the English tree: the English 404, not the Lithuanian one. */
export const metadata: Metadata = {
  title: getCopy("en").notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage lang="en" />;
}
