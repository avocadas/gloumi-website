"use client";

import { useState, useTransition } from "react";
import { Ban, CircleCheck, Trash2, UserRound, X } from "lucide-react";
import { moderate, setSuspended } from "./actions";
import { SUSPEND_DAYS } from "./suspension";
import { useConfirm, type ConfirmOptions } from "./ConfirmDialog";
import { formatWhen } from "./format";
import type { NoticeNote } from "./moderation-email";
import { ReplyVisibility } from "./ReplyVisibility";
import { ActionNote, STROKE, Tag, btn, btnDanger, btnQuiet, card, eyebrow } from "./ui";

export type ReportView = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  details: string | null;
  createdAt: string;
  status: string;
  reporterName: string | null;
  reporterId: string | null;
  preview: string | null;
  authorId: string | null;
  /** Tik `review_reply`: kada paslėptas (`review_replies.hidden_at`), `null` — rodomas. */
  hiddenAt?: string | null;
};

const TARGET_LABEL: Record<string, string> = {
  post: "Įrašas",
  comment: "Komentaras",
  story: "Story",
  message: "Žinutė",
  profile: "Profilis",
  review: "Atsiliepimas",
  review_reply: "Atsakymas į atsiliepimą",
};

const TARGET_TONE: Record<string, "rose" | "lavender" | "mint"> = {
  post: "rose",
  comment: "rose",
  story: "rose",
  message: "lavender",
  profile: "mint",
  review: "rose",
  review_reply: "rose",
};

const STATUS_TAG: Record<string, { label: string; tone: "warn" | "ok" | "neutral" }> = {
  open: { label: "Atviras", tone: "warn" },
  reviewed: { label: "Peržiūrėtas", tone: "ok" },
  dismissed: { label: "Atmestas", tone: "neutral" },
};

/**
 * One report, with the actions that close it.
 *
 * WHY EVERY DESTRUCTIVE BUTTON ASKS FIRST
 * ---------------------------------------
 * Deleting someone's work and suspending an account are both irreversible
 * from this screen. A moderation queue is a list of near-identical cards read
 * quickly, which is exactly the shape where a misplaced click happens — so
 * the confirmation is not politeness, it is the thing that makes a fast queue
 * safe.
 *
 * WHY FAILURES ARE SHOWN AND NOT SWALLOWED
 * ----------------------------------------
 * `admin_moderate()` treats "zero rows affected" as an error on purpose: if
 * the content was already gone, the operator has to know that the button did
 * nothing. Hiding that would leave them believing they cleaned something up.
 */
/*
 * Kortelės sandara visada ta pati: kas ir kada → kodėl pranešta → koks
 * turinys → kieno jis → veiksmai. Veiksmai padalyti į dvi grupes: kairėje
 * tie, kurie tik uždaro skundą, dešinėje — tie, kurie ką nors ištrina ar
 * užblokuoja, kad greitai skaitant ranka nenukryptų ne į tą pusę.
 *
 * Uždarant skundą pranešusiam nusiunčiamas atsakymas (#169 4 p., db
 * `20261004145806`): „Imtasi veiksmų" — kad pagal Taisykles imtasi veiksmų,
 * „Atmesti skundą" — kad pažeidimo nerasta ir turinys lieka. Todėl mygtukas
 * vadinasi tuo, ką išgirs pranešęs: buvęs „Peržiūrėta" skambėjo kaip „pažiūrėjau",
 * o žmogui būtų nuėjęs „ėmėmės veiksmų", nors niekas nepadaryta.
 */
