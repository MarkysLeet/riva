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

  // Find the first tenant where user is an owner or master
  // Check tenants table directly
  const { data: ownedTenant } = await supabase
    .from('tenants')
    .select('slug')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (ownedTenant?.slug) {
    redirect(`/${ownedTenant.slug}/dashboard`);
  }

  // Check business_masters table
  const { data: masterEntry } = await supabase
    .from('business_masters')
    .select('business_id, tenants(slug)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  const tenantSlug = (masterEntry?.tenants as any)?.slug;
  if (tenantSlug) {
    redirect(`/${tenantSlug}/dashboard`);
  }

  // If no tenant found
  redirect('/login?error=no_tenant');
}
