/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addService(data: {
  tenantSlug: string;
  name: string;
  category: string;
  price: number;
  duration_minutes: number;
}) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', data.tenantSlug)
    .single();

  if (!tenant) throw new Error('Tenant not found');

  const { error } = await supabase
    .from('services')
    .insert({
      business_id: tenant.id,
      name: data.name,
      category: data.category,
      price: data.price,
      duration_minutes: data.duration_minutes,
      is_active: true,
    });

  if (error) throw error;
  revalidatePath(`/${data.tenantSlug}/dashboard/services`);
}

export async function updateService(serviceId: string, data: any, tenantSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('services')
    .update(data)
    .eq('id', serviceId);

  if (error) throw error;
  revalidatePath(`/${tenantSlug}/dashboard/services`);
}

export async function toggleServiceStatus(serviceId: string, isActive: boolean, tenantSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', serviceId);

  if (error) throw error;
  revalidatePath(`/${tenantSlug}/dashboard/services`);
}
