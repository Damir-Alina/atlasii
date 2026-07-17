"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations";

import { FormAlert } from "./form-alert";
import { GoogleButton } from "./google-button";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setFormError(
        error.message === "Invalid login credentials"
          ? "Неверный email или пароль"
          : error.message,
      );
      return;
    }

    router.push(ROUTES.dashboard);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton label="Войти через Google" />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">или</span>
        <span className="h-px flex-1 bg-border" />
      </div>

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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Пароль
            </label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs text-primary hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                className="pointer-events-auto"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button type="submit" className="mt-1 w-full" isLoading={isSubmitting}>
          Войти
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
