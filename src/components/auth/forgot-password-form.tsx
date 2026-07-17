"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";

import { FormAlert } from "./form-alert";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=${ROUTES.settings}`,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-sm text-success">
        Если аккаунт с таким email существует, мы отправили на него ссылку
        для восстановления пароля.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {formError && <FormAlert message={formError} />}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Отправить ссылку
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Вспомнили пароль?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
