import type { Metadata } from "next";

import { AuthShell, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Войти",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="С возвращением"
      description="Войдите, чтобы продолжить обучение с того места, где остановились."
    >
      <LoginForm />
    </AuthShell>
  );
}
