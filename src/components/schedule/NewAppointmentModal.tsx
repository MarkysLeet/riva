'use client';

import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { createAppointment } from '@/app/actions/appointments';
import type { Appointment, Specialist } from './mockScheduleData';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHour?: number;
  selectedSpecialistId?: string;
  specialists: Specialist[];
  onAddAppointment: (appointment: Appointment) => void;
  tenantSlug: string;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  selectedHour = 10,
  selectedSpecialistId,
  specialists,
  onAddAppointment,
  tenantSlug
}: NewAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceName, setServiceName] = useState('Маникюр с покрытием');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [specialistId, setSpecialistId] = useState(
    selectedSpecialistId || (specialists[0]?.id ?? 'spec-1')
  );
  const [startHour, setStartHour] = useState(selectedHour);
  const [startMinutes] = useState(0);
  const [price, setPrice] = useState(2500);
  const [depositAmount, setDepositAmount] = useState(300);
  const [status, setStatus] = useState<'confirmed' | 'pending'>('confirmed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const startDecimal = startHour + startMinutes / 60;
    const endMinutesTotal = startHour * 60 + startMinutes + durationMinutes;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;

    const startTimeFormatted = `${startHour.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
    const endTimeFormatted = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    const spec = specialists.find((s) => s.id === specialistId) || specialists[0];

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: `cli-${Date.now()}`,
      client: {
        id: `cli-${Date.now()}`,
        name: clientName,
        shortName: clientName.split(' ')[0] || clientName,
        phone: clientPhone || '+7 (999) 000-00-00',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        metrics: {
          loyaltyRate: 100,
          attendanceRate: 100,
          rating: 100,
        },
        notes: 'Новая запись через панель мастера',
        totalVisits: 1,
      },
      serviceName,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      startHourDecimal: startDecimal,
      durationMinutes,
      specialistId: spec?.id || 'spec-1',
      specialistName: spec?.name || 'Мастер',
      price,
      depositAmount,
      depositCurrency: 'TL',
      isDepositPaid: status === 'confirmed',
      status,
      pastVisits: [],
    };

    onAddAppointment(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2A2421]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#2A2421]">
              <Calendar className="w-4 h-4 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#2A2421]">
              Новая запись
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#7A7571] hover:text-[#2A2421] transition-colors cursor-pointer rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Имя клиента *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Анна Смирнова"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Телефон
              </label>
              <input
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
              />
            </div>
          </div>

          {/* Master Selection (if salon) */}
          {specialists.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Мастер
              </label>
              <select
                value={specialistId}
                onChange={(e) => setSpecialistId(e.target.value)}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              >
                {specialists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Service & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Услуга
              </label>
              <select
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  if (e.target.value.includes('бровей')) {
                    setDurationMinutes(45);
                    setPrice(1200);
                  } else if (e.target.value.includes('Стрижка')) {
                    setDurationMinutes(60);
                    setPrice(2000);
                  } else {
                    setDurationMinutes(90);
                    setPrice(2500);
                  }
                }}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              >
                <option value="Маникюр с покрытием">Маникюр с покрытием (90 мин)</option>
                <option value="Снятие + комплексный маникюр">Снятие + маникюр (105 мин)</option>
                <option value="Коррекция и ламинирование бровей">Коррекция бровей (45 мин)</option>
                <option value="Стрижка и салонная укладка">Стрижка и укладка (60 мин)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Длительность (мин)
              </label>
              <input
                type="number"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              />
            </div>
          </div>

          {/* Time & Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Час начала
              </label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              >
                {Array.from({ length: 13 }, (_, i) => 8 + i).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Стоимость (TL)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544C] mb-1">
                Задаток (TL)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
              />
            </div>
          </div>

          {/* Status Choice */}
          <div>
            <label className="block text-xs font-medium text-[#5E544C] mb-1.5">
              Статус бронирования
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === 'confirmed'
                    ? 'bg-[#CCE7D5] border-[#A8D4B4] text-[#193C24]'
                    : 'bg-white border-[#EAE3D9] text-[#5E544C]'
                }`}
              >
                Подтверждено
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === 'pending'
                    ? 'bg-[#D8DCE2] border-[#BAC3CD] text-[#222933]'
                    : 'bg-white border-[#EAE3D9] text-[#5E544C]'
                }`}
              >
                В ожидании задатка
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              Зарезервировать слот
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
