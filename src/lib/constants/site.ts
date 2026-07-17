export const SITE_CONFIG = {
  name: "AtlasIQ",
  tagline: "Изучай географию умнее",
  description:
    "Интерактивная платформа для подготовки к ЕНТ по географии. Изучай карту Казахстана, тренируйся и достигай лучших результатов.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlasiq.kz",
  locale: "ru-RU",
} as const;

export const NAV_LINKS = [
  { label: "Главная", href: "/" },
  { label: "Возможности", href: "/#features" },
  { label: "Как это работает", href: "/#how-it-works" },
  { label: "Статистика", href: "/#stats" },
  { label: "Тарифы", href: "/#pricing" },
] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  learn: "/learn",
  map: "/map",
  profile: "/profile",
  statistics: "/statistics",
  achievements: "/achievements",
  leaderboard: "/leaderboard",
  settings: "/settings",
  pricing: "/pricing",
  admin: "/admin",
} as const;
