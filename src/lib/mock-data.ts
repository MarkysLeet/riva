export type TimeSlot = {
  time: string;
  available: boolean;
};

export type PlaceType = "salon" | "solo";

export interface MasterPlace {
  id: string;
  type: PlaceType;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  distance: number;
  slots: TimeSlot[];
  deposit?: number;
  priceStart?: number;
  tags?: string[];
  image?: string;
  avatar?: string;
}

export const MOCK_PLACES: MasterPlace[] = [
  {
    id: "1",
    type: "salon",
    name: "Riva Lounge",
    specialization: "Студия красоты",
    rating: 4.9,
    reviews: 124,
    distance: 0.8,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slots: [
      { time: "14:00", available: true },
      { time: "15:30", available: false },
      { time: "17:00", available: true },
    ],
    deposit: 300,
  },
  {
    id: "2",
    type: "solo",
    name: "Анна Смирнова",
    specialization: "Топ-мастер маникюра",
    rating: 5.0,
    reviews: 312,
    distance: 1.2,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    slots: [
      { time: "10:00", available: false },
      { time: "12:30", available: true },
      { time: "18:00", available: false },
    ],
    priceStart: 1000,
    tags: ["Топ-мастер", "Депозит"],
  },
  {
    id: "3",
    type: "salon",
    name: "Glow & Go",
    specialization: "Макияж и брови",
    rating: 4.8,
    reviews: 89,
    distance: 2.5,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slots: [
      { time: "11:00", available: true },
      { time: "13:00", available: true },
      { time: "16:30", available: true },
    ],
    deposit: 200,
  },
  {
    id: "4",
    type: "solo",
    name: "Евгений Волос",
    specialization: "Стилист по волосам",
    rating: 4.7,
    reviews: 45,
    distance: 3.1,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    slots: [
      { time: "09:00", available: false },
      { time: "14:00", available: false },
      { time: "19:00", available: true },
    ],
    priceStart: 2500,
    tags: ["Сложные окрашивания"],
  },
];