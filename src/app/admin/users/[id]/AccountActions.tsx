"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Ban, CalendarPlus, CalendarX, Trash2, Undo2 } from "lucide-react";
import { deleteAccount, setBookingRestriction, setSuspended } from "../../actions";
import { useConfirm } from "../../ConfirmDialog";
import { useTerminationNotice } from "../../ModerationRules";
import { formatWhen } from "../../format";
import type { NoticeNote } from "../../moderation-email";
import { SUSPEND_DAYS, SUSPEND_SOURCES } from "../../suspension";
import { ActionNote, STROKE, SectionTitle, btn, btnDanger, card } from "../../ui";

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
 * Rezervavimo apribojimas (#207) – to paties pavidalo, tik stabdo naujas
 * rezervacijas, ne prisijungimą; automatiniai įspėjimai jo nesukuria.
 *
 * Kiekvienas veiksmas — atskira eilutė su paaiškinimu, ką jis padarys:
 * mygtukas be paaiškinimo verčia spėlioti, o čia spėlioti brangu.
 */
export function AccountActions({
  userId,
  banned,
  bannedUntil,
  restrictedUntil,
  confirmName,
  isMaster,
}: {
  userId: string;
  banned: boolean;
  /** `auth.users.banned_until` – iki kada sustabdyta. */
  bannedUntil: string | null;
  /** `booking_restrictions.until`, jei rezervavimas dabar apribotas; kitaip `null`. */
  restrictedUntil: string | null;
  confirmName: string;
  isMaster: boolean;
}) {
  const router = useRouter();
  const notice = useTerminationNotice();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Ar žmogui išsiųstas laiškas apie sustabdymą (#169 3 p.) – kaip turinio sprendimų kortelėse.
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [dialog, ask] = useConfirm();

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
          options: SUSPEND_SOURCES.map((o) => ({ value: o.value, label: o.label })),
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
          options: SUSPEND_SOURCES.map((o) => ({ value: o.value, label: o.label })),
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
      title: "Ištrinti paskyrą visam laikui?",
      body: [
        "Kartu dings profilis ir viskas, kas duomenų bazėje priklauso šiai paskyrai, taip pat jos pateikti skundai, lojalumo taškai, rekomendacijos ir prenumeratos įrašai.",
        "Vizitai, sąskaitos ir dovanų kortelės lieka, tik be nuorodos į paskyrą. Failai iš saugyklos ištrinami naktį. Atšaukti negalima.",
        // Meistrui trynimas = visos paslaugos nutraukimas: Sąlygos pažada įspėti iš anksto (`termination-notice.ts`).
        isMaster && notice ? `Tai meistras. Jei trinate kaip sankciją, pirma įspėkite – ${notice.source}:` : null,
        isMaster && notice ? `„${notice.text}“` : null,
      ],
      confirmLabel: "Ištrinti paskyrą",
      danger: true,
      // Punktas nebūtinas: trinama dažniausiai paties žmogaus prašymu arba testinė paskyra (#169).
      rule: "optional",
      reasonRequired: true,
      typeToConfirm: confirmName,
    });
    if (!answer) return;

    setError(null);
    startTransition(async () => {
      const res = await deleteAccount(userId, answer.reason, answer.rule);
      if (res.ok) {
        setDeleted(true);
        router.replace("/admin/data?table=profiles");
      } else {
        setError(res.error);
      }
    });
  };

  if (deleted) {
    return <p className={`${card} p-5 text-sm font-semibold text-app-body`}>Paskyra ištrinta.</p>;
  }

  return (
    <section>
      {dialog}
      <SectionTitle title="Veiksmai" />
      <div className={`${card} divide-y divide-app-hairline`}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-ink">
              {banned ? `Sustabdyta iki ${formatWhen(bannedUntil)}` : "Sustabdyti paskyrą"}
            </p>
            <p className="mt-0.5 text-[13px] text-app-muted">
              {banned
                ? "Pasibaigus terminui prieiga grįš automatiškai."
                : "Iki 30 dienų; nebegalės prisijungti, gaus pranešimą."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {banned ? (
              <button type="button" disabled={pending} onClick={restore} className={btn}>
                <Undo2 size={16} strokeWidth={STROKE} aria-hidden />
                Atkurti
              </button>
            ) : null}
            <button type="button" disabled={pending} onClick={suspend} className={btnDanger}>
              {banned ? (
                <CalendarPlus size={16} strokeWidth={STROKE} aria-hidden />
              ) : (
                <Ban size={16} strokeWidth={STROKE} aria-hidden />
              )}
              {banned ? "Pratęsti" : "Sustabdyti"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-ink">
              {restrictedUntil ? `Rezervavimas apribotas iki ${formatWhen(restrictedUntil)}` : "Apriboti rezervavimą"}
            </p>
            <p className="mt-0.5 text-[13px] text-app-muted">
              {restrictedUntil
                ? "Pasibaigus terminui apribojimas nusiims automatiškai."
                : "Iki 30 dienų negalės rezervuoti naujų vizitų; gaus pranešimą."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {restrictedUntil ? (
              <button type="button" disabled={pending} onClick={unrestrict} className={btn}>
                <Undo2 size={16} strokeWidth={STROKE} aria-hidden />
                Nuimti
              </button>
            ) : null}
            <button type="button" disabled={pending} onClick={restrict} className={btnDanger}>
              {restrictedUntil ? (
                <CalendarPlus size={16} strokeWidth={STROKE} aria-hidden />
              ) : (
                <CalendarX size={16} strokeWidth={STROKE} aria-hidden />
              )}
              {restrictedUntil ? "Pratęsti" : "Apriboti"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-app-ink">Ištrinti paskyrą</p>
            <p className="mt-0.5 text-[13px] text-app-muted">Visam laikui, su viskuo, kas jai priklauso.</p>
          </div>
          <button type="button" disabled={pending} onClick={remove} className={btnDanger}>
            <Trash2 size={16} strokeWidth={STROKE} aria-hidden />
            Ištrinti
          </button>
        </div>
      </div>
      <ActionNote note={note} />
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
    </section>
  );
}
