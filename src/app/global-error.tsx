"use client";

import { useEffect } from "react";
import "./globals.css";
import { fontVariables } from "@/app/fonts";

/*
 * Paskutinė riba: nulūžo pats šakninis išdėstymas, tad nėra nei antraštės,
 * nei kalbos – puslapis sako abiem kalbomis (developeris 2026-10-17: viskas
 * savu dizainu). Be išorinių komponentų, kad pats nenulūžtų dėl to paties.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="lt" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-cream-100 px-4 py-20 text-center text-espresso-900">
        <p className="font-serif text-6xl text-terracotta-300" aria-hidden="true">
          Gloumi
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">Kažkas nepavyko</h1>
        <p className="mt-2 font-serif text-2xl text-espresso-500" lang="en">
          Something went wrong
        </p>
        <p className="mx-auto mt-4 max-w-md text-espresso-500">
          Bandykite dar kartą po akimirkos. <span lang="en">Try again in a moment.</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-terracotta-600 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-700"
          >
            Bandyti dar kartą · Try again
          </button>
          {/* Visas puslapio įkėlimas: išdėstymas nulūžęs, kliento perėjimas jo neatkurtų. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="rounded-full px-6 py-3 text-sm font-semibold text-espresso-700 ring-1 ring-espresso-900/15 hover:bg-white">
            gloumi.lt
          </a>
        </div>
        {error.digest ? <p className="mt-6 font-mono text-xs text-espresso-400">#{error.digest}</p> : null}
      </body>
    </html>
  );
}
