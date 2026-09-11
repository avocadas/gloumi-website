import { NextResponse } from "next/server";
import { categories } from "@/content/categories";
import { site } from "@/content/site";

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
const CATEGORY_IDS = new Set<string>(["", "other", ...categories.map((c) => c.id)]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Best-effort per-instance throttle: 5 submissions per 10 minutes per IP. */
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
  if (!CATEGORY_IDS.has(data.category)) fields.push("category");
  if (!data.consent) fields.push("consent");
  return fields.length ? { ok: false, fields } : { ok: true, data };
}

type Channel = "webhook" | "email";

async function deliver(data: Submission): Promise<Channel[]> {
  const webhook = process.env.WAITLIST_WEBHOOK_URL?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
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
    const from = process.env.WAITLIST_FROM_EMAIL?.trim() || `Gloumi <no-reply@${new URL(site.url).hostname}>`;
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
  if (throttled(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const configured = Boolean(process.env.WAITLIST_WEBHOOK_URL?.trim() || process.env.RESEND_API_KEY?.trim());
  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[waitlist] no delivery channel configured – submission:", parsed.data);
      return NextResponse.json({ ok: true, delivered: [] });
    }
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const delivered = await deliver(parsed.data);
    return NextResponse.json({ ok: true, delivered });
  } catch (error) {
    console.error("[waitlist] delivery failed", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
