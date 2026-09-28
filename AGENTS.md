# Gloumi svetainė

**Prieš pradedant skaityti `HANDOVER.md`** — jame surašyta, kas jau padaryta,
kas išmatuota, kokie spąstai jau kainavo laiko ir ko dar neįrodyta.

Taip pat `README.md`: sandara, aplinkos kintamieji ir tai, kas generuojama iš
programėlės repozitorijos.

## Jokios rusų kalbos

**Niekas, ką parašo agentas, negali būti rusiškai: nei raidė, nei žodis, nei
joks kitas dalykas.** Developerio nurodymas 2026-09-27, pažodžiui: „appse ir
chate, website, insta ir visur, negali buti rusisku raidziu, zodziu ar dalyku -
jokiu!!!".

- Galioja svetainės tekstams (`copy.lt.ts`, `copy.en.ts`, teisės puslapiams),
  metaduomenims ir alt tekstams, tekstui paveikslėliuose, Instagram įrašams,
  komitų žinutėms ir pokalbiui su developeriu, įskaitant trumpas būsenos
  eilutes tarp įrankių kvietimų.
- Draudžiama visa kirilica, ne vien rusiškos raidės. Jei raidę reikia aptarti,
  ji rašoma kodu (`U+0435`), o ne pačia raide.
- Rusiškas žodis, parašytas lotyniškomis raidėmis, vis tiek yra rusiškas.
- Rusų kalbos versijos, lokalės ar vertimo nebus: svetainė yra lietuvių ir anglų.
- Jei neaišku, ar kas nors patenka po šia taisykle, laikoma, kad patenka, ir
  pirma klausiama developerio.
- Taisyklė skirta tik tam, ką rašome MES. Ką rašo vartotojai (žinutės, įrašai,
  atsiliepimai, vardai, taip pat tai, ką rodo admin portalas), yra jų: to
  niekas nefiltruoja ir nekeičia. Developeris 2026-09-27: „useriai gali daryti
  ka nori, cia is musu puses viskas".

Nuo issue #83 (2026-09-28) `scripts/check-cyrillic.mjs` (`npm run check`)
automatiškai tikrina kiekvieną sekamą failą – bet tik raidžių lygiu. Rusišką
žodį, parašytą lotyniškomis raidėmis, ar kitą turinį (garsą, vaizdą) vis tiek
tikrina pats agentas: prieš siųsdamas ar commit'indamas, jis perskaito, ką
parašė. Išsamiau – Gloumi repozitorijos `AGENTS.md`, X straipsnis.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
