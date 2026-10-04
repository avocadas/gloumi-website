import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { GrantView } from './GrantRows';

/*
 * `admin_list_master_grants` (#179): abi rūšys vienoje vietoje, galiojančios
 * pirmos, iki 500 eilučių. Ir sąrašo puslapis, ir meistro paskyra skaito tą
 * patį — paskyra tik atsifiltruoja savo meistrą.
 */

type Row = {
  kind: string;
  master_id: string;
  master_name: string | null;
  plan: string | null;
  until: string | null;
  reason: string | null;
  granted_at: string | null;
  subscription_id: string | null;
  active: boolean | null;
  valid_from: string | null;
};

export async function loadGrants(adminId: string): Promise<{ ok: true; grants: GrantView[] } | { ok: false; error: string }> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc('admin_list_master_grants', { _admin_id: adminId });
  if (error) return { ok: false, error: error.message };
  const grants = ((data ?? []) as Row[])
    .filter((r) => r.kind === 'commission_waiver' || r.kind === 'plan_grant')
    .map((r): GrantView => ({
      kind: r.kind === 'plan_grant' ? 'plan_grant' : 'commission_waiver',
      masterId: r.master_id,
      masterName: r.master_name ?? '',
      plan: r.plan === 'pro' ? 'pro' : r.plan === 'vip' ? 'vip' : null,
      validFrom: r.valid_from,
      until: r.until,
      reason: r.reason ?? '',
      grantedAt: r.granted_at,
      subscriptionId: r.subscription_id,
      active: r.active === true,
    }));
  return { ok: true, grants };
}
