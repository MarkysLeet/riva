/* eslint-disable @typescript-eslint/no-explicit-any */
export const instant = false;
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function DashboardRedirector() {
  const supabase = await createClient();
  const adminDb = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth=login');
  }

  let resolvedSlug: string | null = null;

  // 1. Check tenant_owners table using admin client to bypass RLS restrictions
  try {
    const { data: tenantOwnerEntry } = await adminDb
      .from('tenant_owners')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (tenantOwnerEntry?.tenant_id) {
      const { data: tenantObj } = await adminDb
        .from('tenants')
        .select('slug')
        .eq('id', tenantOwnerEntry.tenant_id)
        .maybeSingle();

      if (tenantObj?.slug) {
        resolvedSlug = tenantObj.slug;
      }
    }
  } catch (_e) {}

  // 2. Check direct owner_id on tenants table (if exists in schema)
  if (!resolvedSlug) {
    try {
      const { data: ownedTenant } = await adminDb
        .from('tenants')
        .select('slug')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle();

      if (ownedTenant?.slug) {
        resolvedSlug = ownedTenant.slug;
      }
    } catch (_e) {}
  }

  // 3. Check masters table (fallback)
  if (!resolvedSlug) {
    try {
      const { data: masterAltEntry } = await adminDb
        .from('masters')
        .select('tenant_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (masterAltEntry?.tenant_id) {
        const { data: tenantObj } = await adminDb
          .from('tenants')
          .select('slug')
          .eq('id', masterAltEntry.tenant_id)
          .maybeSingle();

        if (tenantObj?.slug) {
          resolvedSlug = tenantObj.slug;
        }
      }
    } catch (_e) {}
  }

  // If a tenant workspace exists, redirect directly
  if (resolvedSlug) {
    redirect(`/${resolvedSlug}/dashboard`);
  }

  // AUTO-PROVISIONING:
  // If user has no workspace yet, automatically create one on the fly with admin permissions!
  const meta = user.user_metadata || {};
  const isMaster = meta.role === 'master';
  const rawName =
    (meta.name as string) ||
    (user.email ? user.email.split('@')[0] : 'Мой салон');

  let baseSlug =
    (meta.slug as string) ||
    (user.email ? user.email.split('@')[0].split('+')[0] : 'studio');

  baseSlug =
    baseSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'studio';

  let candidateSlug = baseSlug;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const { data: existing } = await adminDb
      .from('tenants')
      .select('id')
      .eq('slug', candidateSlug)
      .maybeSingle();

    if (!existing) {
      isUnique = true;
    } else {
      candidateSlug = `${baseSlug}-${counter++}`;
    }
  }

  try {
    const { data: newTenant, error: createError } = await adminDb
      .from('tenants')
      .insert([
        {
          slug: candidateSlug,
          name: rawName,
          is_solo_master: isMaster,
          settings: {},
        },
      ])
      .select('id, slug')
      .single();

    if (!createError && newTenant) {
      await adminDb.from('tenant_owners').insert([
        {
          tenant_id: newTenant.id,
          user_id: user.id,
        },
      ]);

      await adminDb.from('masters').insert([
        {
          tenant_id: newTenant.id,
          user_id: user.id,
          name: rawName,
          schedule_rules: {},
        },
      ]);

      resolvedSlug = newTenant.slug;
    }
  } catch (err: any) {
    console.error('Auto-provisioning error:', err);
  }

  redirect(`/${resolvedSlug || candidateSlug}/dashboard`);
}
