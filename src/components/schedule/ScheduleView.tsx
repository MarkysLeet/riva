import React from 'react';
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentCard } from './AppointmentCard';
import { mockScheduleData } from './mockScheduleData';
import { cn } from '@/lib/utils';

interface ScheduleViewProps {
  selectedAppointmentId: string | null;
  onSelectAppointment: (id: string | null) => void;
  className?: string;
}

export function ScheduleView({
  selectedAppointmentId,
  onSelectAppointment,
  className,
}: ScheduleViewProps) {
  // Start at 08:00, end at 21:00 (14 rows total)
  const timelineStartHour = 8;
  const timelineEndHour = 21;
  const hours = Array.from(
    { length: timelineEndHour - timelineStartHour + 1 },
    (_, i) => timelineStartHour + i
  );

  return (
    <div className={cn("flex flex-col h-full bg-[#FAF7F2] flex-1 overflow-hidden select-none", className)}>
      {/* Header Toolbar */}
      <header className="flex-none px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-normal text-[#2A2420] tracking-tight">
            Расписание
          </h1>
          <button
            type="button"
            className="p-1 hover:opacity-75 transition-opacity text-[#2A2420] cursor-pointer"
            aria-label="Редактировать расписание"
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Date Controls: < Сегодня > */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-[#2A2420] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Предыдущий день"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </button>
          <button
            type="button"
            className="px-3.5 sm:px-5 h-8 sm:h-9 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-xs sm:text-[15px] font-normal text-[#2A2420] transition-colors cursor-pointer"
          >
            Сегодня
          </button>
          <button
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EDE5D8] hover:bg-[#E2D8C9] text-[#2A2420] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Следующий день"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-4 sm:px-8 pb-12">
        <div className="relative min-w-[480px]">
          {/* Vertical left accent line next to active morning schedule */}
          <div className="absolute left-[54px] top-[10px] w-1 h-[100px] bg-[#B35E46] rounded-full z-10" />

          {/* Hourly Grid Rows */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative h-[60px] border-b border-[#EAE3D9] flex items-start"
              >
                <div className="w-[50px] flex-none text-left -translate-y-2.5">
                  <span className="text-[12px] font-normal text-[#8A8179]">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              </div>
            ))}

            {/* Appointment Cards Overlay */}
            <div className="absolute top-0 left-[68px] right-0 bottom-0 pointer-events-none">
              <div className="relative w-full h-full pointer-events-auto">
                {mockScheduleData.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isSelected={selectedAppointmentId === appointment.id}
                    onClick={() => onSelectAppointment(appointment.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
