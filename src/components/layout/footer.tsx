import Link from "next/link";

import { NAV_LINKS, ROUTES, SITE_CONFIG } from "@/lib/constants";

const FOOTER_COLUMNS = [
  {
    title: "Продукт",
    links: [
      { label: "Возможности", href: "/#features" },
      { label: "Как это работает", href: "/#how-it-works" },
      { label: "Тарифы", href: "/#pricing" },
      { label: "Карта Казахстана", href: ROUTES.map },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", href: "/#about" },
      { label: "Для школ", href: "/#for-schools" },
      { label: "Контакты", href: "/#contact" },
    ],
  },
  {
    title: "Ресурсы",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Статистика", href: "/#stats" },
      { label: "Поддержка", href: "/#contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="font-display font-semibold tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="font-display text-sm font-semibold text-foreground">
                {column.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Все права
            защищены.
          </p>
          <div className="flex items-center gap-6">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
