import "server-only";
import { createHmac, hkdfSync, randomBytes } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/*
 * Ribos, kurios išlieka tarp Vercel instancijų (security M-10). Atmintyje
 * laikoma riba galioja tik vienai instancijai: šalta pradžia ar kita
 * instancija ją nuresetina, tad robotas formą galėjo siųsti be galo ir
 * išnaudoti Resend paros ribą, kuri bendra su prisijungimo laiškais.
 *
 * Žetonus skaičiuoja bazė (`site_rate_limit_hit`, tik `service_role`). Į ją
 * siunčiamas ne IP, o jo maiša su slaptu raktu (HMAC-SHA256), kaip programėlės
 * `rate_limits_ip` – Privatumo politika sako, kad svetainės formoje „taip pat“
 * saugoma tik IP maiša. Paprastą SHA-256 be rakto IPv4 adresui galima atversti
 * perrinkus visus 2^32 adresus (teisininko G7, 2026-10-22).
 * Raktas išvedamas (HKDF-SHA256) iš service-role rakto, kaip `sealed-step.ts`:
 * naujo slapto rakto nereikia, o jį pakeitus ribos tiesiog prasideda iš naujo.
 */
const KEY_INFO = "gloumi-rate-limit-key-v1";
let cachedKey: Buffer | undefined;

function hmacKey(): Buffer {
  if (cachedKey) return cachedKey;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Be serverio rakto (vietinis build'as) – atsitiktinis šio proceso raktas:
  // ribos skaičiuojamos tik jame, o maišos niekas kitas neapskaičiuos.
  cachedKey = secret ? Buffer.from(hkdfSync("sha256", secret, "gloumi.lt", KEY_INFO, 32)) : randomBytes(32);
  return cachedKey;
}

export type LimitBucket = "waitlist_ip" | "waitlist_email_day";

/** `unavailable` – bazė neatsakė arba funkcijos dar nėra: kvietėjas renkasi atsarginį kelią. */
export type LimitResult = "allowed" | "limited" | "unavailable";

export function hashKey(value: string, purpose: string): string {
  return createHmac("sha256", hmacKey()).update(`${purpose}|${value}`).digest("hex");
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
