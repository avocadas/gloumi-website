# HANDOVER.md

Naujausias perdavimas viršuje. Senesni lieka žemiau — jie tebėra teisingi apie
savo dieną.

---

# 2026-09-14 — Svetainė gyva ties gloumi.lt, dvikalbė, forma siunčia laiškus

**Viskas žemiau išmatuota 2026-09-14, ne perrašyta iš atminties.** Kur
nemačiau — pasakyta skyriuje „Ko NEĮRODYTA".

---

## 1. Kas tai per repozitorija

Viešoji Gloumi svetainė: <https://github.com/avocadas/gloumi-website>, gyva ties
<https://gloumi.lt>. Ji **atskira nuo programėlės repozitorijos** sąmoningai:
čia nėra nei `prod`/`main` juostų, nei Article VI leidimo eigos. Deploy'as eina
iš `main` į Vercel automatiškai po kiekvieno push'o.

Lokalus katalogas: `C:/Users/Avocadas/OneDrive/Desktop/gloumi-website`, greta
`Gloumi`, o ne jo viduje.

**Push'o sargas.** `Gloumi/.claude/hooks/guard-push.js` blokuoja bet kokį
`git push` į `main` — nepriklausomai nuo to, kurioje repozitorijoje esi. Jei
sesija paleista iš `Gloumi` katalogo, svetainės push'ui reikia priešdėlio
`GLOUMI_RELEASE=1`. Švaresnis kelias — paleisti sesiją pačiame
`gloumi-website` kataloge.

---

## 2. Kas veikia (išmatuota)

| Kas | Būsena |
|---|---|
| Dešimt puslapių (5 LT + 5 EN) | visi 200, nesamas adresas 404 |
| `<html lang>` | `lt` šaknyje, `en` po `/en` |
| canonical, hreflang, x-default | teisingi abiem pusėm |
| Dalinimosi kortelės | dvi, po vieną kalbai, 118 KB ir 120 KB |
| Meistrų forma | `{"ok":true,"delivered":["email"]}` |
| Sertifikatas | Vercel išrašė pats |
| CI | žalias visiems commit'ams |

**Adresai.** Lietuvių kalba šaknyje: `/`, `/taisykles`, `/privatumo-politika`,
`/grazinimo-salygos`, `/dac7`. Anglų po `/en` su angliškais slug'ais:
`/en`, `/en/terms`, `/en/privacy`, `/en/refunds`, `/en/dac7`.

**Lietuviškų adresų NEKEISTI.** `https://gloumi.lt/privatumo-politika` yra tas
adresas, kurį duosime App Store Connect.

**DNS.** Zona lieka domenai.lt. Pakeisti tik du įrašai:
`gloumi.lt. A 216.150.1.1` ir `www CNAME 16ca6a30bb5ac109.vercel-dns-016.com.`
MX (`mx.oradomail.com`), SPF ir `_dmarc` nepaliesti ir **paliktini**. Vardų
serverių į Vercel **neperkelti** — dingtų paštas.

**Paštas.** Resend patvirtintas domenas — `mail.gloumi.lt`, **ne** grynas
`gloumi.lt`. Siuntėjas ateina iš kodo numatytosios reikšmės
`Gloumi <no-reply@mail.gloumi.lt>` (`src/content/site.ts` → `sendingDomain`).
Vercel'e `WAITLIST_FROM_EMAIL` **sąmoningai ištrintas**: šablonas jį buvo
sukūręs su senu `@gloumi.lt`, kuris Resend'e nepatvirtintas, o kintamasis
nugali kodo numatytąją reikšmę.

---

## 3. Kas kuo generuojama

Trys dalykai privalo nesiskirti nuo programėlės, todėl kopijuojami skriptu, ne
ranka (`npm run gen:app`):

| Svetainės failas | Šaltinis programėlėje |
|---|---|
| `src/components/brand/Wordmark.tsx` | `gloumi-app/src/theme/wordmarkPath.js` |
| `public/brand/gloumi-mark.svg` | ikona, kurią `app.json` nurodo kaip `expo.icon` |
| `src/content/legal-source.ts` | `gloumi-app/src/constants/legal.js` |

Ikona imama **pagal `app.json`, ne pagal failo vardą**, nes programėlė ją jau
pervadino kartą (`Gloumi-icon-light-default` → `Gloumi-icon-10b`). Pakeitus
ženklą, skriptas tai pasako, ir tada reikia `npm run icons`.

`BrandMark.tsx` **negeneruojamas**: jis rodo tą patį vieną SVG per `<img>`.
Anksčiau jis turėjo piešinio kopiją JSX pavidalu, ir pasikeitus ikonai poraštė
būtų likusi su senąja.

---

## 4. Spąstai, į kuriuos jau įlipta

**4.1. Dalinimosi kortelė ir šriftai.** Kortelė build'o metu siuntėsi šriftus iš
Google Fonts. Kai viena iš dviejų užklausų grįždavo tuščia, kodas tęsdavo su
`fontFamily: undefined`, ir prerender'is krisdavo su
`Cannot read properties of undefined (reading 'split')`. Build'as dėl to buvo
**nenuspėjamas**: tas pats commit'as prieš kelias minutes praeidavo. Dabar abu
šriftai guli `assets/fonts/` ir skaitomi iš disko. **Negrąžinti fetch'o.**

