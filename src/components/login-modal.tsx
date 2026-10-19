"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { sendOtp } from "@/app/actions/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setEmail("");
        setErrorMsg("");
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Email обязателен");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const result = await sendOtp(email);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setStep("success");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Ошибка отправки ссылки");
      } else {
        setErrorMsg("Ошибка отправки ссылки");
      }
    } finally {
      setIsLoading(false);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A2421]/30 backdrop-blur-sm p-4"
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-[#FDFBF7] rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-[#EFEAE0] overflow-hidden relative"
          >
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
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-[#2A2421] mb-1">С возвращением</h2>
                    <p className="text-[#827771] text-sm">Введите email для входа в систему</p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {errorMsg && (
                      <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm text-center">
                        {errorMsg}
                      </div>
                    )}

                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F4EFE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C59A87] focus-visible:relative focus-visible:z-10 text-[#2A2421] placeholder:text-[#827771]"
                      required
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 w-full bg-[#C59A87] text-white py-3 rounded-full font-medium transition-colors hover:bg-[#b08876] disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Получить ссылку для входа
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
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
                    Мы отправили Magic-ссылку на {email}
                  </p>

                  <button
                    onClick={onClose}
                    className="w-full bg-[#F4EFE6] text-[#2A2421] py-3 rounded-full font-medium transition-colors hover:bg-[#EFEAE0]"
                  >
                    Закрыть
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
