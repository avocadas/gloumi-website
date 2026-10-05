import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { processNotificationEmails } from "@/lib/notification-emails";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Vercel cron (`vercel.json`, kas 10 min.): išsiunčia bazės eilės
 * `notification_emails` laiškus (`src/lib/notification-emails.ts`).
 *
 * Vercel cron'ui siunčia `Authorization: Bearer <CRON_SECRET>`; be teisingos
 * paslapties – 401, be paslapties aplinkoje – 503, ir eilė neliečiama:
 * kitaip bet kas galėtų paleisti apdorojimą. Be Resend rakto – irgi 503, kad
 * eilutės nebūtų išsiimtos ir pažymėtos nepavykusiomis dėl nustatymų.
 * Cron'as eina tik production deploy'uose.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorised(request: Request, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  // Ilgis išduoda tik ilgį; turinys lyginamas pastoviu laiku.
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret?.trim()) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (!authorised(request, secret)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  try {
    const summary = await processNotificationEmails(createSupabaseAdminClient(), key);
    console.info("[notification-emails]", JSON.stringify(summary));
    return NextResponse.json({ ok: true, ...summary });
  } catch (e) {
    console.error("[notification-emails]", e instanceof Error ? e.message : "unknown error");
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
