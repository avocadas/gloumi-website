import type { Metadata } from "next";
import { TranslatedLegal, translatedMetadata } from "../TranslatedLegal";

type Props = { params: Promise<{ locale: string }> };

export function generateMetadata({ params }: Props): Promise<Metadata> {
  return translatedMetadata(params, "terms");
}

export default function Page({ params }: Props) {
  return <TranslatedLegal params={params} doc="terms" />;
}
