"use client";

import { useState } from "react";
import { Search, ChevronDown, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_PLACES } from "@/lib/mock-data";
import { AuthModal } from "@/components/auth-modal";
import { LoginModal } from "@/components/login-modal";

const CATEGORIES = ["Маникюр", "Педикюр", "Брови", "Волосы", "Макияж"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
        <div className="max-w-[1200px] w-full mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-bold italic tracking-tight">R</span>
            <span className="font-bold text-sm tracking-widest uppercase mt-1 hidden sm:inline-block">Riva Beauty Platform</span>
          </div>

          {/* Search Bar & City */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center mx-8">
            <div className="max-w-md w-full flex items-center bg-[#F0EAE1] h-10 rounded-full px-4">
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
              onClick={() => setIsLoginModalOpen(true)}
              className="h-10 px-5 text-sm font-medium rounded-full inline-flex items-center justify-center transition-colors cursor-pointer border border-[#C59A87] text-[#2A2421] bg-transparent hover:bg-[#F4EFE6]"
            >
              Войти
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="h-10 px-5 text-sm font-medium rounded-full inline-flex items-center justify-center transition-colors cursor-pointer bg-[#C59A87] text-white border border-transparent hover:bg-[#b58976]"
            >
              Зарегистрироваться
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5 h-fit sticky top-28">
          {/* Filters */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-lg">Фильтры</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#C59A87] text-white"
                      : "bg-[#FDFBF7] text-main hover:bg-[#C59A87]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Slider */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Радиус</h3>
              <span className="text-sm text-muted">до 5 км</span>
            </div>
            <Slider defaultValue={[5]} max={20} step={1} />

            <div className="mt-6 flex items-start gap-3 cursor-pointer group">
              <Checkbox id="available-today" className="mt-0.5 border-[#827771]/50 bg-[#FDFBF7] rounded-md data-[state=checked]:bg-[#C59A87] data-[state=checked]:border-[#C59A87]" />
              <label
                htmlFor="available-today"
                className="text-sm font-medium leading-tight cursor-pointer group-hover:text-accent-terra transition-colors select-none"
              >
                Только со свободными слотами сегодня
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
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
              <h1 className="font-sans text-3xl font-bold text-[#2A2421] tracking-tight mb-1">Салоны и мастера поблизости</h1>
              <p className="text-sm text-[#827771] mt-1">Салоны и частные мастера в Анталье</p>
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
                className="bg-[#FDFBF7] rounded-3xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(42,36,33,0.05)] border border-surface break-inside-avoid mb-6"
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

                <div className="p-5 flex flex-col gap-4">
                  {/* Header / Meta */}
                  <div className="flex items-start gap-4">
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
                    <div className="text-sm font-medium">
                      Маникюр с покрытием • <span className="text-muted">от {place.priceStart} TL</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div>
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
                  <div className="pt-3 border-t border-[#EFEAE0] flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {place.type === "salon" && place.deposit && (
                        <span className="text-sm font-medium">Депозит: {place.deposit} TL</span>
                      )}
                      {place.type === "solo" && place.tags?.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-md ${tag === "Депозит" ? "bg-[#C59A87]/20 text-[#C59A87]" : "bg-[#F4EFE6] text-[#2A2421]"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 px-5 rounded-full bg-[#C59A87] text-white text-sm font-medium inline-flex items-center justify-center"
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}