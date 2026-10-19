import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentCard } from './AppointmentCard';
import { mockScheduleData } from './mockScheduleData';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScheduleViewProps {
  selectedAppointmentId: string | null;
  onSelectAppointment: (id: string | null) => void;
  className?: string;
}

export function ScheduleView({ selectedAppointmentId, onSelectAppointment, className }: ScheduleViewProps) {
  const [currentTimeDecimal] = useState<number>(11.25); // Mock current time e.g. 11:15

  // Start at 08:00, end at 21:00. Total 14 hours.
  const timelineStartHour = 8;
  const timelineEndHour = 21;
  const hours = useMemo(() => {
    return Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, i) => timelineStartHour + i);
  }, []);

  const pixelsPerHour = 80;

  // Real-time indicator (mocked with an interval if needed, here just static for demo)
  const currentTimeTop = (currentTimeDecimal - timelineStartHour) * pixelsPerHour;

  const currentHourString = Math.floor(currentTimeDecimal).toString().padStart(2, '0');
  const currentMinuteString = Math.floor((currentTimeDecimal % 1) * 60).toString().padStart(2, '0');

  return (
    <div className={cn("flex flex-col h-full bg-riva-canvas flex-1", className)}>
      {/* Header Toolbar */}
      <header className="flex-none px-6 py-5 border-b border-riva-border bg-riva-canvas flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-riva-text-primary">Расписание</h1>
          <button className="p-2 text-riva-text-secondary hover:text-riva-text-primary rounded-xl hover:bg-riva-sidebar transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl border border-riva-border text-sm hover:bg-riva-sidebar text-riva-text-primary transition-colors">
            Сегодня
          </button>
          <div className="flex items-center gap-1 bg-riva-sidebar rounded-xl p-1 border border-riva-border">
            <button className="p-1 rounded-lg hover:bg-riva-canvas text-riva-text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2 text-riva-text-primary">
              Понедельник, 19 октября
            </span>
            <button className="p-1 rounded-lg hover:bg-riva-canvas text-riva-text-primary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Timeline Grid */}
      <ScrollArea className="flex-1">
        <div className="relative min-w-[600px] pb-12">

          {/* Time lines background */}
          <div className="mt-8 relative">
            {hours.map((hour) => (
              <div key={hour} className="relative h-20 border-b border-riva-borderLight flex items-start w-full group">
                <div className="w-16 flex-none text-right pr-4 transform -translate-y-2">
                  <span className="text-xs font-medium text-riva-text-secondary">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                {/* Half-hour dashed line */}
                <div className="absolute top-1/2 left-16 right-4 border-b border-dashed border-riva-borderLight/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}

            {/* Current Time Indicator */}
            {currentTimeDecimal >= timelineStartHour && currentTimeDecimal <= timelineEndHour && (
              <div
                className="absolute left-0 right-4 z-20 pointer-events-none flex items-center"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="w-16 flex-none text-right pr-2">
                  <div className="inline-block bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded text-center">
                    {currentHourString}:{currentMinuteString}
                  </div>
                </div>
                <div className="flex-1 border-t-2 border-amber-600/70 relative">
                  <div className="absolute left-0 top-[-4px] w-2 h-2 rounded-full bg-amber-600" />
                </div>
              </div>
            )}

            {/* Appointments Container */}
            <div className="absolute top-0 left-20 right-4 bottom-0">
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
      </ScrollArea>
    </div>
  );
}
