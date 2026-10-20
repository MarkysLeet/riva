'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { CardGallery } from '@/components/card-gallery';
import { Star, CreditCard, Sparkles, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

// MOCK INITIAL DATA
const INITIAL_DATA = {
  name: 'Avenue Beauty',
  description: 'Премиальный салон в центре. Работаем только с лучшими материалами. Идеальный сервис и атмосфера.',
  address: 'Lara Cd. No:123, Antalya',
  depositAmount: 200,
  type: 'salon' as 'salon' | 'solo',
  status: 'draft' as 'draft' | 'published',
  portfolioImages: [
    'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80',
  ],
  services: [
    { id: 'srv-1', name: 'Маникюр с покрытием гель-лак', category: 'Ногтевой сервис', price: 600, duration: 90, isActive: true },
    { id: 'srv-2', name: 'Женская стрижка и укладка', category: 'Стрижки и укладки', price: 850, duration: 60, isActive: true },
    { id: 'srv-3', name: 'Ламинирование и архитектура бровей', category: 'Брови и ресницы', price: 500, duration: 45, isActive: true },
  ],
  schedule: [
    { day: 1, name: 'Пн', isWorking: true, start: '10:00', end: '20:00' },
    { day: 2, name: 'Вт', isWorking: true, start: '10:00', end: '20:00' },
    { day: 3, name: 'Ср', isWorking: true, start: '10:00', end: '20:00' },
    { day: 4, name: 'Чт', isWorking: true, start: '10:00', end: '20:00' },
    { day: 5, name: 'Пт', isWorking: true, start: '10:00', end: '20:00' },
    { day: 6, name: 'Сб', isWorking: true, start: '11:00', end: '18:00' },
    { day: 0, name: 'Вс', isWorking: false, start: '10:00', end: '20:00' },
  ]
};

export default function SettingsPage() {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'schedule'>('general');

  // Computed Checkbox Progress
  const isNameFilled = formData.name.trim().length > 0;
  const isServicesFilled = formData.services.some(s => s.isActive && s.price > 0);
  const isScheduleFilled = formData.schedule.some(s => s.isWorking);
  const isDepositFilled = formData.depositAmount >= 0;
  const isPhotosFilled = formData.portfolioImages.length > 0;

  const progressCount = [isNameFilled, isServicesFilled, isScheduleFilled, isDepositFilled, isPhotosFilled].filter(Boolean).length;
  const canPublish = progressCount === 5;

  const handlePublish = () => {
    if (canPublish) {
      setFormData(prev => ({ ...prev, status: 'published' }));
    }
  };

  const handleScheduleChange = (dayIndex: number, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => s.day === dayIndex ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden font-sans">
      {/* Desktop Left Sidebar */}
      <SidebarNav className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-none relative">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">

          {/* Header & Status Banner */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A2421] tracking-tight mb-4">
              Настройки бизнеса
            </h1>

            {formData.status === 'draft' && (
              <div className="bg-[#EFEAE0] border border-[#EAE3D9] rounded-2xl p-5 mb-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-[#2A2421] text-base mb-1">
                      Ваш бизнес в режиме настройки
                    </h3>
                    <p className="text-sm text-[#7A7571]">
                      Заполните базовую информацию, чтобы профиль появился в каталоге и стал доступен клиентам.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <span className={`flex items-center gap-1.5 ${isNameFilled ? 'text-[#C59A87] font-medium' : 'text-[#827771]'}`}>
                        <CheckCircle filled={isNameFilled} /> Название
                      </span>
                      <Link href="/dashboard/services" className={`flex items-center gap-1.5 hover:underline ${isServicesFilled ? 'text-[#C59A87] font-medium' : 'text-[#827771]'}`}>
                        <CheckCircle filled={isServicesFilled} /> Услуги
                      </Link>
                      <span className={`flex items-center gap-1.5 ${isScheduleFilled ? 'text-[#C59A87] font-medium' : 'text-[#827771]'}`}>
                        <CheckCircle filled={isScheduleFilled} /> График
                      </span>
                      <span className={`flex items-center gap-1.5 ${isDepositFilled ? 'text-[#C59A87] font-medium' : 'text-[#827771]'}`}>
                        <CheckCircle filled={isDepositFilled} /> Задаток
                      </span>
                      <span className={`flex items-center gap-1.5 ${isPhotosFilled ? 'text-[#C59A87] font-medium' : 'text-[#827771]'}`}>
                        <CheckCircle filled={isPhotosFilled} /> Фото
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish}
                    className="h-11 px-6 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    Опубликовать ({progressCount}/5)
                  </button>
                </div>
              </div>
            )}

            {formData.status === 'published' && (
              <div className="bg-[#D2E8D8]/50 border border-[#C1DDC9] rounded-2xl p-4 mb-6 flex items-center gap-3 text-[#1E4631]">
                <CheckCircle filled={true} />
                <span className="font-medium text-sm">Ваш бизнес успешно опубликован и отображается в общем каталоге.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-[#EAE3D9]">
                <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
                  Общие данные
                </TabButton>
                <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>
                  График работы
                </TabButton>
                <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>
                  Услуги и прайс
                </TabButton>
              </div>

              {/* Form Card with high-contrast text inputs */}
              <div className="bg-white border border-[#EAE3D9] rounded-3xl p-5 sm:p-8 shadow-[0_4px_20px_-2px_rgba(36,34,32,0.04)]">
                {activeTab === 'general' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                    {/* Business Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="biz-name" className="text-sm font-medium text-[#2A2421]">
                        Название бизнеса *
                      </label>
                      <input
                        id="biz-name"
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Например: Avenue Beauty"
                        className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal placeholder:text-[#827771] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                      />
                    </div>

                    {/* Business Type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#2A2421]">
                        Тип бизнеса
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                            formData.type === 'salon'
                              ? 'bg-[#C59A87] text-white shadow-xs'
                              : 'bg-[#FAF7F2] border border-[#EAE3D9] text-[#7A7571] hover:bg-[#EAE3D9]/50'
                          }`}
                          onClick={() => setFormData({ ...formData, type: 'salon' })}
                        >
                          Салон / Студия
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                            formData.type === 'solo'
                              ? 'bg-[#C59A87] text-white shadow-xs'
                              : 'bg-[#FAF7F2] border border-[#EAE3D9] text-[#7A7571] hover:bg-[#EAE3D9]/50'
                          }`}
                          onClick={() => setFormData({ ...formData, type: 'solo' })}
                        >
                          Частный мастер
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="biz-desc" className="text-sm font-medium text-[#2A2421]">
                        Описание бизнеса
                      </label>
                      <textarea
                        id="biz-desc"
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Расскажите о вашей студии, сервисе и преимуществах..."
                        className="w-full bg-white border border-[#EAE3D9] rounded-xl p-3 text-sm text-[#2A2421] font-normal placeholder:text-[#827771] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors resize-none"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="biz-addr" className="text-sm font-medium text-[#2A2421]">
                        Адрес студии / кабинета
                      </label>
                      <input
                        id="biz-addr"
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Например: Lara Cd. No:123, Antalya"
                        className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal placeholder:text-[#827771] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                      />
                    </div>

                    {/* Default Deposit */}
                    <div className="flex flex-col gap-1.5 border-t border-[#EAE3D9] pt-5 mt-1">
                      <div className="flex items-center gap-2">
                        <label htmlFor="biz-deposit" className="text-sm font-medium text-[#2A2421] mb-0">
                          Базовый задаток (TL)
                        </label>
                        <HelpCircle className="w-4 h-4 text-[#827771]" />
                      </div>
                      <p className="text-xs text-[#7A7571]">
                        Сумма предоплаты, которую клиент вносит для подтверждения бронирования. Может переопределяться у конкретных услуг.
                      </p>
                      <input
                        id="biz-deposit"
                        type="number"
                        min={0}
                        value={formData.depositAmount}
                        onChange={e => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                        className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal max-w-[200px] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                      />
                    </div>

                    {/* Portfolio Images */}
                    <div className="pt-2">
                      <label htmlFor="biz-photos" className="text-sm font-medium text-[#2A2421]">
                        Фотографии портфолио (URLs)
                      </label>
                      <p className="text-xs text-[#7A7571] mb-2">
                        Укажите прямые ссылки на фотографии работ или интерьера через запятую.
                      </p>
                      <textarea
                        id="biz-photos"
                        value={formData.portfolioImages.join(', ')}
                        onChange={e => {
                          const val = e.target.value;
                          const urls = val.split(',').map(s => s.trim()).filter(Boolean);
                          setFormData(prev => ({ ...prev, portfolioImages: urls }));
                        }}
                        className="w-full h-24 p-3 bg-white border border-[#EAE3D9] rounded-xl text-sm text-[#2A2421] font-normal placeholder:text-[#827771] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors resize-none"
                        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'schedule' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                    <p className="text-sm text-[#7A7571] mb-2">
                      Настройте регулярные рабочие часы. Перерывы и исключения можно настроить в календаре.
                    </p>
                    {formData.schedule.map((day) => (
                      <div key={day.day} className="flex items-center justify-between p-3.5 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl">
                        <div className="flex items-center gap-3 w-28">
                          <input
                            type="checkbox"
                            id={`day-${day.day}`}
                            checked={day.isWorking}
                            onChange={e => handleScheduleChange(day.day, 'isWorking', e.target.checked)}
                            className="w-4 h-4 rounded text-[#C59A87] focus:ring-[#C59A87] border-[#EAE3D9] cursor-pointer"
                          />
                          <label htmlFor={`day-${day.day}`} className={`text-sm font-medium cursor-pointer ${day.isWorking ? 'text-[#2A2421]' : 'text-[#827771]'}`}>
                            {day.name}
                          </label>
                        </div>

                        {day.isWorking ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={day.start}
                              onChange={e => handleScheduleChange(day.day, 'start', e.target.value)}
                              className="w-24 h-9 bg-white border border-[#EAE3D9] text-[#2A2421] text-xs font-normal rounded-lg text-center focus:outline-none focus:border-[#C59A87]"
                            />
                            <span className="text-[#827771]">-</span>
                            <input
                              type="time"
                              value={day.end}
                              onChange={e => handleScheduleChange(day.day, 'end', e.target.value)}
                              className="w-24 h-9 bg-white border border-[#EAE3D9] text-[#2A2421] text-xs font-normal rounded-lg text-center focus:outline-none focus:border-[#C59A87]"
                            />
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-[#827771] italic mr-4">Выходной</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                    {/* Callout directing to the dedicated Services management page */}
                    <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-medium text-[#2A2421] mb-1">
                          Расширенное управление услугами
                        </h4>
                        <p className="text-xs sm:text-sm text-[#7A7571]">
                          Услуги, индивидуальные задатки, привязка мастеров и время перерывов настраиваются в специальном разделе «Услуги».
                        </p>
                      </div>
                      <Link
                        href="/dashboard/services"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A2421] hover:bg-[#3E352F] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
                      >
                        <span>Открыть раздел «Услуги»</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Quick Preview of existing services */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-[#7A7571]">
                        Текущий каталог ({formData.services.length})
                      </span>
                      {formData.services.map((service) => (
                        <div key={service.id} className="p-4 bg-white border border-[#EAE3D9] rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-[#2A2421]">{service.name}</div>
                            <div className="text-xs text-[#7A7571] mt-0.5">{service.category} • {service.duration} мин</div>
                          </div>
                          <div className="font-serif font-medium text-[#2A2421]">
                            {service.price} TL
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY LIVE PREVIEW */}
            <aside className="lg:col-span-5 xl:col-span-4 sticky top-6 lg:top-10 h-fit">
              <div className="mb-4">
                <h3 className="font-serif text-lg font-medium text-[#2A2421]">Live Preview</h3>
                <p className="text-xs text-[#7A7571]">Так ваша карточка выглядит в каталоге</p>
              </div>

              {/* Replica of the Card from page.tsx */}
              <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col shadow-[0_12px_32px_-4px_rgba(36,34,32,0.07)]">
                <CardGallery
                  images={formData.portfolioImages.length > 0 ? formData.portfolioImages : ['https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80']}
                  alt={formData.name || 'Без названия'}
                  badge={formData.status === 'published' ? 'Новинка' : 'Черновик'}
                  typeBadge={formData.type === 'solo' ? 'Частный мастер' : undefined}
                />

                <div className="p-5 pb-3">
                  <h2 className="font-serif text-xl font-medium text-[#2A2421] tracking-tight line-clamp-1">
                    {formData.name || 'Название бизнеса'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                    <Star className="w-4 h-4 fill-[#2A2421] text-[#2A2421]" />
                    <span className="text-[#2A2421]">5.0</span>
                    <span className="text-[#7A7571] font-normal">• 1.2 км</span>
                  </div>
                  <p className="text-sm text-[#5A504B] mt-2 line-clamp-2">
                    {formData.description || 'Описание не заполнено...'}
                  </p>

                  <div className="flex items-center gap-2 overflow-hidden py-3 mt-1">
                    {['10:00', '11:30', '14:00'].map((time, i) => (
                      <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${i === 0 ? 'bg-[#C59A87] text-white' : 'bg-[#8A9580]/15 text-[#3D4735]'}`}>
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                  {formData.type === 'salon' ? (
                    <span className="text-sm font-medium text-[#2A2421]">
                      Задаток: {formData.depositAmount} TL
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#2A2421] min-w-0">
                      <CreditCard className="w-4 h-4 text-[#7A7571] shrink-0" />
                      <span className="truncate">
                        от {formData.services.find(s => s.isActive)?.price || 0} TL
                      </span>
                    </div>
                  )}
                  <div className="h-9 px-5 rounded-xl bg-[#C59A87] text-white text-sm font-medium flex items-center">
                    Записаться
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 cursor-pointer ${
        active ? 'bg-white shadow-sm border border-[#EAE3D9] text-[#2A2421]' : 'text-[#7A7571] hover:bg-[#EAE3D9]/50'
      }`}
    >
      {children}
    </button>
  );
}

function CheckCircle({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-current opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
    </svg>
  );
}