export function ReportCard({ report }: { report: ReportView }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [dialog, ask] = useConfirm();

  // `answer` — tai, ką žmogus įrašė ir pasirinko patvirtinimo lange (jei jame buvo laukai).
  const run = async (
    fn: (answer: {
      reason: string;
      rule: string | null;
      choices: Record<string, string>;
    }) => Promise<{ ok: true; note?: NoticeNote } | { ok: false; error: string }>,
    doneText: string,
    confirm?: ConfirmOptions,
  ) => {
    let answer: { reason: string; rule: string | null; choices: Record<string, string> } = {
      reason: "",
      rule: null,
      choices: {},
    };
    if (confirm) {
      const given = await ask(confirm);
      if (!given) return;
      answer = given;
    }
    setError(null);
    startTransition(async () => {
      const res = await fn(answer);
      if (res.ok) {
        setDone(doneText);
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  const canDelete = report.targetType === "post" || report.targetType === "comment";
  const deleteAction = report.targetType === "post" ? "delete_post" : "delete_comment";
  const status = STATUS_TAG[report.status];

  return (
    <article className={`${card} p-5 transition-opacity sm:p-6 ${done ? "opacity-60" : ""}`}>
      {dialog}
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={TARGET_TONE[report.targetType] ?? "neutral"}>
            {TARGET_LABEL[report.targetType] ?? report.targetType}
          </Tag>
          {status ? <Tag tone={status.tone}>{status.label}</Tag> : null}
          {done ? <Tag tone="dark">{done}</Tag> : null}
        </div>
        <time dateTime={report.createdAt} className="text-xs tabular-nums text-app-muted">
          {formatWhen(report.createdAt)}
        </time>
      </header>

      <h3 className="mt-3 text-[15px] font-bold text-app-ink">{report.reason || "Priežastis nenurodyta"}</h3>
      {report.details ? <p className="mt-1 text-sm leading-relaxed text-app-body">{report.details}</p> : null}

      <div className="mt-4 rounded-[14px] bg-app-sheet p-4">
        <p className={`${eyebrow} text-app-muted`}>Turinys</p>
        {report.preview !== null ? (
          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-app-ink">{report.preview}</p>
        ) : (
          <p className="mt-1.5 text-sm italic text-app-muted">
            {report.targetType === "message"
              ? "Žinutės turinys čia nerodomas."
              : "Turinio nebėra — jis jau ištrintas."}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-app-muted">
        {report.reporterName || report.reporterId ? (
          <span>
            Pranešė{" "}
            {report.reporterId ? (
              <a href={`/admin/users/${report.reporterId}`} className="font-semibold text-app-ink hover:underline">
                {report.reporterName ?? "naudotojas"}
              </a>
            ) : (
              <span className="font-semibold text-app-ink">{report.reporterName}</span>
            )}
          </span>
        ) : null}
        {report.authorId ? (
          <a
            href={`/admin/users/${report.authorId}`}
            className="inline-flex items-center gap-1 font-semibold text-app-ink hover:underline"
          >
            <UserRound size={13} strokeWidth={STROKE} aria-hidden />
            Autoriaus paskyra
          </a>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ActionNote note={note} />

      {!done && report.status === "open" ? (
        <footer className="mt-5 flex flex-col gap-2 border-t border-app-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => moderate("review_report", report.id), "Imtasi veiksmų")}
              title="Pranešusiam: imtasi veiksmų pagal Taisykles. Spauskite, kai turinys jau pašalintas ar paskyra apribota."
              className={btn}
            >
              <CircleCheck size={16} strokeWidth={STROKE} aria-hidden />
              Imtasi veiksmų
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => moderate("dismiss_report", report.id), "Atmesta")}
              title="Pranešusiam: Taisyklių pažeidimo nerasta, turinys lieka."
              className={btnQuiet}
            >
              <X size={16} strokeWidth={STROKE} aria-hidden />
              Atmesti skundą
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* U-19: atsakymas ne trinamas, o paslepiamas — grąžinti galima tuo pačiu mygtuku. */}
            {report.targetType === "review_reply" && report.preview !== null ? (
              <ReplyVisibility replyId={report.targetId} hiddenAt={report.hiddenAt ?? null} />
            ) : null}
            {canDelete && report.preview !== null ? (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(({ reason, rule }) => moderate(deleteAction, report.targetId, reason, rule), "Turinys ištrintas", {
                    title: report.targetType === "post" ? "Ištrinti įrašą?" : "Ištrinti komentarą?",
                    body: [
                      "Jis bus pašalintas visiems, ir atšaukti negalima.",
                      "Autorius gaus pranešimą su priežastimi ir punktu — programėlėje ir, jei leidžia laiškų riba, el. paštu. Pranešę gaus žinią, kad imtasi veiksmų. Viskas įrašoma į administratorių žurnalą.",
                    ],
                    confirmLabel: "Ištrinti",
                    danger: true,
                    rule: true,
                    reasonRequired: true,
                  })
                }
                className={btnDanger}
              >
                <Trash2 size={16} strokeWidth={STROKE} aria-hidden />
                Ištrinti turinį
              </button>
            ) : null}

            {report.authorId ? (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(
                    // Iš skundo – visada „gavus pranešimą" (#169 3 p.); terminą renkasi administratorius.
                    ({ reason, rule, choices }) =>
                      setSuspended(report.authorId!, true, reason, rule, Number(choices.days), "report"),
                    "Autorius sustabdytas",
                    {
                      title: "Sustabdyti autoriaus paskyrą?",
                      body: [
                        "Žmogus nebegalės prisijungti iki termino pabaigos; pasibaigus terminui prieiga grąžinama automatiškai.",
                        "Jam iš karto pranešime priežastį, punktą ir terminą – programėlėje ir el. paštu. Jo vizitai iki termino bus atšaukti, kitai šaliai pranešta.",
                        "Atkurti anksčiau ar pratęsti galima jo paskyros puslapyje.",
                      ],
                      confirmLabel: "Sustabdyti",
                      danger: true,
                      choices: [
                        {
                          key: "days",
                          label: "Terminas",
                          hint: "ne ilgiau 30 dienų",
                          options: SUSPEND_DAYS.map((d) => ({ value: String(d), label: d === 1 ? "1 diena" : `${d} d.` })),
                        },
                      ],
                      rule: true,
                      ruleNoRequest: true,
                      reasonRequired: true,
                    },
                  )
                }
                className={btnDanger}
              >
                <Ban size={16} strokeWidth={STROKE} aria-hidden />
                Sustabdyti autorių
              </button>
            ) : null}
          </div>
        </footer>
      ) : null}
    </article>
  );
}
