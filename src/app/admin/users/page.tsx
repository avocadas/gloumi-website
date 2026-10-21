import { redirect } from "next/navigation";

/*
 * „Naudotojai“ (design `admin-portalas.md` 1.1, D13): savas kelias navigacijoje.
 * Paieška lieka ta pati – paskyrų lentelė Duomenyse (vardas, @vardas,
 * telefonas), todėl čia tik nukreipiama, perduodant paieškos žodį ir puslapį.
 * Spec leidžia kelio nekeisti; taip senos nuorodos veikia, o navigacijoje –
 * aiškus „Naudotojai“.
 */
export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keep = new URLSearchParams({ table: "profiles" });
  for (const key of ["q", "page", "owner"]) {
    const v = params[key];
    const value = Array.isArray(v) ? v[0] : v;
    if (value) keep.set(key, value);
  }
  redirect(`/admin/data?${keep.toString()}`);
}
