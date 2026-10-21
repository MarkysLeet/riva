'use client';

import React, { useState } from 'react';

import { Plus, Edit3, Trash2, Clock, CreditCard, User, Sparkles, Check, X } from 'lucide-react';
import { addService, updateService, toggleServiceStatus } from '@/app/actions/services';
import { motion, AnimatePresence } from 'framer-motion';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  depositAmount?: number;
  masterName: string;
  isActive: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Маникюр с покрытием гель-лак',
    category: 'Ногтевой сервис',
    description: 'Комбинированный или аппаратный маникюр, выравнивание ногтевой пластины базой, однотонное покрытие гель-лаком премиум брендов (Luxio, Uno).',
    price: 600,
    durationMinutes: 90,
    bufferMinutes: 15,
    depositAmount: 200,
    masterName: 'Все мастера',
    isActive: true,
  },
  {
    id: 'srv-2',
    name: 'Женская стрижка и укладка',
    category: 'Стрижки и укладки',
    description: 'Мытье головы с массажем, моделирующая стрижка по форме лица и текстуре волос, салонная укладка на брашинг или стайлер.',
    price: 850,
    durationMinutes: 60,
    bufferMinutes: 15,
    depositAmount: 200,
    masterName: 'Екатерина (Топ-стилист)',
    isActive: true,
  },
  {
    id: 'srv-3',
    name: 'Ламинирование и архитектура бровей',
    category: 'Брови и ресницы',
    description: 'Долговременная укладка непослушных волосков составами с кератином, моделирование формы воском/пинцетом и бережное окрашивание.',
    price: 500,
    durationMinutes: 45,
    bufferMinutes: 10,
    depositAmount: 150,
    masterName: 'Анна Смирнова',
    isActive: true,
  },
  {
    id: 'srv-4',
    name: 'Глубокий восстанавливающий спа-уход',
    category: 'Уход и SPA',
    description: 'Интенсивное питание и увлажнение поврежденных волос холодным паром и ампульными концентратами Davines.',
    price: 1100,
    durationMinutes: 60,
    bufferMinutes: 15,
    depositAmount: 300,
    masterName: 'Все мастера',
    isActive: false,
  },
];

const CATEGORIES = ['Все услуги', 'Ногтевой сервис', 'Стрижки и укладки', 'Брови и ресницы', 'Уход и SPA'];

