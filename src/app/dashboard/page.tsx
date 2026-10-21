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
    redirect('/login');
  }

  // 1. Check tenant_owners table (primary association created during onboarding / OTP)
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
      .single();

    if (tenantObj?.slug) {
      redirect(`/${tenantObj.slug}/dashboard`);
    }
  }

  // 2. Check direct owner_id on tenants table
  const { data: ownedTenant } = await supabase
    .from('tenants')
    .select('slug')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (ownedTenant?.slug) {
    redirect(`/${ownedTenant.slug}/dashboard`);
  }

  // 3. Check business_masters table
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
      .single();

    if (tenantObj?.slug) {
      redirect(`/${tenantObj.slug}/dashboard`);
    }
  }

  // 4. Check masters table (fallback for consolidated schema)
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
      .single();

    if (tenantObj?.slug) {
      redirect(`/${tenantObj.slug}/dashboard`);
    }
  }

  // If no tenant found for this user
  redirect('/login?error=no_tenant');
}
