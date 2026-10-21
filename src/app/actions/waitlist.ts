'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addWaitlistRequest(data: {
  tenantSlug: string;
  clientName: string;
  clientPhone: string;
  serviceId?: string;
  desiredDate: string;
  timePreference?: string;
}) {
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', data.tenantSlug)
    .single();

  if (!tenant) throw new Error('Tenant not found');

  const { error } = await supabase
    .from('waitlist_requests')
    .insert({
      tenant_id: tenant.id,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      service_id: data.serviceId || null,
      desired_date: data.desiredDate,
      time_preference: data.timePreference,
      status: 'pending',
    });

  if (error) throw error;
  revalidatePath(`/${data.tenantSlug}/dashboard`);
}

export async function updateWaitlistStatus(requestId: string, status: string, tenantSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('waitlist_requests')
    .update({ status })
    .eq('id', requestId);

  if (error) throw error;
  revalidatePath(`/${tenantSlug}/dashboard`);
}
