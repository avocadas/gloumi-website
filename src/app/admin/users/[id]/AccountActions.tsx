"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IconBan, IconCalendar, IconPencil, IconPlus, IconTrash } from "@/components/icons";
import { cancelMasterTermination, deleteAccount, setBookingRestriction, setSuspended } from "../../actions";
import { useConfirm } from "../../ConfirmDialog";
import { useTerminationNotice } from "../../ModerationRules";
import { formatWhen } from "../../format";
import type { NoticeNote } from "../../moderation-email";
import { SUSPEND_DAYS, SUSPEND_SOURCES } from "../../suspension";
import { TERMINATE_AFTER_NOTICE, URGENT_GROUNDS } from "../../termination";
import type { GrantView } from "../../grants/GrantRows";
import { ActionNote, Alert, STROKE, SectionTitle, btn, btnDanger, btnQuiet, card } from "../../ui";
import { BirthDateCorrection } from "./BirthDateCorrection";
import { ActiveGrantRow, GrantForm, GrantHistory } from "./MasterGrants";

/*
 * Paskyros sustabdymas ir trynimas (#129, developerio sprendimas: abu).
 *
 * Sustabdymas – iki 30 d. su terminu ir šaltiniu (#169 3 p., developeris
 * 2026-10-05); pasibaigus terminui prieiga grąžinama automatiškai, anksčiau –
 * mygtuku „Atkurti", ilgiau – tik pratęsimu, t. y. nauju sprendimu. Trynimas — ne, todėl jis prašo
 * įrašyti paskyros vardą: patvirtinimas paspaudžiamas iš įpročio, o vardo iš
 * įpročio niekas neįrašo. Abu prašymai — ir vardas, ir priežastis — dabar
 * viename lange, kad žmogus matytų, ką patvirtina, kol rašo.
 *
 * Meistro trynimas (#169, P2B 4 str.; developeris 2026-10-08 „Užrakinti“):
 * be skubaus pagrindo bazė paskyrą panaikina tik po 30 d. nuo pranešimo, o
 * kol laukiama – „Atšaukti nutraukimą“. Skubų pagrindą (4 str. 4 d.) renkasi
 * administratorius lange; tada trinama iš karto.
 *
 * Rezervavimo apribojimas (#207) – to paties pavidalo, tik stabdo naujas
 * rezervacijas, ne prisijungimą; automatiniai įspėjimai jo nesukuria.
 *
 * Išdėstymas (design `admin-portalas.md` 5.1, 2026-10-20): „Dabar galioja“ –
 * kiekvienas galiojantis sprendimas su terminu ir veiksmu jam baigti toje
 * pačioje eilutėje (sąlygos, sustabdymas, apribojimas, suplanuotas
 * panaikinimas); po juo – viena veiksmų eilutė naujam sprendimui, formos
 * atsiskleidžia po ja; ankstesni sprendimai – suskleisti. Ką padarys
 * kiekvienas veiksmas, sako jo patvirtinimo langas.
 */
