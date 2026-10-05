# HANDOVER.md

Naujausias perdavimas viršuje. Senesni lieka žemiau — jie tebėra teisingi apie
savo dieną.

---

# 2026-10-05 — DUK puslapis (#209) ir kreipinys „jūs“ (#20)

Rašo ofiso `web` rolė. Kas pasikeitė ir ką žinoti kitam pokalbiui:

- **DUK `/duk` ir `/en/faq`** (Gloumi #209): turinys – `src/content/faq.ts`, GENERUOJAMAS
  `node scripts/gen-faq.mjs <kelias į DUK.md>` iš support rolės juodraščio (ofiso aplankas
  `pagalba/DUK.md`, ne git'e; 2026-10-05). Skelbiama tik tai, kas galioja pagal Taisykles 1.12
  (developeris per Manager'į 2026-10-05): `HOLD` – K-9, K-28, K-40, K-43, K-54; K-46 – tik iki
  žymės „skelbti tik su funkcija“; nuorodos į neskelbiamus klausimus nuimamos. Pasikeitus juodraščiui ar
  įsigaliojus 1.13 – pataisyti `HOLD` ir pergeneruoti (`FAQ_UPDATED=YYYY-MM-DD`), tada check + build.
  Scenarijus nerašo, jei LT ir EN klausimai nesutampa ar liko nuoroda į neskelbiamą klausimą.
- DUK naudoja `LEGAL_ROUTES` (`faq`): sitemap, `hreflang`, kalbos perjungiklis – savaime; į teisinių
  dokumentų „Kiti dokumentai“ jis nepatenka (`LegalPage.tsx`). Poraštėje – „Klientams“ ir
  „Meistrams“ (`/duk#masters`). Skyrių inkarai – `faq.ts` `key` (`about` … `content`), klausimų – `#k-12`.
- **Kreipinys „jūs“, EN „master“ ir „visit“** (Gloumi #20, content `docs/content/svetaine.md` A, B, D4):
  `copy.lt.ts`, `copy.en.ts`, kategorijų šūkiai, EN teisinių puslapių meta aprašai; EN inkaras
  `#for-masters` (buvo `#for-professionals`). `masters.lead` – developerio B3 (`cdc0dad`).
- Neįrodyta: naršyklės skydelyje (paslėptas, `visibilityState: hidden`) Next po perėjimo į `/duk#masters`
  neslenka – taip pat ir esamos nuorodos į `/#kategorijos`; tiesiogiai atidarytas adresas skyrių randa.

---

# 2026-10-04 — Paskyros trynimo puslapis, laiškas moderatoriui ir ofiso `web` šakos

Rašo ofiso `web` rolė (Gloumi `AGENTS.md` XI): savo worktree'e
`C:\Users\Avocadas\Gloumi-office\web` (savas `node_modules`), šakose
`office/web-<tema>` nuo `origin/main`; bendras `../gloumi-website` aplankas
lieka kitoms sesijoms. Į `main` — tik po developerio „pushink“, per Bash su
`GLOUMI_RELEASE=1`. Šis įrašas išleidžiamas tame pačiame push'e kaip #171 ir
#170, todėl jis viršesnis už portalo skyriaus §1 eilutes apie `main` ir
šakas.

## 1. Kas šiuo push'u patenka į `main`

Šie commit'ai stovi ant `2a03b63` — Next.js 16.3.4 → 16.3.8
(GHSA-vcvr-r3jv-pc5j; `npm audit --omit=dev` po jo 0), kuris į `main` eina
pirmas arba tame pačiame push'e. Iki jo `main` = `e9c05a5` (gyvas nuo
2026-10-02 22:39 UTC: Taisyklės ir Privatumo politika 1.12, Meistrų ir salonų
sąlygos 1.0). Pilnas `npm audit` dar rodo 6 high kūrimo įrankiuose
(`brace-expansion`, `braces`) — į svetainę jie nepatenka.

- **#171 — paskyros trynimo puslapis** `/paskyros-trynimas` ir
  `/en/account-deletion` (`3174fea`). Google Play duomenų saugos formai —
  `https://gloumi.lt/en/account-deletion`. Tai šeštas `LEGAL_ROUTES` raktas
  (`deletion`, `lang.ts`): iš jo — sitemap'as ir kitų teisinių puslapių
  nuorodos; poraštėje — `copy.*.ts` `footer.legalLinks`.
  Žingsniai — programėlės mygtukų pavadinimai; „Kiek laiko saugome“
  cituojamas iš Privatumo politikos PAGAL PAVADINIMĄ (`legal.ts`), tad
  pervadinus skyrių programėlėje krenta `npm run build`, ne puslapis.
- **#170 — laiškas moderatoriui** `POST /api/hooks/new-report` (`9a15f43`,
  `0caf7d5`). Kviečia ne naršyklė, o bazės trigeris (`pg_net`) su antrašte
  `x-gloumi-hook-secret`; kūnas — tik `{reason, target_type}`. Laiškas „Yra
  naujų pranešimų apie turinį“ per Resend iš `no-reply@mail.gloumi.lt` į
  `MODERATION_ALERT_TO` arba info@gloumi.lt: naujausio pranešimo priežastis,
  kam jis skirtas ir nuoroda į portalą, be turinio, vardų ir ID (formuluotė
  tokia, nes trigeris laišką siunčia ne kiekvienam pranešimui, žr. §2).
  Atsakymai: 503 — nėra `REPORT_HOOK_SECRET` (arba production'e
  nėra Resend rakto), 401 — bloga paslaptis, 400 — ne JSON, 502 — Resend
  atmetė, 200 — išsiųsta.
- **HANDOVER** — portalo skyriaus atnaujinimas (`82a189d`, buvo
  `portal/handover-2026-10-04` `ec695a0`) ir šis įrašas.

## 2. Kaip įjungti #170 (tvarka svarbi)

1. Šis push'as: maršrutas gyvas, bet be paslapties atsako 503 ir nieko
   nesiunčia (2026-10-04 18:18 UTC Vercel'yje `REPORT_HOOK_SECRET` ir
   `MODERATION_ALERT_TO` nėra).
2. Developeris sugeneruoja paslaptį ir įrašo ją dviejose vietose: Vercel
   `REPORT_HOOK_SECRET` (Production, Sensitive) ir Supabase Vault
   `report_hook_secret`. Agentas jos nemato ir neįrašo.
3. **Naujas production deploy'us:** kintamasis įsigalioja tik naujam
   deploy'ui („Kas gyvena Vercel'yje“ §2). Be jo maršrutas ir toliau atsakys
   503.
4. db pritaiko Gloumi `20261004152607` (`office/db-pranesimu-priezastys`,
   su developerio „taip“ db pokalbyje). Įjungia įrašas
   `app_config.report_hook_url` = `https://gloumi.lt/api/hooks/new-report`;
   jį ir Vault paslaptį įrašo developeris (komandos — Gloumi
   `supabase/migrations/PENDING.md`). Kol URL nėra, trigeris nieko
   nesiunčia, tad migracija gali būti bazėje ir anksčiau. URL įrašyti tik po
   1–3 žingsnių, kitaip pirmi kvietimai gaus 503 ir laiškų nebus.
5. Patikra: vienas pranešimas iš QA paskyros programėlėje → Resend
   `list-emails` arba info@ dėžutė. Trigeris kviečia ne dažniau kaip kas 10
   min ir ne daugiau kaip 24 per parą, o ko nepakvietė, vėliau nebepakviečia,
   tad antras bandymas per 10 min laiško nesukels — tai ne gedimas.

`RESEND_API_KEY` yra tik Production, todėl šakų Preview deploy'uose laiško
neišbandysi. Tas raktas tebėra 2026-09-14 (Gloumi #67), o nemokama Resend
para — 100 laiškų visam projektui kartu su registracijos laiškais.

## 3. Laukia „pushink“ (šakos įstumtos, `main`'e jų nėra)

| Šaka | Kas | Ko laukia |
|---|---|---|
| `office/web-ginco-sprendimas-2` (= `13d21d9` ant šio įrašo) | #164: pralaimėtam banko ginčui — „Nuostolį neša Gloumi“ arba „Nuostolį neša meistras“ (`gloumi_bears`, `master_bears`) | IŠLEIDŽIAMA atskiru push'u iškart po šio įrašo (developerio sprendimas 2026-10-04 ~22:45 UTC). db dalis gyva (`20261004174752`, `…174827`, `…174851`; patikrinta gyvoje bazėje 19:26 UTC); `admin_list_disputes` `chargeback_bearer` grąžins tik `20261004191736` (nepritaikyta) — iki jos žymos „Nuostolį nešė…“ nėra, mygtukai veikia. Po web payments diegia `stripe-webhook` |
| `office/web-admin-errors` `f169ee7` | #29: skirtukas „Klaidos“ (Sentry, tik skaitymas) | `SENTRY_READ_TOKEN` Vercel'yje (2026-10-04 18:18 UTC — nėra) |
| `office/web-moderavimo-priezastis` `c2ce7d9` | #169: privaloma priežastis ir pažeistas punktas (`jsonb` su LT ir EN skyriaus pavadinimu), laiškas autoriui apie sprendimą | db `20261004145806` (`office/db-moderavimo-pranesimai`, nepritaikyta). Į `main` — tik kartu su ta migracija, kitaip gyvo portalo trynimai gaus `reason_required` |
| `office/web-individualios-salygos` `b4772a0` | #179: individualios sąlygos meistrui (komisinio atsisakymas, Pro ar VIP iki datos) | db `20261004135403` (nepritaikyta) |

Likusios trys stovi ant `e9c05a5`: prieš push'ą perkelti ant naujo `main` ir iš
naujo paleisti `npm run check` ir `npm run build`. #29 ir #170 abu prideda
eilutes po `SUPABASE_SERVICE_ROLE_KEY` `README.md` ir `.env.example` —
perkeliant #29 palikti abi dalis.

## 4. Laukia developerio

- **#129:** penki nepažymėti punktai — lentelė portalo skyriaus §5.
- **#20:** socialinių tinklų adresai (`site.ts` `social` — visi `null`);
  parduotuvių nuorodos — po viešo išleidimo (`NEXT_PUBLIC_*`, tad perdiegti
  be build kešo).
- **1.13** (build'o dieną): `gen:app` iš tos šakos → check + build → ranka
  rašytos grąžinimų puslapio eilutės (`legal.ts` `refundSections`) ir DAC7
  dalys → žymos „Pro ir VIP“ meistrų bloke (Gloumi #20, S-082) → „pushink“
  kartu su build'u.
- **#67:** naujas Resend raktas Vercel'yje ir planas.

## 5. Išmatuota ir spąstai

- **Sutartį su db tikrinti prieš push'ą, ne iš atminties:**
  `git -C <Gloumi> show origin/office/db-<tema>:supabase/migrations/<failas>`
  ir palyginti su šakos `actions.ts` (parašai, sprendimų vardai, klaidų
  kodai). Taip 2026-10-04 rasta, kad #164 sutampa, o #169 — ne. db šakos
  keičiasi greitai (tą patį vakarą `20261004101651` virto trimis jau
  pritaikytomis migracijomis), tad prieš push'ą žiūrėti ir gyvą bazę:
  `supabase_migrations.schema_migrations` ir `pg_get_functiondef`.
- **Gloumi #142 2 p.:** Vercel `SUPABASE_SERVICE_ROLE_KEY` nekeistas nuo
  2026-09-30 15:41 UTC (`createdAt` = `updatedAt`), o 10-01 matavimas rodė
  `sb_secret_`. Vercel MCP `get_project_env` grąžina IŠŠIFRUOTĄ reikšmę —
  jo nenaudoti; metaduomenims — `filter_project_envs` su `decrypt: false`.
- **Portalas be prisijungimo:** laikinas `src/app/admin-preview/` ir
  `.claude/launch.json` su uostu 3117 (3100 gali užimti kitas pokalbis);
  prieš commit'ą ištrinti abu ir `.next/dev/types`.
- **Ilgas mygtuko tekstas:** `btn` turi `h-10` ir `shrink-0`, tad telefone
  mygtukas išlenda už kortelės — `h-auto min-h-10 max-w-full py-2`.
- **Nauji failai** — `git add -N` prieš `npm run check`, kitaip
  `check:cyrillic` jų nemato.
- **Apostrofas JSX tekste** krenta per `react/no-unescaped-entities` —
  rašyti `{"…"}`.
- **Tracker'io komentaras gali turėti kelių rolių eilutes** („Ima: db…“,
  „Ima: web…“): skaityti visą, ne pirmą eilutę.
- Vietinė `legal-1.12` ištrinta 2026-10-04 — portalo skyriaus §6 pavyzdys
  jau istorinis.

## 6. Ko NEĮRODYTA

- #170 visa grandinė (trigeris → maršrutas → Resend → dėžutė): migracija
  nepritaikyta, paslapties nėra. Vietoje išbandyti tik maršruto atsakymai.
- Kad #171 adresas tinka Google Play formai — formą pildo developeris.
- Kad šie puslapiai gyvi: įrašas rašytas prieš push'ą, o po deploy'aus
  tikrinama po vieną užklausą.

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

## 1. Kas dabar gyva (išmatuota 2026-10-04)

- **Svetainė:** `main` = `e9c05a5` (portalo kodas paskutinį kartą keistas
  `d3b3d7a`, po jo — tik #146 teisiniai tekstai). Puslapiai: `/admin/login`,
  `/admin` (Skundai), `/admin/disputes` (Ginčai, #147), `/admin/data`
  (Duomenys), `/admin/users/[id]` (paskyra). Nuo `9241a5d` — programėlės
  dizainu (žr. §2 „Išvaizda“).
- **Ofiso `web` rolė** (Gloumi AGENTS XI) nuo 10-03 portalą keičia savo
  šakose `office/web-*`, dar neįlietose į `main`: `web-ginco-sprendimas`
  (#164, kas neša pralaimėtą banko ginčą), `web-moderavimo-priezastis`
  (privaloma priežastis ir pažeista taisyklė), `web-admin-errors` (#29,
  Sentry klaidos portale), `web-pranesimo-laiskas` (#170). Jos keičia
  `actions.ts`, `ConfirmDialog.tsx`, `ReportCard.tsx`, `RowCard.tsx`,
  `AccountActions.tsx`, `DisputeCard.tsx`, `AdminShell.tsx` — prieš liečiant
  šiuos failus pasitikrinti su ja.
- **Gloumi:** portalo bazė ir Edge (`20261001012855`, `admin-media-urls` v2)
  jau `prod`'e. Ginčų RPC (`20261001233134`) — Ringaudo juostos, pritaikyti.
- **Administratoriai:** `admin_ids` trys — `admin.ieva`, `admin.karolis`,
  `admin.ringaudas`; TOTP `verified` visi trys (Karolis įsijungė 10-01
  20:45 UTC). Užrakintų nėra.
- **#129 (4 iš 9):** pažymėti 1 (atsijungimas), 5 (blokavimas ir trynimas —
  gyvai išbandyta 10-01 22:18–22:22 UTC, ištrintos `gloumi.test.client2` ir
  „Claude“), 7 (senos funkcijos), 8 (perpiešimas). **Gyvai NEIŠBANDYTA:** 2
  (paieška ir nuotraukos), 3 (turinio trynimas), 4 (žmogaus apžvalga), 6
  (tekstų taisymas), 9 (priežastis blokuojant — kodas `0c6d0f1` gyvas).
  Skundų „peržiūrėti / atmesti“ gyvai veikia (`admin.karolis`, 10-01 21:51).
- **#147** uždarytas 10-02 (3 punktas — portalo ginčų mygtukai — pažymėtas),
  bet ginčų dar nebuvo nė vieno, tad sprendimo kelias gyvai neišbandytas.
- Nuo 10-01 22:22 UTC iki 10-04 portale nebuvo nė vieno veiksmo
  (`admin_audit_logs` tuščias tame lange).

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
| `setSuspended` | `admin_suspend_user` (Gloumi `20261004231227`, #169 3 p.) — sustabdymas iki 30 d. su šaltiniu (`report` / `own`): `banned_until`, žurnalas, pranešimas žmogui ir meistro vizitų atšaukimas vienoje transakcijoje; laiškas jam — visada (`moderation-email.ts`). Atkuria mygtukas arba bazės cron `restore-suspensions` (žurnale be administratoriaus). Iki jo: GoTrue `ban_duration` + `log_admin_action`, be pranešimo |

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
(`source = 'chargeback'`) `refund` / `release` mygtukų nėra — pinigus grąžina
bankas. Kai bankas ginčą pralaimi (`lost`), nuo #164 portalas siūlo du
sprendimus: „Nuostolį neša Gloumi“ (`gloumi_bears` → `release`, meistrui
išmokama) ir „Nuostolį neša meistras“ (`master_bears` → vizitas `refunded`,
ginčas `closed`, be Stripe grąžinimo); kas nešė, rodo žyma, kai sąrašas
grąžina `chargeback_bearer` (Gloumi `20261004191736`). Jei kortelės ginčas
`open`, o `transferred_at` vis dar užpildytas, `stripe-webhook` išmokos atsiimti
nepavyko — kortelė rodo įspėjimą. Būsenos: `open`, `refund`, `release` (ir laimėtas banko ginčas),
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

| # | developeris daro | turi įvykti | būklė 10-02 |
|---|---|---|---|
| 2 | Duomenys → Įrašai, paieška `TEST` | „Rasta 204“, eilutės ir nuotraukos; vietoj nuotraukos „Peržiūra nepasiekiama“ → funkcijos žurnalas | neišbandyta |
| 3 | programėlėje parašo komentarą `testas 129`, portale Komentarai → ištrina (komentarų bazėje 0) | eilutės nebėra; žurnale `remove` su ta eilute | neišbandyta |
| 4 | įrašo kortelėje paspaudžia „Meistras“ (TEST - Meistras Kaunietis) | Įrašai 100, Nuotraukos 25, Atsiliepimai 15, Vizitai 15, Pranešimai 15, kitos po 1 (išmatuota 10-01) | neišbandyta |
| 5 | Užblokuoti / Atblokuoti; trinti testinę paskyrą | žurnale `suspend_user`, `delete_account`, eilutė `deleted_account_media` | **padaryta** (atblokuoti nespausta) |
| 6 | pataiso testinio įrašo aprašymą ir grąžina | tekstas pasikeitė; žurnale du `edit_text` su `before` ir `after` | neišbandyta |
| 9 | užblokuoja ir atblokuoja testinę paskyrą (pvz. „TEST - QA Klientas“) su priežastimi | žurnale `suspend_user` ir `unsuspend_user` su `details.reason` | neišbandyta |
| #147 | ginčas (testinis klientas programėlėje „Vizitas neįvyko?“) → Ginčai → sprendimas | `booking_disputes.status` = `refund`/`release`, žurnale `resolve_dispute` | ginčų 0 |

Pažymėti punktus ir siūlyti uždaryti #129 — tik developeriui sutikus (Gloumi
VII.14). Neprisijungus saugu patikrinti tik vieną dalyką, viena užklausa:
`curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://gloumi.lt/admin/data`
→ `307` į prisijungimą.

## 6. Ko NEĮRODYTA

- `/admin/data` lentelių ir `/admin/users/[id]` su tikrais duomenimis
  nuotraukų dar niekas nematė (paskyros puslapiai atidaryti 10-01 vakare).
- `admin-media-urls` sėkmės kelias (svetainės raktas → `service_role`).
  Išmatuoti tik atsisakymai: viešas raktas → `permission denied for function
  admin_require`, netikras Bearer → JWT klaida.
- R2 failo dingimas po nuotraukos `admin_remove` — naktinis `media-purge` po
  to gyvai nestebėtas.
- Apple atšaukimas `purge_accounts` viduje — repeticijos paskyros
  `apple_refresh_tokens` neturėjo.
- Ginčo sprendimas (`resolveDispute`) — ginčų dar nebuvo.
- **Bendras aplankas:** kitos sesijos šiame checkout'e laiko vietines šakas ir
  neišsiųstus commit'us (pvz. `legal-1.12` su #146 tekstais, laukia
  developerio). Prieš push'ą — `git log origin/main..main`, išsiųsti tik savo.

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
