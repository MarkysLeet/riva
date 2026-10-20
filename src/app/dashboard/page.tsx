'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { mockScheduleData } from '@/components/schedule/mockScheduleData';
import Link from 'next/link';

export default function DashboardPage() {
  // Default to apt-1 (matching the reference screen state)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('apt-1');

  const selectedAppointment = mockScheduleData.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden font-sans">
      {/* Desktop Left Sidebar */}
      <SidebarNav className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Unobtrusive Setup Mode Notification Banner (Quiet Luxury) */}
        <div className="bg-[#F8F4EE] border-b border-[#EAE3D9] px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#7A7571]">
            <span className="w-2 h-2 rounded-full bg-[#C59A87] shrink-0" />
            <span>Бизнес находится в режиме настройки и пока не виден клиентам в каталоге.</span>
          </div>
          <Link
            href="/dashboard/settings"
            className="font-medium text-[#2A2421] hover:text-[#C59A87] transition-colors inline-flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
          >
            <span>Настройки бизнеса</span>
            <span>→</span>
          </Link>
        </div>

        <div className="flex-1 flex min-h-0">
          <ScheduleView
            selectedAppointmentId={selectedAppointmentId}
            onSelectAppointment={setSelectedAppointmentId}
          />

          {/* Desktop Right Sidebar (Selected Appointment Context Panel) */}
          <div className="hidden xl:block h-full">
            <AppointmentDetailsSidebar
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointmentId(null)}
            />
          </div>
        </div>

        {/* Mobile / Tablet Bottom Sheet for Details */}
        <Sheet
          open={!!selectedAppointmentId && (typeof window !== 'undefined' ? window.innerWidth < 1280 : false)}
          onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
        >
          <SheetContent side="bottom" className="h-[85vh] p-0 sm:max-w-none xl:hidden rounded-t-[32px] overflow-hidden bg-[#EFE6DA] border-none">
            <AppointmentDetailsSidebar
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointmentId(null)}
              className="w-full rounded-none shadow-none"
            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}
