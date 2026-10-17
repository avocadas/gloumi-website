import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/app/fonts";
import { requestLang } from "@/app/(app-link)/request-lang";
import { NotFoundPage } from "@/components/pages/SystemPage";
import { getCopy } from "@/content/copy";
import { LANG_LABELS } from "@/content/lang";

/*
 * 404 visam adresui, kurio neatitinka joks maršrutas (developeris 2026-10-17:
 * „error 404 turi buti custom“). Svetainė turi kelis šakninius išdėstymus, tad
 * vieno, iš kurio sudėti 404, nėra – Next tada rodydavo savo „404: This page
 * could not be found.“. Šis failas (Next `experimental.globalNotFound`)
 * apeina išdėstymus, todėl stilius, šriftus ir <html> nešasi pats. Kalba – iš
 * naršyklės, kaip dalinimosi nuorodų puslapiuose.
 */
export async function generateMetadata(): Promise<Metadata> {
  return { title: `${getCopy(await requestLang()).notFound.title} · Gloumi` };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F6F0",
  colorScheme: "light",
};

export default async function GlobalNotFound() {
  const lang = await requestLang();
  return (
    <html lang={LANG_LABELS[lang].htmlLang} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-100 text-espresso-900">
        <NotFoundPage lang={lang} />
      </body>
    </html>
  );
}
