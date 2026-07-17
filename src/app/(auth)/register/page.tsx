import type { Metadata } from "next";

import { AuthShell, RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Регистрация",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Создайте аккаунт"
      description="Начните готовиться к ЕНТ по географии уже сегодня — бесплатно."
    >
      <RegisterForm />
    </AuthShell>
  );
}
