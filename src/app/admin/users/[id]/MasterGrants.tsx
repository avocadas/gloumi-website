"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconBadgePercent, IconBan, IconCalendar, IconChevronDown, IconCrown, IconPlus, IconTrash } from "@/components/icons";
import { useConfirm } from "../../ConfirmDialog";
import type { GrantView } from "../../grants/GrantRows";
import { clearCommissionWaiver, grantPlan, revokePlanGrant, setCommissionWaiver } from "../../grants/actions";
import { formatWhen } from "../../format";
import { Alert, Field, STROKE, Segment, SectionTitle, Tag, btn, btnDanger, btnPrimary, btnQuiet, card, dateInput, input } from "../../ui";

/*
 * „Dabar galioja“ ir „Suteikti sąlygą“ paskyros puslapyje (design
 * `admin-portalas.md` 5.1–5.2; developeris 2026-10-20: suteikto plano
 * „niekur nerodo“, todėl jo negalima atšaukti).
 *
 * Taisyklė: kiekvienas galiojantis administratoriaus sprendimas matomas čia, su
 * terminu ir priežastimi, ir su veiksmu jam baigti toje pačioje eilutėje. Forma
 * naujam sprendimui – suskleista po mygtuku. Baigtos ir atšauktos sąlygos – po
 * „Ankstesni sprendimai“.
 *
 * Sustabdymas, rezervavimo apribojimas ir nutraukimas čia rodomi kaip būsena;
 * jų veiksmai (su teisiniais pranešimais) lieka „Veiksmuose“ žemiau.
 */

const PLAN_LABEL = { pro: "Pro", vip: "VIP" } as const;

/** Serverio veiksmas nepasiekiamas (tinklas, ar puslapis senesnis už naują diegimą). */
const UNREACHABLE = "Nepavyko susisiekti su serveriu. Perkraukite puslapį ir bandykite dar kartą.";

function day(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("lt-LT", { timeZone: "Europe/Vilnius" });
}

export type AccountState = {
  bannedUntil: string | null;
  restrictedUntil: string | null;
  terminationAt: string | null;
};

