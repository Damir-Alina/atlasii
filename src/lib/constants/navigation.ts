import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Crown,
  LayoutDashboard,
  ListChecks,
  Map,
  Settings,
  Trophy,
  User,
} from "lucide-react";

import { ROUTES } from "./site";

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { label: "Главная", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Обучение", href: ROUTES.learn, icon: BookOpen },
  { label: "Карта", href: ROUTES.map, icon: Map },
  { label: "Достижения", href: ROUTES.achievements, icon: Trophy },
  { label: "Статистика", href: ROUTES.statistics, icon: BarChart3 },
  { label: "Рейтинг", href: ROUTES.leaderboard, icon: ListChecks },
  { label: "Профиль", href: ROUTES.profile, icon: User },
  { label: "Тариф", href: ROUTES.pricing, icon: Crown },
  { label: "Настройки", href: ROUTES.settings, icon: Settings },
];
