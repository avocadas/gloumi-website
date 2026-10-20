import Link from "next/link";
import { AuthShell, btn } from "./ui";

/*
 * 404 portale. Ji rodoma ir prisijungusiam ne administratoriui (`notFound()`
 * puslapiuose), todėl nesako nieko apie portalą: nei ženklo, nei nuorodos į
 * jį – tik tai, ką pasakytų bet kuris puslapis, ir kelias į gloumi.lt.
 */
export default function AdminNotFound() {
  return (
    <AuthShell>
      <p className="font-app-serif text-5xl text-app-faint" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-app-serif text-[26px] leading-tight text-app-ink">Šio puslapio nerandame</h1>
      <p className="mt-3 text-sm leading-relaxed text-app-body">Nuoroda galėjo pasikeisti arba puslapis buvo perkeltas.</p>
      <Link prefetch={false} href="/" className={`${btn} mt-6 h-12 w-full`}>
        Į gloumi.lt
      </Link>
    </AuthShell>
  );
}
