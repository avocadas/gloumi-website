# HANDOVER.md

Naujausias perdavimas viršuje. Senesni lieka žemiau — jie tebėra teisingi apie
savo dieną.

---

# 2026-10-01 — Kas gyvena Vercel'yje, o ne šioje repozitorijoje

Portalas iki 2026-09-30 atsakinėjo `500 MIDDLEWARE_INVOCATION_FAILED`
(išmatuota 09-29 00:19Z; vykdymo klaidose ta pati klaida kartojosi iki 09-30
11:16Z), nes Vercel projekte nebuvo jo trijų Supabase kintamųjų. README
„Environment“ lentelė jų neminėjo, juos žinojo tik `.env.example`, o „Deploy“
skyrius liepė įrašyti būtent tos lentelės kintamuosius. Dabar jie lentelėje.
Žemiau surašyta visa, ko `git` nemato.

## 1. Projekto nustatymai (Vercel → `gloumi-website`, komanda `gloumi1`)

- **Funkcijų regionas `fra1`** nuo 2026-09-29 (`update_project`,
  `serverlessFunctionRegion`), nes Supabase yra `eu-central-1`. Patikrinti:
  `get_deployment` → `regions: ["fra1"]` arba funkcijos atsakymo
  `X-Vercel-Id` (`arn1::fra1::…`). Build'o žurnalas vis tiek rašo „Running
  build in … iad1“, bet tai build'o mašina, ne funkcijos.
- **Node 24.x** nustatytas ir projekte, ir `engines.node` (`7e59406`, išdiegtas
  `READY` 09-29). `9241a5d` build'o žurnale perspėjimo apie atvirą Node
  intervalą nebėra, tad 2026-09-14 skyriaus 6 punktas „Node prisegimas
  neišbandytas“ atsakytas.
- **Ugniasienė:** taisyklė „Admin login rate limit“, žr. žemiau esantį portalo
  skyrių. MCP jos nemato.

## 2. Aplinkos kintamieji

