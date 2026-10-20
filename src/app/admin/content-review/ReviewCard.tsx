"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { IconBan, IconCheck, IconEye } from "@/components/icons";
import type { SignedMedia } from "@/lib/admin-data";
import { decideContentReview } from "../actions";
import { useConfirm } from "../ConfirmDialog";
import { MediaPreview } from "../data/RowCard";
import { formatWhen } from "../format";
import type { NoticeNote } from "../moderation-email";
import { ActionNote, STROKE, Tag, btn, btnDanger, card } from "../ui";

export type ReviewView = {
  id: string;
  authorId: string;
  authorName: string | null;
  authorHandle: string | null;
  /** `text` | `media_warn` | `media_requested` (Gloumi `20261020124647`). */
  kind: string;
  /** `lentelė.stulpelis`, kur tekstas buvo rašomas (`guard_content_filter` argumentai); medijai – null. */
  context: string | null;
  body: string | null;
  category: string | null;
  /** Medijai: `image` | `video`, telefono modelio versija ir pasirašytas adresas (tik laukiantiems). */
  mediaType: string | null;
  modelVersion: string | null;
  media: SignedMedia | null;
  status: string;
  createdAt: string;
  decidedAt: string | null;
  note: string | null;
};

/* Filtro kategorijos – content žodžiais (`notes/content-230-filtro-tekstai-2026-10-20.md`, contentCat*). */
const CATEGORY: Record<string, string> = {
  csam: "vaikų apsauga",
  threat: "grasinimai",
  illegal_trade: "draudžiamų prekių ar paslaugų pardavimas",
  hate: "neapykantos kalba",
  sexual: "seksualinis turinys",
  scam: "sukčiavimo požymiai",
};

/* Kur tekstas buvo rašomas: lentelė ir laukas iš `context`. Nežinomi rodomi taip, kaip yra. */
const TABLE: Record<string, string> = {
  profiles: "Profilis",
  master_profiles: "Meistro profilis",
  services: "Paslauga",
  service_addons: "Paslaugos priedas",
  service_translations: "Paslaugos vertimas",
  master_service_categories: "Paslaugų kategorija",
  posts: "Įrašas",
  post_comments: "Komentaras",
  stories: "Story",
  highlights: "Išskirtinių rinkinys",
  highlight_items: "Išskirtinių įrašas",
  reviews: "Atsiliepimas",
  review_replies: "Atsakymas į atsiliepimą",
  client_reviews: "Atsiliepimas apie klientą",
  salons: "Salonas",
  flash_slots: "Laisvas laikas",
};
const COLUMN: Record<string, string> = {
  display_name: "vardas",
  username: "slapyvardis",
  bio: "aprašymas",
  specialty: "specializacija",
  business_name: "verslo pavadinimas",
  title: "pavadinimas",
  name: "pavadinimas",
  description: "aprašymas",
  service_title: "paslaugos pavadinimas",
  caption: "parašas",
  overlays: "užrašai ant vaizdo",
  body: "tekstas",
  note: "pastaba",
};

/* Medijos prašymo rūšis: ką telefonas padarė ir kas paprašė peržiūros. */
const MEDIA_KIND: Record<string, string> = {
  media_warn: "Perspėta, autorius įkėlė",
  media_requested: "Užblokuota, autorius paprašė peržiūros",
};

function contextLabel(context: string): string {
  const [table, column] = context.split(".");
  const where = TABLE[table] ?? table;
  return column ? `${where} – ${COLUMN[column] ?? column}` : where;
}

const STATUS: Record<string, { label: string; tone: "warn" | "ok" | "danger" | "neutral" }> = {
  open: { label: "Laukia", tone: "warn" },
  approved: { label: "Leista", tone: "ok" },
  rejected: { label: "Atmesta", tone: "danger" },
};

/**
 * Vienas peržiūros prašymas – tekstas arba medija. „Leisti skelbti“ – pasirinktinė vidinė pastaba;
 * „Atmesti“ – priežastis ir taisyklių punktas privalomi (jie keliauja autoriui
 * programėlės pranešime, DSA 17 str.).
 */
