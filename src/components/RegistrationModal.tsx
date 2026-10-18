"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { registerTenant } from "@/app/actions/auth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  type: z.enum(["salon", "solo"]),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  name: z.string().min(2, "Обязательное поле (минимум 2 символа)"),
  phone: z.string().min(5, "Обязательное поле"),
  socials: z.array(z.object({ url: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
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

  const nextStep = async () => {
    if (step === 2) {
      const isValid = await trigger(["email", "password"]);
      if (!isValid) return;
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
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
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
