'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { mockScheduleData } from '@/components/schedule/mockScheduleData';

export default function DashboardPage() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const selectedAppointment = mockScheduleData.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="flex h-screen bg-riva-canvas overflow-hidden font-sans">
      {/* Desktop Left Sidebar */}
      <SidebarNav className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0">
        <ScheduleView
          selectedAppointmentId={selectedAppointmentId}
          onSelectAppointment={setSelectedAppointmentId}
        />

        {/* Desktop Right Sidebar (Context Panel) */}
        <div className="hidden xl:block">
          <AppointmentDetailsSidebar
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointmentId(null)}
          />
        </div>

        {/* Mobile / Tablet Bottom Sheet for Details */}
        <Sheet open={!!selectedAppointmentId && window.innerWidth < 1280} onOpenChange={(open) => !open && setSelectedAppointmentId(null)}>
          <SheetContent side="bottom" className="h-[85vh] p-0 sm:max-w-none xl:hidden rounded-t-3xl overflow-hidden">
            <AppointmentDetailsSidebar
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointmentId(null)}
              className="w-full border-l-0"
            />
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}
