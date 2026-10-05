import "server-only";
import { site } from "@/content/site";
import type { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Laiškai iš bazės eilės `notification_emails` (P2B reglamento 4 str.:
 * pranešimas meistrui ir „patvariojoje laikmenoje“; developeris 2026-10-05).
 *
 * Bazė, įrašiusi programėlės pranešimą su laiškų sąraše esančiu `kind`
 * (skolos pranešimas, priminimas, apmokėjimo vietoje sustabdymas ir
 * atnaujinimas), įdeda jį ir į eilę. Šis modulis eilę išsiima
 * (`claim_notification_emails` – kelių paleidimų vienu metu ta pati eilutė
 * nepasiekia, nulūžusio paleidimo eilutės po nuomos grįžta), išsiunčia per
 * Resend ir praneša bazei, kas nutiko (`finish_notification_email`). Kiek
 * kartų bandyti ir kada, sprendžia bazė; čia – tik kiekvieno laiško baigtis.
 *
 * Laiške – tas pats tekstas, kaip programėlėje: antraštė ir kūnas ateina iš
 * `notifications`, jau gavėjo kalba. Resend `Idempotency-Key` – pranešimo id,
 * tad pakartotinis bandymas po nutrūkusio atsakymo antro laiško nesiunčia.
 *
 * Žurnale – tik skaičiai: adresai ir id į jį nepatenka.
 */

type AdminDb = ReturnType<typeof createSupabaseAdminClient>;

export type ClaimedEmail = {
  notification_id: string;
  kind: string;
  recipient_id: string;
  recipient_role: string;
  title: string;
  body: string;
  attempts: number;
};

type Outcome = { outcome: "sent" | "retry" | "skip"; resendId?: string; error?: string };
export type RunSummary = { claimed: number; sent: number; retried: number; skipped: number; finishErrors: number };

/** Vienam paleidimui: cron eina kas 10 min., o nemokama Resend para – 100 laiškų visam projektui. */
export const BATCH = 20;

/** Laiško rėmas aplink bazės tekstą – ta pačia kalba, kaip pranešimas. */
const FRAME = {
  lt: {
    hello: "Sveiki,",
    reply: `Galite tiesiog atsakyti į šį laišką – jis pasieks ${site.email}.`,
    app: "Tą patį pranešimą rasite ir Gloumi programėlėje.",
  },
  en: {
    hello: "Hello,",
    reply: `You can simply reply to this email – it will reach ${site.email}.`,
    app: "You will also find this notice in the Gloumi app.",
  },
};

/**
 * Resend atsakymas → kas toliau. 400 ir 422 – laiškas niekada nepraeis (pvz.
 * netinkamas adresas), tad praleidžiamas; visa kita – rakto, ribos (429),
 * idempotencijos (409) ar serverio (5xx) bėdos – bandoma vėliau, kad laiškas
 * nedingtų, kol jos sutvarkomos.
 */
export function outcomeForStatus(status: number): Outcome["outcome"] {
  return status === 400 || status === 422 ? "skip" : "retry";
}

async function deliver(db: AdminDb, key: string, row: ClaimedEmail): Promise<Outcome> {
  try {
    const { data: account, error } = await db.auth.admin.getUserById(row.recipient_id);
    if (error) return { outcome: "retry", error: "user_lookup_failed" };
    const to = account?.user?.email;
    if (!to) return { outcome: "skip", error: "no_address" };

    // Ta pati taisyklė, kaip bazės šablonuose: tekstai yra tik LT ir EN.
    const { data: profile } = await db.from("profiles").select("language").eq("id", row.recipient_id).maybeSingle();
    const frame = profile?.language === "en" ? FRAME.en : FRAME.lt;
    const title = String(row.title).replace(/\s+/g, " ").trim();
    const heading = /[.!?…]$/.test(title) ? title : `${title}.`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      // Užstrigęs Resend neturi suvalgyti viso paleidimo laiko.
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `notification-email/${row.notification_id}`,
      },
      body: JSON.stringify({
        from: `Gloumi <no-reply@${site.sendingDomain}>`,
        to: [to],
        reply_to: site.email,
        subject: title,
        text: [frame.hello, "", heading, "", row.body, "", frame.reply, frame.app, "", site.legalName, site.url].join("\n"),
      }),
    });
    if (!res.ok) return { outcome: outcomeForStatus(res.status), error: `resend_${res.status}` };
    const sent = (await res.json().catch(() => null)) as { id?: unknown } | null;
    return { outcome: "sent", resendId: typeof sent?.id === "string" ? sent.id : undefined };
  } catch (e) {
    return { outcome: "retry", error: e instanceof Error && e.name === "TimeoutError" ? "timeout" : "exception" };
  }
}

/** Vienas paleidimas: išsiimti eilę, išsiųsti, pranešti bazei. Klaida metama tik nepavykus išsiimti. */
export async function processNotificationEmails(db: AdminDb, key: string): Promise<RunSummary> {
  const summary: RunSummary = { claimed: 0, sent: 0, retried: 0, skipped: 0, finishErrors: 0 };
  const { data, error } = await db.rpc("claim_notification_emails", { _limit: BATCH });
  if (error) throw new Error(`claim_notification_emails: ${error.code ?? "error"}`);
  const rows = (data ?? []) as ClaimedEmail[];
  summary.claimed = rows.length;

  for (const row of rows) {
    const result = await deliver(db, key, row);
    const { error: finishError } = await db.rpc("finish_notification_email", {
      _notification_id: row.notification_id,
      _outcome: result.outcome,
      _resend_id: result.resendId ?? null,
      _error: result.error ?? null,
    });
    // Nepavykus užrašyti baigties eilutė po nuomos grįš, o Idempotency-Key neleis antro laiško.
    if (finishError) summary.finishErrors++;
    if (result.outcome === "sent") summary.sent++;
    else if (result.outcome === "skip") summary.skipped++;
    else summary.retried++;
  }
  return summary;
}
