"use client";

import { useState } from "react";
import { Search, ChevronDown, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_PLACES, MasterPlace } from "@/lib/mock-data";

const CATEGORIES = ["Маникюр", "Педикюр", "Брови", "Волосы", "Макияж"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-main">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-base/80 backdrop-blur-md border-b border-surface/50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-bold italic tracking-tight">R</span>
            <span className="font-bold text-sm tracking-widest uppercase mt-1 hidden sm:inline-block">Riva Beauty Platform</span>
          </div>

          {/* Search Bar & City */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="flex-1 flex items-center bg-[#F0EAE1] rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-muted mr-3" />
              <input
                type="text"
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted"
              />
            </div>
            <div className="flex items-center gap-1 cursor-pointer group shrink-0">
              <span className="text-sm font-medium">Анталья</span>
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-main transition-colors" />
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-1.5 rounded-full border border-accent-terra text-main text-sm font-medium transition-colors hover:bg-accent-terra/5"
            >
              Войти
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-1.5 rounded-full bg-surface text-main text-sm font-medium transition-colors hover:bg-accent-terra hover:text-white"
            >
              Личный кабинет
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 h-fit">
          {/* Categories */}
          <div className="bg-[#F0EAE1] rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-lg">Фильтры</h3>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent-terra text-white"
                      : "bg-[#FDFBF7] text-main hover:bg-[#C3D5C5]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Slider */}
          <div className="bg-[#F0EAE1] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Радиус</h3>
              <span className="text-sm text-muted">до 5 км</span>
            </div>
            <Slider defaultValue={[5]} max={20} step={1} />

            <div className="mt-6 flex items-start gap-3 cursor-pointer group">
              <Checkbox id="available-today" className="mt-0.5" />
              <label
                htmlFor="available-today"
                className="text-sm font-medium leading-tight cursor-pointer group-hover:text-accent-terra transition-colors select-none"
              >
                Только со свободными слотами сегодня
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-[#F0EAE1] rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-lg">Диапазон цен</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">От</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="0" />
              </div>
              <div className="w-3 h-[2px] bg-muted/30 rounded-full shrink-0" />
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">До</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="5000" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-sans text-main mb-2">Салоны и мастера поблизости</h1>
              <p className="text-muted text-sm">Салоны и частные мастера в Анталье</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="columns-1 md:columns-2 gap-6"
          >
            {MOCK_PLACES.map((place) => (
              <motion.div
                key={place.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[#FDFBF7] rounded-3xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(42,36,33,0.05)] border border-surface break-inside-avoid mb-6 w-full inline-block"
              >
                {/* Salon Image Header */}
                {place.type === "salon" && place.image && (
                  <div className="relative h-48 w-full">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-accent-terra transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Header / Meta */}
                  <div className="flex items-start gap-3 mb-3">
                    {place.type === "solo" && place.avatar && (
                      <img src={place.avatar} alt={place.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold leading-tight">{place.name}</h2>
                        {place.type === "solo" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted hover:text-accent-terra transition-colors ml-2"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-muted text-sm mb-1">{place.specialization}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-accent-terra text-accent-terra" />
                          <span>{place.rating}</span>
                          <span className="text-muted font-normal text-xs">({place.reviews})</span>
                        </div>
                        <div className="text-muted font-normal text-xs">• {place.distance} км</div>
                      </div>
                    </div>
                  </div>

                  {/* Price info for solo */}
                  {place.type === "solo" && place.priceStart && (
                    <div className="text-sm font-medium mb-3">
                      Маникюр с покрытием • <span className="text-muted">от {place.priceStart} TL</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div className="mt-1 mb-4">
                    <div className="text-sm font-medium mb-2">Свободны сегодня</div>
                    <div className="flex flex-wrap gap-2">
                      {place.slots.map((slot, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            slot.available
                              ? "bg-[#C3D5C5] text-main"
                              : "bg-[#EAE5DF] text-muted cursor-not-allowed"
                          }`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-surface flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {place.type === "salon" && place.deposit && (
                        <span className="text-sm font-medium">Депозит: {place.deposit} TL</span>
                      )}
                      {place.type === "solo" && place.tags?.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-md ${tag === "Депозит" ? "bg-accent-terra/20 text-accent-terra" : "bg-surface text-main"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-[#C59A87] text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow shrink-0"
                    >
                      Записаться
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}