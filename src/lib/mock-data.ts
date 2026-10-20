export type TimeSlot = {
  time: string;
  available: boolean;
  highlighted?: boolean;
};

export type PlaceType = "salon" | "solo";

export interface MasterPlace {
  id: string;
  slug: string;
  type: PlaceType;
  name: string;
  specialization: string;
  description: string;
  rating: number;
  reviews: number;
  distance: number;
  badge?: string;
  slots: TimeSlot[];
  deposit?: number;
  primaryService?: {
    name: string;
    price: number;
    duration: number;
  };
  image?: string;
  avatar?: string;
  portfolio: string[];
}

export const MOCK_PLACES: MasterPlace[] = [
  {
    id: "1",
    slug: "riva-lounge",
    type: "salon",
    name: "Riva Lounge",
    specialization: "Студия красоты",
    description: "Современный салон красоты с авторским спа-уходом и атмосферой Quiet Luxury",
    rating: 4.9,
    reviews: 124,
    distance: 0.8,
    badge: "Выбор редакции",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    slots: [
      { time: "10:00", available: true },
      { time: "11:30", available: true },
      { time: "13:00", available: true, highlighted: true },
      { time: "14:30", available: true },
    ],
    deposit: 300,
  },
  {
    id: "2",
    slug: "glow-and-go",
    type: "salon",
    name: "Glow & Go",
    specialization: "Макияж и брови",
    description: "Стильный салон экспресс-ухода: натуральные брови, ламинирование и макияж",
    rating: 4.8,
    reviews: 89,
    distance: 1.2,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    slots: [
      { time: "09:30", available: true },
      { time: "11:00", available: true },
      { time: "12:30", available: true, highlighted: true },
      { time: "15:00", available: true },
    ],
    deposit: 250,
  },
  {
    id: "3",
    slug: "anna-smirnova",
    type: "solo",
    name: "Anna Smirnova",
    specialization: "Мастер маникюра",
    description: "Эстетичный японский маникюр, тонкое укрепление и чистый нюдовый дизайн",
    rating: 4.9,
    reviews: 312,
    distance: 0.6,
    badge: "Топ-мастер",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519014816548-bf785179c24b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    slots: [
      { time: "10:00", available: false },
      { time: "12:30", available: true },
      { time: "18:00", available: false },
    ],
    primaryService: {
      name: "Маникюр",
      price: 300,
      duration: 45,
    },
  },
  {
    id: "4",
    slug: "evgeniy-volos",
    type: "solo",
    name: "Evgeniy Volos",
    specialization: "Парикмахер-стилист",
    description: "Сложное окрашивание AirTouch, калифорнийский блонд и уход Tokio Inkarami",
    rating: 4.8,
    reviews: 45,
    distance: 1.0,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    slots: [
      { time: "09:00", available: false },
      { time: "14:00", available: false },
      { time: "19:00", available: true },
    ],
    primaryService: {
      name: "Окрашивание",
      price: 600,
      duration: 60,
    },
  },
];
