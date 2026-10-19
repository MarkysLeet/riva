"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scissors, Store, X, CheckCircle, Check } from "lucide-react";

type Role = "client" | "master" | "salon" | null;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cyrillicToLatinMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya", " ": "-"
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => cyrillicToLatinMap[char] || char)
    .join("")
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove trailing/leading hyphens
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<"form" | "code">("form");

  // Client State
  const [clientInterests, setClientInterests] = useState<string[]>([]);

  // Master State
  const [masterName, setMasterName] = useState("");
  const [masterSpecializations, setMasterSpecializations] = useState<string[]>([]);

  // Salon State
  const [salonName, setSalonName] = useState("");
  const [teamSize, setTeamSize] = useState<string | null>(null);

  // Code State
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when opened
  // It's better to clear it when modal unmounts or opens. We will just depend on conditional rendering to reset state if possible,
  // but since we need it in framer-motion AnimatePresence, we need to clear it when closed.
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRole(null);
        setStep("form");
        setClientInterests([]);
        setMasterName("");
        setMasterSpecializations([]);
        setSalonName("");
        setTeamSize(null);
        setCode(["", "", "", ""]);
      }, 300); // delay reset until animation finishes
    }
  }, [isOpen]);

  // Only completely remove from DOM if it is not open and fully reset.
  // Actually, we shouldn't use `if (!isOpen)` early return if we want AnimatePresence to work on exit.
  // We should just return the AnimatePresence block and let framer-motion handle the mount/unmount of the inner content based on `isOpen`.

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  const handleClientInterestToggle = (interest: string) => {
    setClientInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleMasterSpecToggle = (spec: string) => {
    setMasterSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((i) => i !== spec) : [...prev, spec]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("code");
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const generatedSlug = role === "master" ? transliterate(masterName) : role === "salon" ? transliterate(salonName) : "";

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2421]/30 backdrop-blur-sm p-4"
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-[#FDFBF7] rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-[#EFEAE0] overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#827771] hover:text-[#2A2421] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#2A2421] mb-1">Добро пожаловать в Riva</h2>
                  <p className="text-[#827771] text-sm">Выберите формат аккаунта, чтобы продолжить</p>
                </div>

                {/* Role Selection Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <RoleCard
                    icon={<Sparkles className="w-5 h-5 mb-2" />}
                    title="Для записи"
                    label="Клиент"
                    isActive={role === "client"}
                    onClick={() => handleRoleSelect("client")}
                  />
                  <RoleCard
                    icon={<Scissors className="w-5 h-5 mb-2" />}
                    title="Частная практика"
                    label="Мастер"
                    isActive={role === "master"}
                    onClick={() => handleRoleSelect("master")}
                  />
                  <RoleCard
                    icon={<Store className="w-5 h-5 mb-2" />}
                    title="Команда и CRM"
                    label="Салон"
                    isActive={role === "salon"}
                    onClick={() => handleRoleSelect("salon")}
                  />
                </div>

                {/* Dynamic Form Content */}
                <AnimatePresence mode="sync">
                  {role && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {role === "client" && (
                          <>
                            <div className="flex flex-col gap-3">
                              <input
                                type="text"
                                placeholder="Ваше имя"
                                className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771]"
                                required
                              />
                              <input
                                type="text"
                                placeholder="Телефон или Email"
                                className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771]"
                                required
                              />
                            </div>
                            <div>
                              <p className="text-[#827771] text-sm mb-2">Что вас интересует?</p>
                              <div className="flex flex-wrap gap-2">
                                {["Маникюр", "Педикюр", "Брови", "Волосы", "Макияж", "Косметология"].map((interest) => (
                                  <Pill
                                    key={interest}
                                    label={interest}
                                    isActive={clientInterests.includes(interest)}
                                    onClick={() => handleClientInterestToggle(interest)}
                                  />
                                ))}
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876]"
                            >
                              Получить код доступа
                            </button>
                          </>
                        )}

                        {role === "master" && (
                          <>
                            <div>
                              <input
                                type="text"
                                placeholder="Имя или никнейм"
                                value={masterName}
                                onChange={(e) => setMasterName(e.target.value)}
                                className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771] mb-2"
                                required
                              />
                              <AnimatePresence>
                                {masterName && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 overflow-hidden"
                                  >
                                    <div className="text-sm text-[#827771] bg-[#F4EFE6]/50 px-3 py-1.5 rounded-lg flex items-center">
                                      riva.com/<span className="text-[#2A2421] font-medium">{generatedSlug}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#C3D5C5] text-xs font-medium bg-[#C3D5C5]/20 px-2 py-1.5 rounded-lg">
                                      <Check className="w-3 h-3" />
                                      Доступно
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div>
                              <p className="text-[#827771] text-sm mb-2">Специализация</p>
                              <div className="flex flex-wrap gap-2">
                                {["Ногтевой сервис", "Брови/Ресницы", "Волосы", "Визаж"].map((spec) => (
                                  <Pill
                                    key={spec}
                                    label={spec}
                                    isActive={masterSpecializations.includes(spec)}
                                    onClick={() => handleMasterSpecToggle(spec)}
                                  />
                                ))}
                              </div>
                            </div>

                            <input
                              type="email"
                              placeholder="Рабочий Email"
                              className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771]"
                              required
                            />

                            <div className="mt-2 text-center">
                              <button
                                type="submit"
                                className="w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876]"
                              >
                                Создать страницу мастера
                              </button>
                              <p className="text-[#827771] text-xs mt-3">
                                30 дней полного доступа бесплатно, без привязки карты
                              </p>
                            </div>
                          </>
                        )}

                        {role === "salon" && (
                          <>
                            <div>
                              <input
                                type="text"
                                placeholder="Название салона"
                                value={salonName}
                                onChange={(e) => setSalonName(e.target.value)}
                                className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771] mb-2"
                                required
                              />
                              <AnimatePresence>
                                {salonName && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 overflow-hidden"
                                  >
                                    <div className="text-sm text-[#827771] bg-[#F4EFE6]/50 px-3 py-1.5 rounded-lg flex items-center">
                                      riva.com/<span className="text-[#2A2421] font-medium">{generatedSlug}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#C3D5C5] text-xs font-medium bg-[#C3D5C5]/20 px-2 py-1.5 rounded-lg">
                                      <Check className="w-3 h-3" />
                                      Доступно
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div>
                              <p className="text-[#827771] text-sm mb-2">Размер команды</p>
                              <div className="flex rounded-xl overflow-hidden bg-[#F4EFE6] p-1 gap-1">
                                {["2–5 мастеров", "6–10 мастеров", "10+ мастеров"].map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => setTeamSize(size)}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                                      teamSize === size
                                        ? "bg-white text-[#2A2421] shadow-sm"
                                        : "text-[#827771] hover:text-[#2A2421]"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <input
                              type="email"
                              placeholder="Email владельца или управляющего"
                              className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59A87] text-[#2A2421] placeholder:text-[#827771]"
                              required
                            />

                            <button
                              type="submit"
                              className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876]"
                            >
                              Запустить CRM салона (30 дней триал)
                            </button>
                          </>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#C3D5C5]/20 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[#8FA992]" />
                </div>

                <h3 className="text-xl font-semibold text-[#2A2421] mb-2 text-center">Проверьте почту</h3>
                <p className="text-[#827771] text-sm text-center mb-8 px-4">
                  Мы отправили Magic-ссылку и код на ваш контакт
                </p>

                <div className="flex gap-4 mb-8">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-14 h-14 bg-[#F4EFE6] rounded-2xl text-center text-2xl font-medium text-[#2A2421] focus:outline-none focus:ring-2 focus:ring-[#C59A87] transition-all"
                    />
                  ))}
                </div>

                <button
                  onClick={() => setStep("form")}
                  className="text-[#827771] text-sm hover:text-[#2A2421] transition-colors"
                >
                  Вернуться назад
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

function RoleCard({
  icon,
  title,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      animate={{ scale: isActive ? 1.02 : 1 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-2 ${
        isActive
          ? "bg-[#C3D5C5]/30 border-[#8FA992]"
          : "bg-[#F4EFE6]/60 border-transparent hover:bg-[#F4EFE6]"
      }`}
    >
      <div className={`${isActive ? "text-[#2A2421]" : "text-[#827771]"}`}>{icon}</div>
      <div className={`text-sm font-medium ${isActive ? "text-[#2A2421]" : "text-[#2A2421]"}`}>{label}</div>
      <div className="text-[10px] text-[#827771] mt-1 text-center leading-tight">{title}</div>
    </motion.button>
  );
}

function Pill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? "bg-[#C3D5C5] text-[#2A2421]"
          : "bg-[#F4EFE6] text-[#827771] hover:bg-[#EFEAE0]"
      }`}
    >
      {label}
    </button>
  );
}
