'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { mockScheduleData } from '@/components/schedule/mockScheduleData';
import { Settings, Info } from 'lucide-react';
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
        {/* Top Status Bar (Integration requirement) */}
        <header className="h-16 border-b border-[#EAE3D9] bg-white flex items-center justify-between px-6 shrink-0">
          <h1 className="font-serif text-lg font-medium text-main">Календарь записей</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D9]">
              <div className="w-2 h-2 rounded-full bg-accent-terra" />
              <span className="text-xs font-medium text-main">Черновик (не опубликован)</span>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-main text-white hover:bg-[#3E352F] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Настройки бизнеса</span>
            </Link>
          </div>
        </header>

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
