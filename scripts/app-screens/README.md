# Programėlės ekranai pradžios telefonui

Pradžios telefonas (`src/components/sections/PhoneMockup.tsx`) rodo keturis
tikrus programėlės ekranus abiem kalbomis: Atrasti, Paiešką, meistrės profilį
ir rezervaciją (avocadas/Gloumi#136). Šis aplankas – kaip juos padaryti iš
naujo, kai programėlė pasikeičia.

**Žmonės ekranuose išgalvoti, ir taip turi likti.** Developerio sprendimai
(2026-09-30):

- realių meistrų dar nėra, o komandos testinės paskyros viešam puslapiui netinka;
- netikri žmonės yra **tik nuotraukose**: gyvoje bazėje neatsiranda nieko;
- darbai nupiešti iš programėlės kategorijų ikonų, avatarai – inicialai, **jokių
  nuotraukų**;
- po skirtukais telefonas sako, kad meistrai ir atsiliepimai pavyzdiniai.

## Kaip tai veikia

`prepare.mjs` padaro laikiną programėlės kopiją (`%TEMP%\gloumi-app-screens`)
iš nurodytos šakos ir į ją įdeda `app-demo/`:

- `demoFetch.js` – visos Supabase užklausos eina per jį. GET su netikrais ID
  atsakomi iš `demoData.js`, **visi rašymai ir nežinomi RPC nuryjami**,
  prisijungimas ir paties naudotojo duomenys eina į tikrą serverį nepakeisti.
  Kiekvienas sprendimas matyti `adb logcat` su žyme `[DEMO]`.
- `demoData.js` – 7 meistrai Vilniuje su paslaugomis, darbais, Story,
  atsiliepimais ir darbo laiku, LT ir EN.
- `config.js` – kalba, paveikslėlių adresas ir vieta (Vilniaus centras).

Be to, keturiose vietose pakeičiamas programėlės kodas (ieškoma tikslaus
teksto; jei programėlė pasikeitė, skriptas sustoja ir pasako kur):

- Supabase klientui paduodamas `demoFetch`;
- kalba imama iš `config.js`, nes programėlės jungiklis kalbą įrašo ir į tikrą
  `profiles.language`;
- paleidimo talpykla nei skaitoma, nei rašoma – kitaip startas parodo tikrus
  duomenis, o po to talpykloje lieka netikri žmonės;
- vieta – Vilniaus centras, emuliatoriaus GPS neliečiamas.

## Žingsniai

Viskas iš svetainės aplanko. Programėlės repozitorija turi būti šalia
(`../Gloumi`, arba `GLOUMI_REPO`) ir turėti įdiegtą `node_modules`.

1. **Kopija:** `node scripts/app-screens/prepare.mjs origin/<šaka>` – ta šaka,
   kurios išvaizdą rodysim. Kopijos `node_modules` yra jungtis į
   `../Gloumi/gloumi-app/node_modules`, todėl ją trinti **tik** su `--clean`.
2. **Paveikslėliai:** atskirame lange `node scripts/app-screens/serve-media.mjs`.
3. **Metro 8090 portu** iš kopijos (PowerShell, atskiras procesas):

   ```powershell
   Start-Process cmd.exe -ArgumentList '/c npx eas-cli env:exec development "npm run start:dev -- --port 8090"' -WorkingDirectory "$env:TEMP\gloumi-app-screens\gloumi-app"
   ```

   `eas-cli env:exec` reikalingas dėl `GOOGLE_MAPS_ANDROID_KEY`: be jo profilio
   žemėlapis Android'e nulaužia programėlę. 8081 palikti developerio Metro.
4. **Emuliatorius** (bendras, tad pirma paklausti kitų sesijų):

   ```bash
   adb -s emulator-5554 reverse tcp:8090 tcp:8090
   adb -s emulator-5554 reverse tcp:8095 tcp:8095
   adb -s emulator-5554 shell am force-stop com.ringaudas.gloumi.dev
   adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d "gloumidev://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8090"
   ```

   Programėlė turi būti prisijungusi. Prisijungti gali tik developeris.
5. **Švari būsenos juosta:** įsiminti `settings get global sysui_demo_allowed`,
   tada `settings put global sysui_demo_allowed 1` ir
   `am broadcast -a com.android.systemui.demo -e command ...`: `enter`,
   `clock -e hhmm 0941`, `network -e wifi show -e level 4 -e fully true`,
   `network -e mobile show -e datatype none -e level 4 -e fully true`,
   `battery -e level 100 -e plugged false`, `notifications -e visible false`.
   Kūrimo meniu (`input keyevent 82`) išjungti „Tools button“, kitaip
   krumpliaratis lieka kadre.
6. **Kadrai** į `%TEMP%\gloumi-app-screens\shots\lt\` (`feed`, `search`,
   `profile`, `booking`.png): `adb exec-out screencap -p > <failas>`.
   2026-10-01 Pixel_5 (1080×2340) koordinatės (`ieva-prod` `a1d9c24`), prieš
   kiekvieną bakstelėjimą tikrinti nauju kadru:
   - **feed** – po paleidimo (Gabija pirma), kai matyti antraštė su meniu ir
     „Tau / Sekami“;
   - **search** – skirtukas Paieška (418, 2215), nepaslinktas: paslinkus
     pavadinimas užlenda po laikrodžiu;
   - **profile** – Atrasti (175, 2215), tada Gabijos vardas įraše (390, 1068);
     palaukti, kol žemėlapyje atsiras raudonas žymeklis;
   - **booking** – „Rezervuoti laiką“ (657, 2172), „Manikiūras su geliu“
     (538, 1030), „Pasirinkti datą ir laiką“ (538, 1752), penktadienis dienų
     juostoje (290, 597), 11:00 (866, 1196). Kadras – „Data ir laikas“ langas
     su pažymėtu laiku; „Tęsti“ nespausti.

   Kadrai vėluoja 4–10 s: palaukti ir fotografuoti dar kartą, o ne bakstelėti
   antrą kartą. Vertikalus braukimas prie pat dešinio krašto (x≈1062)
   nesuveikia, nes ten Android „atgal“ gestas – braukti ties x≈1000, ne per
   kalendoriaus langelius. 2026-10-01 vienas iš trijų šaltų paleidimų srautą
   parodė **be antraštės** (jos nebuvo ir `uiautomator` medyje), ir ji negrįžo
   nei paslinkus, nei perjungus skirtuką – padėjo tik dar vienas šaltas
   paleidimas. Kūrimo meniu (`keyevent 82`) virš atidaryto lango neatsidaro:
   pirma uždaryti langą.
7. **Anglų kalba:** `node scripts/app-screens/prepare.mjs --lang en`, šaltas
   paleidimas (`force-stop` + nuoroda), tie patys kadrai į `shots\en\`.
8. **Į svetainę:** `node scripts/app-screens/to-webp.mjs` – visi aštuoni arba
   nė vienas.
9. **Atstatyti emuliatorių ir išvalyti:** `command exit` ir
   `sysui_demo_allowed` grąžinti į įsimintą reikšmę, „Tools button“ – į buvusią
   būseną, `adb reverse --remove tcp:8090` ir `tcp:8095`, Metro sustabdyti
   kartu su visu jo procesų medžiu, serverį sustabdyti, emuliatorių išjungti
   (`adb emu kill`), jei jį paleidai pats, ir
   `node scripts/app-screens/prepare.mjs --clean`.
10. `npm run check` ir `npm run build`, tada commit'as.

Prieš commit'ą peržiūrėti kadrus akimis: jokių tikrų vardų, jokių pranešimų
ikonų, jokio kūrimo meniu krumpliaračio.
