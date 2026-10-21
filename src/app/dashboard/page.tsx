/* eslint-disable @typescript-eslint/no-explicit-any */
export const instant = false;
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardRedirector() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth=login');
  }

  let resolvedSlug: string | null = null;

  // 1. Check tenant_owners table (primary association created during onboarding / OTP)
  try {
    const { data: tenantOwnerEntry } = await supabase
      .from('tenant_owners')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (tenantOwnerEntry?.tenant_id) {
      const { data: tenantObj } = await supabase
        .from('tenants')
        .select('slug')
        .eq('id', tenantOwnerEntry.tenant_id)
        .maybeSingle();

      if (tenantObj?.slug) {
        resolvedSlug = tenantObj.slug;
      }
    }
  } catch (_e) {}

  // 2. Check direct owner_id on tenants table
  if (!resolvedSlug) {
    try {
      const { data: ownedTenant } = await supabase
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

  // 3. Check business_masters table
  if (!resolvedSlug) {
    try {
      const { data: masterEntry } = await supabase
        .from('business_masters')
        .select('business_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (masterEntry?.business_id) {
        const { data: tenantObj } = await supabase
          .from('tenants')
          .select('slug')
          .eq('id', masterEntry.business_id)
          .maybeSingle();

        if (tenantObj?.slug) {
          resolvedSlug = tenantObj.slug;
        }
      }
    } catch (_e) {}
  }

  // 4. Check masters table (fallback)
  if (!resolvedSlug) {
    try {
      const { data: masterAltEntry } = await supabase
        .from('masters')
        .select('tenant_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (masterAltEntry?.tenant_id) {
        const { data: tenantObj } = await supabase
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
  // If user has no workspace yet, automatically create one on the fly!
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
    const { data: existing } = await supabase
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
    const { data: newTenant, error: createError } = await supabase
      .from('tenants')
      .insert([
        {
          slug: candidateSlug,
          name: rawName,
          type: isMaster ? 'solo' : 'salon',
          is_solo_master: isMaster,
          owner_id: user.id,
          status: 'published',
        },
      ])
      .select('id, slug')
      .single();

    if (!createError && newTenant) {
      await supabase.from('tenant_owners').insert([
        {
          tenant_id: newTenant.id,
          user_id: user.id,
          role: 'owner',
        },
      ]);

      await supabase.from('masters').insert([
        {
          tenant_id: newTenant.id,
          user_id: user.id,
          name: rawName,
          role: 'owner',
          status: 'active',
        },
      ]);

      await supabase.from('business_masters').insert([
        {
          business_id: newTenant.id,
          user_id: user.id,
          name: rawName,
          role: 'owner',
          status: 'active',
        },
      ]);

      resolvedSlug = newTenant.slug;
    }
  } catch (err: any) {
    console.error('Auto-provisioning error:', err);
  }

  redirect(`/${resolvedSlug || candidateSlug}/dashboard`);
}
