/* eslint-disable @typescript-eslint/no-explicit-any */
export const instant = false;
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import ServicesClient, { ServiceItem } from './ServicesClient';

export default async function ServicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', slug).single();
  if (!tenant) return <div>Tenant not found</div>;

  const { data: servicesRaw } = await supabase.from('services').select('*').eq('tenant_id', tenant.id);

  const initialServices: ServiceItem[] = (servicesRaw || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    category: s.category || 'Услуга',
    description: '',
    price: s.price,
    durationMinutes: s.duration_minutes,
    bufferMinutes: s.buffer_minutes || 0,
    depositAmount: s.deposit_amount || 0,
    masterName: 'Все мастера',
    isActive: s.is_active
  }));

  return <ServicesClient initialServices={initialServices} tenantSlug={slug} />;
}
