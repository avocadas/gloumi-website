import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/SystemPage";
import { getCopy } from "@/content/copy";
import { requestLang } from "./request-lang";

/* Share-link pages take their language from the browser, and so does their 404. */
export async function generateMetadata(): Promise<Metadata> {
  return { title: getCopy(await requestLang()).notFound.title, robots: { index: false } };
}

export default async function NotFound() {
  return <NotFoundPage lang={await requestLang()} />;
}
