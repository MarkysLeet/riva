import React from 'react';
import { Calendar, X, MoreVertical, Phone, Heart, CheckCircle2, Star, StickyNote, Play, Ban } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Appointment } from './mockScheduleData';

interface AppointmentDetailsSidebarProps {
  appointment: Appointment | null;
  onClose: () => void;
  className?: string;
}

export function AppointmentDetailsSidebar({ appointment, onClose, className }: AppointmentDetailsSidebarProps) {
  if (!appointment) {
    return (
      <aside className={cn("w-[400px] bg-riva-surface border-l border-riva-border h-full flex flex-col items-center justify-center p-8", className)}>
        <div className="w-16 h-16 rounded-full bg-riva-canvas border border-riva-border flex items-center justify-center mb-6">
          <Calendar className="w-8 h-8 text-riva-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-riva-text-primary text-center mb-2">
          Выберите запись в расписании
        </h3>
        <p className="text-sm text-riva-text-secondary text-center">
          Нажмите на слот клиента, чтобы просмотреть контактные данные, историю визитов и заметки
        </p>
      </aside>
    );
  }

  const { client } = appointment;
  const isConfirmed = appointment.status === 'confirmed';

  return (
    <aside className={cn("w-[400px] bg-riva-surface border-l border-riva-border h-full flex flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-riva-canvas flex items-center justify-center text-riva-text-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-riva-canvas flex items-center justify-center text-riva-text-secondary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Client Info */}
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-14 h-14 border-2 border-riva-border mb-3">
              <AvatarImage src={client.avatarUrl} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-riva-text-primary mb-1">
              {client.name}
            </h2>
            <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-sm text-riva-text-secondary hover:text-riva-text-primary transition-colors mb-3">
              <Phone className="w-3.5 h-3.5" />
              {client.phone}
            </a>
            <span className={cn(
              "text-[11px] font-semibold px-2.5 py-1 rounded-full",
              isConfirmed
                ? "bg-riva-status-confirmed border border-riva-status-confirmedBorder text-riva-status-confirmedText"
                : "bg-riva-status-pending border border-riva-status-pendingBorder text-riva-status-pendingText"
            )}>
              {isConfirmed ? "Подтверждено 🛡️" : "Ожидает подтверждения ⏳"}
            </span>
          </div>

          {/* Loyalty Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-riva-canvas rounded-2xl border border-riva-border mb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-riva-status-dangerAction mb-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-bold text-riva-text-primary">{client.metrics.loyaltyRate}%</span>
              </div>
              <span className="text-[10px] text-riva-text-secondary uppercase tracking-wider">Лояльность</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-riva-border">
              <div className="flex items-center gap-1 text-riva-status-actionPrimary mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-sm font-bold text-riva-text-primary">{client.metrics.attendanceRate}%</span>
              </div>
              <span className="text-[10px] text-riva-text-secondary uppercase tracking-wider">Визиты</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-bold text-riva-text-primary">{client.metrics.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-riva-text-secondary uppercase tracking-wider">Рейтинг</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Appointment Details Card */}
            <div className="bg-white rounded-2xl p-4 border border-riva-border">
              <h4 className="text-sm font-semibold text-riva-text-primary mb-3">Данные записи</h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-riva-text-secondary">Услуга</span>
                  <span className="font-medium text-right ml-4">{appointment.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-riva-text-secondary">Время</span>
                  <span className="font-medium text-right">{appointment.startTime} – {appointment.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-riva-text-secondary">Специалист</span>
                  <span className="font-medium text-right">{appointment.specialistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-riva-text-secondary">Стоимость</span>
                  <span className="font-medium text-right">{appointment.price} ₽</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-riva-borderLight">
                  <span className="text-riva-text-secondary">Депозит</span>
                  {appointment.isDepositPaid ? (
                    <div className="flex items-center gap-1.5 text-riva-status-actionPrimary font-medium">
                      <div className="w-2 h-2 rounded-full bg-current" />
                      Внесён ({appointment.depositAmount} ₽)
                    </div>
                  ) : (
                    <span className="text-riva-text-secondary">Без депозита</span>
                  )}
                </div>
              </div>
            </div>

            {/* Past Visits Card */}
            <div className="bg-white rounded-2xl p-4 border border-riva-border">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-riva-text-primary">История посещений</h4>
                <span className="text-xs font-medium text-riva-text-secondary bg-riva-canvas px-2 py-0.5 rounded-full">
                  Всего: {client.totalVisits}
                </span>
              </div>
              {appointment.pastVisits.length > 0 ? (
                <div className="space-y-3">
                  {appointment.pastVisits.map(visit => (
                    <div key={visit.id} className="flex justify-between items-start text-sm pb-3 border-b border-riva-borderLight last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium text-riva-text-primary">{visit.serviceName}</div>
                        <div className="text-xs text-riva-text-secondary mt-0.5">{visit.date}</div>
                      </div>
                      <div className="font-medium">{visit.price} ₽</div>
                    </div>
                  ))}
                  <button className="w-full text-xs font-medium text-riva-status-actionPrimary hover:text-riva-status-actionHover pt-1">
                    Показать всю историю
                  </button>
                </div>
              ) : (
                <div className="text-sm text-riva-text-secondary italic text-center py-2">
                  Это первый визит клиента
                </div>
              )}
            </div>

            {/* Internal Notes Card */}
            <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200/50">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <StickyNote className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Внутренние заметки</h4>
              </div>
              <p className="text-sm text-amber-900/80 leading-relaxed">
                {client.notes || "Нет заметок"}
              </p>
              <button className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-2 underline decoration-amber-700/30 underline-offset-2">
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Action Bar */}
      <div className="p-4 border-t border-riva-border bg-riva-surface mt-auto space-y-2">
        <button className="w-full py-3.5 rounded-2xl font-semibold text-white bg-riva-status-actionPrimary hover:bg-riva-status-actionHover transition-colors shadow-sm flex items-center justify-center gap-2">
          <Play className="w-4 h-4 fill-current" />
          Начать сеанс
        </button>
        <button className="w-full py-3 rounded-2xl font-medium text-riva-status-dangerText bg-riva-status-dangerBg hover:bg-[#FCD7D0] transition-colors border border-riva-status-dangerText/20 flex items-center justify-center gap-2">
          <Ban className="w-4 h-4" />
          Отменить сеанс
        </button>
        <div className="text-center pt-1">
          <button className="text-xs font-medium text-riva-text-secondary hover:text-riva-text-primary transition-colors underline underline-offset-2 decoration-riva-text-secondary/30">
            Перенести запись
          </button>
        </div>
      </div>
    </aside>
  );
}
