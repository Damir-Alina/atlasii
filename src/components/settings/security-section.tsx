"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations";

import { SettingsSection } from "./settings-section";

export function SecuritySection() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordInput) {
    setFormError(null);
    setSuccess(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <SettingsSection
      title="Безопасность"
      description="Смена пароля вашего аккаунта."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {success && (
          <p className="text-sm text-success">Пароль успешно изменён.</p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Новый пароль
          </label>
          <Input
            type="password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Повторите пароль
          </label>
          <Input
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Изменить пароль
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
