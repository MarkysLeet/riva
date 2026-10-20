export type TimeSlot = {
  time: string;
  available: boolean;
  highlighted?: boolean;
};

export type PlaceType = "salon" | "solo";

export interface MasterPlace {
  id: string;
  type: PlaceType;
  name: string;
  specialization: string;
  description: string;
  rating: number;
  reviews: number;
  distance: number;
  slots: TimeSlot[];
  deposit?: number;
  primaryService?: {
    name: string;
    price: number;
    duration: number;
  };
  image?: string;
  avatar?: string;
}

export const MOCK_PLACES: MasterPlace[] = [
  {
    id: "1",
    type: "salon",
    name: "Riva Lounge",
    specialization: "Студия красоты",
    description: "Современный салон красоты с уютной атмосферой",
    rating: 4.9,
    reviews: 124,
    distance: 0.8,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    type: "salon",
    name: "Glow & Go",
    specialization: "Макияж и брови",
    description: "Стильный салон для быстрого и качественного ухода",
    rating: 4.8,
    reviews: 89,
    distance: 1.2,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    type: "solo",
    name: "Anna Smirnova",
    specialization: "Мастер маникюра",
    description: "Профессиональный маникюр и дизайн ногтей в уютной студии",
    rating: 4.9,
    reviews: 312,
    distance: 0.6,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
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
    type: "solo",
    name: "Evgeniy Volos",
    specialization: "Парикмахер-стилист",
    description: "Стрижки, окрашивание, укладки и уход за волосами",
    rating: 4.8,
    reviews: 45,
    distance: 1.0,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
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
