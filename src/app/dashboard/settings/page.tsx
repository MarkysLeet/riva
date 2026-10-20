'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { CardGallery } from '@/components/card-gallery';
import { Star, CreditCard, Plus, Trash2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    { id: '1', name: 'Маникюр с покрытием', category: 'Nails', price: 600, duration: 90, isActive: true },
    { id: '2', name: 'Стрижка женская', category: 'Hair', price: 800, duration: 60, isActive: true }
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
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'schedule' | 'photos'>('general');

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

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      name: '',
      category: 'Other',
      price: 0,
      duration: 60,
      isActive: true
    };
    setFormData(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const handleServiceChange = (id: string, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleRemoveService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const handleScheduleChange = (dayIndex: number, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => s.day === dayIndex ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden font-sans">
      <SidebarNav className="hidden lg:flex" />

      <main className="flex-1 overflow-y-auto scrollbar-none relative">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">

          {/* Header & Status Banner */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium text-main tracking-tight mb-4">Настройки бизнеса</h1>

            {formData.status === 'draft' && (
              <div className="bg-[#EFEAE0] border border-[#EAE3D9] rounded-2xl p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-main text-base mb-1">Ваш бизнес в режиме настройки</h3>
                    <p className="text-sm text-muted">Заполните базовую информацию, чтобы профиль появился в каталоге.</p>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1.5 ${isNameFilled ? 'text-accent-terra' : 'text-muted'}`}><CheckCircle filled={isNameFilled} /> Название</span>
                      <span className={`flex items-center gap-1.5 ${isServicesFilled ? 'text-accent-terra' : 'text-muted'}`}><CheckCircle filled={isServicesFilled} /> Услуги</span>
                      <span className={`flex items-center gap-1.5 ${isScheduleFilled ? 'text-accent-terra' : 'text-muted'}`}><CheckCircle filled={isScheduleFilled} /> График</span>
                      <span className={`flex items-center gap-1.5 ${isDepositFilled ? 'text-accent-terra' : 'text-muted'}`}><CheckCircle filled={isDepositFilled} /> Задаток</span>
                      <span className={`flex items-center gap-1.5 ${isPhotosFilled ? 'text-accent-terra' : 'text-muted'}`}><CheckCircle filled={isPhotosFilled} /> Фото</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish}
                    className="h-10 px-6 rounded-xl bg-accent-terra text-white font-medium hover:bg-[#B58976] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    Опубликовать ({progressCount}/5)
                  </button>
                </div>
              </div>
            )}
            {formData.status === 'published' && (
              <div className="bg-[#D2E8D8]/40 border border-[#C1DDC9] rounded-2xl p-4 mb-6 flex items-center gap-3 text-[#1E4631]">
                <CheckCircle filled={true} />
                <span className="font-medium text-sm">Ваш бизнес опубликован и виден клиентам в каталоге.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

              {/* Custom Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-[#EAE3D9]">
                <TabButton active={activeTab === 'general' || activeTab === 'photos'} onClick={() => setActiveTab('general')}>Общие данные</TabButton>
                <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Услуги и цены</TabButton>
                <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>График работы</TabButton>
              </div>

              <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(36,34,32,0.04)]">
                {(activeTab === 'general' || activeTab === 'photos') && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Название бизнеса</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="h-11 bg-surface border-none rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Тип бизнеса</Label>
                      <div className="flex gap-3">
                        <button
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${formData.type === 'salon' ? 'bg-accent-terra text-white' : 'bg-surface text-muted hover:bg-[#EAE3D9]'}`}
                          onClick={() => setFormData({...formData, type: 'salon'})}
                        >
                          Салон / Студия
                        </button>
                        <button
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${formData.type === 'solo' ? 'bg-accent-terra text-white' : 'bg-surface text-muted hover:bg-[#EAE3D9]'}`}
                          onClick={() => setFormData({...formData, type: 'solo'})}
                        >
                          Частный мастер
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="desc">Описание</Label>
                      <textarea
                        id="desc"
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-surface border-none rounded-xl p-3 text-sm outline-none resize-none focus:ring-2 focus:ring-accent-terra/20"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="addr">Адрес</Label>
                      <Input
                        id="addr"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="h-11 bg-surface border-none rounded-xl"
                      />
                    </div>

                    <div className="flex flex-col gap-2 border-t border-[#EAE3D9] pt-5 mt-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="deposit" className="mb-0">Размер задатка (TL)</Label>
                        <HelpCircle className="w-4 h-4 text-muted" />
                      </div>
                      <p className="text-xs text-muted mb-1">Сумма, которую клиент должен оплатить для подтверждения записи.</p>
                      <Input
                        id="deposit"
                        type="number"
                        value={formData.depositAmount}
                        onChange={e => setFormData({...formData, depositAmount: Number(e.target.value)})}
                        className="h-11 bg-surface border-none rounded-xl max-w-[200px]"
                      />
                    </div>

                    <div className="pt-2">
                      <Label htmlFor="photos">Фотографии портфолио (URLs)</Label>
                      <p className="text-xs text-muted mb-2">Введите ссылки на фото через запятую.</p>
                      <textarea
                        id="photos"
                        value={formData.portfolioImages.join(', ')}
                        onChange={e => {
                          const val = e.target.value;
                          const urls = val.split(',').map(s => s.trim()).filter(Boolean);
                          setFormData(prev => ({ ...prev, portfolioImages: urls }));
                        }}
                        className="w-full h-24 p-3 bg-surface border-none rounded-xl outline-none resize-none shadow-sm text-sm"
                        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    {formData.services.map((service, idx) => (
                      <div key={service.id} className="p-4 bg-surface rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-end">
                        <div className="flex-1 flex flex-col gap-2">
                          <Label className="text-xs">Название услуги</Label>
                          <Input
                            value={service.name}
                            onChange={e => handleServiceChange(service.id, 'name', e.target.value)}
                            className="h-10 bg-white border-none rounded-lg"
                            placeholder="Например: Стрижка"
                          />
                        </div>
                        <div className="w-full sm:w-24 flex flex-col gap-2">
                          <Label className="text-xs">Цена (TL)</Label>
                          <Input
                            type="number"
                            value={service.price}
                            onChange={e => handleServiceChange(service.id, 'price', Number(e.target.value))}
                            className="h-10 bg-white border-none rounded-lg"
                          />
                        </div>
                        <div className="w-full sm:w-32 flex flex-col gap-2">
                          <Label className="text-xs">Мин.</Label>
                          <select
                            value={service.duration}
                            onChange={e => handleServiceChange(service.id, 'duration', Number(e.target.value))}
                            className="h-10 bg-white border-none rounded-lg px-3 text-sm outline-none"
                          >
                            <option value={30}>30 мин</option>
                            <option value={45}>45 мин</option>
                            <option value={60}>1 ч</option>
                            <option value={90}>1.5 ч</option>
                            <option value={120}>2 ч</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-3 sm:pb-2.5 pt-2 sm:pt-0">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={service.isActive}
                              onCheckedChange={c => handleServiceChange(service.id, 'isActive', !!c)}
                            />
                            <span className="text-xs text-muted">Актив.</span>
                          </div>
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="p-2 text-[#A6A09B] hover:text-[#9C382A] transition-colors ml-auto sm:ml-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddService}
                      className="mt-2 flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-[#EAE3D9] text-sm font-medium text-muted hover:text-main hover:bg-surface transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить услугу
                    </button>
                  </motion.div>
                )}

                {activeTab === 'schedule' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                    <p className="text-sm text-muted mb-2">Настройте регулярные рабочие часы. Перерывы и исключения можно настроить в календаре.</p>
                    {formData.schedule.map((day) => (
                      <div key={day.day} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                        <div className="flex items-center gap-3 w-24">
                          <Checkbox
                            checked={day.isWorking}
                            onCheckedChange={c => handleScheduleChange(day.day, 'isWorking', !!c)}
                          />
                          <span className={`text-sm font-medium ${day.isWorking ? 'text-main' : 'text-muted'}`}>{day.name}</span>
                        </div>

                        {day.isWorking ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={day.start}
                              onChange={e => handleScheduleChange(day.day, 'start', e.target.value)}
                              className="w-24 h-9 bg-white border-none rounded-lg text-center"
                            />
                            <span className="text-muted">-</span>
                            <Input
                              type="time"
                              value={day.end}
                              onChange={e => handleScheduleChange(day.day, 'end', e.target.value)}
                              className="w-24 h-9 bg-white border-none rounded-lg text-center"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-muted italic mr-8">Выходной</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY LIVE PREVIEW */}
            <aside className="lg:col-span-5 xl:col-span-4 sticky top-6 lg:top-10 h-fit hidden sm:block">
              <div className="mb-4">
                <h3 className="font-serif text-lg font-medium text-main">Live Preview</h3>
                <p className="text-xs text-muted">Так ваша карточка выглядит в каталоге</p>
              </div>

              {/* Replica of the Card from page.tsx */}
              <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col shadow-[0_12px_32px_-4px_rgba(36,34,32,0.07)]">
                <CardGallery
                  images={formData.portfolioImages.length > 0 ? formData.portfolioImages : ['/api/placeholder/400/300']}
                  alt={formData.name || 'Без названия'}
                  badge={formData.status === 'published' ? 'Новинка' : 'Черновик'}
                  typeBadge={formData.type === 'solo' ? 'Частный мастер' : undefined}
                />

                <div className="p-5 pb-3">
                  <h2 className="font-serif text-xl font-medium text-main tracking-tight line-clamp-1">
                    {formData.name || 'Название бизнеса'}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                    <Star className="w-4 h-4 fill-main text-main" />
                    <span className="text-main">5.0</span>
                    <span className="text-muted font-normal">• 1.2 км</span>
                  </div>
                  <p className="text-sm text-[#5A504B] mt-2 line-clamp-2">
                    {formData.description || 'Описание не заполнено...'}
                  </p>

                  <div className="flex items-center gap-2 overflow-hidden py-3 mt-1">
                    {['10:00', '11:30', '14:00'].map((time, i) => (
                      <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${i === 0 ? 'bg-accent-terra text-white' : 'bg-[#8A9580]/15 text-[#3D4735]'}`}>
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                  {formData.type === 'salon' ? (
                    <span className="text-sm font-medium text-main">
                      Задаток: {formData.depositAmount} TL
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-main min-w-0">
                      <CreditCard className="w-4 h-4 text-muted shrink-0" />
                      <span className="truncate">
                        от {formData.services.find(s => s.isActive)?.price || 0} TL
                      </span>
                    </div>
                  )}
                  <div className="h-9 px-5 rounded-xl bg-accent-terra text-white text-sm font-medium flex items-center">
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
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
        active ? 'bg-white shadow-sm border border-[#EAE3D9] text-main' : 'text-muted hover:bg-[#EAE3D9]/50'
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
