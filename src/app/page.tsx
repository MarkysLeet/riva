"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const RegistrationModal = dynamic(() => import("@/components/RegistrationModal").then(m => m.RegistrationModal), { ssr: false });

// Mock data for salons and masters
const MOCK_PLACES = [
  {
    id: 1,
    name: "Beauty Lounge",
    slug: "beauty-lounge",
    type: "salon",
    address: "Улица Ленина, 15",
  },
  {
    id: 2,
    name: "Anna Nails",
    slug: "anna-nails",
    type: "solo",
    address: "ТЦ Галерея, 3 этаж",
  },
  {
    id: 3,
    name: "Glow Studio",
    slug: "glow-studio",
    type: "salon",
    address: "Проспект Мира, 42",
  },
  {
    id: 4,
    name: "Mikhail Hair",
    slug: "mikhail-hair",
    type: "solo",
    address: "БЦ Высота, офис 12",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center pt-20 pb-20 px-4">
      {/* Hero Section */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Найди своего идеального мастера
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Riva — это удобная платформа для поиска и онлайн-записи в лучшие салоны красоты и к частным мастерам.
        </p>
        <div className="flex gap-4 mt-4">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            Зарегистрировать бизнес
          </Button>
          <Link href="#explore">
            <Button size="lg" variant="outline">
              Найти мастера
            </Button>
          </Link>
        </div>
      </div>

      {/* Directory Section */}
      <div id="explore" className="w-full max-w-5xl mt-12 flex flex-col gap-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Популярные салоны и мастера
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PLACES.map((place) => (
            <Link
              key={place.id}
              href={`/${place.slug}`}
              className="group flex flex-col p-6 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                  {place.name}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
                  {place.type === "salon" ? "Салон" : "Мастер"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-auto">
                {place.address}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
