"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconAlert } from "@/components/icons";
import type { MfaResetRow } from "@/lib/mfa-reset";
import { formatWhen } from "../format";
import { STROKE, Tag, btn, btnDanger, btnQuiet, card, eyebrow, input } from "../ui";
import { executeMfaReset, openMfaReset } from "./actions";

type TagTone = Parameters<typeof Tag>[0]["tone"];

const STATUS: Record<string, { label: string; tone: TagTone }> = {
  email_sent: { label: "Laukiama kodo", tone: "neutral" },
  confirmed: { label: "Laukimas", tone: "warn" },
  ready: { label: "Galima nuimti", tone: "danger" },
  done: { label: "Nuimta", tone: "ok" },
  cancelled_by_owner: { label: "Atšaukė savininkas", tone: "lavender" },
  cancelled_aal2_login: { label: "Atšaukta: prisijungė su 2FA", tone: "lavender" },
  failed_checks: { label: "Atmesta: patikra nepavyko", tone: "rose" },
  expired: { label: "Pasibaigė", tone: "neutral" },
};

const OPEN = new Set(["email_sent", "confirmed", "ready"]);

function Problem({ text }: { text: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-[14px] bg-app-danger-bg px-4 py-3 text-sm font-semibold text-app-danger-text">
      <IconAlert size={16} strokeWidth={STROKE} aria-hidden className="mt-0.5 shrink-0" />
      {text}
    </p>
  );
}

