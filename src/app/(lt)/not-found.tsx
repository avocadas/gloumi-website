import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/SystemPage";
import { getCopy } from "@/content/copy";

export const metadata: Metadata = {
  title: getCopy("lt").notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage lang="lt" />;
}
