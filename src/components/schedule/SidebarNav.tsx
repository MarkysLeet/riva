import React from 'react';
import { Calendar, Users, Sparkles, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  return (
    <aside className={cn("w-[240px] bg-riva-sidebar border-r border-riva-border h-full flex flex-col", className)}>
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-riva-canvas border border-riva-border flex items-center justify-center font-serif text-lg font-bold text-riva-text-primary">
            R
          </div>
          <span className="tracking-widest text-sm font-semibold text-riva-text-primary">
            RIVA
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-riva-canvas text-riva-text-primary font-medium shadow-sm rounded-2xl relative">
          <div className="absolute left-0 w-1 h-5 bg-riva-status-actionPrimary rounded-full -ml-1" />
          <Calendar className="w-5 h-5" />
          <span>Календарь</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-riva-text-secondary hover:text-riva-text-primary hover:bg-riva-canvas/50 transition-all rounded-2xl">
          <Users className="w-5 h-5" />
          <span>Клиенты</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-riva-text-secondary hover:text-riva-text-primary hover:bg-riva-canvas/50 transition-all rounded-2xl">
          <Sparkles className="w-5 h-5" />
          <span>Услуги</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-riva-text-secondary hover:text-riva-text-primary hover:bg-riva-canvas/50 transition-all rounded-2xl">
          <Settings className="w-5 h-5" />
          <span>Настройки</span>
        </button>
      </nav>

      {/* Master Profile Section */}
      <div className="p-4 border-t border-riva-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=master" />
              <AvatarFallback>ЕВ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-riva-text-primary">Елена В.</span>
            </div>
          </div>
          <button className="p-2 text-riva-text-secondary hover:text-riva-text-primary transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
