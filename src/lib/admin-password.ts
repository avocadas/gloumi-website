import { createHash } from "node:crypto";

/*
 * Administratoriaus slaptažodis ilgesnis nei bcrypt riba (security
 * 2026-10-20, developeris „iki 200“).
 *
 * bcrypt GoTrue pusėje skaito tik pirmus 72 baitus, todėl ilgesnis
 * slaptažodis paverčiamas fiksuoto ilgio išvestiniu ir būtent jis siunčiamas
 * GoTrue: prisijungiant (abu žingsniai) ir keičiant (dabartinis ir naujas).
 * Iki 72 baitų – nekeičiama, tad esami slaptažodžiai veikia.
 *
 * Išvestinis: `Gl1.` + base64url(SHA-256(žyma + NFC(slaptažodis))), 47 ženklai.
 *  - NFC: ta pati lietuviška raidė, įklijuota ar surinkta kitoje sistemoje,
 *    gali ateiti viena arba dviem kodo vietomis – be NFC slaptažodis būtų
 *    „neteisingas“ (security L1). Tik ilgajam keliui: trumpieji jau nustatyti.
 *  - Žyma `gloumi-admin-password-v1\0`: paskirtis ir versija, kad vėliau
 *    schemą būtų galima keisti nesumaišant (security L2).
 *  - Priešdėlis `Gl1.` turi didžiąją ir mažąją raidę, skaičių ir ženklą –
 *    projekto taisyklę išvestinis tenkina visada, base64url be 0x00.
 *
 * Kadangi GoTrue taisyklę tikrina tik išvestiniui (o jis visada praeina),
 * NAUJAM slaptažodžiui taisyklę taikome patys, originalui, bet kokio ilgio
 * (`password-rule.ts` `isStrongAdminPassword`, security M1). Nutekėjusių slaptažodžių sąrašą
 * GoTrue patikrina tik iki 72 baitų – ilgesniems ši patikra netaikoma.
 */

export const BCRYPT_BYTES = 72;
const TAG = "gloumi-admin-password-v1\u0000";

export function forGoTrue(password: string): string {
  if (Buffer.byteLength(password, "utf8") <= BCRYPT_BYTES) return password;
  const digest = createHash("sha256").update(TAG + password.normalize("NFC"), "utf8").digest("base64url");
  return `Gl1.${digest}`;
}
