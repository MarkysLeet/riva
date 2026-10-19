'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { mockScheduleData } from '@/components/schedule/mockScheduleData';

export default function DashboardPage() {
  // Default to apt-1 (matching the reference screen state)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('apt-1');

  const selectedAppointment = mockScheduleData.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden font-sans">
      {/* Desktop Left Sidebar */}
      <SidebarNav className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0 h-full overflow-hidden">
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
