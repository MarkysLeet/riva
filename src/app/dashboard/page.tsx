'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/schedule/SidebarNav';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { AppointmentDetailsSidebar } from '@/components/schedule/AppointmentDetailsSidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  mockScheduleData,
  mockWaitlistData,
  type Appointment,
  type AppointmentStatus,
  type WaitlistEntry,
} from '@/components/schedule/mockScheduleData';
import Link from 'next/link';
import { Calendar, UserPlus, Phone, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockScheduleData);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'schedule' | 'waitlist'>('schedule');

  // Waitlist state
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(mockWaitlistData);
  const [isAddWaitlistOpen, setIsAddWaitlistOpen] = useState(false);
  const [newWaitName, setNewWaitName] = useState('');
  const [newWaitPhone, setNewWaitPhone] = useState('');
  const [newWaitService, setNewWaitService] = useState('Маникюр с покрытием гель-лак');
  const [newWaitTime, setNewWaitTime] = useState('Вторая половина дня (после 14:00)');

  const selectedAppointment =
    appointments.find((apt) => apt.id === selectedAppointmentId) || null;

  // Status transitions
  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt))
    );
  };

  // Notes update
  const handleSaveNotes = (appointmentId: string, notes: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              client: {
                ...apt.client,
                notes,
              },
            }
          : apt
      )
    );
  };

  // Add new appointment from schedule grid
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [...prev, newApt]);
    setSelectedAppointmentId(newApt.id);
  };

  // Add to waitlist
  const handleAddWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaitName.trim()) return;

    const entry: WaitlistEntry = {
      id: `wait-${Date.now()}`,
      clientName: newWaitName,
      phone: newWaitPhone || '+7 (999) 000-00-00',
      desiredService: newWaitService,
      desiredTimeRange: newWaitTime,
      createdAt: 'Сегодня, только что',
      status: 'waiting',
    };

    setWaitlist((prev) => [entry, ...prev]);
    setNewWaitName('');
    setNewWaitPhone('');
    setIsAddWaitlistOpen(false);
  };

  const handleRemoveWaitlist = (id: string) => {
    setWaitlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF7F2] overflow-hidden font-sans">
      {/* 1. Left Icon Navigation Sidebar */}
      <SidebarNav />

      {/* 2. Main Center Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top View Selector Bar */}
        <div className="bg-[#FAF7F2] border-b border-[#EAE3D9] px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('schedule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'schedule'
                  ? 'bg-[#2A2421] text-white shadow-xs'
                  : 'bg-white text-[#5E544C] border border-[#EAE3D9] hover:text-[#2A2421]'
              }`}
            >
              Расписание
            </button>
            <button
              onClick={() => setCurrentView('waitlist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'waitlist'
                  ? 'bg-[#2A2421] text-white shadow-xs'
                  : 'bg-white text-[#5E544C] border border-[#EAE3D9] hover:text-[#2A2421]'
              }`}
            >
              <span>Лист ожидания</span>
              {waitlist.length > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  currentView === 'waitlist' ? 'bg-[#C59A87] text-white' : 'bg-[#EDE5D8] text-[#2A2421]'
                }`}>
                  {waitlist.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[#7A7571] hover:text-[#2A2421] transition-colors"
            >
              В каталог
            </Link>
          </div>
        </div>

        {/* View Switcher Container */}
        {currentView === 'schedule' ? (
          <div className="flex-1 flex overflow-hidden">
            <ScheduleView
              appointments={appointments}
              selectedAppointmentId={selectedAppointmentId}
              onSelectAppointment={setSelectedAppointmentId}
              onAddAppointment={handleAddAppointment}
            />

            {/* Desktop Sticky Right Sidebar */}
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
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#FAF7F2]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-[#2A2421]">
                    Лист ожидания (Waitlist)
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A7571] mt-0.5">
                    Клиенты, ожидающие освобождения удобного окна или отмены записей
                  </p>
                </div>
                <button
                  onClick={() => setIsAddWaitlistOpen(true)}
                  className="h-9 px-4 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Добавить клиента</span>
                </button>
              </div>

              {waitlist.length === 0 ? (
                <div className="bg-white border border-[#EAE3D9] rounded-2xl p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F4EFE6] text-[#7A7571] flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-base text-[#2A2421] mb-1">
                    Лист ожидания пуст
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A7571] max-w-sm mx-auto">
                    Когда у вас закончатся свободные слоты, добавляйте желающих сюда, чтобы быстро заполнять отмены.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {waitlist.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white border border-[#EAE3D9] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#C59A87] transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-medium text-base text-[#2A2421]">
                            {entry.clientName}
                          </h3>
                          <span className="text-[11px] font-medium bg-[#F4EFE6] text-[#2A2421] px-2 py-0.5 rounded-md">
                            {entry.createdAt}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs sm:text-sm text-[#5E544C] mb-4">
                          <p className="flex items-center gap-1.5 text-[#2A2421] font-medium">
                            <Phone className="w-3.5 h-3.5 text-[#7A7571]" />
                            <span>{entry.phone}</span>
                          </p>
                          <p>
                            <span className="text-[#7A7571]">Услуга:</span> {entry.desiredService}
                          </p>
                          <p>
                            <span className="text-[#7A7571]">Желаемое время:</span> {entry.desiredTimeRange}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F0ECE4]">
                        <button
                          onClick={() => {
                            setCurrentView('schedule');
                            alert(`Выберите подходящий свободный слот в расписании для ${entry.clientName}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#2A2421] hover:bg-[#C59A87] text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Назначить окно
                        </button>
                        <button
                          onClick={() => handleRemoveWaitlist(entry.id)}
                          className="p-1.5 text-[#7A7571] hover:text-[#5C2317] transition-colors cursor-pointer"
                          title="Удалить из листа"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <SheetTitle className="sr-only">Детали записи</SheetTitle>
            <AppointmentDetailsSidebar
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointmentId(null)}
              onStatusChange={handleStatusChange}
              onSaveNotes={handleSaveNotes}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Add Client to Waitlist Modal */}
      {isAddWaitlistOpen && (
        <div className="fixed inset-0 z-50 bg-[#2A2421]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-[28px] max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9] mb-4">
              <h3 className="font-serif text-lg font-medium text-[#2A2421] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C59A87]" />
                <span>Добавить в лист ожидания</span>
              </h3>
              <button
                onClick={() => setIsAddWaitlistOpen(false)}
                className="text-[#7A7571] hover:text-[#2A2421] text-xs font-medium cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            <form onSubmit={handleAddWaitlist} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#5E544C] mb-1">
                  Имя клиента *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Мария Иванова"
                  value={newWaitName}
                  onChange={(e) => setNewWaitName(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E544C] mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 123-45-67"
                  value={newWaitPhone}
                  onChange={(e) => setNewWaitPhone(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] placeholder-[#827771] focus:outline-none focus:border-[#C59A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E544C] mb-1">
                  Желаемая услуга
                </label>
                <input
                  type="text"
                  value={newWaitService}
                  onChange={(e) => setNewWaitService(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5E544C] mb-1">
                  Желаемое время / дни
                </label>
                <input
                  type="text"
                  value={newWaitTime}
                  onChange={(e) => setNewWaitTime(e.target.value)}
                  placeholder="Любое время в пятницу или субботу"
                  className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3 py-2 text-sm text-[#2A2421] focus:outline-none focus:border-[#C59A87]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2A2421] hover:bg-[#C59A87] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
                >
                  Внести в лист ожидания
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
