import Link from "next/link";
import type { ReactNode } from "react";

import { ROUTES, SITE_CONFIG } from "@/lib/constants";

const HIGHLIGHTS = [
  "10 000+ учеников готовятся к ЕНТ вместе с AtlasIQ",
  "Интерактивная карта Казахстана вместо зубрёжки",
  "XP, уровни и достижения держат мотивацию",
] as const;

export function AuthShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border/60 bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" />

        <Link href={ROUTES.home} className="relative flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow-primary">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="relative">
          <h2 className="max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight">
            Изучай географию умнее
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