| Kintamasis | Aplinka | Tipas | Būklė 2026-10-01 |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Encrypted | įrašytas 09-29 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Encrypted | įrašytas 09-30, `sb_publishable_…` |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Sensitive | įrašytas 09-30; ar tai `sb_secret_`, ar senasis `service_role`, per API neperskaitoma (Gloumi #142) |
| `RESEND_API_KEY` | Production | Sensitive | **tebėra 2026-09-14 raktas**; naujas `vercel-gloumi-website-send` (`sending_access`, tik `mail.gloumi.lt`) laukia įklijavimo (Gloumi #67) |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL`, `WAITLIST_WEBHOOK_URL`, `WAITLIST_TO_EMAIL` | Production, Preview | Sensitive | nuo projekto sukūrimo 09-14; parduotuvių nuorodos įrašomos, kai programėlė bus parduotuvėse |

`WAITLIST_FROM_EMAIL` nėra tyčia (2026-09-14 skyriaus 2 dalis).
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` irgi nėra, nes Search Console patvirtintas
DNS TXT įrašu. Sensitive reikšmės vėliau neperskaitomos niekam, tik keičiamos.
Pakeitus bet kurį kintamąjį, reikia naujo deploy'aus, o pakeitus `NEXT_PUBLIC_*`,
deploy'aus be build kešo.

## 3. Vercel MCP

- Nuo 2026-10-01 atiduoda build'o žurnalus (`list_deployment_events`) ir
  vykdymo klaidas (`get_runtime_errors`). 09-29 abu grąžino `403 … re-authenticate
  to this scope`.
- Platūs žurnalų langai (`get_runtime_logs` per 7 d. ar 24 val. su
  `statusCode`) baigiasi `timed out`. Siaurinti iki `deploymentId`.
- Ugniasienės nemato (`404 Seawall Config not found`).

## 4. Deploy'o tempas

Gloumi #40 uždarytas 2026-09-29 su matavimais: eilė 1–2 s, build'as 14–26 s, o
09-18 vėlavimas buvo vienkartinis, platformos pusėje. 10-01 `9241a5d`: eilėje
1 s, build'as 10 s, nuo sukūrimo iki `READY` 20 s.

## 5. Build'o perspėjimai, kurie liko (`9241a5d`)

- `The "middleware" file convention is deprecated. Please use "proxy"
  instead.` Next 16 tai rodo kiekviename build'e. Perkėlimas
  (`npx @next/codemod@canary middleware-to-proxy .`) yra portalo kodo
  pakeitimas, ir jis keičia vykdymo aplinką: `proxy` visada veikia Node.js
  aplinkoje, o `runtime` parinkties ten nėra
  (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:255`).
  Dabar prisijungimo vartai veikia kraštiniame tinkle (`X-Vercel-Id` be
  regiono). Daryti atskiru, atskirai patikrintu pakeitimu.
- `npm warn install-scripts … unrs-resolver@1.12.2 (postinstall)`: npm dar
  neleido šio paketo diegimo skripto. Build'as praeina.

## 6. Ko NEĮRODYTA

- Kad naujas Resend raktas veikia: jis dar neįklijuotas.
- Ugniasienės taisyklės būklė čia perrašyta iš portalo skyriaus, ne
  išmatuota: MCP jos nemato.

---

# 2026-10-01 — Administravimo portalas: kaip sudėtas, kur sustota ir ką testuoti toliau (#105, #129)

Šio skyriaus iki šiol nebuvo: portalas gimė 2026-09-21, o jo apsauga (#105) ir
duomenų naršyklė (#129) padarytos 09-30–10-01. Skyrius skirtas sesijai, kuri
tęs **#129**. Pirmas jos darbas — kartu su developeriu patikrinti punktus 2–6,
sutvarkyti, kas neveiks, ir tik tada juos pažymėti.

**Pirmiausia perskaityti:** šio repo `AGENTS.md` (jokios rusų kalbos), Gloumi
`AGENTS.md` V (migracijos), VII.14 (tracker'is keičiamas tik developeriui
sutikus), VIII (paslaptys) ir Gloumi `.claude/LESSONS.md` 4.8. Duomenų bazė ir
Edge funkcija gyvena **Gloumi** repozitorijoje, ne čia.

## 1. Kas dabar gyva (išmatuota 2026-10-01 ~02:30 UTC)

- **Svetainė:** `main` = `d0596f4`, Vercel production
  `dpl_5gAvqMFFmKoqKd7CDLzdYXmLJhWJ` (`READY`, `gloumi.lt`). Puslapiai:
  `/admin/login`, `/admin` (Skundai), `/admin/data` (Duomenys),
  `/admin/users/[id]` (paskyra).
- **Gloumi `ringaudas-prod`:** `d9c49f5` (migracija
  `20261001012855_admin_data_browser`, pritaikyta per MCP 01:28 UTC) ir
  `012e718` (Edge `admin-media-urls`, versija 2). Į `prod` dar **neįlieta** —
  pateks su kitu `ringaudas-prod` → `prod` sujungimu (Gloumi VI.1.3). Bazė ir
  funkcija gyvos jau dabar: pritaikytos tiesiai, ne per šaką.
- **Administratoriai:** `admin_ids` lygiai trys — `admin.ieva`,
  `admin.karolis`, `admin.ringaudas`. Patvirtintą TOTP turi `admin.ieva` ir
  `admin.ringaudas`; `admin.karolis` dar nė karto neprisijungė (0 faktorių,
  nė vieno `ok` bandymo). Užrakintų nėra.
- **#129:** 1 (atsijungimas) ir 7 (senųjų funkcijų pašalinimas) pažymėti;
  **2–6 laukia developerio patikros** — jis pažadėjo patikrinti pats.

## 2. Kaip portalas sudėtas

**Prisijungimas** (`src/app/admin/login/actions.ts`, #105) vyksta serverio
veiksmuose: vardas (`admin.ieva`) → `admin_login_begin` → GoTrue su paslėptu
adresu → TOTP (įsijungimas arba kodas) → `admin_login_finish` → sesija į
slapukus. Slaptažodžio sesija naršyklės nepasiekia. Užraktas: 5 klaidos per
15 min užrakina paskyrą valandai, nesvarbu iš kokio IP; vienas IP po 20 klaidų
stabdomas 15 min. Atrakinti anksčiau: `select admin_unlock('admin.ieva')`.
Dar viena riba — Vercel ugniasienės taisyklė „Admin login rate limit“
(`/admin/login`, 10 užklausų per 60 s iš vieno IP → 429 penkiolikai minučių).

**Sargas** `src/lib/admin-guard.ts` `checkAdmin()`: prisijungęs? →
`admin_ids` (servisiniu raktu) → `aal2` → ne daugiau 12 val. nuo kodo
įvedimo. Ne administratorius gauna 404, administratorius su pasenusia ar vien
slaptažodžio sesija — `MfaNotice`. `src/middleware.ts`
(`matcher: /admin/:path*`) atnaujina sesijos slapukus ir neprisijungusį siunčia
į `/admin/login?next=`.

**Veiksmai** `src/app/admin/actions.ts`: kiekvienas pirmiausia vėl kviečia
`requireAdmin()`, nes serverio veiksmas yra viešas HTTP taškas. Tada — VIENAS
RPC, kuris ir pakeičia, ir įrašo į `admin_audit_logs` toje pačioje
transakcijoje:

| veiksmas | RPC |
|---|---|
| `moderate` | `admin_moderate` |
| `removeRow` | `admin_remove` |
| `editText` | `admin_edit_text` |
| `deleteAccount` | `admin_delete_account` → `purge_accounts` |
| `setSuspended` | GoTrue `ban_duration` + `log_admin_action` — vienintelė dviejų žingsnių vieta |

**Duomenys:** `src/lib/admin-data.ts` (`server-only`) — `loadCatalog`,
`searchTable`, `mediaIdsOf`, `signMedia`. Puslapiai (`page.tsx`) nuo
2026-10-01 tik gauna duomenis, o išdėsto atskiri komponentai, kuriuos galima
nupiešti ir su netikrais duomenimis (žr. „Išvaizda“ žemiau):

| puslapis | išdėstymas |
|---|---|
| `admin/page.tsx` (skundai) | `ReportQueue.tsx` → `ReportCard.tsx` |
| `data/page.tsx` | `data/CatalogIndex.tsx` (pradžia), `data/TableResults.tsx` → `data/RowCard.tsx` |
| `users/[id]/page.tsx` | `users/[id]/UserOverview.tsx` → `AccountActions.tsx`, `CopyButton.tsx` |
| `disputes/page.tsx` (ginčai, #147) | `disputes/DisputeQueue.tsx` → `disputes/DisputeCard.tsx` |
| visi | `AdminShell.tsx` (buvo `AdminHeader.tsx`), `ui.tsx`, `ConfirmDialog.tsx`, `format.ts` |

**Ginčai (2026-10-02, Gloumi #147, `20261001233134` 6 dalis):** išmoka
meistrui laukia 3 d. po vizito; klientas gali pranešti „Vizitas neįvyko?“,
bankas — atsiųsti kortelės ginčą; kol ginčas `open`, `stripe-settle` neperveda.
Puslapis kviečia `admin_list_disputes(_status = null)` VIENĄ kartą (skaičiai ir
filtras iš to paties, iki 200) ir `dac7_held_masters()` (tik skaito; nepavykus —
sąrašo nėra, ne „nė vieno“). Sprendimas — `resolveDispute` (`actions.ts`) →
`admin_resolve_dispute` (`refund` / `release`, pastaba ≤ 500, žurnale
`resolve_dispute`); pinigus kitą naktį perkelia `stripe-settle`. Kortelės ginčui
(`source = 'chargeback'`) mygtukų nėra; jei jis `open`, o `transferred_at` vis
dar užpildytas, `stripe-webhook` išmokos atsiimti nepavyko — kortelė rodo
įspėjimą. Būsenos: `open`, `refund`, `release` (ir laimėtas banko ginčas),
`lost` (bankas — klientui), `closed`. Spalva — „Vizitai“ persikas (`peach`).

**Išvaizda (2026-10-01, #129):** portalas kalba programėlės dizainu, ne
rinkodaros puslapio: Figtree + Source Serif 4 (`fonts.ts` `adminFontVariables`),
`--color-app-*` žetonai `globals.css` (perrašyti iš `gloumi-app/src/theme/theme.js`
su tais pačiais vardais komentaruose — pasikeitus programėlei, keisti ir čia).
Pastelinis antgalvis su skrituliais kiekvienam skyriui (skundai rožinė,
duomenys levandinė, paskyra mėtinė), balta skirtukų kapsulė (telefone
apačioje), kortelės su šešėliu, mygtukai balti su juodu apvadu (#130 — juodo
užpildo nėra). Trynimas ir blokavimas klausia viename `<dialog>` lange
(`useConfirm`), ne `window.confirm` + `window.prompt`. Žymų rašalas tamsesnis
už programėlės žetonus, nes 10 px raidės ten davė 4,25–4,41 kontrasto
(`ui.tsx`). **Pamatyti neprisijungus:** laikinas `src/app/admin-preview/`
(savas `layout.tsx` kaip `admin/layout.tsx` + `page.tsx`, kuris su netikrais
duomenimis piešia `AdminShell` ir aukščiau išvardytus komponentus) — už
`middleware` ribų, tad be `.env.local`; `.claude/launch.json` „gloumi-website“
(3100). PRIEŠ commit'ą katalogą ištrinti ir dar `.next/dev/types`, kitaip
`npm run check` krenta dėl pasenusių maršrutų tipų.

**Gloumi pusė:** migracijos `20260930165140` (administratorius nebe
programėlės paskyra), `20260930210151` (užraktas), `20260930211143` (žurnalo
etiketė), `20261001005823` (`is_admin` atstatymas), `20261001012855`
(naršyklė); funkcija `supabase/functions/admin-media-urls/index.ts`; prieigos
aprašas `supabase/ACCESS.md`; pritaikymų istorija `supabase/migrations/PENDING.md`.

## 3. Katalogas: ką galima su kuria lentele

Viską sako viena funkcija, `admin_catalog()` (51 lentelė):

- **`content`** — ieškoti, trinti, taisyti kataloge išvardytus tekstus;
- **`account`** (`profiles`, `master_profiles`) — ieškoti ir taisyti tekstus;
  paskyra trinama tik visa, paskyros puslapyje;
- **`view`** (pinigai, teisiniai įrašai, žurnalas) — tik peržiūra. Developerio
  sprendimas: sąskaitas saugoti liepia įstatymas, o mokėjimų įrašai susieti su
  Stripe.

Lentelės, kurios kataloge nėra, portale nematomos; sistemos lentelių
(`admin_ids`, `app_config`, `push_tokens`, `media_trash`…) ten nėra tyčia.
Atsiliepimų ir žinučių tekstų taisyti negalima, tik ištrinti: pataisytas
atsiliepimas vis tiek rodomas kaip žmogaus žodžiai. Paslėpti stulpeliai
(`master_profiles.iban`, `tax_id`, `stripe_account_id`, `geog`,
`gift_cards.code`, `subscriptions.latest_payload`) išimami pačiame RPC ir
naršyklės nepasiekia net HTML'e.

**Pakeisti katalogą** — nauja migracija su
`create or replace function public.admin_catalog()`. Prieš rašant perskaityti
GYVĄ apibrėžimą (`pg_get_functiondef`), ne seną migraciją (LESSONS 4.8).
Įrodymų bloką nukopijuoti iš `20261001012855`: jis tikrina, ar kiekviena
katalogo lentelė ir stulpelis egzistuoja, tad rašybos klaida sustabdo
migraciją, o ne portalą.

## 4. Spąstai, į kuriuos jau įlipta

- **Viešas `pub-…r2.dev` nuo 2026-09-01 visam kam atsako 401.** Nuotraukas
  portalas rodo tik per `admin-media-urls`: funkcija perduoda kvietėjo
  `apikey` ir `Authorization` ir klausia `admin_require(_admin_id)`, o
  pasirašo tik tada, kai bazė atsako „`service_role` ir administratorius“.
  `verify_jwt = false`, nes projekto raktai naujo tipo (`sb_publishable_…`),
  tad ir serverio raktas greičiausiai ne JWT.
- **`is_admin` regresija 09-30.** `20260930165140` perkūrė `is_admin` iš
  pirminės migracijos, ir ~8 val. nebuvo nei `aal2` sąlygos, nei uždarymo
  klientams. Grąžinta `20261001005823`. Prieš bet kurį `create or replace` —
  gyvas `pg_get_functiondef`, `has_function_privilege` ir
  `git log -S 'function public.<f>' -- supabase/migrations`.
- **Paskyra trinama iškart, ne naktį:** `cancel_account_deletion()`
  besąlygiškas, tad pažymėtą paskyrą naudotojas atstatytų pats. Su paskyra
  dingsta ir jos pateikti skundai, lojalumo taškai, rekomendacijos ir
  prenumeratos įrašai; vizitai, sąskaitos ir dovanų kortelės lieka be nuorodos
  (`set null`).
- **Nuotraukos trynimas kaskada:** `posts.media_id`, `messages.media_id` ir
  `post_media.media_id` — `on delete cascade`, tad ištrynus pagrindinę įrašo
  nuotrauką dingsta įrašas. Įspėjimai `data/page.tsx` `CASCADE_NOTE` išmatuoti
  iš gyvų FK 10-01; pasikeitus ryšiams, juos atnaujinti. Failas iš R2 dingsta
  tik naktį (`media_trash` → `media-purge`, 05:10 UTC).
- **Laiko juosta:** `format.ts` rašo `timeZone: "Europe/Vilnius"`. Be jos
  serveris (UTC) ir naršyklė piešia skirtingą tekstą, ir React meta
  hidratacijos klaidą.
- **Administratorių adresai paslėpti** (`admin.<vardas>.<24 hex>@gloumi.lt`)
  ir yra apsaugos dalis: jų neišvesti nei pokalbyje, nei žurnale, nei
  puslapyje. Tikrinti tik šablonu (`~`), grąžinant taip/ne. Paskyros puslapis
  administratoriaus adreso nerodo.
- **`/admin/login` niekada netestuoti serija iš agento:** Bash eina iš
  developerio IP, ir Vercel taisyklė 15 min užblokuotų jį patį. Svetainės
  irgi netikrinti `curl` ciklu (žr. 2026-09-28 §4).
- **Vercel MCP ugniasienės nemato** (`404 Seawall Config not found`) —
  taisyklę tikrinti tik skydelio nuotrauka.
- **`NEXT_PUBLIC_*`** įrašomi į kliento paketą build'o metu: pakeitus
  kintamąjį, Redeploy BE „Use existing Build Cache“.
- **„Error generating QR Code“** buvo GoTrue `Issuer must be set` —
  `issuer: "Gloumi"` (`ae47d57`).
- **Next 16:** `params` ir `searchParams` yra `Promise`;
  `revalidatePath("/admin", "layout")` atnaujina visus portalo puslapius;
  dokumentacija `node_modules/next/dist/docs/`.
- **Migracija per MCP:** `apply_migration` versija = taikymo laikas. Failą
  pervadinti ta versija (`md5(statements[1])` sutampa su failu be paskutinio
  `\n`), commit'inti ir push'inti IŠ KARTO — kitaip kitų juostų `db push`
  sustoja, — ir įrašyti į `PENDING.md`. Pirma repetuoti `begin … rollback` per
  `npx supabase db query --linked -f <failas>`. Pastebėta: `now()` vienoje
  transakcijoje sustingęs; tame pačiame sakinyje poklausiai mato senąją būseną;
  SQL `and` netrumpina.
- **Commit'ai:** čia `Co-Authored-By` įprastas, Gloumi repozitorijoje
  draudžiamas (VI.3). Push į šio repo `main` = production deploy;
  `GLOUMI_RELEASE=1 git push origin main` tik developeriui leidus (Gloumi push
  sargas blokuoja `main`, kai sesija paleista iš Gloumi).
- **Bendras aplankas:** šiame checkout'e dirba ir sesija „gloumi.lt“ (#136).
  Commit'inti tik savo kelius (`git commit -- <keliai>`), o prieš
  `npm run build` ar `next dev` jai parašyti — abu naudoja tą patį `.next`.

## 5. Kaip testuoti (agentas prisijungti negali)

Slaptažodis ir TOTP — developerio: jų neprašyti ir niekur nevesti. Developeris
spaudžia, agentas skaito, kas įvyko:

- **Vercel žurnalas:** MCP `get_runtime_logs`, `projectId`
  `prj_eNlK3C55AC453gRgiIqnkgZHO4R0`, `teamId` `team_LYPor0FJYsFjmWbJ9qQX5GZb`.
- **Funkcijos žurnalas:** Supabase MCP `query_logs`:

  ```sql
  select timestamp, event_message from logs
   where source = 'function_logs' and event_message like '%gate_refused%'
   order by timestamp desc limit 20
  ```

  `gate_refused: <priežastis>` pasako, kodėl nuotrauka nepasirašyta.
  `select *` grąžino „Backend error“, su įvardytais stulpeliais veikė.
- **Žurnalas bazėje:**

  ```sql
  select created_at, admin_label, action, target_type, target_id
    from admin_audit_logs order by created_at desc limit 20
  ```

  `details` NEspausdinti visos: ten ištrintos eilutės, t. y. asmens duomenys.

Ką tikrinti kiekvienam #129 punktui:

| # | developeris daro | turi įvykti |
|---|---|---|
| 2 | Duomenys → Įrašai, paieška | eilutės ir nuotraukos; vietoj nuotraukos „Peržiūra nepasiekiama“ → funkcijos žurnalas |
| 3 | ištrina testinį komentarą | eilutės nebėra; žurnale `remove` su ta eilute |
| 4 | kortelėje paspaudžia „paskyra“ | skaičiai pagal lenteles, nuorodos filtruoja pagal naudotoją |
| 5 | Užblokuoti / Atblokuoti; trinti tik nereikalingą testinę paskyrą | `auth.users.banned_until`; žurnale `suspend_user` / `unsuspend_user`; po trynimo — `delete_account` ir eilutė `deleted_account_media` |
| 6 | pataiso testinio įrašo aprašymą | tekstas pasikeitė; žurnale `edit_text` su `before` ir `after` |

Pažymėti punktus ir siūlyti uždaryti #129 — tik developeriui sutikus (Gloumi
VII.14). Neprisijungus saugu patikrinti tik vieną dalyką, viena užklausa:
`curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://gloumi.lt/admin/data`
→ `307` į prisijungimą.

## 6. Ko NEĮRODYTA

- Prisijungus `/admin/data` ir `/admin/users/[id]` dar niekas neatidarė.
- `admin-media-urls` sėkmės kelias (svetainės raktas → `service_role`).
  Išmatuoti tik atsisakymai: viešas raktas → `permission denied for function
  admin_require`, netikras Bearer → JWT klaida.
- R2 failo dingimas po nuotraukos `admin_remove` — naktinis `media-purge` po
  to gyvai nestebėtas.
- Apple atšaukimas `purge_accounts` viduje — repeticijos paskyros
  `apple_refresh_tokens` neturėjo.
- `admin.karolis` neprisijungęs: kol jis neįsijungs TOTP, kas žino jo
  slaptažodį, gali įsijungti savo.

## 7. Kas liko už #129

- Po prisijungimo `?next=` išlaiko tik kelią: `/admin/data?table=posts` →
  `/admin/data` (middleware užklausą palieka prisijungimo adrese).
- `middleware.ts` → `proxy.ts` (Next 16 perspėjimas).
- Supabase Pro → nutekėjusių slaptažodžių apsauga; Vercel Spend Management
  perspėjimas.
- Gloumi `ringaudas-prod` → `prod` su `d9c49f5` ir `012e718` (VI.1.3, prieš
  tai negyvo kodo valymas).

## 8. Komandos

```bash
git fetch --all && git status --short
gh issue view 129 --repo avocadas/Gloumi
gh api repos/avocadas/gloumi-website/deployments --jq '.[0] | "\(.created_at) \(.sha)"'
npm run check && npm run build
```

---

# 2026-09-28 — Teisiniai tekstai nuo v1.4 iki v1.10, ir puslapiai, kurie nustojo perpasakoti

Per dvi savaites teisiniai dokumentai pajudėjo septynis kartus, ir svetainė
kaskart buvo pergeneruota. Žemiau — ne kas pasikeitė tekste (tai matyti
commit'uose), o tai, kas paaiškėjo apie **šią** repozitoriją ir kas kitą kartą
sutaupys laiko.

## 1. Kas dabar gyva

`gloumi.lt` atiduoda **v1.10 (2026-09-28)**: Taisyklės 21 skyrius, privatumo
politika 17, grąžinimo sąlygos 6, skaidrumo puslapis 8. Visų keturių dokumentų
turinys atitinka skyrius vienas prie vieno, negyvų inkarų nėra — tikrinta
sugeneruotame HTML'e, ne šaltinyje.

Programėlės pusėje `prod`, `ringaudas-prod`, `ieva-prod` ir `karolis-prod` —
visos ties v1.10. Svetainė kurį laiką ėjo **priekyje** `prod` (generuota iš
juostos, kuri dar nebuvo įlieta); nuo 2026-09-28 jos sutampa.

## 2. Du puslapiai nustojo perpasakoti programėlę ir pradėjo ją cituoti

`/dac7` ir `/grazinimo-salygos` rašyti šiai svetainei, bet jie aprašinėjo tą
patį, ką Taisyklės. Perpasakojimas nuklydo per kelias dienas:

- skaidrumo puslapis sakė, kad paiešką lemia „atstumas iki Jūsų", o funkcija,
  kuri iš tikrųjų rikiuoja, to nedaro — paiešką lemia naudotojo filtrai ir ji
  **nėra** personalizuojama, o personalizuojamas srautas. P2B 5 straipsnis kaip
  tik reikalauja tikslių rikiavimo parametrų;
- grąžinimo puslapis sakė, kad pinigai grąžinami „per Stripe", taškas — o
  kitas to paties puslapio skyrius yra Pro prenumerata, kurią perka ir grąžina
  Apple arba Google.

Dabar rikiavimas, DSA pranešimai, P2B skyrius ir teisė atsisakyti sutarties
**traukiami iš Taisyklių pagal pavadinimą** (`src/content/legal.ts`,
`termsSection`). Ranka liko tik tai, ko Taisyklėse nėra: kas yra Gloumi, ką
DAC7 praneša VMI, kontaktinis punktas, mažos įmonės išimtis ir grąžinimo
mechanika.

**Tai pasitvirtino realiu pakeitimu.** Kai programėlė perrašė rikiavimo skyrių
pagal gyvą `get_personalized_feed`, naujoji formulė (21 dienos langas, keturi
įrašai iš vieno meistro, ženkliuko 15 %) pateko į `/dac7` **be jokio rankinio
taisymo**. Mokamos pozicijos atskleidimas, kurio reikalauja P2B, atsirado ten
savaime.

**Spąstai:** `termsSection` ieško skyriaus **paraidžiui pagal pavadinimą** ir
**meta klaidą**, jei jo neranda. Tai tyčia — pervadinus skyrių programėlėje,
krenta `npm run build`, o ne tyliai atiduodamas tuščias teisinis dokumentas.
Programėlės `legal.js` antraštėje apie tai yra įspėjimas (`548d6b2`).

## 3. App Store Connect gauna ANGLIŠKĄ adresą

`https://gloumi.lt/en/privacy`, ne lietuvišką — ir tai ne pasirinkimas.
App Privacy laukas yra vienas kiekvienai parduotuvės kalbai, o **lietuvių
kalbos App Store metaduomenyse nėra**: Apple „App Store localizations" sąraše
nėra nei lietuvių, nei latvių, nei estų, o Lietuvai nurodyta English (U.K.).
Kalbos tame lange perjungti neįmanoma, nes nėra į ką.

Laukas gyvena **App Privacy** skiltyje (ne „App Information"), ir jį galima
pildyti dar neišleistai programėlei. Duomenų deklaracija skelbiama **iš karto**
(„Update your responses, then click Publish"), o URL laukas — su kita versija.

## 4. Deploy'as: kaip jo laukti ir kaip NElaukti

Tempas nepastovus: 2026-09-16 deployment'as atsirado per **30 sekundžių**,
2026-09-18 — per **30 ir 15 minučių**, vėliau vėl per 3–4. Nedaryti išvados,
kad integracija atjungta, jei įrašo dar nėra — taip nutiko 09-18 ir buvo
atidaryta kortelė ant klaidingos prielaidos (#40, perrašyta į `LV 1`).

Būseną klausti GitHub'o, ne spėlioti iš puslapio:

```bash
gh api repos/avocadas/gloumi-website/deployments --jq '.[0] | "\(.created_at) \(.sha)"'
```

**Turinio NETIKRINTI ciklu su `curl`.** 2026-09-18 laukimas kas 10 sekundžių
užsitraukė `403` su `X-Vercel-Mitigated: challenge` — Vercel botų apsauga
suveikė prieš patį tikrintoją, ir tai atrodė kaip svetainės gedimas. Tikra
naršyklė tuo pačiu metu puslapį atidarė normaliai. Tikrinti naršykle arba
pavieniais užklausimais.

## 5. Generavimas iš svetimos juostos

`scripts/gen-from-app.mjs` priima kelią (`process.argv[2]`), tad tekstą galima
paimti iš juostos, kurios nėra vietiniame medyje, nieko nemerginant:

```bash
git -C ../Gloumi worktree add --detach /tmp/wt origin/<juosta>
npm run gen:app -- /tmp/wt/gloumi-app/src
git -C ../Gloumi worktree remove --force /tmp/wt
```

Taip 2026-09-25 buvo paimta lytis iš `ieva-prod`, kai jos dar nebuvo nei
`prod`, nei kitose juostose. **Patikra po to:** kai ta juosta pasiekia `prod`,
`npm run gen:app` iš įprasto šaltinio privalo duoti **nulinį diff'ą** — jei ne,
tekstas paimtas ne iš ten.

## 6. Ko NEĮRODYTA

- Teisininko peržiūros nebuvo. `legal.js` antraštė tebesako, kad tai
  struktūrizuotas juodraštis; tracker'io #20 punktas atviras.
- Anketos App Store Connect'e **nemačiau** — jos pildymas remiasi developerio
  žodžiu. Čia nėra nei API rakto, nei prisijungusios naršyklės.
- Rikiavimo formulė perrašyta pagal gyvą funkciją programėlės pusėje; ar
  svetainės tekstas ją atkartoja **teisingai**, tikrinta tik lyginant eilutes,
  ne matuojant pačią funkciją.

---

# 2026-09-28 — Kirilicos sargas: `scripts/check-cyrillic.mjs`, sujungtas su `npm run check`

Gloumi repo issue #83 dalis (žr. jos `HANDOVER.md`). Šio repo `AGENTS.md`
iki šiol sakė, kad nieko čia automatiškai netikrinama — tik agentas
perskaito, ką parašė. Dabar `npm run check` (`lint && typecheck &&
check:contrast && check:cyrillic`) atmeta bet kokią kirilicos raidę bet
kuriame sekamame faile, ta pati logika kaip programėlės
`tools/checkCyrillic.js`: `git ls-files`, binarinis/tekstinis atskyrimas
pagal turinį (nulinis baitas), ne pletinį.

Parašyta anglų kalba, sekant vienintelio esamo `scripts/` scenarijaus
(`check-contrast.mjs`) konvenciją — ne perkeliant programėlės repo
lietuvišką komentarų taisyklę čia, kur ji anksčiau netaikyta.

Sweep'as prieš pridedant rado **nulį** kirilicos raidžių šiame repo.

Pastumta į `main` su developerio patvirtinimu (`GLOUMI_RELEASE=1`) —
commit `d9bd3ed`. Šis repo neturi `prod`/`main` eigos (žr. įrašą žemiau,
1 skyrių): `main` yra tiesioginis Vercel deploy, tad kiekvienas push į ją
yra release.

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

**Naršyklėje išbandyta 2026-09-14 po pietų** (Chromium, 375×812 telefono
emuliacija; kas liko nepatikrinta — 6 skyriuje):

| Kas | Ką matėme |
|---|---|
| Titulinis per telefoną | visas puslapis nuo antraštės iki poraštės, be šoninio slinkimo (`scrollWidth` = `clientWidth` = 375) |
| Teisiniai per telefoną | `/taisykles` – turinio kortelė, numeruoti skyriai, „English version ↓“ veda į `#en` tame pačiame puslapyje |
| Kalbos perjungiklis | paspaustas: `/` → `/en` ir `/privatumo-politika` → `/en/privacy`; `aria-current` persikelia, `<html lang>` pasikeičia |
| Mobilus meniu | atsidaro, `aria-label` virsta „Uždaryti meniu“, po nuorodos užsidaro, inkaras nuslenka su 96 px antraštės atsarga |
| Meistrų forma | tuščia neišsiunčiama (naršyklės validacija, fokusas grįžta į „Vardas“); užpildyta duoda `POST /api/waitlist 200` ir žalią kortelę „Ačiū – gavome!“ |
| Lietuviškos raidės | `Testas Ąžuolas` / `Šiauliai` pasiekia serverį nesugadinti |
| Nuorodos | nė viena `#` nuoroda neveda į nesantį elementą – nei `/`, nei `/en`, nei `/taisykles` |
| Dalinimosi kortelės | abi parsisiųstos ir pažiūrėtos: ženklas, antraštė, kategorijų eilutė, `gloumi.lt` |

Forma siųsta per **vietinį `npm run dev`**, kur be `RESEND_API_KEY` užklausa tik
įrašoma į terminalą. Į gyvą svetainę testinė užklausa **nesiųsta** — ji būtų
atėjusi į `info@gloumi.lt` kaip tikra.

**Adresai.** Lietuvių kalba šaknyje: `/`, `/taisykles`, `/privatumo-politika`,
`/grazinimo-salygos`, `/dac7`. Anglų po `/en` su angliškais slug'ais:
`/en`, `/en/terms`, `/en/privacy`, `/en/refunds`, `/en/dac7`.

**Nė vieno iš dešimties adresų NEKEISTI**, o lietuviškų — labiausiai: juos
naudoja pati programėlė ir žmonės, ir jie jau paskelbti.

**App Store Connect gaus ANGLIŠKĄ adresą**, `https://gloumi.lt/en/privacy`.
Anksčiau čia buvo parašyta priešingai, ir tai buvo prielaida, o ne patikrinta:
App Privacy laukas yra vienas kiekvienai parduotuvės kalbai, o **lietuvių
kalbos App Store metaduomenyse nėra**. Apple „App Store localizations" sąraše
(patikrinta 2026-09-14) nėra nei lietuvių, nei latvių, nei estų; Lietuvai
nurodyta English (U.K.). Perjungti kalbos tame lange neįmanoma, nes nėra į ką.
Lietuviškas puslapis dėl to niekur nedingsta — į jį veda perjungiklis iš
angliškojo, `hreflang` ir pati programėlė.

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

**4.7. Naršyklės skydelis meluoja dviem būdais.** Abu atrodo kaip svetainės
klaidos ir nė vienas nėra.
- **Paslėptas skydelis nepersipiešia.** Kai Claude langas ne priekyje,
  ekrano nuotrauka po slinkimo grįžta tuščia arba su antrašte, įpiešta vidury
  puslapio. DOM tuo metu rodo, kad turinys vietoje ir `opacity: 1`. Apėjimas,
  kuriuo padarytos šios dienos nuotraukos: aukštas langas (375×2400) ir
  `document.body.style.marginTop = '-4600px'` vietoj slinkimo — maketo
  pakeitimas priverčia perpiešti.
- **Paspaudimas pagal `ref` nepataiko.** Elemento nuoroda duoda CSS
  koordinates, o skydelis jas skaito savo rėmelyje, tad forma tyliai
  nepasiuntė **keturis kartus** iš eilės — nei `submit`, nei klaidos, nei
  užklausos tinkle. Pataiko koordinatė, nuskaityta iš pačios nuotraukos
  (nuotraukos taškas ÷ mastelis). Prieš skelbiant, kad mygtukas neveikia,
  pakabinti `addEventListener('click')` ir pažiūrėti, ar paspaudimas išvis
  atėjo.

**4.8. Cormorant Garamond paukščiukai — ne klaida.** Dideliame šrifte `ž`, `š`,
`č` paukščiukas atrodo atplyšęs ir pastumtas kairėn; nuotraukoje tai atrodo kaip
sugadintas šriftas. Išmatuota pačiame `assets/fonts/CormorantGaramond-SemiBold.ttf`:
`ž` yra vientisas glifas (gid 565), raidės kontūro centras 205, paukščiuko — 211,
tad horizontaliai jis **centruotas**. Nestandartinis tik aukštis: paukščiuko
viršus 731, kai didžiųjų raidžių aukštis 625, o `ė` taškas siekia 607. Tokia
šrifto sandara. Nediagnozuoti iš nuotraukos — glifą galima pamatuoti.

---

## 5. Kas liko (tracker #20)

<https://github.com/avocadas/Gloumi/issues/20>, priskirta avocadas.

- [ ] `https://gloumi.lt/en/privacy` į App Store Connect (App Privacy →
      Privacy Policy); platesnis sąrašas — tracker'io #28
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

- **Tikras telefonas į rankas neimtas.** Kas patikrinta — 2 skyriuje, ir tai
  darta darbalaukio naršyklės telefono emuliacijoje. Emuliacija nerodo nei
  Safari iOS, nei iškarpos, nei tikro piršto: 17 nuorodų ir mygtukų yra žemesni
  nei 32 px (poraštės nuorodos 18 px, kalbos perjungiklis 24 px). Visos jos —
  tekstinės eilutės, ne pagrindiniai mygtukai, bet tai spręsti reikia matant.
- **Gyva forma nepaspausta.** Siųsta per `curl` ir per naršyklę vietiniame
  serveryje; per `gloumi.lt` naršyklėje **ne**, nes tai būtų tikras laiškas.
  Kas neįrodyta gyvai: kad Vercel'io aplinkos kintamieji tebeveikia ir kad
  `Resend` priima šiandien.
- **Kortelės socialiniuose tinkluose nematytos.** Abu PNG parsisiųsti ir
  pažiūrėti; kaip juos apkerpa Facebook, LinkedIn ar Messenger peržiūra,
  nežiūrėta.
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