/** Forma „Atidaryti prašymą“ (B žingsnis): kodas išsiunčiamas paskyros el. paštu, ne kreipimosi adresu. */
function OpenForm() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [ticket, setTicket] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSent(false);
    startTransition(async () => {
      const res = await openMfaReset(account, ticket);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setAccount("");
      setTicket("");
      setSent(true);
      router.refresh();
    });
  };

  return (
    <section className={`${card} p-5 sm:p-6`}>
      <h2 className="text-lg font-bold text-app-ink">Atidaryti prašymą</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-app-muted">
        Kodas išsiunčiamas tik paskyros el. pašto adresu ir galioja 24 val. Žmogui atsakykite bendru tekstu (S-37 B) ir
        nepatvirtinkite, ar paskyra yra, net jei čia matote priežastį.
      </p>
      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className={`${eyebrow} text-app-muted`}>Paskyros vardas arba el. paštas</span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            maxLength={254}
            autoComplete="off"
            spellCheck={false}
            required
            className={`${input} mt-1.5`}
          />
        </label>
        <label className="block">
          <span className={`${eyebrow} text-app-muted`}>Kreipimosi ID</span>
          <input
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            required
            className={`${input} mt-1.5`}
          />
        </label>
        <button type="submit" disabled={pending || !account.trim() || !ticket.trim()} className={`${btn} h-11`}>
          {pending ? "Siunčiama…" : "Siųsti kodą"}
        </button>
      </form>
      <div className="mt-3 space-y-2">
        {error ? <Problem text={error} /> : null}
        {sent ? (
          <p role="status" className="rounded-[14px] bg-app-band px-4 py-3 text-sm text-app-ink">
            Išsiųsta. Prašymas eilėje – laukiama, kol savininkas įves kodą.
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** „Nuimti 2FA“ (E žingsnis): tik `ready`, su paskyros vardo pakartojimu ir šviežiu TOTP kodu. */
function ExecuteForm({ row, onClose }: { row: MfaResetRow; onClose: () => void }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await executeMfaReset(row.id, username, code);
      setCode("");
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const parts = [
        res.factors !== null ? `faktorių ištrinta: ${res.factors}` : null,
        res.sessions !== null ? `sesijų atjungta: ${res.sessions}` : null,
      ].filter(Boolean);
      setDone(`2FA nuimta${parts.length ? ` (${parts.join(", ")})` : ""}. Savininkui išsiųstas laiškas.`);
      router.refresh();
    });
  };

  if (done) {
    return (
      <p role="status" className="mt-4 rounded-[14px] bg-app-ok-bg px-4 py-3 text-sm font-semibold text-[#3F6A4D]">
        {done}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-[14px] bg-app-sheet p-4">
      <p className="text-[13px] leading-relaxed text-app-body">
        Bus ištrinti visi paskyros 2FA faktoriai ir atjungti visi įrenginiai. Veiksmas įrašomas į administratorių
        žurnalą. Įveskite paskyros vardą dar kartą ir dabartinį kodą iš savo autentifikavimo programėlės.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={`${eyebrow} text-app-muted`}>Paskyros vardas</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            required
            className={`${input} mt-1.5 bg-white`}
          />
        </label>
        <label className="block">
          <span className={`${eyebrow} text-app-muted`}>Jūsų 2FA kodas</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            className={`${input} mt-1.5 bg-white text-center tabular-nums tracking-[0.3em]`}
          />
        </label>
      </div>
      {error ? <Problem text={error} /> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending || username.trim() !== (row.username ?? "").trim() || code.length !== 6}
          className={btnDanger}
        >
          {pending ? "Nuimama…" : "Nuimti 2FA"}
        </button>
        <button type="button" onClick={onClose} className={btnQuiet}>
          Atšaukti
        </button>
      </div>
    </form>
  );
}

function RequestCard({ row }: { row: MfaResetRow }) {
  const [executing, setExecuting] = useState(false);
  const status = STATUS[row.status] ?? { label: row.status, tone: "neutral" as TagTone };
  const closedAt = row.done_at ?? row.cancelled_at;

  return (
    <li className={`${card} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-app-ink">{row.username ?? "—"}</p>
        <Tag tone={status.tone}>{status.label}</Tag>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-[13px] text-app-body sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-app-muted">Atidarė:</dt>
          <dd>{row.opened_by ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-app-muted">Atidaryta:</dt>
          <dd>{formatWhen(row.created_at)}</dd>
        </div>
        {row.confirmed_at ? (
          <div className="flex gap-2">
            <dt className="text-app-muted">Savininkas patvirtino:</dt>
            <dd>{formatWhen(row.confirmed_at)}</dd>
          </div>
        ) : null}
        {row.ready_at ? (
          <div className="flex gap-2">
            <dt className="text-app-muted">Galima nuimti nuo:</dt>
            <dd>{formatWhen(row.ready_at)}</dd>
          </div>
        ) : null}
        {closedAt && !OPEN.has(row.status) ? (
          <div className="flex gap-2">
            <dt className="text-app-muted">Uždaryta:</dt>
            <dd>{formatWhen(closedAt)}</dd>
          </div>
        ) : null}
      </dl>
      {row.status === "ready" && !executing ? (
        <button type="button" onClick={() => setExecuting(true)} className={`${btnDanger} mt-4`}>
          Nuimti 2FA
        </button>
      ) : null}
      {row.status === "ready" && executing ? <ExecuteForm row={row} onClose={() => setExecuting(false)} /> : null}
    </li>
  );
}

export function MfaResetDesk({ rows }: { rows: MfaResetRow[] }) {
  const open = rows.filter((r) => OPEN.has(r.status));
  const closed = rows.filter((r) => !OPEN.has(r.status));
  return (
    <div className="space-y-6">
      <OpenForm />
      <section>
        <h2 className="mb-3 text-[15px] font-semibold text-app-ink">Atviri prašymai ({open.length})</h2>
        {open.length ? (
          <ul className="space-y-3">
            {open.map((row) => (
              <RequestCard key={row.id} row={row} />
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-app-muted">Atvirų prašymų nėra.</p>
        )}
      </section>
      {closed.length ? (
        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-app-ink">Uždaryti, paskutinės 90 d. ({closed.length})</h2>
          <ul className="space-y-3">
            {closed.map((row) => (
              <RequestCard key={row.id} row={row} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
