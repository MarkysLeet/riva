"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  ChevronDown,
  Star,
  Heart,
  SlidersHorizontal,
  X,
  CreditCard,
  MapPin,
  LogOut,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { MOCK_PLACES } from "@/lib/mock-data";
import { AuthModal } from "@/components/auth-modal";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ALL_CATEGORIES = ["Маникюр", "Педикюр", "Брови", "Волосы", "Макияж"];

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Маникюр",
    "Педикюр",
  ]);
  const [radius, setRadius] = useState<number>(5);
  const [priceMin, setPriceMin] = useState<number>(200);
  const [priceMax, setPriceMax] = useState<number>(1500);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 320, damping: 26 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-base text-main">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-base/90 backdrop-blur-md border-b border-[#EAE3D9]">
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo with botanical monogram */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-[#C59A87]"
                  viewBox="0 0 36 36"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 28C14 20 20 14 28 8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 22C12 20 10 16 12 13C14 13 18 16 18 19"
                    strokeWidth="1.2"
                    fill="currentColor"
                    fillOpacity="0.25"
                  />
                  <path
                    d="M20 17C18 14 18 10 21 8C23 9 25 13 23 15"
                    strokeWidth="1.2"
                    fill="currentColor"
                    fillOpacity="0.25"
                  />
                  <path
                    d="M23 13C23 10 25 7 28 6C29 8 29 11 27 12"
                    strokeWidth="1.2"
                    fill="currentColor"
                    fillOpacity="0.25"
                  />
                </svg>
                <span className="font-serif text-3xl font-bold tracking-tight text-main -ml-5">
                  R
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-[0.25em] text-main leading-none">
                  R I V A
                </span>
                <span className="text-[9px] font-sans tracking-[0.2em] text-[#827771] uppercase font-semibold mt-1">
                  BEAUTY PLATFORM
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar & City (Desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center max-w-xl mx-8">
            <div className="w-full flex items-center bg-[#F4EFE6]/70 border border-[#EAE3D9] h-11 rounded-2xl px-4 focus-within:border-[#C59A87] transition-colors">
              <Search className="w-4 h-4 text-[#827771] mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm text-main placeholder:text-[#827771]"
              />
              <div className="h-5 w-[1px] bg-[#EAE3D9] mx-3 shrink-0" />
              <div className="flex items-center gap-1.5 cursor-pointer group shrink-0 text-main hover:text-[#C59A87] transition-colors">
                <MapPin className="w-4 h-4 text-[#827771] group-hover:text-[#C59A87] transition-colors" />
                <span className="text-sm font-medium">Анталья</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#827771]" />
              </div>
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden sm:block">
                  <button className="h-10 px-5 text-sm font-medium rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer bg-[#C59A87] text-white hover:bg-[#B58976] shadow-xs">
                    Личный кабинет
                  </button>
                </Link>
                <Link href="/profile">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-[#EAE3D9] cursor-pointer hover:border-[#C59A87] transition-colors">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-[#F4EFE6] text-main text-xs sm:text-sm font-medium">
                      {(
                        user.user_metadata?.name?.[0] ||
                        user.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    if (supabase) {
                      await supabase.auth.signOut();
                    }
                  }}
                  className="text-[#827771] hover:text-main transition-colors p-2"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthTab("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="h-10 px-5 text-sm font-medium rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer border border-[#EAE3D9] text-main bg-white hover:bg-[#F4EFE6] shadow-xs"
                >
                  Войти
                </button>
                <button
                  onClick={() => {
                    setAuthTab("register");
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex h-10 px-5 text-sm font-medium rounded-xl items-center justify-center transition-colors cursor-pointer bg-[#C59A87] text-white hover:bg-[#B58976] shadow-xs"
                >
                  Зарегистрироваться
                </button>
                <button className="sm:hidden p-2 text-main">
                  <Menu className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-[#EAE3D9] bg-base px-4 py-3 flex gap-2">
          <div className="flex-1 flex items-center bg-[#F4EFE6] border border-[#EAE3D9] h-10 rounded-xl px-3.5">
            <Search className="w-4 h-4 text-[#827771] mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Салоны, мастера..."
              className="bg-transparent border-none outline-none w-full text-sm text-main placeholder:text-[#827771]"
            />
          </div>
          <div className="bg-[#F4EFE6] border border-[#EAE3D9] h-10 rounded-xl px-3 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-main mr-1">Ант.</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#827771]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Mobile Category Chips & Filter Button */}
        <div className="lg:hidden flex items-center gap-2 mb-2 w-full">
          <div className="flex-1 overflow-x-auto scrollbar-none flex-nowrap flex gap-2 pb-1 touch-pan-x">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-1.5 shrink-0 rounded-xl text-xs sm:text-sm font-medium transition-colors border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#C59A87] text-white border-[#C59A87]"
                      : "bg-white text-main border-[#EAE3D9]"
                  }`}
                >
                  {cat}
                  {isSelected && <X className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white text-main border border-[#EAE3D9] shadow-xs">
                <SlidersHorizontal className="w-4 h-4 text-[#827771]" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl bg-base px-6 py-6 pb-10 border-[#EAE3D9]"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-serif font-semibold text-main text-left">
                  Фильтры
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm text-main">
                      Радиус
                    </span>
                    <span className="text-xs text-[#827771]">{radius} км</span>
                  </div>
                  <Slider
                    defaultValue={[radius]}
                    max={15}
                    min={0}
                    step={1}
                    className="w-full"
                    onValueChange={(val) =>
                      setRadius(Array.isArray(val) ? val[0] : val)
                    }
                  />
                  <div className="flex justify-between items-center text-xs text-[#827771] mt-2">
                    <span>0</span>
                    <span>15+ км</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold mb-3 block text-sm text-main">
                    Цена за услугу
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-[#EAE3D9] rounded-xl px-3 py-2">
                      <span className="block text-[11px] text-[#827771]">От</span>
                      <div className="flex items-baseline">
                        <input
                          type="number"
                          value={priceMin}
                          onChange={(e) => setPriceMin(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                        />
                        <span className="text-xs text-[#827771] ml-1">TL</span>
                      </div>
                    </div>
                    <span className="text-[#827771] font-medium">—</span>
                    <div className="flex-1 bg-white border border-[#EAE3D9] rounded-xl px-3 py-2">
                      <span className="block text-[11px] text-[#827771]">До</span>
                      <div className="flex items-baseline">
                        <input
                          type="number"
                          value={priceMax}
                          onChange={(e) => setPriceMax(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                        />
                        <span className="text-xs text-[#827771] ml-1">TL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-2 bg-[#C59A87] text-white py-3 rounded-xl font-medium transition-colors hover:bg-[#B58976]">
                  Применить
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-6 h-fit sticky top-28">
          <div className="bg-white rounded-2xl border border-[#EAE3D9] p-5 flex flex-col gap-6 shadow-[0_2px_12px_rgba(42,36,33,0.02)]">
            {/* Header with clear high-contrast title */}
            <div className="flex items-center justify-between pb-1 border-b border-[#F0ECE4]">
              <h2 className="font-serif text-lg font-semibold text-[#2A2421] tracking-tight">
                Фильтры
              </h2>
              <SlidersHorizontal className="w-4 h-4 text-[#827771]" />
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-2">
              {/* Selected chips with X */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="inline-flex items-center gap-1.5 bg-[#C59A87] text-white text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-[#B58976] transition-colors shadow-xs cursor-pointer"
                    >
                      {cat}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Unselected chips */}
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.filter(
                  (cat) => !selectedCategories.includes(cat)
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center bg-[#FAF6F0] border border-[#EAE3D9] text-main text-xs font-medium px-3 py-1.5 rounded-xl hover:border-[#C59A87] hover:bg-white transition-colors shadow-xs cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#EAE3D9]" />

            {/* Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm text-main">Радиус</span>
                <span className="text-xs font-medium text-[#827771]">{radius} км</span>
              </div>
              <Slider
                defaultValue={[radius]}
                max={15}
                min={0}
                step={1}
                className="w-full"
                onValueChange={(val) =>
                  setRadius(Array.isArray(val) ? val[0] : val)
                }
              />
              <div className="flex justify-between items-center text-xs text-[#827771] mt-2">
                <span>0</span>
                <span>15+ км</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#EAE3D9]" />

            {/* Price Range */}
            <div>
              <span className="font-semibold text-sm text-main block mb-3">
                Цена за услугу
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#FAF6F0] border border-[#EAE3D9] rounded-xl px-3 py-2 shadow-xs">
                  <span className="block text-[11px] text-[#827771]">От</span>
                  <div className="flex items-baseline">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                    />
                    <span className="text-xs text-[#827771] ml-1">TL</span>
                  </div>
                </div>
                <span className="text-[#827771] font-medium">—</span>
                <div className="flex-1 bg-[#FAF6F0] border border-[#EAE3D9] rounded-xl px-3 py-2 shadow-xs">
                  <span className="block text-[11px] text-[#827771]">До</span>
                  <div className="flex items-baseline">
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                    />
                    <span className="text-xs text-[#827771] ml-1">TL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="font-serif text-3xl md:text-[34px] font-normal text-main tracking-tight mb-1">
              Салоны и мастера поблизости
            </h1>
            <p className="text-sm text-[#827771]">
              Салоны и частные мастера в Анталье • 24 варианта
            </p>
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
                className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col justify-between shadow-[0_2px_12px_rgba(42,36,33,0.03)] hover:shadow-[0_8px_24px_rgba(42,36,33,0.06)] transition-shadow"
              >
                {/* SALON CARD */}
                {place.type === "salon" ? (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Image header */}
                      <div className="relative h-52 w-full bg-[#EAE3D9]">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-3.5 right-3.5 text-white/90 hover:text-white transition-colors drop-shadow-md cursor-pointer"
                          aria-label="В избранное"
                        >
                          <Heart className="w-5 h-5 stroke-[1.8]" />
                        </button>
                      </div>

                      <div className="p-5 pb-3">
                        <h2 className="font-serif text-xl font-medium text-main tracking-tight">
                          {place.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                          <Star className="w-4 h-4 fill-main text-main" />
                          <span className="text-main">{place.rating}</span>
                          <span className="text-[#827771] font-normal">
                            • {place.distance} км
                          </span>
                        </div>
                        <p className="text-sm text-[#5A504B] mt-2 line-clamp-1">
                          {place.description}
                        </p>

                        {/* Slots */}
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
                          {place.slots.map((slot, idx) => (
                            <button
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                                slot.highlighted
                                  ? "bg-[#C59A87] text-white shadow-xs"
                                  : "bg-[#8A9580]/15 text-[#3D4735] hover:bg-[#8A9580]/25 border border-[#8A9580]/25"
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                      <span className="text-sm font-medium text-main">
                        Задаток: {place.deposit} TL
                      </span>
                      <button className="h-9 px-5 rounded-xl bg-[#C59A87] text-white text-sm font-medium hover:bg-[#B58976] transition-colors shadow-xs cursor-pointer">
                        Записаться
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SOLO MASTER CARD */
                  <div className="p-5 flex flex-col h-full justify-between">
                    <div>
                      {/* Top badge */}
                      <div className="flex justify-end mb-1">
                        <span className="bg-[#8A9580]/20 text-[#3D4735] border border-[#8A9580]/30 text-[11px] font-medium px-2.5 py-0.5 rounded-md tracking-wide">
                          Частный мастер
                        </span>
                      </div>

                      {/* Master Info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={place.avatar}
                          alt={place.name}
                          className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#EAE3D9]"
                        />
                        <div className="flex-1 min-w-0">
                          <h2 className="font-serif text-xl font-medium text-main tracking-tight">
                            {place.name}
                          </h2>
                          <p className="text-sm text-[#827771] mt-0.5">
                            {place.specialization}
                          </p>
                          <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                            <Star className="w-4 h-4 fill-main text-main" />
                            <span className="text-main">{place.rating}</span>
                            <span className="text-[#827771] font-normal">
                              • {place.distance} км
                            </span>
                          </div>
                          <p className="text-sm text-[#5A504B] mt-2.5 leading-relaxed">
                            {place.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-4 border-t border-[#F0ECE4] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-main min-w-0">
                        <CreditCard className="w-4 h-4 text-[#827771] shrink-0" />
                        <span className="truncate">
                          {place.primaryService?.name} • от{" "}
                          {place.primaryService?.price} TL • от{" "}
                          {place.primaryService?.duration} мин
                        </span>
                      </div>
                      <button className="h-9 px-5 rounded-xl bg-[#C59A87] text-white text-sm font-medium hover:bg-[#B58976] transition-colors shrink-0 shadow-xs cursor-pointer">
                        Записаться
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
}
