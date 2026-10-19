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

export interface Appointment {
  id: string;
  clientId: string;
  client: ClientProfile;
  serviceName: string;
  startTime: string;
  endTime: string;
  startHourDecimal: number;
  durationMinutes: number;
  specialistName: string;
  price: number;
  depositAmount: number;
  depositCurrency?: string;
  isDepositPaid: boolean;
  status: AppointmentStatus;
  pastVisits: PastVisit[];
}

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
];
