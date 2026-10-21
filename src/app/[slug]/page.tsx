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

  let tenantData: { id: string; name: string; is_solo_master?: boolean; settings?: any } | null = null;
  let isOwner = false;
  let realServices: any[] = [];

  try {
    const supabase = await createClient();
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, name, is_solo_master, settings')
      .eq('slug', slug)
      .maybeSingle();

    if (tenant) {
      tenantData = tenant;

      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true);

      if (services) {
        realServices = services;
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && tenant) {
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
  } catch (_err) {
    // If connection fails, use fallback
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

  const settings = tenantData?.settings || {};

  const displayServices = realServices.length > 0
    ? realServices.map((s) => ({
        id: s.id,
        name: s.name,
        category: 'Услуги',
        price: s.price,
        duration: s.duration_minutes,
        deposit: s.deposit_amount || 0,
        popular: false,
      }))
    : defaultServices;

  const business = {
    name: tenantData?.name || mockMatch?.name || (slug === 'avenue' ? 'Avenue Beauty' : 'Студия красоты Riva'),
    type: (tenantData ? (tenantData.is_solo_master ? 'solo' : 'salon') : mockMatch?.type) || 'salon',
    specialization: settings.specialization || mockMatch?.specialization || (tenantData?.is_solo_master ? 'Частный мастер' : 'Салон красоты'),
    description:
      settings.description ||
      mockMatch?.description ||
      'Уютное камерное пространство в центре города. Высочайшие стандарты качества и заботливые мастера.',
    address: settings.address || 'Lara Cd. No:123, Antalya',
    rating: settings.rating || mockMatch?.rating || 5.0,
    reviewsCount: settings.reviewsCount || mockMatch?.reviews || 1,
    deposit: settings.depositAmount || mockMatch?.deposit || 0,
    portfolio:
      Array.isArray(settings.portfolioImages) && settings.portfolioImages.length > 0
        ? settings.portfolioImages
        : mockMatch?.portfolio && mockMatch.portfolio.length > 0
        ? mockMatch.portfolio
        : [
            'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
          ],
    avatar:
      settings.avatar ||
      mockMatch?.avatar ||
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    services: displayServices,
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7A7571] hover:text-[#2A2421] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Все салоны</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#2A2421]">
              R I V A
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}#booking`}
              className="hidden sm:inline-flex h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white text-xs sm:text-sm font-medium items-center justify-center transition-colors shadow-xs"
            >
              Записаться онлайн
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Media Section */}
      <section className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery View */}
          <div className="lg:col-span-7">
            <CardGallery
              images={business.portfolio}
              alt={business.name}
              badge={business.type === 'solo' ? 'Частный мастер' : 'Салон красоты'}
            />
          </div>

          {/* Salon / Master Info Block */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8A9580]/15 text-[#8A9580] uppercase tracking-wider">
                  {business.type === 'solo' ? 'Частный кабинет' : 'Студия & Салон'}
                </span>
                <span className="text-xs text-[#7A7571] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#8A9580]" />
                  Проверенный профиль
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#2A2421] mb-2">
                {business.name}
              </h1>
              <p className="text-sm font-medium text-[#C59A87]">
                {business.specialization}
              </p>
            </div>

            {/* Quick Stats: Rating, Reviews, Address */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-[#EAE3D9] text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                <Star className="w-4 h-4 fill-[#C59A87] text-[#C59A87]" />
                <span className="font-semibold">{business.rating}</span>
                <span className="text-[#7A7571]">({business.reviewsCount} отзывов)</span>
              </div>
              <span className="text-[#EAE3D9]">•</span>
              <div className="flex items-center gap-1 text-[#7A7571]">
                <MapPin className="w-4 h-4 text-[#7A7571]" />
                <span>{business.address}</span>
              </div>
            </div>

            {/* About text */}
            <p className="text-sm text-[#5E544C] leading-relaxed">
              {business.description}
            </p>

            {/* Working Hours Card */}
            <div className="bg-[#F4EFE6]/60 rounded-2xl p-4 border border-[#EAE3D9]">
              <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#7A7571]">
                <Clock className="w-3.5 h-3.5" />
                <span>График работы</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                {business.workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#5E544C]">
                    <span>{wh.day}</span>
                    <span className="font-medium text-[#2A2421]">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deposit Pill info */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#EAE3D9] text-xs sm:text-sm">
              <span className="text-[#5E544C]">Обязательный задаток при бронировании:</span>
              <span className="font-bold text-[#C59A87]">{business.deposit} TL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Booking section */}
      <section id="booking" className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 border-t border-[#EAE3D9]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#2A2421]">
              Прайс-лист и онлайн-запись
            </h2>
            <p className="text-sm text-[#7A7571] mt-1">
              Выберите желаемую услугу для бронирования даты и времени
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {business.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#C59A87] transition-all flex flex-col justify-between shadow-[0_2px_8px_rgba(42,36,33,0.02)] group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#8A9580] uppercase tracking-wider">
                      {service.category}
                    </span>
                    {service.popular && (
                      <span className="text-[10px] bg-[#C59A87]/15 text-[#C59A87] px-2 py-0.5 rounded-full font-medium">
                        Популярное
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-base text-[#2A2421] group-hover:text-[#C59A87] transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#7A7571]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration} мин
                    </span>
                    <span>•</span>
                    <span>Задаток: {service.deposit} TL</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-[#2A2421] block">
                    {service.price} TL
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F4EFE6] flex items-center justify-between">
                <span className="text-xs text-[#7A7571]">
                  Гарантированная бронь слота
                </span>
                <button
                  className="px-4 py-2 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  onClick={() => {
                    alert(`Запись на услугу: "${service.name}". Для записи свяжитесь с мастером или оформите заявку в лист ожидания.`);
                  }}
                >
                  Выбрать время
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#EAE3D9] bg-white/50 py-10">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7571]">
          <p>© {new Date().getFullYear()} {business.name}. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#2A2421] transition-colors">Главная RIVA</Link>
            <Link href="/dashboard" className="hover:text-[#2A2421] transition-colors">Кабинет мастера</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
