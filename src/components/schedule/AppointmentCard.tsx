import React from 'react';
import { Shield, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from './mockScheduleData';

interface AppointmentCardProps {
  appointment: Appointment;
  isSelected: boolean;
  onClick: () => void;
}

export function AppointmentCard({ appointment, isSelected, onClick }: AppointmentCardProps) {
  // Positioning logic: timeline starts at 08:00, with 60px per hour
  const timelineStartHour = 8;
  const pixelsPerHour = 60;

  const topPosition = (appointment.startHourDecimal - timelineStartHour) * pixelsPerHour;
  const height = (appointment.durationMinutes / 60) * pixelsPerHour;

  const isConfirmed = appointment.status === 'confirmed';
  const clientDisplayName = appointment.client.shortName || appointment.client.name;

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute left-0 w-[270px] rounded-[22px] px-4 py-3 cursor-pointer transition-all duration-200 select-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        // Status Colors matching reference Quiet Luxury palette
        isConfirmed
          ? "bg-[#BDDAC5] text-[#1A3623] hover:brightness-[0.98]"
          : "bg-[#CFD4DA] text-[#2D333B] hover:brightness-[0.98]",
        // Selected highlight
        isSelected
          ? "ring-2 ring-[#7F9E87] ring-offset-2 ring-offset-[#FDFBF7] shadow-md z-20 scale-[1.01]"
          : "z-10 hover:z-20"
      )}
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Row 1: Status with icon */}
        <div className="flex items-center gap-1.5 text-[13px] font-normal leading-tight">
          <span>{isConfirmed ? "Подтверждено" : "Ожидает подтверждения"}</span>
          {isConfirmed ? (
            <Shield className="w-3.5 h-3.5 stroke-[2] fill-none text-[#1A3623]" />
          ) : (
            <Hourglass className="w-3.5 h-3.5 stroke-[2] fill-none text-[#2D333B]" />
          )}
        </div>

        {/* Row 2: Time and Name */}
        <div className="text-[14px] font-normal leading-snug mt-1">
          {appointment.startTime} - {appointment.endTime} {clientDisplayName}
        </div>

        {/* Row 3: Service Name */}
        <div className="text-[13px] opacity-90 truncate leading-snug mt-0.5">
          {appointment.serviceName}
        </div>
      </div>
    </div>
  );
}
