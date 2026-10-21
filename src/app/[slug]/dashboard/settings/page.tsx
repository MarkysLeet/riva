export const instant = false;
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: tenant } = await supabase.from('tenants').select('*').eq('slug', slug).single();
  if (!tenant) return <div>Tenant not found</div>;

  const initialData = {
    name: tenant.name || '',
    description: tenant.description || '',
    slug: tenant.slug || '',
    depositAmount: tenant.deposit_amount || 0,
    city: tenant.city || 'Dubai',
    address: tenant.address || '',
    portfolioImages: tenant.portfolio_images || [],
    services: [], // Fetch real if needed, but the UI might just use placeholders
    schedule: [],
    status: tenant.status || 'draft',
  };

  return <SettingsClient initialData={initialData} tenantSlug={slug} />;
}
