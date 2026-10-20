'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  mockScheduleData,
  mockWaitlistData,
  type Appointment,
  type AppointmentStatus,
  type WaitlistEntry,
} from '@/components/schedule/mockScheduleData';
import Link from 'next/link';
import { Calendar, UserPlus, Phone, Clock, Sparkles, Check, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockScheduleData);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(mockWaitlistData);
  const [activeTab, setActiveTab] = useState<'calendar' | 'waitlist'>('calendar');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('apt-1');

  // New waitlist modal state
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [wlName, setWlName] = useState('');
  const [wlPhone, setWlPhone] = useState('');
  const [wlService, setWlService] = useState('Маникюр с покрытием');
  const [wlTime, setWlTime] = useState('Сегодня после 15:00');

  const selectedAppointment =
    appointments.find((a) => a.id === selectedAppointmentId) || null;

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleSaveNotes = (appointmentId: string, notes: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, client: { ...apt.client, notes } }
          : apt
      )
    );
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [...prev, newApt]);
    setSelectedAppointmentId(newApt.id);
  };

  const handleAddWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName.trim()) return;

    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      clientName: wlName,
      phone: wlPhone || '+7 (999) 000-00-00',
      serviceName: wlService,
      preferredMaster: 'Любой мастер',
      desiredTime: wlTime,
      createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setWaitlist((prev) => [newEntry, ...prev]);
    setIsWaitlistModalOpen(false);
    setWlName('');
    setWlPhone('');
  };

  const handleRemoveWaitlist = (id: string) => {
    setWaitlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden font-sans text-[#2A2421]">
      {/* Desktop Left Sidebar */}
      <SidebarNav className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Unobtrusive Setup Mode Notification Banner (Quiet Luxury) */}
        <div className="bg-[#F8F4EE] border-b border-[#EAE3D9] px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#5E544C]">
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

        {/* View Mode Switcher (Расписание / Лист ожидания) */}
        <div className="bg-[#FAF7F2] px-4 sm:px-8 pt-3 pb-1 flex items-center justify-between gap-3 border-b border-[#EAE3D9]/60 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-[#2A2421] text-white shadow-xs'
                  : 'bg-[#EDE5D8] text-[#5E544C] hover:text-[#2A2421]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2]" />
              <span>Расписание</span>
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'waitlist'
                  ? 'bg-[#2A2421] text-white shadow-xs'
                  : 'bg-[#EDE5D8] text-[#5E544C] hover:text-[#2A2421]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2]" />
              <span>Лист ожидания ({waitlist.length})</span>
            </button>
          </div>

          {activeTab === 'waitlist' && (
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#C59A87] hover:bg-[#B58976] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              + Добавить в лист
            </button>
          )}
        </div>

        {/* Dynamic View Container */}
        {activeTab === 'calendar' ? (
          <div className="flex-1 flex min-h-0">
            <ScheduleView
              appointments={appointments}
              selectedAppointmentId={selectedAppointmentId}
              onSelectAppointment={setSelectedAppointmentId}
              onAddAppointment={handleAddAppointment}
            />

            {/* Desktop Right Sidebar (Selected Appointment Context Panel) */}
            <div className="hidden xl:block h-full">
              <AppointmentDetailsSidebar
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointmentId(null)}
                onStatusChange={handleStatusChange}
                onSaveNotes={handleSaveNotes}
              />
            </div>
          </div>
        ) : (
          /* WAITLIST VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-medium text-[#2A2421] mb-1">
                  Лист ожидания клиентов
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7571]">
                  Клиенты, желающие попасть на процедуру при освобождении слота или отмене
                </p>
              </div>

              {waitlist.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-[#EAE3D9] text-center">
                  <p className="text-sm text-[#7A7571]">
                    В листе ожидания пока нет клиентов
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {waitlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#EAE3D9] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#C59A87] transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-base text-[#2A2421]">
                            {item.clientName}
                          </h3>
                          <span className="text-[11px] font-normal text-[#7A7571] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EAE3D9]">
                            {item.createdAt}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs text-[#5E544C] mb-4">
                          <p className="flex items-center gap-1.5">
                            <span className="text-[#7A7571]">Услуга:</span> {item.serviceName}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="text-[#7A7571]">Желаемое время:</span> {item.desiredTime}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-[#C59A87]" />
                            <span>{item.phone}</span>
                          </p>
                          {item.notes && (
                            <p className="text-xs text-[#7A7571] italic mt-1 bg-[#FAF7F2] p-2 rounded-xl border border-[#EAE3D9]/60">
                              «{item.notes}»
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F0ECE4]">
                        <button
                          onClick={() => {
                            // Quick transfer from waitlist to appointment modal
                            setActiveTab('calendar');
                          }}
                          className="h-8 px-3 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Назначить окно
                        </button>
                        <button
                          onClick={() => handleRemoveWaitlist(item.id)}
                          className="p-1.5 text-[#7A7571] hover:text-[#C67A60] transition-colors cursor-pointer"
                          title="Удалить из листа"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile / Tablet Bottom Sheet for Details */}
        <Sheet
          open={!!selectedAppointmentId && (typeof window !== 'undefined' ? window.innerWidth < 1280 : false)}
          onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
        >
          <SheetContent side="bottom" className="h-[85vh] p-0 sm:max-w-none xl:hidden rounded-t-[32px] overflow-hidden bg-[#EFE6DA] border-none">
            <AppointmentDetailsSidebar
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointmentId(null)}
              onStatusChange={handleStatusChange}
              onSaveNotes={handleSaveNotes}
              className="w-full rounded-none shadow-none"
            />
          </SheetContent>
        </Sheet>

        {/* Quick Add to Waitlist Modal */}
        {isWaitlistModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#2A2421]/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-[28px] max-w-md w-full p-6 shadow-xl">
              <h3 className="font-serif text-lg font-medium text-[#2A2421] mb-4">
                Добавить в лист ожидания
              </h3>
              <form onSubmit={handleAddWaitlist} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#5E544C] mb-1">
                    Имя клиента *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Виктория"
                    value={wlName}
                    onChange={(e) => setWlName(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E544C] mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={wlPhone}
                    onChange={(e) => setWlPhone(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E544C] mb-1">
                    Услуга
                  </label>
                  <input
                    type="text"
                    value={wlService}
                    onChange={(e) => setWlService(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5E544C] mb-1">
                    Желаемое время / окно
                  </label>
                  <input
                    type="text"
                    value={wlTime}
                    onChange={(e) => setWlTime(e.target.value)}
                    className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsWaitlistModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#5E544C] hover:text-[#2A2421] cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
