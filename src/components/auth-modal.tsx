"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Store, X, CheckCircle, Check, Loader2 } from "lucide-react";
import { sendOtp, verifyOtp, PasswordlessMetadata } from "@/app/actions/auth";

type Role = "client" | "master" | "salon" | null;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
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
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<"form" | "code">("form");

  // Common State
  const [email, setEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Client State
  const [clientInterests, setClientInterests] = useState<string[]>([]);

  // Master State
  const [masterName, setMasterName] = useState("");
  const [masterSpecializations, setMasterSpecializations] = useState<string[]>([]);

  // Salon State
  const [salonName, setSalonName] = useState("");
  const [teamSize, setTeamSize] = useState<string | null>(null);

  // 6-digit Code State
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0 && step === "code") {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown, step]);

  // Handle tab state sync on open using a layout effect or similar
  // To satisfy Next.js' strict ESLint rule, we can derive it during render instead of using useEffect
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTab(initialTab);
    }
  }

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setRole(null);
        setStep("form");
        setEmail("");
        setClientName("");
        setClientInterests([]);
        setMasterName("");
        setMasterSpecializations([]);
        setSalonName("");
        setTeamSize(null);
        setCode(["", "", "", "", "", ""]);
        setErrorMsg("");
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setErrorMsg("");
  };

  const generatedSlug = role === "master" ? transliterate(masterName) : role === "salon" ? transliterate(salonName) : "";

  // 1. Submit Form & Send 6-digit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Укажите email");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const metadata: PasswordlessMetadata = tab === "login"
        ? { role: "client" } // Backend verifyOtp sets proper role anyway, but we need some default
        : {
          role: (role as "client" | "master" | "salon") || "client",
          name: role === "master" ? masterName : role === "salon" ? salonName : (clientName || undefined),
          slug: generatedSlug || undefined,
          specializations: role === "master" ? masterSpecializations : undefined,
          interests: role === "client" ? clientInterests : undefined,
          teamSize: role === "salon" ? (teamSize || undefined) : undefined,
        };

      const res = await sendOtp(email, metadata);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setStep("code");
        setCooldown(60);
      }
    } catch {
      setErrorMsg("Не удалось отправить код. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle 6-digit Code Input
  const handleCodeChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join("");
    if (codeToVerify.length !== 6) {
      setErrorMsg("Введите 6-значный код");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await verifyOtp(email, codeToVerify);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        onClose();
        if (res.role === "master" || res.role === "salon") {
          router.push(res.slug ? `/${res.slug}/admin` : "/dashboard");
        } else {
          router.push("/profile");
        }
      }
    } catch {
      setErrorMsg("Ошибка при проверке кода. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || "";
    }
    setCode(newCode);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2421]/30 backdrop-blur-sm p-3 sm:p-4"
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-[#FDFBF7] rounded-3xl p-5 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFEAE0] relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-[#827771] hover:text-[#2A2421] transition-colors z-10"
              aria-label="Закрыть"
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
                  {/* Tabs */}
                  <div className="flex gap-1 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#EFEAE0] mb-6">
                    <button
                      className={`flex-1 py-2.5 sm:py-3 text-sm font-semibold rounded-xl transition-all text-center ${
                        tab === "login"
                          ? "bg-white text-[#2A2421] shadow-sm"
                          : "font-medium text-[#5A504B] hover:text-[#2A2421]"
                      }`}
                      onClick={() => setTab("login")}
                    >
                      Войти
                    </button>
                    <button
                      className={`flex-1 py-2.5 sm:py-3 text-sm font-semibold rounded-xl transition-all text-center ${
                        tab === "register"
                          ? "bg-white text-[#2A2421] shadow-sm"
                          : "font-medium text-[#5A504B] hover:text-[#2A2421]"
                      }`}
                      onClick={() => {
                        setTab("register");
                        if (!role) setRole("client");
                      }}
                    >
                      Регистрация
                    </button>
                  </div>

                  {/* Header */}
                  <div className="mb-5 sm:mb-6 pr-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#2A2421] mb-1">
                      {tab === "login" ? "С возвращением" : "Добро пожаловать в Riva"}
                    </h2>
                    <p className="text-[#827771] text-xs sm:text-sm">
                      {tab === "login" ? "Введите ваш email для входа в систему" : "Выберите формат аккаунта, чтобы продолжить"}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl text-xs sm:text-sm text-center mb-4">
                      {errorMsg}
                    </div>
                  )}

                  {tab === "login" ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] transition-colors"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                      >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Получить код
                      </button>
                    </form>
                  ) : (
                    <>
                      {/* Role Selection Options */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
                        <RoleCard
                          icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2" />}
                          title="Для записи на услуги"
                          label="Клиент"
                          isActive={role === "client"}
                          onClick={() => handleRoleSelect("client")}
                        />
                        <RoleCard
                          icon={<Store className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2" />}
                          title="Для мастеров и салонов"
                          label="Бизнес"
                          isActive={role === "master" || role === "salon"}
                          onClick={() => handleRoleSelect("master")}
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
                          >
                            {(role === "master" || role === "salon") && (
                              <div className="flex gap-2 mb-4 bg-[#F4EFE6] p-1 rounded-xl border border-[#EFEAE0]">
                                <button
                                  type="button"
                                  onClick={() => setRole("master")}
                                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                                    role === "master"
                                      ? "bg-white text-[#2A2421] shadow-sm"
                                      : "text-[#827771] hover:text-[#2A2421]"
                                  }`}
                                >
                                  Частный мастер
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRole("salon")}
                                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                                    role === "salon"
                                      ? "bg-white text-[#2A2421] shadow-sm"
                                      : "text-[#827771] hover:text-[#2A2421]"
                                  }`}
                                >
                                  Студия/Салон
                                </button>
                              </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                              {role === "client" && (
                                <>
                                  <div className="flex flex-col gap-3">
                                    <input
                                      type="text"
                                      placeholder="Ваше имя (необязательно)"
                                      value={clientName}
                                      onChange={(e) => setClientName(e.target.value)}
                                      className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] transition-colors"
                                    />
                                    <input
                                      type="email"
                                      placeholder="Email"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] transition-colors"
                                      required
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                                  >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
                                      className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] mb-2 transition-colors"
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
                                          <div className="text-xs sm:text-sm text-[#827771] bg-[#F4EFE6]/50 px-3 py-1.5 rounded-lg flex items-center">
                                            riva.com/<span className="text-[#2A2421] font-medium">{generatedSlug}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-[#4B7355] text-xs font-medium bg-[#C3D5C5]/30 px-2 py-1.5 rounded-lg">
                                            <Check className="w-3 h-3" />
                                            Доступно
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  <input
                                    type="email"
                                    placeholder="Рабочий Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] transition-colors"
                                    required
                                  />

                                  <div className="mt-2 text-center">
                                    <button
                                      type="submit"
                                      disabled={isLoading}
                                      className="w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                                    >
                                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                      Создать страницу мастера
                                    </button>
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
                                      className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] mb-2 transition-colors"
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
                                          <div className="text-xs sm:text-sm text-[#827771] bg-[#F4EFE6]/50 px-3 py-1.5 rounded-lg flex items-center">
                                            riva.com/<span className="text-[#2A2421] font-medium">{generatedSlug}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-[#4B7355] text-xs font-medium bg-[#C3D5C5]/30 px-2 py-1.5 rounded-lg">
                                            <Check className="w-3 h-3" />
                                            Доступно
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  <div>
                                    <p className="text-[#827771] text-xs sm:text-sm mb-2">Размер команды</p>
                                    <div className="flex rounded-xl overflow-hidden bg-[#F4EFE6] p-1 gap-1 border border-[#EFEAE0]">
                                      {["2–5", "6–10", "10+"].map((size) => (
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#F4EFE6] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none rounded-xl px-4 py-3 text-sm text-[#2A2421] placeholder:text-[#827771] transition-colors"
                                    required
                                  />

                                  <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                                  >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Запустить CRM салона (30 дней триал)
                                  </button>
                                </>
                              )}
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
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
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C3D5C5]/20 flex items-center justify-center mb-5 sm:mb-6">
                    {isLoading ? (
                      <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#8FA992] animate-spin" />
                    ) : (
                      <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#8FA992]" />
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-[#2A2421] mb-2 text-center">
                    Проверьте почту
                  </h3>
                  <p className="text-[#827771] text-xs sm:text-sm text-center mb-6 px-4">
                    Мы отправили 6-значный код доступа на{" "}
                    <span className="font-medium text-[#2A2421]">{email}</span>
                  </p>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl text-xs sm:text-sm text-center mb-5 w-full">
                      {errorMsg}
                    </div>
                  )}

                  {/* 6-digit OTP Inputs */}
                  <div
                    className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center w-full"
                    onPaste={handlePaste}
                  >
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        disabled={isLoading}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-10 sm:w-13 h-12 sm:h-14 bg-[#F4EFE6] rounded-xl sm:rounded-2xl text-center text-xl sm:text-2xl font-medium text-[#2A2421] border border-[#EFEAE0] hover:border-[#D9D1C5] focus:border-[#C59A87] focus:ring-1 focus:ring-[#C59A87] focus:ring-inset focus:outline-none transition-all disabled:opacity-50"
                      />
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      disabled={isLoading || cooldown > 0}
                      onClick={(e) => {
                        if (cooldown === 0) {
                          handleSubmit(e);
                        }
                      }}
                      className="text-[#C59A87] text-xs sm:text-sm font-medium hover:text-[#b08876] transition-colors disabled:opacity-50"
                    >
                      {cooldown > 0 ? `Отправить код повторно через ${cooldown} сек.` : "Отправить код повторно"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleVerify()}
                      className="w-full sm:w-auto px-8 bg-[#C59A87] text-white py-2.5 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Подтвердить
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setStep("form");
                        setCode(["", "", "", "", "", ""]);
                        setErrorMsg("");
                      }}
                      className="text-[#827771] text-xs sm:text-sm hover:text-[#2A2421] transition-colors mt-2"
                    >
                      Вернуться назад
                    </button>
                  </div>
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
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all h-full ${
        isActive
          ? "border-[#C59A87] bg-[#FDFBF7] shadow-sm text-[#C59A87]"
          : "border-[#EFEAE0] bg-[#F4EFE6] text-[#827771] hover:border-[#D9D1C5] hover:bg-[#FDFBF7]"
      }`}
    >
      {icon}
      <span className={`text-[10px] sm:text-xs font-semibold mb-0.5 ${isActive ? "text-[#C59A87]" : "text-[#2A2421]"}`}>
        {label}
      </span>
      <span className="text-[9px] sm:text-[10px] text-center leading-tight opacity-80">{title}</span>
    </motion.button>
  );
}
