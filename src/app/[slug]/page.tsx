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

  let tenantData: { id: string; name: string; is_solo_master?: boolean } | null = null;

  try {
    const supabase = await createClient();
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, name, is_solo_master')
      .eq('slug', slug)
      .maybeSingle();

    if (tenant) {
      tenantData = tenant;
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

          {/* Direct Booking CTA */}
          <a
            href="#services"
            className="h-10 px-4 sm:px-5 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors shadow-xs"
          >
            Записаться
          </a>
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
                  <Star className="w-3.5 h-3.5 fill-[#2A2421] text-[#2A2421]" />
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

              <div className="border-t border-[#EAE3D9] pt-4 mb-4">
                <p className="text-sm text-[#5E544C] leading-relaxed">
                  {business.description}
                </p>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE3D9] flex items-center justify-between">
                <div>
                  <span className="block text-xs font-normal text-[#7A7571]">Базовый задаток</span>
                  <span className="font-serif text-lg font-medium text-[#2A2421]">
                    {business.deposit} TL
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2A2421] bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D9]">
                  <Shield className="w-3.5 h-3.5 text-[#4E7554]" />
                  <span>Безопасная бронь</span>
                </div>
              </div>
            </div>

            {/* Schedule Quick Preview */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 shadow-xs">
              <h3 className="font-serif text-base font-medium text-[#2A2421] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C59A87]" />
                <span>Часы приёма</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {business.workingHours.map((wh, i) => (
                  <div key={i} className="flex justify-between items-center text-[#5E544C]">
                    <span>{wh.day}</span>
                    <span className="font-medium text-[#2A2421]">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Services List Section */}
        <section id="services" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A2421] tracking-tight">
                Услуги и стоимость
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7571] mt-1">
                Выберите подходящую процедуру для бронирования онлайн
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business.services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-[#EAE3D9] rounded-2xl p-5 flex flex-col justify-between hover:border-[#C59A87] transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-normal text-[#C59A87] uppercase tracking-wider">
                      {srv.category}
                    </span>
                    {srv.popular && (
                      <span className="text-[11px] font-medium bg-[#F4EFE6] text-[#2A2421] px-2 py-0.5 rounded-md">
                        Популярно
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-base text-[#2A2421] mb-1">
                    {srv.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#7A7571] mb-4">
                    <span>{srv.duration} мин</span>
                    <span>•</span>
                    <span>Задаток: {srv.deposit} TL</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0ECE4]">
                  <div className="font-serif text-xl font-medium text-[#2A2421]">
                    {srv.price} TL
                  </div>
                  <Link
                    href={`/${slug}/dashboard?service=${srv.id}`}
                    className="h-9 px-4 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    Записаться
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
