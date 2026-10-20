import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, Pencil, Shield, Hourglass, Calendar, PlayCircle, CheckCircle2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from './mockScheduleData';

interface AppointmentDetailsSidebarProps {
  appointment: Appointment | null;
  onClose: () => void;
  onStatusChange?: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onSaveNotes?: (appointmentId: string, notes: string) => void;
  className?: string;
}

export function AppointmentDetailsSidebar({
  appointment,
  onClose,
  onStatusChange,
  onSaveNotes,
  className,
}: AppointmentDetailsSidebarProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (appointment?.client.notes) {
      setNoteText(appointment.client.notes);
    } else {
      setNoteText('');
    }
    setIsEditingNotes(false);
  }, [appointment?.id]);

  if (!appointment) {
    return (
      <aside
        className={cn(
          "w-full xl:w-[450px] bg-[#EFE6DA] rounded-l-[36px] p-8 h-full flex flex-col items-center justify-center text-center select-none shrink-0 shadow-[-8px_0_24px_rgba(42,36,33,0.03)]",
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mb-4 text-[#7A6A5E] shadow-xs">
          <Calendar className="w-8 h-8 stroke-[1.4]" />
        </div>
        <h3 className="text-lg font-medium text-[#2A2421] mb-1">
          Выберите запись
        </h3>
        <p className="text-sm text-[#5E544C] max-w-[240px]">
          Кликните по любой записи в расписании, чтобы просмотреть карточку клиента и детали
        </p>
      </aside>
    );
  }

  const { client } = appointment;
  const isConfirmed = appointment.status === 'confirmed';
  const isInProgress = appointment.status === 'in_progress';
  const isCancelled = appointment.status === 'cancelled';

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(appointment.id, noteText);
    }
    setIsEditingNotes(false);
  };

  return (
    <aside
      className={cn(
        "w-full xl:w-[450px] bg-[#EFE6DA] rounded-t-[32px] xl:rounded-t-none xl:rounded-l-[36px] p-5 sm:p-7 h-full flex flex-col justify-between overflow-y-auto select-none shrink-0 shadow-[-8px_0_24px_rgba(42,36,33,0.03)]",
        className
      )}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:opacity-75 transition-opacity text-[#2A2421] cursor-pointer"
            aria-label="Назад"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.8]" />
          </button>

          <div className="flex items-center gap-3 flex-1 justify-center px-1">
            <img
              src={client.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"}
              alt={client.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-[#E0D5C7]"
            />
            <h2 className="text-[18px] sm:text-[20px] font-medium text-[#2A2421] tracking-tight">
              {client.name}
            </h2>
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-[12px] font-medium ml-1",
                isInProgress
                  ? "bg-[#F3E7C4] text-[#4A3810] border border-[#DECF9E]"
                  : isConfirmed
                  ? "bg-[#CCE7D5] text-[#193C24]"
                  : isCancelled
                  ? "bg-[#F2D7D0] text-[#5C2317]"
                  : "bg-[#D8DCE2] text-[#222933]"
              )}
            >
              <span>
                {isInProgress
                  ? "Сеанс идёт"
                  : isConfirmed
                  ? "Подтверждено"
                  : isCancelled
                  ? "Отменено"
                  : "Ожидает"}
              </span>
              {isInProgress ? (
                <PlayCircle className="w-3 h-3 stroke-[2]" />
              ) : isConfirmed ? (
                <Shield className="w-3 h-3 stroke-[2] fill-none" />
              ) : (
                <Hourglass className="w-3 h-3 stroke-[2] fill-none" />
              )}
            </div>
          </div>

          <button
            type="button"
            className="p-1 hover:opacity-75 transition-opacity text-[#2A2421] cursor-pointer"
            aria-label="Опции"
          >
            <ChevronDown className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>

        {/* Loyalty & Rating Metrics (3 circular pills) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 text-center">
          <div>
            <div className="text-[13px] sm:text-[14px] font-medium text-[#2A2421] mb-1.5">
              Лояльность
            </div>
            <div className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[14px] sm:text-[15px] font-medium text-[#193C24] mx-auto shadow-sm">
              {client.metrics.loyaltyRate}%
            </div>
          </div>

          <div>
            <div className="text-[13px] sm:text-[14px] font-medium text-[#2A2421] mb-1.5">
              Посещаемость
            </div>
            <div className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[14px] sm:text-[15px] font-medium text-[#193C24] mx-auto shadow-sm">
              {client.metrics.attendanceRate}%
            </div>
          </div>

          <div>
            <div className="text-[13px] sm:text-[14px] font-medium text-[#2A2421] mb-1.5">
              Рейтинг
            </div>
            <div className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#CCE7D5] flex items-center justify-center text-[14px] sm:text-[15px] font-medium text-[#193C24] mx-auto shadow-sm">
              {client.metrics.rating}%
            </div>
          </div>
        </div>

        {/* Content Island Cards */}
        <div className="space-y-3.5 sm:space-y-4">
          {/* 1. Данные записи */}
          <div className="bg-white/95 rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[14px] sm:text-[15px] font-medium text-[#2A2421]">
                Данные записи
              </h3>
            </div>
            <div className="space-y-1.5 text-[13px] sm:text-[14px] font-normal text-[#2A2421]">
              <p><span className="text-[#7A7571]">Услуга:</span> {appointment.serviceName}</p>
              <p><span className="text-[#7A7571]">Мастер:</span> {appointment.specialistName}</p>
              <p><span className="text-[#7A7571]">Время:</span> {appointment.startTime} — {appointment.endTime} ({appointment.durationMinutes} мин)</p>
              <p><span className="text-[#7A7571]">Телефон:</span> {client.phone}</p>
              <p><span className="text-[#7A7571]">Задаток:</span> {appointment.depositAmount} {appointment.depositCurrency || 'TL'} {appointment.isDepositPaid ? '• Оплачен' : '• Не оплачен'}</p>
            </div>
          </div>

          {/* 2. История посещений */}
          <div className="bg-white/95 rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <h3 className="text-[14px] sm:text-[15px] font-medium text-[#2A2421] mb-2">
              История посещений ({client.totalVisits})
            </h3>
            {appointment.pastVisits && appointment.pastVisits.length > 0 ? (
              <div className="space-y-1.5 text-[13px] sm:text-[14px] font-normal text-[#2A2421]">
                {appointment.pastVisits.map((visit) => (
                  <p key={visit.id}>
                    {visit.date} — {visit.serviceName}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[13px] sm:text-[14px] text-[#7A7571] italic">
                Нет предыдущих записей
              </p>
            )}
          </div>

          {/* 3. Внутренние заметки */}
          <div className="bg-white/95 rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] sm:text-[15px] font-medium text-[#2A2421]">
                Внутренние заметки
              </h3>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-1 text-[#7A7571] hover:text-[#2A2421] transition-colors cursor-pointer"
                  title="Редактировать заметки"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSaveNotes}
                    className="p-1 text-[#193C24] hover:opacity-80 transition-opacity cursor-pointer"
                    title="Сохранить"
                  >
                    <Check className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    onClick={() => {
                      setNoteText(client.notes);
                      setIsEditingNotes(false);
                    }}
                    className="p-1 text-[#7A7571] hover:text-[#2A2421] transition-colors cursor-pointer"
                    title="Отмена"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl p-2.5 text-xs sm:text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87] resize-none"
                  rows={3}
                  placeholder="Добавьте особенности клиента..."
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-[#2A2421] text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            ) : (
              <p className="text-[13px] sm:text-[14px] font-normal text-[#2A2421] leading-relaxed">
                {noteText || "Заметок пока нет"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 pt-2 pb-8 xl:pb-0 shrink-0">
        <button
          type="button"
          onClick={() => onStatusChange && onStatusChange(appointment.id, isInProgress ? 'completed' : 'in_progress')}
          className={cn(
            "font-medium text-sm sm:text-[15px] py-3.5 rounded-[18px] sm:rounded-[20px] transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center px-2 text-center",
            isInProgress
              ? "bg-[#D2E8D8] hover:bg-[#C2DFC9] text-[#193C24]"
              : "bg-[#BFE1CE] hover:bg-[#B3D9C3] text-[#1E3E28]"
          )}
        >
          {isInProgress ? "Завершить сеанс" : "Начать сеанс"}
        </button>
        <button
          type="button"
          disabled={isCancelled}
          onClick={() => onStatusChange && onStatusChange(appointment.id, 'cancelled')}
          className="bg-[#C67A60] hover:bg-[#BD7157] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-[15px] py-3.5 rounded-[18px] sm:rounded-[20px] transition-all shadow-xs active:scale-[0.98] cursor-pointer flex items-center justify-center px-2 text-center"
        >
          {isCancelled ? "Отменено" : "Отменить сеанс"}
        </button>
      </div>
    </aside>
  );
}