export default function ServicesClient({ initialServices, tenantSlug }: { initialServices: ServiceItem[], tenantSlug: string }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все услуги');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [form, setForm] = useState<Omit<ServiceItem, 'id'>>({
    name: '',
    category: 'Ногтевой сервис',
    description: '',
    price: 500,
    durationMinutes: 60,
    bufferMinutes: 15,
    depositAmount: 200,
    masterName: 'Все мастера',
    isActive: true,
  });

  const filteredServices = services.filter(s => 
    selectedCategory === 'Все услуги' ? true : s.category === selectedCategory
  );

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      name: '',
      category: selectedCategory === 'Все услуги' ? 'Ногтевой сервис' : selectedCategory,
      description: '',
      price: 600,
      durationMinutes: 60,
      bufferMinutes: 15,
      depositAmount: 200,
      masterName: 'Все мастера',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      bufferMinutes: service.bufferMinutes,
      depositAmount: service.depositAmount,
      masterName: service.masterName,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (editingService) {
        await updateService(editingService.id, {
          name: form.name,
          category: form.category,
          price: form.price,
          duration_minutes: form.durationMinutes,
        }, tenantSlug);
        setServices(prev => prev.map(s => s.id === editingService.id ? { ...form, id: editingService.id } : s));
      } else {
        await addService({
          tenantSlug,
          name: form.name,
          category: form.category,
          price: form.price,
          duration_minutes: form.durationMinutes,
        });
        // We can just rely on the server revalidation, but optimistic update is nice
        setServices(prev => [{ ...form, id: `temp-${Date.now()}` }, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении услуги');
    }
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <>
      {/* Desktop Left Navigation */}


      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A2421] tracking-tight">
                Услуги и прайс-лист
              </h1>
              <p className="text-sm text-[#7A7571] mt-1">
                Индивидуальная настройка услуг мастера: цены, длительность, задаток и параметры записи.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#2A2421] hover:bg-[#3E352F] text-white text-sm font-medium transition-all shadow-sm active:scale-[0.98] self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить услугу</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-white text-[#2A2421] shadow-sm border border-[#EAE3D9]'
                    : 'text-[#7A7571] hover:text-[#2A2421] hover:bg-white/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="flex flex-col gap-4">
            {filteredServices.length === 0 ? (
              <div className="bg-white border border-[#EAE3D9] rounded-2xl p-10 text-center text-[#7A7571]">
                <p className="text-base font-medium text-[#2A2421] mb-1">Услуг в этой категории пока нет</p>
                <p className="text-sm mb-4">Создайте первую услугу, чтобы клиенты могли записаться на нее.</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE3D9] text-[#2A2421] text-sm font-medium hover:bg-[#EAE3D9]/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить услугу</span>
                </button>
              </div>
            ) : (
              filteredServices.map(service => (
                <div
                  key={service.id}
                  className="bg-white border border-[#EAE3D9] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(36,34,32,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(36,34,32,0.06)]"
                >
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <h3 className="text-base sm:text-lg font-medium text-[#2A2421] tracking-tight">
                        {service.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-[#FAF7F2] border border-[#EAE3D9] text-[#7A7571]">
                        {service.category}
                      </span>
                      {!service.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-[#F3EFE9] text-[#A6A09B]">
                          Отключена
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#665E59] leading-relaxed mb-3 line-clamp-2">
                      {service.description || 'Описание услуги пока не добавлено.'}
                    </p>

                    {/* Extended Settings Meta Row */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#7A7571]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C59A87]" />
                        <span>{service.durationMinutes} мин</span>
                        {service.bufferMinutes > 0 && (
                          <span className="text-[#A6A09B]">(+{service.bufferMinutes} мин перерыв)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#C59A87]" />
                        <span>Задаток: {service.depositAmount ?? 0} TL</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C59A87]" />
                        <span>{service.masterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Quick Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0ECE4] shrink-0">
                    <div className="text-left md:text-right">
                      <div className="font-serif text-xl sm:text-2xl font-medium text-[#2A2421]">
                        {service.price} TL
                      </div>
                      <div className="text-[11px] text-[#A6A09B]">
                        фикс. стоимость
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          service.isActive
                            ? 'bg-[#E7F0E8] text-[#285233] hover:bg-[#D9E7DB]'
                            : 'bg-[#EAE5DE] text-[#7A7571] hover:bg-[#DFD8CE]'
                        }`}
                        title={service.isActive ? 'Сделать неактивной' : 'Активировать'}
                      >
                        {service.isActive ? 'Активна' : 'Неактивна'}
                      </button>

                      <button
                        onClick={() => openEditModal(service)}
                        className="p-2 rounded-xl text-[#7A7571] hover:text-[#2A2421] hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE3D9] transition-all cursor-pointer"
                        aria-label="Редактировать услугу"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 rounded-xl text-[#7A7571] hover:text-[#9C382A] hover:bg-[#FDE8E4] border border-transparent transition-all cursor-pointer"
                        aria-label="Удалить услугу"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Extended Service Modal / Sheet */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl border border-[#EAE3D9] shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-[620px] w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4] mb-5">
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#2A2421]">
                  {editingService ? 'Редактирование услуги' : 'Новая услуга'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-[#7A7571] hover:text-[#2A2421] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                    Название услуги *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Например: Стрижка и салонная укладка"
                    className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal placeholder:text-[#A6A09B] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                  />
                </div>

                {/* Category & Master */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Категория
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87] transition-colors"
                    >
                      <option value="Ногтевой сервис">Ногтевой сервис</option>
                      <option value="Стрижки и укладки">Стрижки и укладки</option>
                      <option value="Брови и ресницы">Брови и ресницы</option>
                      <option value="Уход и SPA">Уход и SPA</option>
                      <option value="Другое">Другое</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Закрепленный мастер
                    </label>
                    <select
                      value={form.masterName}
                      onChange={e => setForm({ ...form, masterName: e.target.value })}
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87] transition-colors"
                    >
                      <option value="Все мастера">Все мастера салона</option>
                      <option value="Анна Смирнова">Анна Смирнова (Владелец)</option>
                      <option value="Екатерина (Топ-стилист)">Екатерина (Топ-стилист)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                    Описание для клиентов
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Подробно опишите процедуру, используемые материалы и ожидаемый результат..."
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl p-3 text-sm text-[#2A2421] placeholder:text-[#A6A09B] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors resize-none"
                  />
                </div>

                {/* Price & Deposit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Стоимость (TL) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.price}
                      onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Задаток для записи (TL)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.depositAmount ?? ''}
                      onChange={e => setForm({ ...form, depositAmount: Number(e.target.value) })}
                      placeholder="200"
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3.5 text-sm text-[#2A2421] font-normal placeholder:text-[#A6A09B] focus:outline-none focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] transition-colors"
                    />
                  </div>
                </div>

                {/* Duration & Buffer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Длительность сеанса
                    </label>
                    <select
                      value={form.durationMinutes}
                      onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87] transition-colors"
                    >
                      <option value={15}>15 минут</option>
                      <option value={30}>30 минут</option>
                      <option value={45}>45 минут</option>
                      <option value={60}>1 час</option>
                      <option value={75}>1 час 15 минут</option>
                      <option value={90}>1.5 часа</option>
                      <option value={120}>2 часа</option>
                      <option value={150}>2.5 часа</option>
                      <option value={180}>3 часа</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-[#2A2421]">
                      Перерыв после сеанса
                    </label>
                    <select
                      value={form.bufferMinutes}
                      onChange={e => setForm({ ...form, bufferMinutes: Number(e.target.value) })}
                      className="h-11 bg-white border border-[#EAE3D9] rounded-xl px-3 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87] transition-colors"
                    >
                      <option value={0}>Без перерыва</option>
                      <option value={10}>10 минут</option>
                      <option value={15}>15 минут</option>
                      <option value={20}>20 минут</option>
                      <option value={30}>30 минут</option>
                    </select>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveModal"
                    checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59A87] focus:ring-[#C59A87] border-[#EAE3D9] cursor-pointer"
                  />
                  <label htmlFor="isActiveModal" className="text-xs sm:text-sm text-[#2A2421] cursor-pointer font-medium">
                    Услуга активна и доступна для онлайн-записи клиентам
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0ECE4] mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 px-5 rounded-xl border border-[#EAE3D9] text-[#7A7571] hover:text-[#2A2421] hover:bg-[#FAF7F2] text-sm font-medium transition-colors cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-[#2A2421] hover:bg-[#3E352F] text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    {editingService ? 'Сохранить изменения' : 'Создать услугу'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
