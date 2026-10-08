import "server-only";
import { site } from "@/content/site";
import type { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Sprendimo pranešimas autoriui el. paštu (Gloumi #169 2 p.: „programėlėje ir
 * el. paštu").
 *
 * Programėlės pranešimą įrašo pati bazė, tame pačiame RPC, kuris šalina ar
 * taiso turinį (Gloumi `20261004145806`, `moderation_notify_author`), ir jau
 * gavėjo kalba. RPC grąžina žurnalo įrašo id, o pranešimo `payload.auditLogId`
 * — tas pats id (db sutartis, 2026-10-04). Todėl laiške — lygiai tas pats
 * tekstas: antraštė ir kūnas imami iš `notifications`, čia nieko neperrašoma.
 * Pranešimo nėra (punktas „paties naudotojo prašymu", autorius be profilio,
 * techninė lentelė, tekstas nepasikeitė) — nėra ir laiško.
 *
 * KODĖL KLIENTAMS NE KIEKVIENAM PRANEŠIMUI
 * ----------------------------------------
 * Resend nemokama para — 100 laiškų, ir ją dalijasi registracijos bei
 * slaptažodžio laiškai (developeris 2026-10-04: „laiškas tik kai jo reikia").
 * Išvalius 30 vieno šlamštininko įrašų, 30 laiškų jam suvalgytų trečdalį paros,
 * o tikras žmogus nebegautų registracijos laiško. Todėl klientui:
 *   - ne daugiau kaip vienas laiškas per valandą; kiti sprendimai jam lieka
 *     programėlėje (`BURST_MS`);
 *   - visiems klientams kartu — ne daugiau kaip `DAILY_CAP` per paskutines
 *     24 val.
 * Abi ribos skaičiuojamos iš pačių pranešimų, be atskiro įrašo: kiekvienas
 * laiškas turi savo pranešimą, tad pranešimų skaičius yra viršutinė laiškų riba.
 *
 * MEISTRUI — VISADA. Meistrų ir salonų sąlygos (skyrius „Ribojimas,
 * sustabdymas ir nutraukimas") žada: apribojimas, įskaitant skelbimo ar
 * turinio paslėpimą, įsigalioja, kai meistrui „patvariojoje laikmenoje
 * (el. paštu ir programėlėje)" pateikiamas motyvuotas pranešimas (P2B
 * reglamento 4 str.). Laiškas jam — ne mandagumas, o pažadas, todėl ribos jam
 * netaikomos; jei Resend atsisakytų, administratorius tai pamatys.
 *
 * PASKYROS SUSTABDYMAS — VISADA (Gloumi `20261004231227`, #169 3 p.; iki 30 d.).
 * `admin_suspend_user` įrašo `account_suspended` arba `account_unsuspended`
 * pranešimą su tuo pačiu `auditLogId`. Sustabdytas žmogus programėlės
 * nebeatidarys, tad laiškas jam — vienintelis kanalas, ir klientų ribos šiems
 * pranešimams netaikomos. Jų taip pat neskaičiuoja ribos: blokavimų būna
 * mažai, o turinio laiškų ribą jie neturi suvalgyti.
 *
 * MEISTRO PASKYROS NUTRAUKIMAS — VISADA (Gloumi `20261008173623`, #169; P2B 4 str.).
 * Be skubaus pagrindo `admin_delete_account` meistrą tik suplanuoja panaikinti
 * po 30 d. ir įrašo `master_termination_scheduled` pranešimą; atšaukus –
 * `master_termination_cancelled`. Abu – tas pats `auditLogId` kelias.
 * Su skubiu pagrindu paskyra trinama iš karto, ir pranešimas programėlėje su ja
 * neišliktų: tekstas tada guli žurnale (`details.notice`), o laiškas –
 * `emailTerminatedNow`, kuriam el. pašto adresą reikia pasiimti PRIEŠ trynimą.
 *
 * Laiškas nepavyko — veiksmas vis tiek atliktas, o pranešimas programėlėje
 * liko. Todėl klaida čia niekada nemetama: grąžinama būsena, kurią portalas
 * parodo administratoriui.
 */

type AdminDb = ReturnType<typeof createSupabaseAdminClient>;

export type NoticeEmail =
  | "sent"
  | "none"
  | "burst"
  | "cap"
  | "no_address"
  | "not_configured"
  | "failed"
  | "lookup_failed";
/** `master` — gavėjas meistras: jam laiškas privalomas (žr. viršų), tad nepavykęs — rimtesnis. */
export type NoticeEmailResult = { status: NoticeEmail; master: boolean };

/** Turinio sprendimai — klientams su ribomis (žr. viršų). */
const CONTENT_KINDS = ["moderation_content_removed", "moderation_content_edited", "moderation_content_hidden"];
/** Paskyros sustabdymas ir atkūrimas (ir automatinis) — visada. */
const ACCOUNT_KINDS = ["account_suspended", "account_unsuspended"];
/**
 * Gloumi sulaikytas vizitas (K-U24-4, Gloumi `20261005211440`): suma rezervuota
 * arba jau nurašyta, ir sprendimas. Gavėjas visada meistras — laiškas visada
 * (Meistrų sąlygų 16 sk.: apie sulaikymą ir priežastį — programėlėje ir el. paštu).
 */
const HOLD_KINDS = ["visit_charge_held", "visit_payout_held", "visit_hold_resolved"];
/** Meistro paskyros nutraukimas po 30 d. ir jo atšaukimas — visada, gavėjas meistras. */
const TERMINATION_KINDS = ["master_termination_scheduled", "master_termination_cancelled"];
const KINDS = [...CONTENT_KINDS, ...ACCOUNT_KINDS, ...HOLD_KINDS, ...TERMINATION_KINDS];
const BURST_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_CAP = 20;

/** Laiško rėmas aplink bazės tekstą — ta pačia kalba, kaip pranešimas (`moderation_template`). */
const FRAME = {
  lt: {
    hello: "Sveiki,",
    reply: `Galite tiesiog atsakyti į šį laišką – jis pasieks ${site.email}.`,
    app: "Tą patį pranešimą rasite ir Gloumi programėlėje.",
  } as { hello: string; reply: string; app: string | null },
  en: {
    hello: "Hello,",
    reply: `You can simply reply to this email – it will reach ${site.email}.`,
    app: "You will also find this notice in the Gloumi app.",
  } as { hello: string; reply: string; app: string | null },
};

/**
 * Vienas laiškas per Resend. Grąžina būseną, niekada nemeta (žr. viršų).
 * `app: false` – kai programėlėje to pranešimo nėra (paskyra jau ištrinta).
 */
async function sendNotice(input: {
  to: string;
  lang: "lt" | "en";
  title: string;
  body: string;
  idempotencyKey: string;
  app: boolean;
}): Promise<"sent" | "not_configured" | "failed"> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return "not_configured";
  const frame = FRAME[input.lang];
  const title = input.title.replace(/\s+/g, " ").trim();
  const lines = [frame.hello, "", `${title}.`, "", input.body, "", frame.reply];
  if (input.app && frame.app) lines.push(frame.app);
  lines.push("", site.legalName, site.url);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    // Užstrigęs Resend neturi laikyti administratoriaus mygtuko be galo.
    signal: AbortSignal.timeout(10_000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Vienas pranešimas — vienas laiškas, net jei užklausa kartotųsi.
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: `Gloumi <no-reply@${site.sendingDomain}>`,
      to: [input.to],
      // Atsakymas — tai skundas, kurį pranešimas kviečia rašyti į info@.
      reply_to: site.email,
      subject: title,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("[moderation-email] resend answered", res.status);
    return "failed";
  }
  return "sent";
}

export async function emailAuthorNotice(db: AdminDb, auditLogId: unknown): Promise<NoticeEmailResult> {
  let master = false;
  const result = (status: NoticeEmail): NoticeEmailResult => ({ status, master });
  if (typeof auditLogId !== "number" && typeof auditLogId !== "string") return result("none");
  try {
    const { data: notice, error } = await db
      .from("notifications")
      .select("id, kind, recipient_id, recipient_role, title, body")
      .eq("payload->>auditLogId", String(auditLogId))
      .in("kind", KINDS)
      .maybeSingle();
    if (error) return result("lookup_failed");
    if (!notice) return result("none");
    master = notice.recipient_role === "master";

    if (!master && CONTENT_KINDS.includes(String(notice.kind))) {
      const now = Date.now();
      const { count: earlier, error: burstError } = await db
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", notice.recipient_id)
        .in("kind", CONTENT_KINDS)
        .neq("id", notice.id)
        .gte("created_at", new Date(now - BURST_MS).toISOString());
      if (burstError) return result("failed");
      if (earlier) return result("burst");

      const { count: today, error: capError } = await db
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .in("kind", CONTENT_KINDS)
        .neq("recipient_role", "master")
        .gte("created_at", new Date(now - DAY_MS).toISOString());
      if (capError) return result("failed");
      if ((today ?? 0) > DAILY_CAP) return result("cap");
    }

    const { data: account, error: accountError } = await db.auth.admin.getUserById(notice.recipient_id);
    if (accountError) return result("failed");
    const to = account?.user?.email;
    if (!to) return result("no_address");

    // Ta pati taisyklė, kaip bazės `moderation_template`: šablonai yra tik LT ir EN.
    const { data: profile } = await db.from("profiles").select("language").eq("id", notice.recipient_id).maybeSingle();
    return result(
      await sendNotice({
        to,
        lang: profile?.language === "en" ? "en" : "lt",
        title: String(notice.title),
        body: String(notice.body),
        idempotencyKey: `moderation-notice/${notice.id}`,
        app: true,
      }),
    );
  } catch (e) {
    console.error("[moderation-email]", e instanceof Error ? e.message : "unknown error");
    return result("failed");
  }
}

/**
 * Laiškas meistrui, kurio paskyra panaikinta iš karto dėl skubaus pagrindo
 * (`master_terminated_now`). Tekstas – iš žurnalo įrašo `details.notice`
 * (bazė jį įrašo meistro kalba), adresas – paimtas prieš trynimą.
 */
export async function emailTerminatedNow(
  db: AdminDb,
  auditLogId: unknown,
  to: string | null,
): Promise<NoticeEmailResult> {
  const result = (status: NoticeEmail): NoticeEmailResult => ({ status, master: true });
  if (typeof auditLogId !== "number" && typeof auditLogId !== "string") return result("lookup_failed");
  if (!to) return result("no_address");
  try {
    const { data, error } = await db
      .from("admin_audit_logs")
      .select("notice:details->notice")
      .eq("id", auditLogId)
      .maybeSingle();
    if (error) return result("lookup_failed");
    const notice = (data as { notice?: { kind?: unknown; lang?: unknown; title?: unknown; body?: unknown } | null } | null)
      ?.notice;
    if (!notice || notice.kind !== "master_terminated_now" || typeof notice.title !== "string" || typeof notice.body !== "string") {
      return result("lookup_failed");
    }
    return result(
      await sendNotice({
        to,
        lang: notice.lang === "en" ? "en" : "lt",
        title: notice.title,
        body: notice.body,
        idempotencyKey: `termination-now/${auditLogId}`,
        app: false,
      }),
    );
  } catch (e) {
    console.error("[moderation-email]", e instanceof Error ? e.message : "unknown error");
    return result("failed");
  }
}

/**
 * Sprendimo pranešimo žurnalo id, kai RPC grąžina ne jį (`admin_resolve_dispute`
 * grąžina sprendimą): naujausias tos rūšies pranešimas apie tą vizitą per
 * paskutines 10 min. `null` — tokio nėra (pvz. ne Gloumi atidarytas ginčas).
 */
export async function latestNoticeLogId(db: AdminDb, kind: string, bookingId: string): Promise<string | null> {
  const { data } = await db
    .from("notifications")
    .select("payload")
    .eq("kind", kind)
    .eq("payload->>bookingId", bookingId)
    .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const id = (data?.payload as { auditLogId?: unknown } | null)?.auditLogId;
  return typeof id === "number" || typeof id === "string" ? String(id) : null;
}

export type NoticeNote = { text: string; tone: "info" | "warn" };

/** Ką pasakyti administratoriui; `null` — nieko (laiško ir neturėjo būti). */
export function noticeEmailNote({ status, master }: NoticeEmailResult): NoticeNote | null {
  const info = (text: string): NoticeNote => ({ text, tone: "info" });
  const warn = (text: string): NoticeNote => ({ text, tone: "warn" });
  // Meistrui laiškas privalomas: jei jo nebus, administratorius turi jį parašyti pats.
  if (master && (status === "no_address" || status === "not_configured" || status === "failed")) {
    return warn(
      `Meistrui pranešta programėlėje, bet laiškas neišsiųstas. Meistrų sąlygos žada pranešimą ir el. paštu — parašykite jam iš ${site.email} tą patį tekstą.`,
    );
  }
  switch (status) {
    case "sent":
      return info("Pranešta programėlėje ir el. paštu.");
    case "burst":
      return info(
        "Pranešta programėlėje. Laiško nesiuntėme: per pastarąją valandą jam jau pranešta apie kitą sprendimą.",
      );
    case "cap":
      return info(
        `Pranešta programėlėje. Laiško nesiuntėme: per paskutines 24 val. moderavimo pranešimų klientams jau daugiau nei ${DAILY_CAP}, o Resend paros limitą saugome registracijos laiškams.`,
      );
    case "no_address":
      return info("Pranešta programėlėje. Laiško nėra kur siųsti — paskyra be el. pašto.");
    case "not_configured":
      return warn("Pranešta programėlėje, bet laiškai nesiunčiami — nenustatytas RESEND_API_KEY.");
    case "failed":
      return warn("Pranešta programėlėje, bet laiško išsiųsti nepavyko.");
    case "lookup_failed":
      return warn("Nepavyko patikrinti, ar reikia laiško: bazė neatsakė. Laiškas neišsiųstas.");
    case "none":
      return null;
  }
}
