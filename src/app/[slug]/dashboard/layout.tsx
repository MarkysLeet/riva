export const instant = false;
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
  const adminDb = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth=login');
  }

  // Find the tenant by slug using adminDb (bypasses RLS)
  const { data: tenant } = await adminDb
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (!tenant) {
    redirect('/dashboard');
  }

  let isAuthorized = false;

  // 1. Check tenant_owners table
  const { data: ownerRecord } = await adminDb
    .from('tenant_owners')
    .select('id')
    .eq('tenant_id', tenant.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (ownerRecord) {
    isAuthorized = true;
  }

  // 2. Check masters table
  if (!isAuthorized) {
    const { data: masterAlt } = await adminDb
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
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen w-full bg-[#FAF7F2] overflow-hidden font-sans">
      <SidebarNav currentSlug={slug} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>
    </div>
  );
}
