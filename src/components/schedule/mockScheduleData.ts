export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ClientProfile {
  id: string;
  name: string;
  shortName?: string;
  phone: string;
  avatarUrl?: string;
  metrics: {
    loyaltyRate: number;      // 100 (%)
    attendanceRate: number;   // 100 (%)
    rating: number;           // 100 (%)
  };
  notes: string;
  totalVisits: number;
}

export interface PastVisit {
  id: string;
  date: string;
  serviceName: string;
  price?: number;
  status: 'completed' | 'cancelled';
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  client: ClientProfile;
  serviceName: string;
  startTime: string;
  endTime: string;
  startHourDecimal: number;
  durationMinutes: number;
  specialistId: string;
  specialistName: string;
  price: number;
  depositAmount: number;
  depositCurrency?: string;
  isDepositPaid: boolean;
  status: AppointmentStatus;
  pastVisits: PastVisit[];
}

export interface WaitlistEntry {
  id: string;
  clientName: string;
  phone: string;
  serviceName: string;
  preferredMaster?: string;
  desiredTime: string;
  notes?: string;
  createdAt: string;
}

export const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Екатерина',
    role: 'Ведущий топ-мастер',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'spec-2',
    name: 'Алина',
    role: 'Мастер ногтевого сервиса',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'spec-3',
    name: 'Дарья',
    role: 'Стилист-колорист',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  }
];

export const mockScheduleData: Appointment[] = [
  {
    id: 'apt-1',
    clientId: 'cli-1',
    client: {
      id: 'cli-1',
      name: 'Анна Грозан',
      shortName: 'Анна Г.',
      phone: '+7 (999) 123-45-67',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      metrics: {
        loyaltyRate: 100,
        attendanceRate: 100,
        rating: 100,
      },
      notes: 'Аллергия на латекс. Не любит много разговаривать, есть собака.',
      totalVisits: 12,
    },
    serviceName: 'Маникюр с покрытием',
    startTime: '08:00',
    endTime: '10:00',
    startHourDecimal: 8.0,
    durationMinutes: 120,
    specialistId: 'spec-1',
    specialistName: 'Екатерина',
    price: 3000,
    depositAmount: 300,
    depositCurrency: 'TL',
    isDepositPaid: true,
    status: 'confirmed',
    pastVisits: [
      {
        id: 'pv-1',
        date: '16.09.2026',
        serviceName: 'Маникюр с покрытием',
        status: 'completed',
      },
      {
        id: 'pv-2',
        date: '19.07.2026',
        serviceName: 'Маникюр с покрытием',
        status: 'completed',
      }
    ],
  },
  {
    id: 'apt-2',
    clientId: 'cli-2',
    client: {
      id: 'cli-2',
      name: 'Мария Семенова',
      shortName: 'Мария С.',
      phone: '+7 (900) 765-43-21',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      metrics: {
        loyaltyRate: 100,
        attendanceRate: 100,
        rating: 100,
      },
      notes: 'Чувствительная кожа бровей. Предпочитает естественную форму.',
      totalVisits: 4,
    },
    serviceName: 'Коррекция бровей',
    startTime: '14:00',
    endTime: '16:00',
    startHourDecimal: 14.0,
    durationMinutes: 120,
    specialistId: 'spec-1',
    specialistName: 'Екатерина',
    price: 1500,
    depositAmount: 200,
    depositCurrency: 'TL',
    isDepositPaid: false,
    status: 'pending',
    pastVisits: [
      {
        id: 'pv-3',
        date: '20.08.2026',
        serviceName: 'Коррекция бровей',
        status: 'completed',
      }
    ],
  },
  {
    id: 'apt-3',
    clientId: 'cli-3',
    client: {
      id: 'cli-3',
      name: 'София Лебедева',
      shortName: 'София Л.',
      phone: '+7 (912) 345-67-89',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      metrics: {
        loyaltyRate: 95,
        attendanceRate: 100,
        rating: 98,
      },
      notes: 'Любит кофе с овсяным молоком. Предпочитает нюдовые оттенки Luxio.',
      totalVisits: 8,
    },
    serviceName: 'Японский эко-маникюр',
    startTime: '10:30',
    endTime: '12:00',
    startHourDecimal: 10.5,
    durationMinutes: 90,
    specialistId: 'spec-2',
    specialistName: 'Алина',
    price: 1800,
    depositAmount: 200,
    depositCurrency: 'TL',
    isDepositPaid: true,
    status: 'confirmed',
    pastVisits: [],
  },
  {
    id: 'apt-4',
    clientId: 'cli-4',
    client: {
      id: 'cli-4',
      name: 'Елена Васильева',
      shortName: 'Елена В.',
      phone: '+7 (921) 987-65-43',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      metrics: {
        loyaltyRate: 90,
        attendanceRate: 90,
        rating: 95,
      },
      notes: 'Тонкие волосы, требуется деликатная термозащита при укладке.',
      totalVisits: 3,
    },
    serviceName: 'Стрижка и салонная укладка',
    startTime: '12:00',
    endTime: '13:30',
    startHourDecimal: 12.0,
    durationMinutes: 90,
    specialistId: 'spec-3',
    specialistName: 'Дарья',
    price: 2500,
    depositAmount: 300,
    depositCurrency: 'TL',
    isDepositPaid: true,
    status: 'confirmed',
    pastVisits: [],
  }
];

export const mockWaitlistData: WaitlistEntry[] = [
  {
    id: 'wl-1',
    clientName: 'Анастасия Попова',
    phone: '+7 (995) 432-10-98',
    serviceName: 'Маникюр с покрытием гель-лак',
    preferredMaster: 'Екатерина',
    desiredTime: 'Сегодня, после 16:00',
    notes: 'Срочно, уезжает в отпуск',
    createdAt: '11:20'
  },
  {
    id: 'wl-2',
    clientName: 'Виктория Соколова',
    phone: '+7 (918) 777-88-99',
    serviceName: 'Архитектура и окрашивание бровей',
    preferredMaster: 'Любой мастер',
    desiredTime: 'Сегодня в течение дня',
    notes: 'Может подойти за 20 минут',
    createdAt: '12:45'
  }
];
