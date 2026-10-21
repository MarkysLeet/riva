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

  // Check if owner
  if (tenant.owner_id === user.id) {
    isAuthorized = true;
  } else {
    // Check if master
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

  if (!isAuthorized) {
    redirect(`/${slug}/login?error=unauthorized`);
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#FDFBF7]">
      <SidebarNav currentSlug={slug} />
      <main className="flex-1 w-full relative sm:ml-20 md:ml-64 transition-all duration-300 min-h-screen">
        {children}
      </main>
    </div>
  );
}
