export const instant = false;
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  // Fetch actual data
  const { data: specialists } = await supabase
    .from('business_masters')
    .select('*')
    .eq('business_id', tenant.id);

  const { data: appointmentsRaw } = await supabase
    .from('appointments')
    .select(`
      *,
      services(name)
    `)
    .eq('business_id', tenant.id);

  const { data: waitlistRaw } = await supabase
    .from('waitlist_requests')
    .select('*, services(name)')
    .eq('business_id', tenant.id);

  return (
    <DashboardClient
      tenantSlug={slug}
      tenantId={tenant.id}
      specialists={specialists || []}
      appointmentsRaw={appointmentsRaw || []}
      waitlistRaw={waitlistRaw || []}
    />
  );
}