export function ActiveNow({ grants, state }: { grants: GrantView[] | null | undefined; state: AccountState }) {
  const active = (grants ?? []).filter((g) => g.active);
  const stateRows = [
    state.bannedUntil
      ? { key: "ban", Icon: IconBan, title: "Paskyra sustabdyta", meta: `iki ${formatWhen(state.bannedUntil)} · baigti – „Veiksmai“ žemiau` }
      : null,
    state.restrictedUntil
      ? {
          key: "restrict",
          Icon: IconCalendar,
          title: "Rezervavimas apribotas",
          meta: `iki ${formatWhen(state.restrictedUntil)} · nuimti – „Veiksmai“ žemiau`,
        }
      : null,
    state.terminationAt
      ? {
          key: "terminate",
          Icon: IconTrash,
          title: "Suplanuotas panaikinimas",
          meta: `${formatWhen(state.terminationAt)} · atšaukti – „Veiksmai“ žemiau`,
        }
      : null,
  ].filter((r) => r !== null);

  return (
    <section className={`${card} p-4 sm:p-5`}>
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

      {active.length === 0 && stateRows.length === 0 ? (
        <p className="mt-3 border-t border-app-hairline pt-3 text-sm text-app-muted">Nieko nesuteikta ir neapribota.</p>
      ) : (
        <ul className="mt-3 divide-y divide-app-hairline border-t border-app-hairline">
          {active.map((g) => (
            <ActiveGrantRow key={g.kind === "plan_grant" ? `p:${g.subscriptionId}` : `w:${g.masterId}`} grant={g} />
          ))}
          {stateRows.map((r) => (
            <li key={r.key} className="flex items-start gap-3 py-3">
              <r.Icon size={18} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0 text-app-faint" />
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-app-ink">{r.title}</p>
                <p className="mt-0.5 text-[13px] text-app-muted">{r.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function grantMeta(g: GrantView) {
  const term = g.until ? `iki ${day(g.until)}` : "neribotai";
  return [term, g.reason || null, g.grantedAt ? `suteikta ${day(g.grantedAt)}` : null].filter(Boolean).join(" · ");
}

function ActiveGrantRow({ grant }: { grant: GrantView }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dialog, ask] = useConfirm();
  const isWaiver = grant.kind === "commission_waiver";
  const planLabel = grant.plan ? PLAN_LABEL[grant.plan] : "planas";
  const Icon = isWaiver ? IconBadgePercent : IconCrown;

  const end = async () => {
    const answer = await ask(
      isWaiver
        ? {
            title: "Baigti komisinio atsisakymą dabar?",
            body: [
              "Komisinis vėl bus imamas už vizitus nuo šios akimirkos. Jau įvykę vizitai lieka be komisinio.",
              "Veiksmas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Baigti dabar",
            danger: true,
          }
        : {
            title: `Atšaukti nemokamą ${planLabel}?`,
            body: [
              "Meistras neteks šio plano iš karto. Parduotuvės prenumerata, jei yra, lieka.",
              "Veiksmas įrašomas į administratorių žurnalą.",
            ],
            confirmLabel: "Atšaukti planą",
            danger: true,
          },
    );
    if (!answer) return;
    setError(null);
    startTransition(async () => {
      const res = await (isWaiver ? clearCommissionWaiver(grant.masterId) : revokePlanGrant(grant.subscriptionId ?? "")).catch(
        () => ({ ok: false as const, error: UNREACHABLE }),
      );
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  };

  return (
    <li className="py-3">
      {dialog}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Icon size={18} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0 text-app-faint" />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-app-ink">{isWaiver ? "Komisinis neimamas" : `Nemokamas ${planLabel}`}</p>
            <p className="mt-0.5 text-[13px] break-words text-app-muted">{grantMeta(grant)}</p>
          </div>
        </div>
        <button type="button" disabled={pending} onClick={end} className={`${btnDanger} self-start pl-7 sm:pl-4`}>
          {isWaiver ? "Baigti dabar" : "Atšaukti planą"}
        </button>
      </div>
      {error ? (
        <Alert className="mt-2" tone="danger">
          {error}
        </Alert>
      ) : null}
    </li>
  );
}

/** Ankstesni sprendimai – baigtos ir atšauktos sąlygos, suskleista. */
export function GrantHistory({ grants }: { grants: GrantView[] | null | undefined }) {
  const past = (grants ?? []).filter((g) => !g.active);
  if (past.length === 0) return null;
  return (
    <details className={`${card} group overflow-hidden`}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-app-ink [&::-webkit-details-marker]:hidden">
        Ankstesni sprendimai ({past.length})
        <IconChevronDown size={18} strokeWidth={STROKE} aria-hidden className="text-app-faint transition-transform group-open:rotate-180" />
      </summary>
      <ul className="divide-y divide-app-hairline border-t border-app-hairline px-5">
        {past.map((g) => (
          <li key={g.kind === "plan_grant" ? `p:${g.subscriptionId}` : `w:${g.masterId}`} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-app-ink">
                {g.kind === "commission_waiver" ? "Komisinis neimamas" : `Nemokamas ${g.plan ? PLAN_LABEL[g.plan] : "planas"}`}
              </p>
              <p className="mt-0.5 text-[13px] break-words text-app-muted">
                nuo {day(g.validFrom)} {g.until ? `iki ${day(g.until)}` : ""}
                {g.reason ? ` · ${g.reason}` : ""}
              </p>
            </div>
            <Tag tone="neutral">Nebegalioja</Tag>
          </li>
        ))}
      </ul>
    </details>
  );
}

type Kind = "waiver" | "plan";
type Term = "date" | "unlimited";

/** „Suteikti sąlygą“ – viena forma (5.2), suskleista po mygtuku. */
export function GrantForm({
  masterId,
  grants,
  minDay,
  maxDay,
}: {
  masterId: string;
  grants: GrantView[] | null | undefined;
  minDay: string;
  maxDay: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<Kind>("plan");
  const [plan, setPlan] = useState<"pro" | "vip">("pro");
  const [term, setTerm] = useState<Term>("date");
  const [until, setUntil] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [dialog, ask] = useConfirm();

  if (grants === null) return null;

  const activeWaiver = (grants ?? []).find((g) => g.kind === "commission_waiver" && g.active);
  const extending = kind === "waiver" && Boolean(activeWaiver);
  // „Neribotai“ – ir planui, ir komisinio atsisakymui (developeris 2026-10-20).
  const unlimited = term === "unlimited";
  const planLabel = PLAN_LABEL[plan];
  const ready = (unlimited || Boolean(until)) && reason.trim().length > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    const termText = unlimited ? "be termino, kol neatšauksite" : `iki ${until} imtinai`;
    const answer = await ask(
      kind === "plan"
        ? {
            title: `Suteikti nemokamą ${planLabel}?`,
            body: [`Meistras gaus ${planLabel} nuo dabar ${termText}, be mokėjimo parduotuvėje.`, "Veiksmas ir priežastis įrašomi į administratorių žurnalą."],
            confirmLabel: `Suteikti ${planLabel}`,
          }
        : {
            title: extending ? "Pratęsti komisinio atsisakymą?" : "Neimti komisinio?",
            body: [
              extending
                ? `Gloumi neims komisinio ${unlimited ? "be termino" : `iki ${until} imtinai`}; pradžia lieka ta pati.`
                : `Gloumi neims komisinio už šio meistro vizitus nuo dabar ${termText}.`,
              "Veiksmas ir priežastis įrašomi į administratorių žurnalą.",
            ],
            confirmLabel: extending ? "Pratęsti" : "Neimti komisinio",
          },
    );
    if (!answer) return;
    setError(null);
    setDone(null);
    startTransition(async () => {
      const res = await (kind === "plan"
        ? grantPlan(masterId, plan, unlimited ? null : until, reason)
        : setCommissionWaiver(masterId, unlimited ? null : until, reason)
      ).catch(() => ({ ok: false as const, error: UNREACHABLE }));
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(kind === "plan" ? `${planLabel} suteiktas.` : extending ? "Pratęsta." : "Komisinis neimamas.");
      setReason("");
      setUntil("");
      setOpen(false);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <div className="space-y-2">
        <button type="button" onClick={() => setOpen(true)} className={`${btn} w-full sm:w-auto`}>
          <IconPlus size={16} strokeWidth={STROKE} aria-hidden />
          Suteikti sąlygą
        </button>
        {done ? <Alert tone="ok">{done}</Alert> : null}
      </div>
    );
  }

  // Dialogas – UŽ formos: jo paties `<form>` submit įvykis kitaip iškyla į šią
  // formą ir vėl atidaro patvirtinimą (taip 10-20 suteikimas nepasiekė serverio).
  return (
    <>
      {dialog}
      <form onSubmit={submit} className={`${card} space-y-4 p-4 sm:p-5`}>
        <h2 className="flex items-center gap-2 text-base font-semibold text-app-ink">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#7A5AC8]" />
          Suteikti sąlygą
        </h2>

        <Field label="Kas">
          <Segment<Kind>
            label="Kas"
            value={kind}
            onChange={setKind}
            options={[
              { value: "waiver", label: "Komisinis neimamas" },
              { value: "plan", label: "Nemokamas planas" },
            ]}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          {kind === "plan" ? (
            <Field label="Planas">
              <Segment<"pro" | "vip">
                label="Planas"
                value={plan}
                onChange={setPlan}
                options={[
                  { value: "pro", label: "Pro" },
                  { value: "vip", label: "VIP" },
                ]}
              />
            </Field>
          ) : null}
          <Field label="Terminas" hint={extending && activeWaiver ? `Dabar galioja ${activeWaiver.until ? `iki ${day(activeWaiver.until)}` : "neribotai"}.` : undefined}>
            <Segment<Term>
              label="Terminas"
              value={term}
              onChange={setTerm}
              options={[
                { value: "date", label: "Iki datos" },
                { value: "unlimited", label: "Neribotai" },
              ]}
            />
            {!unlimited ? (
              <input
                type="date"
                required
                aria-label="Iki (imtinai)"
                min={minDay}
                max={maxDay}
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className={`${dateInput} mt-2`}
              />
            ) : null}
          </Field>
        </div>

        <Field label="Priežastis" htmlFor={`grant-reason-${masterId}`}>
          <input
            id={`grant-reason-${masterId}`}
            required
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Pvz. pirmieji meistrai, komandos narys"
            className={input}
          />
        </Field>

        {error ? <Alert>{error}</Alert> : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setOpen(false)} disabled={pending} className={btnQuiet}>
            Atšaukti
          </button>
          <button type="submit" disabled={pending || !ready} className={btnPrimary}>
            {kind === "plan" ? `Suteikti ${planLabel}` : extending ? "Pratęsti" : "Neimti komisinio"}
          </button>
        </div>
      </form>
    </>
  );
}

/** Nuoroda į visų meistrų sąlygų sąrašą. */
export function GrantsHeader() {
  return (
    <SectionTitle
      accent="value"
      title="Individualios sąlygos"
      aside={
        <Link href="/admin/grants" className="text-xs font-semibold text-app-accent hover:underline">
          Visų sąrašas
        </Link>
      }
    />
  );
}
