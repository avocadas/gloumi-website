/**
 * https://gloumi.lt/.well-known/security.txt (RFC 9116) – where to report a
 * security problem (security role, #137 item 15).
 *
 * The text is security's, word for word. Expires is about six months out on
 * purpose: the RFC asks for less than a year, and an expired file tells
 * researchers the contact is stale – renew it before 2027-04-11 (secretary's
 * register). No Policy, Encryption or Acknowledgments yet: there is no public
 * policy page or PGP key. security@ is a forward to info@ on the domenai.lt
 * mail plan, so it lives only as long as that plan does.
 *
 * A route handler, like the files next to it, so the content type is set
 * here; static, and outside the /admin middleware, so no cookies or session.
 */
const SECURITY_TXT = [
  "Contact: mailto:security@gloumi.lt",
  "Expires: 2027-04-11T00:00:00.000Z",
  "Preferred-Languages: lt, en",
  "Canonical: https://gloumi.lt/.well-known/security.txt",
  "",
].join("\n");

export const dynamic = "force-static";

export function GET() {
  return new Response(SECURITY_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
