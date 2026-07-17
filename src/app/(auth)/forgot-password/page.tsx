import type { Metadata } from "next";

import { AuthShell, ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Восстановление пароля",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Восстановление пароля"
      description="Укажите email, привязанный к аккаунту — мы пришлём ссылку для сброса пароля."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
