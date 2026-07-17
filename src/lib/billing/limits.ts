import type { GeoObjectCategory } from "@/types";

/** Free users can only practice these categories — matches the "Обучение по 2 категориям" bullet on the pricing page. */
export const FREE_CATEGORIES: GeoObjectCategory[] = ["region", "city"];

/** Free users get a capped number of learning sessions per day — matches "Неограниченная практика" being a Premium-only bullet. */
export const FREE_DAILY_SESSION_LIMIT = 3;
