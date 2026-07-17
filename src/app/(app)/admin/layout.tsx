import { redirect } from "next/navigation";
import Link from "next/link";

import { requireAdminProfile } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

const ADMIN_NAV = [
  { label: "Аналитика", href: ROUTES.admin },
  { label: "Пользователи", href: `${ROUTES.admin}/users` },
  { label: "Категории", href: `${ROUTES.admin}/categories` },
  { label: "Вопросы", href: `${ROUTES.admin}/questions` },
  { label: "Достижения", href: `${ROUTES.admin}/achievements` },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminProfile();

  // Never expose admin routes/data to non-admins — this is the
  // authoritative server-side check (the sidebar link is only a UI nicety).
  if (!admin) {
    redirect(ROUTES.dashboard);
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Админ-панель
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Управление пользователями, контентом и аналитикой AtlasIQ.
        </p>
      </div>

      <nav className="mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
