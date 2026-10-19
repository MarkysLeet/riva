import React from 'react';
import { cn } from '@/lib/utils';
import type { Appointment } from './mockScheduleData';

interface AppointmentCardProps {
  appointment: Appointment;
  isSelected: boolean;
  onClick: () => void;
}

export function AppointmentCard({ appointment, isSelected, onClick }: AppointmentCardProps) {
  // Positioning logic (assuming timeline starts at 08:00, with 80px per hour)
  const timelineStartHour = 8;
  const pixelsPerHour = 80;

  const topPosition = (appointment.startHourDecimal - timelineStartHour) * pixelsPerHour;
  const height = (appointment.durationMinutes / 60) * pixelsPerHour;

  const isConfirmed = appointment.status === 'confirmed';

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute left-0 right-0 rounded-2xl p-3.5 cursor-pointer transition-all",
        // Base Status Colors
        isConfirmed
          ? "bg-[#D2E8D8]/70 hover:bg-[#D2E8D8] border border-[#C1DDC9] text-[#1E4631]"
          : "bg-[#E8EAED] hover:bg-[#DDE0E5] border border-[#D5D8DC] text-[#474D57]",
        // Selected State
        isSelected && "ring-2 ring-riva-status-actionPrimary shadow-riva-card z-10",
        !isSelected && "z-0 hover:z-10"
      )}
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold opacity-90">
            {appointment.startTime} – {appointment.endTime}
          </span>
          <span className={cn(
            "text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0",
            isConfirmed ? "bg-white/70" : "bg-white/80"
          )}>
            {isConfirmed ? "Подтверждено 🛡️" : "Ожидает ⏳"}
          </span>
        </div>
        <div className="text-sm font-bold truncate mt-0.5">
          {appointment.client.name}
        </div>
        <div className="text-xs opacity-80 truncate mt-0.5">
          {appointment.serviceName}
        </div>
      </div>
    </div>
  );
}
