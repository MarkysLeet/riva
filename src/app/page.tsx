/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  ChevronDown,
  Star,
  SlidersHorizontal,
  X,
  CreditCard,
  MapPin,
  LogOut,
  Menu,
  Sparkles,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { AuthModal } from "@/components/auth-modal";
import { CardGallery } from "@/components/card-gallery";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(5);
  const [priceMin, setPriceMin] = useState<number>(200);
  const [priceMax, setPriceMax] = useState<number>(1500);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const auth = params.get("auth");
      if (auth === "login") {
        setAuthTab("login");
        setIsAuthModalOpen(true);
      } else if (auth === "register") {
        setAuthTab("register");
        setIsAuthModalOpen(true);
      }
    }

    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const client = supabase;

    client.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    async function loadRealPlaces() {
      setIsLoading(true);
      try {
        const { data: tenantsData, error: tenantsErr } = await client
          .from("tenants")
          .select("*")
          .order("created_at", { ascending: false });

        if (tenantsErr) {
          console.error("Error fetching tenants:", tenantsErr);
          setIsLoading(false);
          return;
        }

        const { data: servicesData } = await client
          .from("services")
          .select("*")
          .eq("is_active", true);

        if (tenantsData) {
          const mapped = tenantsData.map((tenant: any) => {
            const tenantServices = (servicesData || []).filter(
              (s: any) => s.tenant_id === tenant.id
            );
            const firstService = tenantServices[0];
            const settings = tenant.settings || {};

            return {
              id: tenant.id,
              slug: tenant.slug,
              name: tenant.name || "Студия красоты",
              type: tenant.is_solo_master ? "solo" : "salon",
              specialization:
                settings.specialization ||
                (tenant.is_solo_master ? "Частный мастер" : "Салон красоты"),
              rating: settings.rating || 5.0,
              reviews: settings.reviewsCount || 1,
              distance: settings.distance || 0.8,
              description:
                settings.description ||
                (tenant.is_solo_master
                  ? "Персональный мастер красоты. Индивидуальный подход и безупречный сервис."
                  : "Современное бьюти-пространство. Высокие стандарты качества и комфорта."),
              deposit:
                settings.depositAmount ?? firstService?.deposit_amount ?? 200,
              portfolio:
                Array.isArray(settings.portfolioImages) &&
                settings.portfolioImages.length > 0
                  ? settings.portfolioImages
                  : [
                      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
                    ],
              avatar:
                settings.avatar ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
              badge:
                settings.badge ||
                (tenant.is_solo_master ? "Новый мастер" : "Новое пространство"),
              slots: settings.slots || [
                { time: "11:00", available: true, highlighted: true },
                { time: "13:00", available: true },
                { time: "15:30", available: true },
                { time: "18:00", available: true },
              ],
              primaryService: firstService
                ? {
                    name: firstService.name,
                    price: firstService.price,
                    duration: firstService.duration_minutes,
                  }
                : {
                    name: "Базовая услуга",
                    price: 500,
                    duration: 60,
                  },
            };
          });
          setPlaces(mapped);
        }
      } catch (err) {
        console.error("Failed to load real places:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealPlaces();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredPlaces = places.filter((place) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchSpec = place.specialization?.toLowerCase().includes(q);
      const matchDesc = place.description?.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchDesc) return false;
    }
    return true;
  });

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
                <span className="text-[9px] font-sans tracking-[0.2em] text-[#5E544C] uppercase font-semibold mt-1">
                  BEAUTY PLATFORM
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar & City (Desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center max-w-xl mx-8">
            <div className="w-full flex items-center bg-[#F4EFE6]/70 border border-[#EAE3D9] h-11 rounded-2xl px-4 focus-within:border-[#C59A87] transition-colors">
              <Search className="w-4 h-4 text-[#7A7571] mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm text-main placeholder:text-[#7A7571]"
              />
              <div className="h-5 w-[1px] bg-[#EAE3D9] mx-3 shrink-0" />
              <div className="flex items-center gap-1.5 cursor-pointer group shrink-0 text-main hover:text-[#C59A87] transition-colors">
                <MapPin className="w-4 h-4 text-[#7A7571] group-hover:text-[#C59A87] transition-colors" />
                <span className="text-sm font-medium">Анталья</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A7571]" />
              </div>
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <button className="h-9 sm:h-10 px-3 sm:px-5 text-xs sm:text-sm font-medium rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer bg-[#C59A87] text-white hover:bg-[#B58976] shadow-xs">
                    <span className="sm:hidden">Кабинет</span>
                    <span className="hidden sm:inline">Личный кабинет</span>
                  </button>
                </Link>
                <Link href="/dashboard">
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
                    const sb = createClient();
                    if (sb) {
                      await sb.auth.signOut();
                    }
                  }}
                  className="text-[#7A7571] hover:text-main transition-colors p-2 cursor-pointer"
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
            <Search className="w-4 h-4 text-[#7A7571] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Салоны, мастера..."
              className="bg-transparent border-none outline-none w-full text-sm text-main placeholder:text-[#7A7571]"
            />
          </div>
          <div className="bg-[#F4EFE6] border border-[#EAE3D9] h-10 rounded-xl px-3 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-main mr-1">Ант.</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A7571]" />
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
                <SlidersHorizontal className="w-4 h-4 text-[#7A7571]" />
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
                    <span className="text-xs text-[#7A7571]">{radius} км</span>
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
                  <div className="flex justify-between items-center text-xs text-[#7A7571] mt-2">
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
                      <span className="block text-[11px] text-[#7A7571]">От</span>
                      <div className="flex items-baseline">
                        <input
                          type="number"
                          value={priceMin}
                          onChange={(e) => setPriceMin(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                        />
                        <span className="text-xs text-[#7A7571] ml-1">TL</span>
                      </div>
                    </div>
                    <span className="text-[#7A7571] font-medium">—</span>
                    <div className="flex-1 bg-white border border-[#EAE3D9] rounded-xl px-3 py-2">
                      <span className="block text-[11px] text-[#7A7571]">До</span>
                      <div className="flex items-baseline">
                        <input
                          type="number"
                          value={priceMax}
                          onChange={(e) => setPriceMax(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                        />
                        <span className="text-xs text-[#7A7571] ml-1">TL</span>
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
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-[#F0ECE4]">
              <h2 className="font-serif text-lg font-semibold text-[#2A2421] tracking-tight">
                Фильтры
              </h2>
              <SlidersHorizontal className="w-4 h-4 text-[#7A7571]" />
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
                <span className="text-xs font-medium text-[#7A7571]">{radius} км</span>
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
              <div className="flex justify-between items-center text-xs text-[#7A7571] mt-2">
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
                  <span className="block text-[11px] text-[#7A7571]">От</span>
                  <div className="flex items-baseline">
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                    />
                    <span className="text-xs text-[#7A7571] ml-1">TL</span>
                  </div>
                </div>
                <span className="text-[#7A7571] font-medium">—</span>
                <div className="flex-1 bg-[#FAF6F0] border border-[#EAE3D9] rounded-xl px-3 py-2 shadow-xs">
                  <span className="block text-[11px] text-[#7A7571]">До</span>
                  <div className="flex items-baseline">
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-main"
                    />
                    <span className="text-xs text-[#7A7571] ml-1">TL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl md:text-[34px] font-normal text-main tracking-tight mb-1">
                Салоны и мастера поблизости
              </h1>
              <p className="text-sm text-[#7A7571]">
                {isLoading ? (
                  "Загрузка списка салонов и мастеров..."
                ) : (
                  <>
                    Салоны и частные мастера в Анталье • {filteredPlaces.length}{" "}
                    {filteredPlaces.length === 1
                      ? "вариант"
                      : filteredPlaces.length >= 2 && filteredPlaces.length <= 4
                      ? "варианта"
                      : "вариантов"}
                  </>
                )}
              </p>
            </div>
            {/* Quick aesthetic pill indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A7571]">
              <span className="w-2 h-2 rounded-full bg-[#8A9580]" />
              <span>Листайте фото работ в карточках</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#EAE3D9] p-6 animate-pulse flex flex-col gap-4 h-[380px]"
                >
                  <div className="w-full h-48 bg-[#F4EFE6] rounded-xl" />
                  <div className="h-6 w-3/4 bg-[#F4EFE6] rounded-md" />
                  <div className="h-4 w-1/2 bg-[#F4EFE6] rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D9] p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#C59A87] mb-4">
                {places.length === 0 ? (
                  <Store className="w-7 h-7" />
                ) : (
                  <Sparkles className="w-7 h-7" />
                )}
              </div>
              <h3 className="font-serif text-2xl font-medium text-main mb-2">
                {places.length === 0
                  ? "Пока нет зарегистрированных салонов"
                  : "По вашему запросу ничего не найдено"}
              </h3>
              <p className="text-sm text-[#7A7571] max-w-md mb-6">
                {places.length === 0
                  ? "Станьте первым специалистом на платформе! Создайте личный кабинет или салон и начните принимать записи."
                  : "Попробуйте изменить поисковый запрос или сбросить фильтры."}
              </p>
              {places.length === 0 ? (
                <button
                  onClick={() => {
                    setAuthTab("register");
                    setIsAuthModalOpen(true);
                  }}
                  className="h-11 px-6 rounded-xl bg-[#C59A87] text-white text-sm font-medium hover:bg-[#B58976] transition-colors shadow-xs cursor-pointer"
                >
                  Зарегистрировать салон или кабинет
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                  className="h-10 px-5 rounded-xl border border-[#EAE3D9] text-main text-sm font-medium hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredPlaces.map((place) => {
                const isFav = favorites.includes(place.id);
                const galleryImages =
                  place.portfolio && place.portfolio.length > 0
                    ? place.portfolio
                    : [place.avatar];

                const targetSlug = place.slug || place.id;

                return (
                  <motion.div
                    key={place.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col justify-between shadow-[0_2px_12px_rgba(42,36,33,0.03)] hover:shadow-[0_8px_24px_rgba(42,36,33,0.06)] transition-shadow"
                  >
                    {/* SALON CARD */}
                    {place.type === "salon" ? (
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          {/* Interactive Work Gallery with Swipe & Dots */}
                          <CardGallery
                            images={galleryImages}
                            alt={place.name}
                            badge={place.badge}
                            isFavorite={isFav}
                            onFavoriteClick={() => toggleFavorite(place.id)}
                          />

                          <div className="p-5 pb-3">
                            <Link href={`/${targetSlug}`}>
                              <h2 className="font-serif text-xl font-medium text-main tracking-tight hover:text-[#C59A87] transition-colors cursor-pointer">
                                {place.name}
                              </h2>
                            </Link>
                            <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                              <Star className="w-4 h-4 fill-main text-main" />
                              <span className="text-main">{place.rating}</span>
                              <span className="text-[#7A7571] font-normal">
                                • {place.distance} км
                              </span>
                            </div>
                            <p className="text-sm text-[#5E544C] mt-2 line-clamp-1">
                              {place.description}
                            </p>

                            {/* Slots */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
                              {place.slots.map((slot: any, idx: number) => (
                                <Link key={idx} href={`/${targetSlug}`}>
                                  <button
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                                      slot.highlighted
                                        ? "bg-[#C59A87] text-white shadow-xs"
                                        : "bg-[#8A9580]/15 text-[#2A2421] hover:bg-[#8A9580]/25 border border-[#8A9580]/25"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                          <span className="text-sm font-medium text-main">
                            Задаток: {place.deposit} TL
                          </span>
                          <Link href={`/${targetSlug}`}>
                            <button className="h-9 px-5 rounded-xl bg-[#C59A87] text-white text-sm font-medium hover:bg-[#B58976] transition-colors shadow-xs cursor-pointer">
                              Записаться
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      /* SOLO MASTER CARD */
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          {/* Interactive Work Gallery with Swipe & Dots */}
                          <CardGallery
                            images={galleryImages}
                            alt={place.name}
                            badge={place.badge}
                            typeBadge="Частный мастер"
                            isFavorite={isFav}
                            onFavoriteClick={() => toggleFavorite(place.id)}
                          />

                          {/* Master Info */}
                          <div className="p-5 pb-3">
                            <div className="flex items-start gap-3.5">
                              <img
                                src={place.avatar}
                                alt={place.name}
                                className="w-13 h-13 rounded-full object-cover shrink-0 border border-[#EAE3D9] mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <Link href={`/${targetSlug}`}>
                                  <h2 className="font-serif text-xl font-medium text-main tracking-tight hover:text-[#C59A87] transition-colors cursor-pointer">
                                    {place.name}
                                  </h2>
                                </Link>
                                <p className="text-sm text-[#7A7571] mt-0.5">
                                  {place.specialization}
                                </p>
                                <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
                                  <Star className="w-4 h-4 fill-main text-main" />
                                  <span className="text-main">{place.rating}</span>
                                  <span className="text-[#7A7571] font-normal">
                                    • {place.distance} км
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-[#5E544C] mt-3 line-clamp-2 leading-relaxed">
                              {place.description}
                            </p>

                            {/* Slots for solo master */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
                              {place.slots.map((slot: any, idx: number) => (
                                <Link key={idx} href={`/${targetSlug}`}>
                                  <button
                                    disabled={!slot.available}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                                      !slot.available
                                        ? "bg-[#F4EFE6] text-[#7A7571] cursor-not-allowed line-through"
                                        : "bg-[#8A9580]/15 text-[#2A2421] hover:bg-[#8A9580]/25 border border-[#8A9580]/25 cursor-pointer"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-5 pt-3 border-t border-[#F0ECE4] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-main min-w-0">
                            <CreditCard className="w-4 h-4 text-[#7A7571] shrink-0" />
                            <span className="truncate">
                              {place.primaryService?.name} • от{" "}
                              {place.primaryService?.price} TL • от{" "}
                              {place.primaryService?.duration} мин
                            </span>
                          </div>
                          <Link href={`/${targetSlug}`}>
                            <button className="h-9 px-5 rounded-xl bg-[#C59A87] text-white text-sm font-medium hover:bg-[#B58976] transition-colors shrink-0 shadow-xs cursor-pointer">
                              Записаться
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
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
