'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();

  const isCalendar = pathname === '/dashboard';
  const isSettings = pathname === '/dashboard/settings';

  return (
    <aside
      className={cn(
        "w-[110px] bg-[#F5EFE6] border-r border-[#EAE3D9] h-full flex flex-col items-center py-6 select-none shrink-0",
        className
      )}
    >
      {/* Brand Monogram Crest */}
      <Link href="/dashboard" className="flex flex-col items-center mb-8 px-2 cursor-pointer">
        <svg
          viewBox="0 0 48 54"
          className="w-11 h-12 text-[#684C38] fill-current drop-shadow-sm mb-1"
          aria-label="Riva Crest"
        >
          {/* Stylized Luxury Floral Monogram R */}
          <path d="M12 8 C12 6, 15 4, 23 4 C33 4, 38 9, 38 17 C38 23, 34 27, 28 29 C34 32, 38 39, 41 49 C42 51, 41 52, 38 52 C35 52, 34 49, 31 42 C28 34, 24 30, 18 30 L18 48 C18 51, 16 52, 13 52 C11 52, 10 50, 11 46 L14 16 C14 12, 13 10, 12 8 Z M19 12 L17 24 C21 24, 28 24, 30 20 C31 16, 29 11, 23 11 C20 11, 19 11.5, 19 12 Z" />
          <path d="M8 12 C10 16, 10 24, 6 29 C5 30, 4 30, 4 28 C5 24, 7 18, 7 12 C7 8, 8 6, 8 12 Z" opacity="0.7" />
          <path d="M36 10 C39 7, 43 9, 44 14 C44 18, 41 21, 38 22 C37 20, 37 15, 36 10 Z" opacity="0.6" />
        </svg>
        <span className="font-serif tracking-[0.28em] text-[13px] font-semibold text-[#4A3D34] pl-1">
          RIVA
        </span>
      </Link>

      {/* Vertical Navigation Tabs */}
      <nav className="w-full flex-1 flex flex-col space-y-3">
        {/* 1. Календарь */}
        <Link
          href="/dashboard"
          className={cn(
            "w-full relative flex flex-col items-center justify-center py-3.5 px-1 transition-colors group cursor-pointer",
            isCalendar ? "bg-[#DFD5C6] text-[#28221D]" : "text-[#5E544C] hover:text-[#28221D] hover:bg-[#EAE2D5]/50"
          )}
        >
          {isCalendar && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B35E46]" />}
          <Calendar className="w-7 h-7 stroke-[1.4] mb-1" />
          <span className={cn("text-[13px]", isCalendar ? "font-medium" : "font-normal")}>
            Календарь
          </span>
        </Link>

        {/* 2. Клиенты */}
        <button
          type="button"
          className="w-full flex flex-col items-center justify-center py-3 px-1 text-[#5E544C] hover:text-[#28221D] hover:bg-[#EAE2D5]/50 transition-colors cursor-pointer"
        >
          <Users className="w-7 h-7 stroke-[1.4] text-[#5E544C] mb-1" />
          <span className="text-[13px] font-normal text-[#5E544C]">
            Клиенты
          </span>
        </button>

        {/* 3. Услуги (Crossed brushes / services) */}
        <button
          type="button"
          className="w-full flex flex-col items-center justify-center py-3 px-1 text-[#5E544C] hover:text-[#28221D] hover:bg-[#EAE2D5]/50 transition-colors cursor-pointer"
        >
          <svg
            className="w-7 h-7 stroke-[1.4] text-[#5E544C] mb-1 fill-none stroke-current"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 8.5 3 3L8 22H5v-3L15.5 8.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.5 5.5 1-1a2.12 2.12 0 0 0-3-3l-1 1 3 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 6.5 9 11.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.5 4-4" />
          </svg>
          <span className="text-[13px] font-normal text-[#5E544C]">
            Услуги
          </span>
        </button>

        {/* 4. Настройки */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "w-full relative flex flex-col items-center justify-center py-3.5 px-1 transition-colors group cursor-pointer",
            isSettings ? "bg-[#DFD5C6] text-[#28221D]" : "text-[#5E544C] hover:text-[#28221D] hover:bg-[#EAE2D5]/50"
          )}
        >
          {isSettings && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B35E46]" />}
          <Settings className="w-7 h-7 stroke-[1.4] mb-1" />
          <span className={cn("text-[13px]", isSettings ? "font-medium" : "font-normal")}>
            Настройки
          </span>
        </Link>
      </nav>
    </aside>
  );
}
