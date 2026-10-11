import "server-only";
import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Ribos, kurios išlieka tarp Vercel instancijų (security M-10). Atmintyje
 * laikoma riba galioja tik vienai instancijai: šalta pradžia ar kita
 * instancija ją nuresetina, tad robotas formą galėjo siųsti be galo ir
 * išnaudoti Resend paros ribą, kuri bendra su prisijungimo laiškais.
 *
 * Žetonus skaičiuoja bazė (`site_rate_limit_hit`, tik `service_role`). Į ją
 * siunčiamas ne IP, o jo SHA-256 – kad skaičiuoti, IP nereikia.
 */

export type LimitBucket = "waitlist_ip" | "waitlist_email_day";

/** `unavailable` – bazė neatsakė arba funkcijos dar nėra: kvietėjas renkasi atsarginį kelią. */
export type LimitResult = "allowed" | "limited" | "unavailable";

export function hashKey(value: string, purpose: string): string {
  return createHash("sha256").update(`${purpose}|${value}`).digest("hex");
}

export async function hitLimit(bucket: LimitBucket, key: string): Promise<LimitResult> {
  try {
    const db = createSupabaseAdminClient();
    const { data, error } = await db.rpc("site_rate_limit_hit", { _bucket: bucket, _key: key });
    if (error || typeof data !== "boolean") {
      console.warn("[rate-limit]", bucket, error?.code ?? "bad_answer");
      return "unavailable";
    }
    return data ? "allowed" : "limited";
  } catch {
    console.warn("[rate-limit]", bucket, "exception");
    return "unavailable";
  }
}
