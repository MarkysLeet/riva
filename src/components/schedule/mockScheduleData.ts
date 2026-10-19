export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  metrics: {
    loyaltyRate: number;      // e.g. 100 (%)
    attendanceRate: number;   // e.g. 100 (%)
    rating: number;           // e.g. 5.0 или 100 (%)
  };
  notes: string;              // Внутренние пометки мастера
  totalVisits: number;
}

export interface PastVisit {
  id: string;
  date: string;               // e.g. "12 октября 2026"
  serviceName: string;
  price: number;
  status: 'completed' | 'cancelled';
}

export interface Appointment {
  id: string;
  clientId: string;
  client: ClientProfile;
  serviceName: string;
  startTime: string;          // e.g. "10:00"
  endTime: string;            // e.g. "11:30"
  startHourDecimal: number;   // e.g. 10.0 для позиционирования
  durationMinutes: number;    // e.g. 90
  specialistName: string;
  price: number;
  depositAmount: number;
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
      phone: '+7 (999) 123-45-67',
      avatarUrl: 'https://i.pravatar.cc/150?u=anna',
      metrics: {
        loyaltyRate: 100,
        attendanceRate: 100,
        rating: 5.0,
      },
      notes: 'Предпочитает кофе без сахара, чувствительная кожа головы, формула тонирования: 9.12 + 1.5%',
      totalVisits: 12,
    },
    serviceName: 'Сложное окрашивание AirTouch',
    startTime: '10:00',
    endTime: '11:30',
    startHourDecimal: 10.0,
    durationMinutes: 90,
    specialistName: 'Елена В.',
    price: 5500,
    depositAmount: 1000,
    isDepositPaid: true,
    status: 'confirmed',
    pastVisits: [
      {
        id: 'pv-1',
        date: '12 сентября 2024',
        serviceName: 'Стрижка женская',
        price: 2500,
        status: 'completed',
      },
      {
        id: 'pv-2',
        date: '05 августа 2024',
        serviceName: 'Укладка',
        price: 1500,
        status: 'completed',
      }
    ],
  },
  {
    id: 'apt-2',
    clientId: 'cli-2',
    client: {
      id: 'cli-2',
      name: 'Мария Иванова',
      phone: '+7 (900) 765-43-21',
      metrics: {
        loyaltyRate: 80,
        attendanceRate: 90,
        rating: 4.8,
      },
      notes: 'Аллергия на определенные компоненты шампуня, уточнить перед началом.',
      totalVisits: 5,
    },
    serviceName: 'Стрижка и укладка',
    startTime: '13:00',
    endTime: '14:00',
    startHourDecimal: 13.0,
    durationMinutes: 60,
    specialistName: 'Елена В.',
    price: 3500,
    depositAmount: 500,
    isDepositPaid: false,
    status: 'pending',
    pastVisits: [
      {
        id: 'pv-3',
        date: '20 августа 2024',
        serviceName: 'Стрижка',
        price: 3000,
        status: 'completed',
      }
    ],
  },
  {
    id: 'apt-3',
    clientId: 'cli-3',
    client: {
      id: 'cli-3',
      name: 'Ольга Петрова',
      phone: '+7 (911) 222-33-44',
      avatarUrl: 'https://i.pravatar.cc/150?u=olga',
      metrics: {
        loyaltyRate: 100,
        attendanceRate: 100,
        rating: 5.0,
      },
      notes: 'Любит поговорить во время процесса.',
      totalVisits: 20,
    },
    serviceName: 'Маникюр с покрытием гель-лак',
    startTime: '15:30',
    endTime: '17:30',
    startHourDecimal: 15.5,
    durationMinutes: 120,
    specialistName: 'Елена В.',
    price: 2800,
    depositAmount: 500,
    isDepositPaid: true,
    status: 'confirmed',
    pastVisits: [],
  },
];