export function ReviewCard({ view }: { view: ReviewView }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(view.status);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<NoticeNote | null>(null);
  const [dialog, ask] = useConfirm();
  const tag = STATUS[status] ?? { label: status, tone: "neutral" as const };
  const who = view.authorName || (view.authorHandle ? `@${view.authorHandle}` : "Be vardo");
  const isMedia = view.kind !== "text";
  const video = view.mediaType === "video";
  const what = video ? "vaizdo įrašą" : "nuotrauką";
  // Medija rodoma užtamsinta, kol administratorius jos neatidengia: ji gali būti atvirai seksualinė.
  const [revealed, setRevealed] = useState(false);

  const decide = async (approve: boolean) => {
    const answer = await ask(
      isMedia
        ? approve
          ? {
              title: `Leisti skelbti šį ${what}?`,
              body: [
                `${video ? "Vaizdo įrašas taps matomas" : "Nuotrauka taps matoma"} visiems ten, kur autorius ${video ? "jį" : "ją"} įkėlė, o autorius gaus pranešimą.`,
                "Pastaba neprivaloma; ji lieka tik administratoriams. Rašykite dalykiškai: žmogus gali paprašyti visų apie jį saugomų duomenų (BDAR 15 str.), tarp jų ir šią pastabą.",
              ],
              confirmLabel: "Leisti skelbti",
              reason: true,
              reasonLabel: "Pastaba",
            }
          : {
              title: `Atmesti šį ${what}?`,
              body: [
                `${video ? "Vaizdo įrašas bus ištrintas" : "Nuotrauka bus ištrinta"}. Jei tai vienintelė įrašo ar Story medija – bus ištrintas ir pats įrašas ar Story.`,
                "Autorius gaus pranešimą programėlėje ir el. paštu su priežastimi ir taisyklių punktu, todėl rašykite jam suprantamai.",
              ],
              confirmLabel: "Atmesti",
              danger: true,
              reasonRequired: true,
              rule: true,
              ruleNoRequest: true,
            }
        : approve
        ? {
            title: "Leisti skelbti šį tekstą?",
            body: [
              "Autorius gaus pranešimą ir 30 dienų galės paskelbti lygiai šį tekstą – filtras jo nebesulaikys. Kitam tekstui leidimas negalioja.",
              "Pastaba neprivaloma; ji lieka tik administratoriams. Rašykite dalykiškai: žmogus gali paprašyti visų apie jį saugomų duomenų (BDAR 15 str.), tarp jų ir šią pastabą.",
            ],
            confirmLabel: "Leisti skelbti",
            reason: true,
            reasonLabel: "Pastaba",
          }
        : {
            title: "Atmesti šį tekstą?",
            body: [
              "Tekstas nebus paskelbtas. Autorius gaus pranešimą programėlėje ir el. paštu su priežastimi ir taisyklių punktu, todėl rašykite jam suprantamai.",
            ],
            confirmLabel: "Atmesti",
            danger: true,
            reasonRequired: true,
            rule: true,
            ruleNoRequest: true,
          },
    );
    if (!answer) return;
    setError(null);
    setNote(null);
    startTransition(async () => {
      const res = await decideContentReview(view.id, approve, answer.reason, answer.rule);
      if (res.ok) {
        setStatus(approve ? "approved" : "rejected");
        setNote(res.note ?? null);
      } else setError(res.error);
    });
  };

  return (
    <li className={`${card} p-5`}>
      {dialog}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-app-ink">
          {isMedia ? (video ? "Vaizdo įrašas" : "Nuotrauka") : contextLabel(view.context ?? "")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {isMedia ? (
            <Tag tone="rose">{MEDIA_KIND[view.kind] ?? view.kind}</Tag>
          ) : view.category ? (
            <Tag tone="rose">{CATEGORY[view.category] ?? view.category}</Tag>
          ) : null}
          <Tag tone={tag.tone}>{tag.label}</Tag>
        </div>
      </div>
      {isMedia ? (
        <div className="mt-3">
          {status !== "open" ? (
            <p className="text-[13px] text-app-muted">
              {status === "approved"
                ? `Paskelbta – peržiūrėti galima ten, kur autorius ${video ? "jį" : "ją"} įkėlė.`
                : "Ištrinta."}
            </p>
          ) : revealed || !view.media ? (
            <MediaPreview signed={view.media ?? undefined} />
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="flex aspect-[4/5] w-[136px] flex-col items-center justify-center gap-1.5 rounded-[14px] bg-app-ink/80 p-3 text-center text-[11px] font-semibold text-white"
            >
              <IconEye size={20} strokeWidth={STROKE} aria-hidden />
              Rodyti {what}
            </button>
          )}
          {view.modelVersion ? <p className="mt-2 text-[11px] text-app-faint">Telefono modelis: {view.modelVersion}</p> : null}
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap break-words rounded-[14px] bg-app-sheet px-4 py-3 text-sm text-app-ink">{view.body}</p>
      )}
      <p className="mt-3 text-[13px] text-app-muted">
        <Link prefetch={false} href={`/admin/users/${view.authorId}`} className="font-semibold text-app-ink hover:underline">
          {who}
        </Link>
        {" · "}paprašė {formatWhen(view.createdAt)}
        {view.decidedAt ? ` · išspręsta ${formatWhen(view.decidedAt)}` : ""}
      </p>
      {view.note ? <p className="mt-1 text-[13px] text-app-muted">Pastaba: {view.note}</p> : null}
      {status === "open" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={pending} onClick={() => decide(true)} className={btn}>
            <IconCheck size={16} strokeWidth={STROKE} aria-hidden />
            Leisti skelbti
          </button>
          <button type="button" disabled={pending} onClick={() => decide(false)} className={btnDanger}>
            <IconBan size={16} strokeWidth={STROKE} aria-hidden />
            Atmesti
          </button>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
          {error}
        </p>
      ) : null}
      <ActionNote note={note} />
    </li>
  );
}
