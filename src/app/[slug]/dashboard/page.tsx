export const instant = false;
import React from 'react';
import { redirect } from 'next/navigation';
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
    .maybeSingle();

  if (!tenant) {
    redirect('/dashboard');
  }

  // Fetch actual data
  const { data: specialists } = await supabase
    .from('masters')
    .select('*')
    .eq('tenant_id', tenant.id);

  const { data: appointmentsRaw } = await supabase
    .from('appointments')
    .select('*, services(name)')
    .eq('tenant_id', tenant.id);

  const { data: waitlistRaw } = await supabase
    .from('waitlist_requests')
    .select('*, services(name)')
    .eq('tenant_id', tenant.id);

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