export function AccountActions({
  userId,
  banned,
  bannedUntil,
  restrictedUntil,
  suspendWhy = null,
  restrictWhy = null,
  terminationAt,
  confirmName,
  isMaster,
  grants,
  grantDays,
  birthDate,
}: {
  userId: string;
  banned: boolean;
  /** `auth.users.banned_until` – iki kada sustabdyta. */
  bannedUntil: string | null;
  /** `booking_restrictions.until`, jei rezervavimas dabar apribotas; kitaip `null`. */
  restrictedUntil: string | null;
  /** Kodėl sustabdyta ir kodėl apribota (žurnalas): priežastis, punktas, šaltinis, kas sprendė. */
  suspendWhy?: string | null;
  restrictWhy?: string | null;
  /** Kada bus panaikinta meistro paskyra, jei nutraukimas suplanuotas; kitaip `null`. */
  terminationAt: string | null;
  confirmName: string;
  isMaster: boolean;
  /** Meistro individualios sąlygos (#179); `undefined` — ne meistras, `null` — gauti nepavyko. */
  grants?: GrantView[] | null;
  grantDays: { min: string; max: string };
  /** `profiles.birth_date` (YYYY-MM-DD); `null` – nenurodyta. */
  birthDate: string | null;
}) {
  const router = useRouter();
  const notice = useTerminationNotice();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Ar žmogui išsiųstas laiškas apie sustabdymą (#169 3 p.) – kaip turinio sprendimų kortelėse.
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [dialog, ask] = useConfirm();
  const [form, setForm] = useState<"grant" | "birth" | null>(null);

  const run = (suspend: boolean, reason: string, rule: string | null, days?: number, source?: string) => {
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await setSuspended(userId, suspend, reason, rule, days, source);
      if (res.ok) setNote(res.note ?? null);
      else setError(res.error);
    });
  };

  /** Sustabdyti arba pratęsti (`banned`) – tas pats langas: pratęsimas yra naujas sprendimas su nauju pranešimu. */
  const suspend = async () => {
    const answer = await ask({
      title: banned ? "Pratęsti sustabdymą?" : "Sustabdyti paskyrą?",
      body: [
        banned
          ? `Dabar sustabdyta iki ${formatWhen(bannedUntil)}. Naujas terminas turi būti vėlesnis; tai naujas sprendimas, ir žmogus gaus naują pranešimą.`
          : "Žmogus nebegalės prisijungti iki termino pabaigos, o jau atidaryta programėlė nustos veikti, kai baigsis jos prieigos raktas. Pasibaigus terminui prieiga grąžinama automatiškai.",
        "Jam iš karto pranešime priežastį, punktą, šaltinį ir terminą – programėlėje ir el. paštu; sustabdymas be pranešimo neįvyksta.",
        "Jo vizitai iki termino pabaigos – ir kaip meistro, ir kaip kliento – bus atšaukti, kitai šaliai pranešta, o programėlėje sumokėta suma grąžinta.",
      ],
      confirmLabel: banned ? "Pratęsti" : "Sustabdyti",
      danger: true,
      choices: [
        {
          key: "days",
          label: "Terminas",
          hint: "ne ilgiau 30 dienų; ilgiau – tik nauju sprendimu",
          options: SUSPEND_DAYS.map((d) => ({ value: String(d), label: d === 1 ? "1 diena" : `${d} d.` })),
        },
        {
          key: "source",
          label: "Kodėl imtasi",
          hint: "nurodoma pranešime",
          options: SUSPEND_SOURCES.map((o) => ({ value: o.value, label: o.label, note: "note" in o ? o.note : undefined })),
        },
      ],
      rule: true,
      ruleNoRequest: true,
      reasonRequired: true,
    });
    if (!answer) return;
    run(true, answer.reason, answer.rule, Number(answer.choices.days), answer.choices.source);
  };

  const restore = async () => {
    const answer = await ask({
      title: "Atkurti prieigą dabar?",
      body: [
        `Sustabdyta iki ${formatWhen(bannedUntil)}; pasibaigus terminui prieiga grįžtų ir be šio mygtuko.`,
        "Žmogus vėl galės prisijungti. Jam pranešime, kad prieiga grąžinta – programėlėje ir el. paštu.",
      ],
      confirmLabel: "Atkurti",
      reason: true,
    });
    if (!answer) return;
    run(false, answer.reason, null);
  };

  const runRestriction = (restrict: boolean, reason: string, rule: string | null, days?: number, source?: string) => {
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await setBookingRestriction(userId, restrict, reason, rule, days, source);
      if (res.ok) setNote(res.note ?? null);
      else setError(res.error);
    });
  };

  /** Apriboti arba pratęsti – kaip sustabdymas: pratęsimas yra naujas sprendimas su nauju pranešimu. */
  const restrict = async () => {
    const answer = await ask({
      title: restrictedUntil ? "Pratęsti rezervavimo apribojimą?" : "Apriboti rezervavimą?",
      body: [
        restrictedUntil
          ? `Dabar apribota iki ${formatWhen(restrictedUntil)}. Naujas terminas turi būti vėlesnis; tai naujas sprendimas, ir žmogus gaus naują pranešimą.`
          : "Iki termino pabaigos žmogus negalės rezervuoti naujų vizitų. Jau rezervuoti vizitai lieka, prisijungti galės; pasibaigus terminui apribojimas nuimamas automatiškai.",
        "Jam iš karto pranešime priežastį, punktą, šaltinį ir terminą programėlėje.",
      ],
      confirmLabel: restrictedUntil ? "Pratęsti" : "Apriboti",
      danger: true,
      choices: [
        {
          key: "days",
          label: "Terminas",
          hint: "ne ilgiau 30 dienų; ilgiau – tik nauju sprendimu",
          options: SUSPEND_DAYS.map((d) => ({ value: String(d), label: d === 1 ? "1 diena" : `${d} d.` })),
        },
        {
          key: "source",
          label: "Kodėl imtasi",
          hint: "nurodoma pranešime",
          options: SUSPEND_SOURCES.map((o) => ({ value: o.value, label: o.label, note: "note" in o ? o.note : undefined })),
        },
      ],
      rule: true,
      ruleNoRequest: true,
      reasonRequired: true,
    });
    if (!answer) return;
    runRestriction(true, answer.reason, answer.rule, Number(answer.choices.days), answer.choices.source);
  };

  const unrestrict = async () => {
    const answer = await ask({
      title: "Nuimti rezervavimo apribojimą dabar?",
      body: [
        `Apribota iki ${formatWhen(restrictedUntil)}; pasibaigus terminui apribojimas nusiimtų ir be šio mygtuko.`,
        "Žmogus vėl galės rezervuoti vizitus. Jam pranešime programėlėje.",
      ],
      confirmLabel: "Nuimti",
      reason: true,
    });
    if (!answer) return;
    runRestriction(false, answer.reason, null);
  };

  const remove = async () => {
    const answer = await ask({
      title: isMaster ? (terminationAt ? "Ištrinti meistro paskyrą iš karto?" : "Nutraukti meistro paskyrą?") : "Ištrinti paskyrą visam laikui?",
      body: [
        "Kartu dings profilis ir viskas, kas duomenų bazėje priklauso šiai paskyrai, taip pat jos pateikti skundai, lojalumo taškai, rekomendacijos ir prenumeratos įrašai.",
        "Vizitai, sąskaitos ir dovanų kortelės lieka, tik be nuorodos į paskyrą. Failai iš saugyklos ištrinami naktį. Atšaukti negalima.",
        // Meistrui trynimas = visos paslaugos nutraukimas: be skubaus pagrindo – tik po 30 d. (`termination-notice.ts`).
        isMaster
          ? terminationAt
            ? `Nutraukimas jau suplanuotas – paskyra bus panaikinta ${formatWhen(terminationAt)}. Iš karto ištrinti galima tik dėl skubaus pagrindo.`
            : "Tai meistras. Be skubaus pagrindo paskyra bus panaikinta tik po 30 dienų: meistras dabar gaus pranešimą su priežastimi programėlėje ir el. paštu, o iki tol dirbs kaip įprastai. Nutraukimą iki tol galima atšaukti."
          : null,
        isMaster && notice ? `${notice.source}: „${notice.text}“` : null,
      ],
      confirmLabel: isMaster ? "Patvirtinti" : "Ištrinti paskyrą",
      danger: true,
      choices: isMaster
        ? [
            {
              key: "ground",
              label: "Kada",
              hint: "skubus pagrindas – P2B 4 str. 4 d.; meistras jį matys pranešime",
              options: [
                ...(terminationAt ? [] : [{ value: TERMINATE_AFTER_NOTICE, label: "Po 30 dienų (įprastai)" }]),
                ...URGENT_GROUNDS.map((g) => ({
                  value: g.value,
                  label: `Iš karto: ${g.label.toLowerCase()}`,
                  note: "reasonLead" in g ? `Meistras pranešime gaus priežastį, prasidedančią „${g.reasonLead}.“` : undefined,
                })),
              ],
            },
          ]
        : undefined,
      // Punktas nebūtinas: trinama dažniausiai paties žmogaus prašymu arba testinė paskyra (#169).
      rule: "optional",
      reasonRequired: true,
      typeToConfirm: confirmName,
    });
    if (!answer) return;
    const ground = isMaster && answer.choices.ground !== TERMINATE_AFTER_NOTICE ? (answer.choices.ground ?? null) : null;

    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await deleteAccount(userId, answer.reason, answer.rule, ground);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.scheduled) {
        // Paskyra lieka – puslapis persipiešia su „Bus panaikinta …“ ir atšaukimo mygtuku.
        setNote(res.note ?? null);
        router.refresh();
        return;
      }
      if (res.note) setNote(res.note);
      setDeleted(true);
      router.replace("/admin/users");
    });
  };

  const cancelTermination = async () => {
    const answer = await ask({
      title: "Atšaukti paskyros nutraukimą?",
      body: [
        `Paskyra nebus panaikinta ${formatWhen(terminationAt)}. Meistras gaus pranešimą programėlėje ir el. paštu.`,
      ],
      confirmLabel: "Atšaukti nutraukimą",
      reason: true,
    });
    if (!answer) return;
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await cancelMasterTermination(userId, answer.reason);
      if (res.ok) {
        setNote(res.note ?? null);
        router.refresh();
      } else setError(res.error);
    });
  };

  if (deleted) {
    return <p className={`${card} p-5 text-sm font-semibold text-app-body`}>Paskyra ištrinta.</p>;
  }

  const activeGrants = (grants ?? []).filter((g) => g.active);
  const nothing = activeGrants.length === 0 && !banned && !restrictedUntil && !terminationAt;
  const canGrant = isMaster && grants !== undefined && grants !== null;
  const removeLabel = terminationAt ? "Ištrinti iš karto" : isMaster ? "Nutraukti meistro paskyrą" : "Ištrinti paskyrą";

  return (
    <section className="space-y-4">
      {dialog}

      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="flex items-center gap-2 text-base font-semibold text-app-ink">
          <span aria-hidden className="h-2 w-2 rounded-full bg-app-ok" />
          Dabar galioja
        </h2>
        <p className="mt-0.5 text-[13px] text-app-muted">Kiekvieną sprendimą galima baigti čia pat.</p>
        {grants === null ? (
          <Alert tone="warn" className="mt-3">
            Individualių sąlygų gauti nepavyko – sąrašas gali būti nepilnas.
          </Alert>
        ) : null}
        {nothing ? (
          <p className="mt-3 border-t border-app-hairline pt-3 text-sm text-app-muted">Nieko nesuteikta ir neapribota.</p>
        ) : (
          <ul className="mt-3 divide-y divide-app-hairline border-t border-app-hairline">
            {activeGrants.map((g) => (
              <ActiveGrantRow key={g.kind === "plan_grant" ? `p:${g.subscriptionId}` : `w:${g.masterId}`} grant={g} />
            ))}
            {banned ? (
              <StateRow
                Icon={IconBan}
                title="Paskyra sustabdyta"
                meta={`iki ${formatWhen(bannedUntil)} · pasibaigus terminui prieiga grįš automatiškai`}
                why={suspendWhy}
              >
                <button type="button" disabled={pending} onClick={suspend} className={btnQuiet}>
                  Pratęsti
                </button>
                <button type="button" disabled={pending} onClick={restore} className={btnDanger}>
                  Atkurti prieigą
                </button>
              </StateRow>
            ) : null}
            {restrictedUntil ? (
              <StateRow
                Icon={IconCalendar}
                title="Rezervavimas apribotas"
                meta={`iki ${formatWhen(restrictedUntil)} · pasibaigus terminui nusiims automatiškai`}
                why={restrictWhy}
              >
                <button type="button" disabled={pending} onClick={restrict} className={btnQuiet}>
                  Pratęsti
                </button>
                <button type="button" disabled={pending} onClick={unrestrict} className={btnDanger}>
                  Panaikinti apribojimą
                </button>
              </StateRow>
            ) : null}
            {terminationAt ? (
              <StateRow
                Icon={IconTrash}
                title="Suplanuotas panaikinimas"
                meta={`${formatWhen(terminationAt)} · meistrui pranešta, iki tol jis dirba kaip įprastai`}
              >
                <button type="button" disabled={pending} onClick={cancelTermination} className={btnDanger}>
                  Atšaukti nutraukimą
                </button>
              </StateRow>
            ) : null}
          </ul>
        )}
      </div>

      <div>
        <SectionTitle accent="system" title="Veiksmai" />
        <div className="flex flex-wrap items-center gap-2">
          {canGrant ? (
            <button type="button" onClick={() => setForm(form === "grant" ? null : "grant")} aria-expanded={form === "grant"} className={btn}>
              <IconPlus size={16} strokeWidth={STROKE} aria-hidden />
              Suteikti sąlygą
            </button>
          ) : null}
          {restrictedUntil ? null : (
            <button type="button" disabled={pending} onClick={restrict} className={btn}>
              Apriboti rezervavimą
            </button>
          )}
          {banned ? null : (
            <button type="button" disabled={pending} onClick={suspend} className={btn}>
              Sustabdyti paskyrą
            </button>
          )}
          <button type="button" onClick={() => setForm(form === "birth" ? null : "birth")} aria-expanded={form === "birth"} className={btn}>
            <IconPencil size={16} strokeWidth={STROKE} aria-hidden />
            Pataisyti gimimo datą
          </button>
          <span aria-hidden className="hidden flex-1 sm:block" />
          <button type="button" disabled={pending} onClick={remove} className={btnDanger}>
            {removeLabel}
          </button>
        </div>
      </div>

      {canGrant ? (
        <GrantForm
          masterId={userId}
          grants={grants}
          minDay={grantDays.min}
          maxDay={grantDays.max}
          open={form === "grant"}
          onClose={() => setForm(null)}
        />
      ) : null}
      {form === "birth" ? <BirthDateCorrection userId={userId} birthDate={birthDate} /> : null}

      <ActionNote note={note} />
      {error ? <Alert>{error}</Alert> : null}

      {isMaster ? <GrantHistory grants={grants} /> : null}
    </section>
  );
}

/** Viena „Dabar galioja“ eilutė: ikona, pavadinimas, terminas; veiksmai dešinėje (telefone – po tekstu). */
function StateRow({
  Icon,
  title,
  meta,
  why = null,
  children,
}: {
  Icon: typeof IconBan;
  title: string;
  meta: string;
  /** Kodėl – priežastis, punktas, šaltinis, kas sprendė (design D12). */
  why?: string | null;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <Icon size={18} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0 text-app-faint" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-app-ink">{title}</p>
          <p className="mt-0.5 text-[13px] break-words text-app-muted">{meta}</p>
          {why ? <p className="mt-0.5 text-[13px] break-words text-app-body">{why}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 pl-7 sm:pl-0">{children}</div>
    </li>
  );
}
