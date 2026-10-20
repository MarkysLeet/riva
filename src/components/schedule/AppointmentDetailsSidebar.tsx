import React from 'react';
import { ChevronLeft, ChevronDown, Pencil, Shield, Hourglass, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from './mockScheduleData';

interface AppointmentDetailsSidebarProps {
  appointment: Appointment | null;
  onClose: () => void;
  className?: string;
}

export function AppointmentDetailsSidebar({
  appointment,
  onClose,
  className,
}: AppointmentDetailsSidebarProps) {
  // If no appointment is selected, render a quiet luxury empty state
  if (!appointment) {
    return (
      <aside
        className={cn(
          "w-[450px] bg-[#EFE6DA] rounded-l-[36px] p-8 h-full flex flex-col items-center justify-center text-center select-none shrink-0 shadow-[-8px_0_24px_rgba(42,36,33,0.03)]",
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mb-4 text-[#8C7A6D]">
          <Calendar className="w-8 h-8 stroke-[1.4]" />
        </div>
        <h3 className="text-lg font-normal text-[#2A2420] mb-1">
          Выберите запись
        </h3>
        <p className="text-sm text-[#7D7065] max-w-[240px]">
          Кликните по любой записи в расписании, чтобы просмотреть карточку клиента и детали
        </p>
      </aside>
    );
  }

  const { client } = appointment;
  const isConfirmed = appointment.status === 'confirmed';

  return (
    <aside
      className={cn(
        "w-[450px] bg-[#EFE6DA] rounded-l-[36px] p-7 h-full flex flex-col justify-between overflow-y-auto select-none shrink-0 shadow-[-8px_0_24px_rgba(42,36,33,0.03)]",
        className
      )}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-7">
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:opacity-75 transition-opacity text-[#2A2420] cursor-pointer"
            aria-label="Назад"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.8]" />
          </button>

          <div className="flex items-center gap-3 flex-1 justify-center px-1">
            <img
              src={client.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"}
              alt={client.name}
              className="w-12 h-12 rounded-full object-cover shadow-sm border border-[#E0D5C7]"
            />
            <h2 className="text-[20px] font-normal text-[#2A2420] tracking-tight">
              {client.name}
            </h2>
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-normal ml-1",
                isConfirmed
                  ? "bg-[#BFE0CB] text-[#193C24]"
                  : "bg-[#CFD4DA] text-[#2C333D]"
              )}
            >
              <span>{isConfirmed ? "Подтверждено" : "Ожидает"}</span>
              {isConfirmed ? (
                <Shield className="w-3 h-3 stroke-[2] fill-none" />
              ) : (
                <Hourglass className="w-3 h-3 stroke-[2] fill-none" />
              )}
            </div>
          </div>

          <button
            type="button"
            className="p-1 hover:opacity-75 transition-opacity text-[#2A2420] cursor-pointer"
            aria-label="Опции"
          >
            <ChevronDown className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>

        {/* Loyalty & Rating Metrics (3 circular pills) */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div>
            <div className="text-[14px] font-normal text-[#2A2420] mb-2">
              Лояльность
            </div>
            <div className="w-[58px] h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[15px] font-normal text-[#1E3B27] mx-auto shadow-sm">
              {client.metrics.loyaltyRate}%
            </div>
          </div>

          <div>
            <div className="text-[14px] font-normal text-[#2A2420] mb-2">
              Посещаемость
            </div>
            <div className="w-[58px] h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[15px] font-normal text-[#1E3B27] mx-auto shadow-sm">
              {client.metrics.attendanceRate}%
            </div>
          </div>

          <div>
            <div className="text-[14px] font-normal text-[#2A2420] mb-2">
              Рейтинг
            </div>
            <div className="w-[58px] h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[15px] font-normal text-[#1E3B27] mx-auto shadow-sm">
              {client.metrics.rating}%
            </div>
          </div>
        </div>

        {/* Content Island Cards */}
        <div className="space-y-4">
          {/* 1. Данные записи */}
          <div className="bg-white/95 rounded-[26px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className="text-[15px] font-normal text-[#2A2420]">
                Данные записи
              </h3>
              <Pencil className="w-3.5 h-3.5 text-[#2A2420] stroke-[1.8] cursor-pointer hover:opacity-75 transition-opacity" />
            </div>
            <div className="space-y-1 text-[14px] font-normal text-[#2A2420]">
              <p>Услуга: {appointment.serviceName}</p>
              <p>Мастер: {appointment.specialistName}</p>
              <p>Депозит: {appointment.depositAmount} {appointment.depositCurrency || 'TL'}</p>
            </div>
          </div>

          {/* 2. История посещений */}
          <div className="bg-white/95 rounded-[26px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <h3 className="text-[15px] font-normal text-[#2A2420] mb-2.5">
              История посещений
            </h3>
            {appointment.pastVisits && appointment.pastVisits.length > 0 ? (
              <div className="space-y-1.5 text-[14px] font-normal text-[#2A2420]">
                {appointment.pastVisits.map((visit) => (
                  <p key={visit.id}>
                    {visit.date} - {visit.serviceName}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-[#7D7065] italic">
                Нет предыдущих записей
              </p>
            )}
          </div>

          {/* 3. Внутренние заметки */}
          <div className="bg-white/95 rounded-[26px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className="text-[15px] font-normal text-[#2A2420]">
                Внутренние заметки
              </h3>
              <Pencil className="w-3.5 h-3.5 text-[#2A2420] stroke-[1.8] cursor-pointer hover:opacity-75 transition-opacity" />
            </div>
            <p className="text-[14px] font-normal text-[#2A2420] leading-relaxed">
              {client.notes || "Заметок пока нет"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-2">
        <button
          type="button"
          className="bg-[#BFE1CE] hover:bg-[#B3D9C3] text-[#1E3E28] font-normal text-[16px] py-3.5 rounded-[20px] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-[0.98] cursor-pointer flex items-center justify-center"
        >
          Начать сеанс
        </button>
        <button
          type="button"
          className="bg-[#C67A60] hover:bg-[#BD7157] text-white font-normal text-[16px] py-3.5 rounded-[20px] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-[0.98] cursor-pointer flex items-center justify-center"
        >
          Отменить сеанс
        </button>
      </div>
    </aside>
  );
}
