import { NextResponse } from "next/server";
import { CATEGORY_IDS } from "@/content/categories";
import { site } from "@/content/site";
import { hashKey, hitLimit } from "@/lib/site-rate-limit";

export const runtime = "nodejs";

type Submission = {
  name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  link: string;
  message: string;
  consent: boolean;
  website: string;
};

const LIMITS = { name: 80, email: 120, phone: 40, city: 80, category: 40, link: 200, message: 1000, website: 200 };
const ALLOWED_CATEGORIES = new Set<string>(["", "other", ...CATEGORY_IDS]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * Fallback only: the real limit is kept by the database (`site_rate_limit_hit`,
 * M-10), because this one lives in one instance and resets with it. It is used
 * when the database does not answer, so the form is never left unthrottled.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (value: unknown, max: number): string => (typeof value === "string" ? value.trim().slice(0, max) : "");

function parse(body: unknown): { ok: true; data: Submission } | { ok: false; fields: string[] } {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const data: Submission = {
    name: str(b.name, LIMITS.name),
    email: str(b.email, LIMITS.email),
    phone: str(b.phone, LIMITS.phone),
    city: str(b.city, LIMITS.city),
    category: str(b.category, LIMITS.category),
    link: str(b.link, LIMITS.link),
    message: str(b.message, LIMITS.message),
    consent: b.consent === true,
    website: str(b.website, LIMITS.website),
  };
  const fields: string[] = [];
  if (data.name.length < 2) fields.push("name");
  if (!EMAIL_RE.test(data.email)) fields.push("email");
  if (!ALLOWED_CATEGORIES.has(data.category)) fields.push("category");
  if (!data.consent) fields.push("consent");
  return fields.length ? { ok: false, fields } : { ok: true, data };
}

type Channel = "webhook" | "email";

async function deliver(data: Submission, sendEmail: boolean): Promise<Channel[]> {
  const webhook = process.env.WAITLIST_WEBHOOK_URL?.trim();
  const resendKey = sendEmail ? process.env.RESEND_API_KEY?.trim() : undefined;
  const receivedAt = new Date().toISOString();
  const via: Channel[] = [];

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "master_waitlist",
        receivedAt,
        source: site.url,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        category: data.category || null,
        link: data.link || null,
        message: data.message || null,
      }),
    });
    if (!res.ok) throw new Error(`webhook answered ${res.status}`);
    via.push("webhook");
  }

  if (resendKey) {
    const to = process.env.WAITLIST_TO_EMAIL?.trim() || site.email;
    const from = process.env.WAITLIST_FROM_EMAIL?.trim() || `Gloumi <no-reply@${site.sendingDomain}>`;
    const text = [
      `Nauja meistro užklausa (${receivedAt})`,
      "",
      `Vardas: ${data.name}`,
      `El. paštas: ${data.email}`,
      `Telefonas: ${data.phone || "–"}`,
      `Miestas: ${data.city || "–"}`,
      `Kategorija: ${data.category || "–"}`,
      `Nuoroda: ${data.link || "–"}`,
      "",
      data.message || "(be žinutės)",
    ].join("\n");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Meistro užklausa: ${data.name}${data.city ? ` (${data.city})` : ""}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`resend answered ${res.status}`);
    via.push("email");
  }

  return via;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = parse(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: "validation", fields: parsed.fields }, { status: 422 });
  }

  /* Honeypot filled in: a bot. Answer success so it stops retrying. */
  if (parsed.data.website) return NextResponse.json({ ok: true, delivered: [] });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const perIp = await hitLimit("waitlist_ip", hashKey(ip, "waitlist"));
  if (perIp === "limited" || (perIp === "unavailable" && throttled(ip))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const hasWebhook = Boolean(process.env.WAITLIST_WEBHOOK_URL?.trim());
  const hasEmail = Boolean(process.env.RESEND_API_KEY?.trim());
  const configured = hasWebhook || hasEmail;
  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[waitlist] no delivery channel configured – submission:", parsed.data);
      return NextResponse.json({ ok: true, delivered: [] });
    }
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  /*
   * One shared daily cap on these e-mails: Resend's daily quota is shared with
   * sign-in e-mails, and a flood here must not lock people out of the app.
   * Past it, a webhook still receives the submission; with e-mail as the only
   * channel the visitor is asked to write to us instead.
   */
  const emailAllowed = hasEmail && (await hitLimit("waitlist_email_day", "all")) !== "limited";
  if (!emailAllowed && !hasWebhook) {
    return NextResponse.json({ ok: false, error: "daily_limited" }, { status: 429 });
  }

  try {
    const delivered = await deliver(parsed.data, emailAllowed);
    return NextResponse.json({ ok: true, delivered });
  } catch (error) {
    console.error("[waitlist] delivery failed", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
