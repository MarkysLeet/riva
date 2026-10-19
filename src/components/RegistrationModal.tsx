"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { registerTenant } from "@/app/actions/auth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  type: z.enum(["salon", "solo"]),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  name: z.string().min(2, "Обязательное поле (минимум 2 символа)"),
  slug: z.string().min(3, "Минимум 3 символа").regex(/^[a-z0-9-]+$/, "Только латинские буквы, цифры и дефис"),
  phone: z.string().min(5, "Обязательное поле"),
  socials: z.array(z.object({ url: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Mock Hook for Slug Validation ---
function useSlugValidation(slugValue: string) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [chips, setChips] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (!slugValue || slugValue.length < 3) {
      setTimeout(() => {
        if(active) {
            setStatus('idle');
            setChips([]);
        }
      }, 0);
      return;
    }

    setTimeout(() => {
        if(active) {
            setStatus('checking');
        }
    }, 0);
    const timer = setTimeout(() => {
        if(!active) return;
      // Mock logic: if slug includes "test", it's taken
      if (slugValue.includes('test')) {
        setStatus('taken');
        setChips([`${slugValue}-studio`, `${slugValue}-pro`, `${slugValue}-beauty`, `${slugValue}1`]);
      } else {
        setStatus('available');
        setChips([]);
      }
    }, 350); // 350ms debounce

    return () => {
        active = false;
        clearTimeout(timer);
    };
  }, [slugValue]);

  return { status, chips };
}

export function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "salon",
      socials: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  const accountType = watch("type");
  const slugValue = watch("slug");
  const { status: slugStatus, chips: slugChips } = useSlugValidation(slugValue);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await registerTenant(data);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
        // Here you might want to redirect or show a success message
      }
    } catch {
      setError("Произошла ошибка при регистрации");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes("@")) return;

    // Mock API call
    setTimeout(() => {
        if (email === "test@example.com") {
            setEmailExists(true);
        } else {
            setEmailExists(false);
        }
    }, 500);
  };

  const nextStep = async () => {
    if (step === 2) {
      const isValid = await trigger(["email", "password"]);
      if (!isValid || emailExists) return;
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Регистрация бизнеса</DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col gap-4"
              >
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Выберите тип аккаунта</h3>
                  <div className="grid gap-4">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <input
                        type="radio"
                        value="salon"
                        {...register("type")}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">Салон красоты</div>
                        <div className="text-sm text-muted-foreground">
                          Команда мастеров, управление расписанием
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <input
                        type="radio"
                        value="solo"
                        {...register("type")}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">Частный мастер</div>
                        <div className="text-sm text-muted-foreground">
                          Индивидуальная практика и расписание
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="mt-auto pt-4 flex justify-end">
                  <Button onClick={nextStep}>
                    Далее <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col gap-4"
              >
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Данные для входа</h3>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email", {
                          onBlur: (e) => checkEmailExists(e.target.value)
                      })}
                    />
                    {errors.email ? (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    ) : emailExists ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex items-center justify-between text-xs mt-2">
                        <span>Аккаунт с таким email уже существует</span>
                        <button
                            type="button"
                            className="font-semibold underline hover:text-amber-950"
                            onClick={() => {
                                // Logic to jump to login modal if applicable
                                // For now, we just close this modal as a mock
                                onClose();
                            }}
                        >
                            Войти
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-auto pt-4 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Назад
                  </Button>
                  <Button onClick={nextStep}>
                    Далее <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="absolute inset-0 flex flex-col gap-4 overflow-y-auto pr-2 pb-2"
              >
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">
                    {accountType === "salon"
                      ? "Информация о салоне"
                      : "Информация о мастере"}
                  </h3>

                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {accountType === "salon" ? "Название студии" : "Имя или псевдоним"}
                    </Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Ссылка (Slug)</Label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-sm text-muted-foreground select-none pointer-events-none">
                        riva.pro/
                      </span>
                      <Input
                        id="slug"
                        {...register("slug", {
                          onChange: (e) => {
                            e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          }
                        })}
                        className={cn("pl-[72px]",
                          slugStatus === 'available' && "border-green-500 focus-visible:ring-green-500/20",
                          slugStatus === 'taken' && "border-destructive focus-visible:ring-destructive/20"
                        )}
                      />
                      {slugStatus === 'available' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 absolute right-3" />
                      )}
                    </div>

                    {slugStatus === 'available' && (
                      <p className="text-xs text-green-600 mt-1">
                        Ссылка свободна! Клиенты смогут записаться по ней
                      </p>
                    )}
                    {slugStatus === 'taken' && (
                      <div className="mt-1">
                        <p className="text-xs text-destructive mb-2">Эта ссылка уже занята</p>
                        <div className="flex flex-wrap gap-2">
                          {slugChips.map(chip => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => {
                                setValue("slug", chip, { shouldValidate: true, shouldDirty: true });
                              }}
                              className="bg-riva-canvas hover:bg-riva-sidebar border border-riva-border px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all text-riva-text-primary"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.slug && (
                      <p className="text-sm text-destructive">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Социальные сети / Сайты</Label>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder="https://..."
                          {...register(`socials.${index}.url`)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => append({ url: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Добавить еще
                    </Button>
                  </div>
                </div>
                <div className="mt-auto pt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Назад
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Регистрация..." : "Завершить"}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
