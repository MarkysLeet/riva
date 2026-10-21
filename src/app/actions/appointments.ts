'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAppointment(data: {
  tenantSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId?: string;
  specialistId: string;
  startTime: string;
  endTime: string;
  internalNotes?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get tenant ID
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', data.tenantSlug)
    .single();

  if (!tenant) throw new Error('Tenant not found');

  // Upsert client
  let clientId;
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', data.clientPhone)
    .maybeSingle();

  if (existingClient) {
    clientId = existingClient.id;
    // Optionally update name/email
    await supabase.from('clients').update({
      name: data.clientName,
      email: data.clientEmail || null,
    }).eq('id', clientId);
  } else {
    const { data: newClient, error: clientErr } = await supabase
      .from('clients')
      .insert({
        phone: data.clientPhone,
        name: data.clientName,
        email: data.clientEmail || null,
      })
      .select('id')
      .single();

    if (clientErr) throw clientErr;
    clientId = newClient.id;
  }

  // Upsert client profile for CRM
  const { data: existingProfile } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('client_id', clientId)
    .eq('tenant_id', tenant.id)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from('client_profiles').insert({
      client_id: clientId,
      tenant_id: tenant.id,
    });
  }

  // Create appointment
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      business_id: tenant.id,
      master_id: data.specialistId,
      service_id: data.serviceId || null,
      client_id: clientId,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      client_email: data.clientEmail || null,
      start_time: data.startTime,
      end_time: data.endTime,
      status: 'pending_deposit',
      internal_notes: data.internalNotes || null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath(`/${data.tenantSlug}/dashboard`);
  return appointment;
}

export async function updateAppointmentStatus(appointmentId: string, status: string, tenantSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) throw error;

  revalidatePath(`/${tenantSlug}/dashboard`);
}

export async function updateAppointmentNotes(appointmentId: string, clientId: string, tenantId: string, notes: string, tenantSlug: string) {
  const supabase = await createClient();

  const { error: aptError } = await supabase
    .from('appointments')
    .update({ internal_notes: notes })
    .eq('id', appointmentId);

  if (aptError) throw aptError;

  const { error: profileError } = await supabase
    .from('client_profiles')
    .update({ internal_notes: notes })
    .eq('client_id', clientId)
    .eq('tenant_id', tenantId);

  if (profileError) throw profileError;

  revalidatePath(`/${tenantSlug}/dashboard`);
}
