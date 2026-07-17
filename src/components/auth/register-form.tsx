"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validations";

import { FormAlert } from "./form-alert";
import { GoogleButton } from "./google-button";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setFormError(null);
    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setFormError(
        error.message === "User already registered"
          ? "Аккаунт с таким email уже существует"
          : error.message,
      );
      return;
    }

    // If email confirmation is required, Supabase returns a user with no
    // session yet — show a "check your inbox" state instead of redirecting.
    if (signUpData.user && !signUpData.session) {
      setSuccess(true);
      return;
    }

    router.push(ROUTES.dashboard);
    router.refresh();
  }

  if (success) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-sm text-success">
        Мы отправили письмо для подтверждения на указанный email. Перейдите по
        ссылке из письма, чтобы завершить регистрацию.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton label="Зарегистрироваться через Google" />

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
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
            Имя
          </label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Асан Асанов"
            icon={<User className="h-4 w-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Пароль
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Минимум 8 символов"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            Повторите пароль
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div>
          <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong bg-surface accent-primary"
              {...register("agreeToTerms")}
            />
            Согласен с условиями использования и политикой конфиденциальности
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-1 w-full" isLoading={isSubmitting}>
          Создать аккаунт
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
