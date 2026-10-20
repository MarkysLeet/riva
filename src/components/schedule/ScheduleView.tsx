'use client';

import React, { useState } from 'react';
import { Pencil, ChevronLeft, ChevronRight, Plus, Users, User, Calendar as CalendarIcon } from 'lucide-react';
import { AppointmentCard } from './AppointmentCard';
import { NewAppointmentModal } from './NewAppointmentModal';
import {
  MOCK_SPECIALISTS,
  type Appointment,
  type Specialist,
} from './mockScheduleData';
import { cn } from '@/lib/utils';

interface ScheduleViewProps {
  appointments: Appointment[];
  selectedAppointmentId: string | null;
  onSelectAppointment: (id: string | null) => void;
  onAddAppointment: (appointment: Appointment) => void;
  className?: string;
}

export function ScheduleView({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  onAddAppointment,
  className,
}: ScheduleViewProps) {
  const [selectedMasterFilter, setSelectedMasterFilter] = useState<string>('all');
  const [currentDateOffset, setCurrentDateOffset] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState<{ hour: number; specialistId?: string }>({
    hour: 10,
    specialistId: undefined,
  });

  const timelineStartHour = 8;
  const timelineEndHour = 20;
  const hours = Array.from(
    { length: timelineEndHour - timelineStartHour + 1 },
    (_, i) => timelineStartHour + i
  );

  const displayedSpecialists =
    selectedMasterFilter === 'all'
      ? MOCK_SPECIALISTS
      : MOCK_SPECIALISTS.filter((s) => s.id === selectedMasterFilter);

  // Date formatting calculation
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + currentDateOffset);
  const dateFormatted = targetDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });

  const handleCellClick = (hour: number, specialistId?: string) => {
    setModalSlot({ hour, specialistId });
    setIsModalOpen(true);
  };

  const columnWidth = selectedMasterFilter === 'all' ? 240 : 360;

  return (
    <div className={cn("flex flex-col h-full bg-[#FAF7F2] flex-1 overflow-hidden select-none", className)}>
      {/* Header Toolbar */}
      <header className="flex-none px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-[#2A2421] tracking-tight">
            Расписание
          </h1>
          <span className="text-xs sm:text-sm font-normal text-[#5E544C] capitalize bg-[#F4EFE6] px-3 py-1 rounded-xl border border-[#EAE3D9]">
            {dateFormatted}
          </span>
        </div>

        {/* Date & Master Switch Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Master View Toggle */}
          <div className="flex items-center bg-[#EDE5D8] p-1 rounded-xl text-xs font-medium text-[#2A2421]">
            <button
              onClick={() => setSelectedMasterFilter('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                selectedMasterFilter === 'all'
                  ? "bg-white text-[#2A2421] shadow-xs"
                  : "text-[#5E544C] hover:text-[#2A2421]"
              )}
            >
              Все мастера ({MOCK_SPECIALISTS.length})
            </button>
            {MOCK_SPECIALISTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedMasterFilter(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                  selectedMasterFilter === s.id
                    ? "bg-white text-[#2A2421] shadow-xs"
                    : "text-[#5E544C] hover:text-[#2A2421]"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentDateOffset((prev) => prev - 1)}
              className="w-8 h-8 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-[#2A2421] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Предыдущий день"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDateOffset(0)}
              className="px-3 h-8 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-xs font-medium text-[#2A2421] transition-colors cursor-pointer"
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => setCurrentDateOffset((prev) => prev + 1)}
              className="w-8 h-8 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-[#2A2421] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Следующий день"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => handleCellClick(10)}
            className="h-8 px-3 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto sm:ml-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Запись</span>
          </button>
        </div>
      </header>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-4 sm:px-8 pb-12 pt-4">
        <div className="min-w-fit">
          
          {/* Multi-specialist Column Headers (if viewing all masters) */}
          <div className="flex items-center pl-[60px] pb-3 border-b border-[#EAE3D9] mb-2">
            {displayedSpecialists.map((spec) => (
              <div
                key={spec.id}
                style={{ width: `${columnWidth}px` }}
                className="flex items-center gap-2.5 px-3 shrink-0"
              >
                <img
                  src={spec.avatarUrl}
                  alt={spec.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#E0D5C7]"
                />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-[#2A2421] truncate">
                    {spec.name}
                  </div>
                  <div className="text-[10px] text-[#7A7571] truncate">
                    {spec.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Grid Rows */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative h-[60px] border-b border-[#EAE3D9]/80 flex items-start"
              >
                {/* Time Indicator */}
                <div className="w-[50px] flex-none text-left -translate-y-2.5">
                  <span className="text-[12px] font-medium text-[#7A7571]">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>

                {/* Clickable Column Slots for Creating Appointments */}
                <div className="flex-1 flex h-full">
                  {displayedSpecialists.map((spec) => (
                    <div
                      key={spec.id}
                      style={{ width: `${columnWidth}px` }}
                      onClick={() => handleCellClick(hour, spec.id)}
                      className="h-full border-r border-[#EAE3D9]/40 hover:bg-[#F4EFE6]/50 transition-colors cursor-pointer group relative shrink-0"
                      title={`Нажмите, чтобы записать к ${spec.name} в ${hour}:00`}
                    >
                      <div className="hidden group-hover:flex items-center justify-center h-full text-xs text-[#C59A87] font-medium gap-1">
                        <Plus className="w-3 h-3 stroke-[2]" />
                        <span>Свободно</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Appointment Cards Overlay */}
            <div className="absolute top-0 left-[50px] right-0 bottom-0 pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                {displayedSpecialists.map((spec, specIndex) => {
                  const specAppointments = appointments.filter(
                    (a) => a.specialistId === spec.id || (selectedMasterFilter !== 'all' && !a.specialistId)
                  );

                  const columnLeftOffset = specIndex * columnWidth;

                  return specAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      style={{
                        position: 'absolute',
                        left: `${columnLeftOffset + 8}px`,
                      }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        columnWidth={columnWidth}
                        isSelected={selectedAppointmentId === appointment.id}
                        onClick={() => onSelectAppointment(appointment.id)}
                      />
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedHour={modalSlot.hour}
        selectedSpecialistId={modalSlot.specialistId}
        specialists={MOCK_SPECIALISTS}
        onAddAppointment={onAddAppointment}
      />
    </div>
  );
}
