export const instant = false;
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SidebarNav } from '@/components/schedule/SidebarNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${slug}/login?error=unauthorized`);
  }

  // Find the tenant by slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, owner_id')
    .eq('slug', slug)
    .maybeSingle();

  if (!tenant) {
    redirect('/not-found');
  }

  let isAuthorized = false;

  // 1. Check direct owner_id
  if (tenant.owner_id === user.id) {
    isAuthorized = true;
  }

  // 2. Check tenant_owners table
  if (!isAuthorized) {
    const { data: ownerRecord } = await supabase
      .from('tenant_owners')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (ownerRecord) {
      isAuthorized = true;
    }
  }

  // 3. Check business_masters table
  if (!isAuthorized) {
    const { data: master } = await supabase
      .from('business_masters')
      .select('id')
      .eq('business_id', tenant.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (master) {
      isAuthorized = true;
    }
  }

  // 4. Check masters table
  if (!isAuthorized) {
    const { data: masterAlt } = await supabase
      .from('masters')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (masterAlt) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    redirect(`/${slug}/login?error=unauthorized`);
  }

  return (
    <div className="flex h-screen w-full bg-[#FAF7F2] overflow-hidden font-sans">
      <SidebarNav currentSlug={slug} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
