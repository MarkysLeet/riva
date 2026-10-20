import React from 'react';
import { Shield, Hourglass, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from './mockScheduleData';

interface AppointmentCardProps {
  appointment: Appointment;
  isSelected: boolean;
  onClick: () => void;
  columnWidth?: number;
}

export function AppointmentCard({ appointment, isSelected, onClick, columnWidth }: AppointmentCardProps) {
  // Positioning logic: timeline starts at 08:00, with 60px per hour
  const timelineStartHour = 8;
  const pixelsPerHour = 60;

  const topPosition = (appointment.startHourDecimal - timelineStartHour) * pixelsPerHour;
  const height = Math.max((appointment.durationMinutes / 60) * pixelsPerHour, 48);

  const isConfirmed = appointment.status === 'confirmed';
  const isInProgress = appointment.status === 'in_progress';
  const isCompleted = appointment.status === 'completed';
  const clientDisplayName = appointment.client.shortName || appointment.client.name;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute rounded-[20px] px-3.5 py-2.5 cursor-pointer transition-all duration-200 select-none shadow-[0_2px_8px_rgba(42,36,33,0.04)]",
        // Status Colors matching reference Quiet Luxury palette
        isConfirmed && "bg-[#CCE7D5] text-[#193C24] hover:brightness-[0.98]",
        isInProgress && "bg-[#F3E7C4] text-[#4A3810] border border-[#DECF9E] hover:brightness-[0.98]",
        isCompleted && "bg-[#EAE4DC] text-[#554C46] opacity-80",
        appointment.status === 'pending' && "bg-[#D8DCE2] text-[#222933] hover:brightness-[0.98]",
        appointment.status === 'cancelled' && "bg-[#F2D7D0] text-[#5C2317] line-through opacity-70",
        // Selected highlight
        isSelected
          ? "ring-2 ring-[#7F9E87] ring-offset-2 ring-offset-[#FDFBF7] shadow-md z-20 scale-[1.01]"
          : "z-10 hover:z-20"
      )}
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
        width: columnWidth ? `${columnWidth - 12}px` : '260px',
      }}
    >
      <div className="flex flex-col h-full justify-between overflow-hidden">
        {/* Row 1: Status with icon */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium leading-tight">
          {isInProgress ? (
            <>
              <PlayCircle className="w-3.5 h-3.5 stroke-[2] text-[#4A3810] animate-pulse" />
              <span>Сеанс идёт</span>
            </>
          ) : isConfirmed ? (
            <>
              <Shield className="w-3.5 h-3.5 stroke-[2] fill-none text-[#193C24]" />
              <span>Подтверждено</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2] text-[#554C46]" />
              <span>Завершено</span>
            </>
          ) : (
            <>
              <Hourglass className="w-3.5 h-3.5 stroke-[2] fill-none text-[#222933]" />
              <span>Ожидает</span>
            </>
          )}
        </div>

        {/* Row 2: Time and Name */}
        <div className="text-[13px] sm:text-[14px] font-medium leading-snug truncate mt-0.5">
          {appointment.startTime} - {appointment.endTime} • {clientDisplayName}
        </div>

        {/* Row 3: Service Name */}
        <div className="text-[11px] sm:text-[12px] opacity-90 truncate leading-snug">
          {appointment.serviceName}
        </div>
      </div>
    </div>
  );
}
