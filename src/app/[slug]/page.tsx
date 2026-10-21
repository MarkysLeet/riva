import React from 'react';

export const instant = false;
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PLACES } from '@/lib/mock-data';
import { CardGallery } from '@/components/card-gallery';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SalonPublicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let tenantData: { id: string; name: string; is_solo_master?: boolean; owner_id?: string } | null = null;
  let isOwner = false;

  try {
    const supabase = await createClient();
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, name, is_solo_master, owner_id')
      .eq('slug', slug)
      .maybeSingle();

    if (tenant) {
      tenantData = tenant;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && tenant) {
      if (tenant.owner_id === user.id) {
        isOwner = true;
      } else {
        const { data: ownerRec } = await supabase
          .from('tenant_owners')
          .select('id')
          .eq('tenant_id', tenant.id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (ownerRec) {
          isOwner = true;
        }
      }
    }
  } catch (_err) {
    // If table doesn't exist yet or connection fails, use fallback
  }

  // Fallback match from mock data or default demo business
  const mockMatch = MOCK_PLACES.find(
    (p) =>
      p.id === slug ||
      p.slug === slug ||
      p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug.toLowerCase() ||
      (slug === 'riva-lounge' && p.id === '1') ||
      (slug === 'glow-and-go' && p.id === '2') ||
      (slug === 'anna-smirnova' && p.id === '3') ||
      (slug === 'evgeniy-volos' && p.id === '4')
  );

  const defaultServices = [
    { id: '1', name: 'Маникюр с покрытием гель-лак', category: 'Ногтевой сервис', price: 600, duration: 90, deposit: 200, popular: true },
    { id: '2', name: 'Снятие + комплексный маникюр', category: 'Ногтевой сервис', price: 750, duration: 105, deposit: 250 },
    { id: '3', name: 'Архитектура и ламинирование бровей', category: 'Брови и ресницы', price: 500, duration: 45, deposit: 150, popular: true },
    { id: '4', name: 'Женская стрижка и салонная укладка', category: 'Волосы', price: 850, duration: 60, deposit: 300 },
    { id: '5', name: 'СПА-уход и восстановление структуры волос', category: 'Волосы', price: 1200, duration: 75, deposit: 400 },
  ];

  const defaultHours = [
    { day: 'Пн — Пт', hours: '10:00 — 20:00' },
    { day: 'Суббота', hours: '11:00 — 18:00' },
    { day: 'Воскресенье', hours: 'Выходной' },
  ];

  const business = {
    name: tenantData?.name || mockMatch?.name || (slug === 'avenue' ? 'Avenue Beauty' : 'Студия красоты Riva'),
    type: (tenantData?.is_solo_master ? 'solo' : mockMatch?.type) || 'salon',
    specialization: mockMatch?.specialization || 'Премиальный ногтевой сервис и эстетический уход',
    description:
      mockMatch?.description ||
      'Уютное камерное пространство в центре города. Высочайшие стандарты стерилизации, премиальные материалы Luxio и Davines, заботливые мастера.',
    address: 'Lara Cd. No:123, Antalya',
    rating: mockMatch?.rating || 4.9,
    reviewsCount: mockMatch?.reviews || 128,
    deposit: mockMatch?.deposit || 300,
    portfolio:
      mockMatch?.portfolio && mockMatch.portfolio.length > 0
        ? mockMatch.portfolio
        : [
            'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
          ],
    avatar:
      mockMatch?.avatar ||
      (mockMatch?.type === 'solo'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
        : undefined),
    services: defaultServices,
    workingHours: defaultHours,
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A2421] font-sans">
      {/* Owner Top Navigation Bar */}
      {isOwner && (
        <div className="bg-[#2A2421] text-[#FAF7F2] px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between z-50 relative border-b border-[#3E352F]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Вы владелец этого салона</span>
          </div>
          <Link
            href={`/${slug}/dashboard`}
            className="inline-flex items-center gap-1.5 bg-[#C59A87] hover:bg-[#B58976] text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
          >
            Панель управления & расписание →
          </Link>
        </div>
      )}

      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D9]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Back to Catalog Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE3D9] hover:bg-[#F4EFE6] hover:border-[#C59A87] text-sm font-medium text-[#2A2421] transition-all shadow-xs group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#7A7571] group-hover:text-[#2A2421] transition-colors" />
            <span>В каталог</span>
          </Link>

          {/* Logo Monogram */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#2A2421]">
              RIVA
            </span>
          </Link>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isOwner && (
              <Link
                href={`/${slug}/dashboard`}
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-[#2A2421] hover:bg-[#3E352F] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors shadow-xs"
              >
                Панель управления
              </Link>
            )}
            <a
              href="#services"
              className="h-10 px-4 sm:px-5 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors shadow-xs"
            >
              Записаться
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1140px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Business Hero Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 sm:mb-12">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#EAE3D9] bg-white shadow-xs">
            <CardGallery
              images={business.portfolio}
              alt={business.name}
              badge={business.type === 'solo' ? 'Частный мастер' : 'Салон красоты'}
            />
          </div>

          {/* Right: Info Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-[#F4EFE6] px-2.5 py-1 rounded-lg text-xs font-medium text-[#2A2421]">
                  <Star className="w-3.5 h-3.5 fill-[#2A2421] text-[#2A2421] credit-card" />
                  <span>{business.rating}</span>
                </div>
                <span className="text-xs font-normal text-[#7A7571]">
                  ({business.reviewsCount} отзывов)
                </span>
                <span className="text-xs font-normal text-[#C59A87] ml-auto">
                  100% гарантия чистоты
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A2421] tracking-tight mb-2">
                {business.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#7A7571] font-normal mb-4">
                {business.specialization}
              </p>

              <div className="flex items-start gap-2 text-xs sm:text-sm text-[#5E544C] mb-4">
                <MapPin className="w-4 h-4 text-[#C59A87] shrink-0 mt-0.5" />
                <span>{business.address}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#7A7571] font-normal leading-relaxed mb-6 pt-4 border-t border-[#F0ECE4]">
                {business.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#F4EFE6]/60 border border-[#EAE3D9] flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#C59A87] shrink-0" />
                <div className="text-xs text-[#5E544C] leading-snug">
                  <span className="font-medium text-[#2A2421]">Предоплата {business.deposit} TL.</span>{' '}
                  Бесплатная отмена за 24 часа до визита.
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 font-serif text-base font-medium text-[#2A2421]">
                <Clock className="w-4 h-4 text-[#C59A87]" />
                <span>Режим работы</span>
              </div>
              <div className="flex flex-col gap-2">
                {business.workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between text-xs sm:text-sm text-[#5E544C]">
                    <span className="font-normal text-[#7A7571]">{wh.day}</span>
                    <span className="font-medium text-[#2A2421]">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-medium text-[#2A2421] tracking-tight">
              Услуги и стоимость
            </h2>
            <span className="text-xs font-normal text-[#7A7571]">
              Всего: {business.services.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {business.services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-[#EAE3D9] hover:border-[#C59A87] rounded-3xl p-5 sm:p-6 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-[#C59A87] bg-[#F4EFE6] px-2.5 py-0.5 rounded-full">
                      {srv.category}
                    </span>
                    {srv.popular && (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Популярное
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#2A2421] mb-1">
                    {srv.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#7A7571] mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.duration} мин</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0ECE4]">
                  <div className="font-serif text-xl font-medium text-[#2A2421]">
                    {srv.price} TL
                  </div>
                  <a
                    href="#services"
                    className="h-9 px-4 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    Записаться
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
