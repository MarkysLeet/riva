"use client";

import { useState } from "react";
import { Search, ChevronDown, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_PLACES, MasterPlace } from "@/lib/mock-data";
import { AuthModal } from "@/components/auth-modal";

const CATEGORIES = ["Маникюр", "Педикюр", "Брови", "Волосы", "Макияж"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col font-sans bg-base text-main">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-base/80 backdrop-blur-md border-b border-surface/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-bold italic tracking-tight">R</span>
            <span className="font-bold text-sm tracking-widest uppercase mt-1 hidden sm:inline-block">Riva Beauty Platform</span>
          </div>

          {/* Search Bar & City */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-8">
            <div className="flex-1 flex items-center bg-[#EFEAE0] rounded-full px-4 py-2.5">
              <Search className="w-4 h-4 text-muted mr-3" />
              <input
                type="text"
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted"
              />
            </div>
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-sm font-medium">Анталья</span>
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-main transition-colors" />
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-full border border-accent-terra text-main text-sm font-medium transition-colors hover:bg-accent-terra/5"
            >
              Войти
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1.5 text-sm rounded-full bg-[#C59A87] text-white font-medium transition-colors hover:bg-[#b08876]"
            >
              Зарегистрироваться
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 bg-surface rounded-2xl p-6 flex flex-col gap-8 h-fit">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Категории</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent-terra text-white"
                      : "bg-[#FDFBF7] text-main hover:bg-accent-green/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Slider */}
          <div>
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
          <div>
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
              <h1 className="text-3xl font-serif mb-2">Найдено 124 варианта</h1>
              <p className="text-muted text-sm">Салоны и частные мастера в Анталье</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {MOCK_PLACES.map((place) => (
              <motion.div
                key={place.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[#FDFBF7] rounded-3xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(42,36,33,0.05)] border border-surface"
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

                <div className="p-6 flex flex-col flex-1">
                  {/* Header / Meta */}
                  <div className="flex items-start gap-4 mb-4">
                    {place.type === "solo" && place.avatar && (
                      <img src={place.avatar} alt={place.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold">{place.name}</h2>
                        {place.type === "solo" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted hover:text-accent-terra transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-muted text-sm mb-2">{place.specialization}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent-terra text-accent-terra" />
                          <span>{place.rating}</span>
                          <span className="text-muted font-normal">({place.reviews})</span>
                        </div>
                        <div className="text-muted font-normal">• {place.distance} км</div>
                      </div>
                    </div>
                  </div>

                  {/* Price info for solo */}
                  {place.type === "solo" && place.priceStart && (
                    <div className="text-sm font-medium mb-4">
                      Маникюр с покрытием • <span className="text-muted">от {place.priceStart} TL</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div className="mt-2 mb-6">
                    <div className="text-sm font-medium mb-3">Свободны сегодня</div>
                    <div className="flex gap-2">
                      {place.slots.map((slot, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            slot.available
                              ? "bg-accent-green text-main"
                              : "bg-surface text-muted cursor-not-allowed opacity-60"
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
                      className="px-6 py-2.5 bg-accent-terra text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}