**4.2. Klaidinga diagnozė, kurią ta klaida sukėlė.** Kai deploy'as krito,
atrodė kaltas `engines.node: "24.x"` prisegimas, nes tai buvo vienintelis to
commit'o pakeitimas. Atstačiau į `">=20.9"`, deploy'as praėjo, ir tai atrodė
kaip įrodymas. Nebuvo — praėjo todėl, kad šriftų užklausa tąkart pavyko. Node
niekuo dėtas. `engines.node` tebėra `">=20.9"`, ir Vercel dėl to rodo nekaltą
perspėjimą; prisegti prie major versijos galima, bet **atskiru, atskirai
patikrintu pakeitimu**.

**4.3. `openGraph` paveldėjimas.** Jei puslapis pats aprašo `openGraph` objektą,
Next **nebeprideda** failinio `opengraph-image`. Dėl to kortelė buvo dingusi iš
visų teisinių puslapių, o tituliniai ją išlaikė tik todėl, kad paveikslėlio
failas guli tame pačiame segmente. Todėl `openGraph` gyvena **makete**
(`src/content/metadata.ts` → `rootMetadata`), o `buildMetadata` deda tik
`alternates`.

**4.4. Maketas be apvalkalo.** Pirmoji dvikalbės versijos redakcija renderino
tik `{children}`, tad antraštės ir poraštės nebuvo iš viso. Build'as to
nepastebėjo. **Tikrinti atiduodamą HTML, ne tik build'o išvestį.**

**4.5. Bash ir lietuviškos raidės.** Windows komandinė eilutė argumentą
perkoduoja savo koduote, tad `curl -d '{"name":"ąčę"}'` išsiunčia sugadintus
baitus. Tai atrodo kaip svetainės klaida, bet nėra. Testuojant rašyti JSON į
failą per Node ir siųsti `--data-binary @failas`.

**4.6. Bash komandos dydis.** Virš maždaug 10 KB komanda nesuparsinama ir
**nieko neįrašo**. Dideliems failams naudoti Write įrankį.

---

## 5. Kas liko (tracker #20)

<https://github.com/avocadas/Gloumi/issues/20>, priskirta avocadas.

- [ ] `https://gloumi.lt/privatumo-politika` į App Store Connect
- [ ] App Store ir Google Play nuorodos (`NEXT_PUBLIC_APP_STORE_URL`,
      `NEXT_PUBLIC_PLAY_STORE_URL` Vercel'e; kol tuščios, ženkleliai rodo
      „Netrukus" ir niekur neveda)
- [ ] Teisininko peržiūra: `/taisykles`, `/privatumo-politika`,
      `/grazinimo-salygos`, `/dac7`
- [ ] Socialinių tinklų nuorodos `src/content/site.ts` (poraštė rodo eilutę tik
      kai bent viena yra)

Nepradėta ir **šiandien nedaryti**: perėjimas nuo `pub-...r2.dev` prie
`media.gloumi.lt`. Cloudflare reikalauja, kad zona būtų jų vardų serveriuose, o
tai reiškia MX, SPF ir DKIM perkėlimą ranka. Atskiras darbas.

---

## 6. Ko NEĮRODYTA

- **Mobiliojoje naršyklėje nematyta.** Visi patikrinimai daryti per HTTP
  užklausas ir atiduodamą HTML. Puslapiai per telefoną neatidaryti.
- **Kalbos perjungiklis nespaustas.** Žinoma, kad jis renderinamas abiem
  kalbomis su teisingomis nuorodomis; kad paspaudus tikrai nuveda, netikrinta.
- **Forma per naršyklę nesiųsta.** Siųsta tik per `curl` į `/api/waitlist`.
  Pats laukų pildymas, validacija naršyklėje ir sėkmės kortelė nematyti.
- **Kortelės socialiniuose tinkluose nematytos.** Žinoma, kad jos generuojasi ir
  atiduodamos; kaip atrodo Facebook ar LinkedIn peržiūroje, nežiūrėta.
- **Rekvizitai netikrinti registre.** Kodas 308087857 ir adresas sutampa su
  programėlės `legal.js`, ir Ringaudas juos patvirtino žodžiu. Registro įrašas
  nežiūrėtas.
- **Node prisegimas neišbandytas po šriftų pataisos.** Tikėtina, kad `24.x`
  dabar praeitų, bet tai spėjimas.

---

## 7. Komandos

```bash
npm run dev          # kūrimo serveris, forma tik logina į terminalą
npm run check        # lint + typecheck + WCAG kontrastas
npm run build        # tas pats, ką daro Vercel
npm run gen:app      # pergeneruoja iš programėlės
npm run icons        # favikonės iš ženklo SVG
```

`npm run check` privalo baigtis nuliu prieš commit'ą. Kontrasto patikra šiuo
metu tikrina 26 spalvų poras.
