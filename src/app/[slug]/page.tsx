import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const instant = false;

export default async function SalonPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // Try to find the tenant by slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, is_solo_master')
    .eq('slug', slug)
    .single();

  if (!tenant) {
    notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-20">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Бронирование онлайн: {tenant.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {tenant.is_solo_master
            ? 'Выберите услугу и время для записи.'
            : 'Выберите услугу, мастера и время для записи.'}
        </p>

        {/* Placeholder for booking widget */}
        <div className="w-full p-12 border rounded-xl bg-card text-card-foreground shadow-sm">
           <p className="text-muted-foreground">Здесь будет виджет онлайн-записи</p>
        </div>
      </div>
    </div>
  );
}
