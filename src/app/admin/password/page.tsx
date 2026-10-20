import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin-guard";
import { AdminShell } from "../AdminShell";
import { MfaNotice } from "../MfaNotice";
import { PasswordForm } from "./PasswordForm";

/*
 * Administratoriaus slaptažodžio keitimas (developeris 2026-10-20). „Pamiršau
 * slaptažodį" administratoriui neveikia – adresas atsitiktinis
 * (`admin_register`), tad keičiama tik čia, prisijungus. Tikrina serveris
 * (`actions.ts`).
 */
export const dynamic = "force-dynamic";

export default async function AdminPasswordPage() {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "mfa-required" || check.reason === "expired") return <MfaNotice reason={check.reason} />;
    notFound();
  }

  return (
    <AdminShell
      section="account"
      title="Slaptažodis"
      subtitle="Reikia dabartinio slaptažodžio ir kodo iš autentifikatoriaus."
      username={check.username ?? check.userId}
    >
      <PasswordForm />
    </AdminShell>
  );
}
