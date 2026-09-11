"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { CircleCheck, LoaderCircle, Mail } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { categories } from "@/content/categories";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error" | "unconfigured";

type ApiResponse = { ok?: boolean; error?: string; fields?: string[] } | null;

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-espresso-900/10 bg-cream-50 px-4 py-3 text-[15px] text-espresso-900 transition-[border-color,box-shadow] placeholder:text-espresso-400 focus:border-terracotta-600 focus:outline-none focus:ring-2 focus:ring-terracotta-600/25";
const labelClass = "block text-sm font-medium text-espresso-800";

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl bg-white p-6 text-espresso-900 shadow-soft sm:p-8">{children}</div>;
}

function Optional() {
  return <span className="font-normal text-espresso-400"> ({copy.form.fields.optional})</span>;
}

/**
 * Master inquiry form. Posts to /api/waitlist, which forwards to whichever
 * channel is configured (webhook and/or e-mail). When none is, the API answers
 * 503 and the card turns into a plain mailto – a form that silently drops
 * submissions would be worse than no form.
 */
export function WaitlistForm() {
  const id = useId();
  const f = copy.form;
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const payload = {
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      city: text("city"),
      category: text("category"),
      link: text("link"),
      message: text("message"),
      consent: data.get("consent") === "on",
      website: text("website"),
    };

    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as ApiResponse;
      if (res.ok && json?.ok) {
        form.reset();
        setStatus("success");
        return;
      }
      if (res.status === 503 && json?.error === "not_configured") {
        setStatus("unconfigured");
        return;
      }
      if (res.status === 429) setMessage(f.errorRateLimited);
      else if (json?.error === "validation") setMessage(f.errorValidation);
      else setMessage(f.errorGeneric);
      setStatus("error");
    } catch {
      setMessage(f.errorNetwork);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card>
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-500">
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="font-serif text-3xl font-medium">{f.successTitle}</h3>
          <p className="leading-relaxed text-espresso-500">{f.successText}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href="/#atsisiusti" size="sm">
              {copy.nav.cta}
            </ButtonLink>
            <Button size="sm" variant="ghost" onClick={() => setStatus("idle")}>
              {f.another}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (status === "unconfigured") {
    return (
      <Card>
        <h3 className="font-serif text-3xl font-medium">{f.unconfiguredTitle}</h3>
        <p className="mt-3 leading-relaxed text-espresso-500">{f.unconfiguredText}</p>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(f.mailSubject)}`}
          className="mt-4 inline-flex items-center gap-2 font-medium text-terracotta-600 hover:text-terracotta-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {site.email}
        </a>
      </Card>
    );
  }

  const submitting = status === "submitting";

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">{f.eyebrow}</p>
      <h3 className="mt-3 font-serif text-3xl font-medium">{f.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-espresso-500">{f.lead}</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" aria-busy={submitting}>
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            {f.fields.name}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            {f.fields.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            inputMode="email"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            {f.fields.phone}
            <Optional />
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-city`} className={labelClass}>
            {f.fields.city}
            <Optional />
          </label>
          <input
            id={`${id}-city`}
            name="city"
            maxLength={80}
            autoComplete="address-level2"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-category`} className={labelClass}>
            {f.fields.category}
            <Optional />
          </label>
          <select id={`${id}-category`} name="category" defaultValue="" className={cn(inputClass, "appearance-auto")}>
            <option value="">{f.fields.categoryPlaceholder}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
            <option value="other">{f.fields.categoryOther}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-link`} className={labelClass}>
            {f.fields.link}
            <Optional />
          </label>
          <input id={`${id}-link`} name="link" maxLength={200} autoComplete="url" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={labelClass}>
            {f.fields.message}
            <Optional />
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            maxLength={1000}
            placeholder={f.fields.messagePlaceholder}
            className={cn(inputClass, "resize-y")}
          />
        </div>

        {/* Honeypot: invisible to people, filled in by bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-start gap-3 sm:col-span-2">
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0 rounded border-espresso-900/20 accent-terracotta-600"
          />
          <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-espresso-500">
            {f.consentStart}
            <Link href="/privatumo-politika" className="font-medium text-terracotta-600 underline-offset-2 hover:underline">
              {f.consentLink}
            </Link>
            {f.consentEnd}
          </label>
        </div>

        {status === "error" && message ? (
          <p role="alert" className="rounded-xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700 sm:col-span-2">
            {message}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                {f.submitting}
              </>
            ) : (
              f.submit
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
