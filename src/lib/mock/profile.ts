import type { Achievement, Category } from "@/types";

/**
 * PLACEHOLDER DATA — see src/lib/mock/dashboard.ts for the same caveat.
 * Stage 9 replaces these with Supabase queries returning the same shapes.
 */

export function getMockAllAchievements(): Achievement[] {
  return [
    {
      id: "a1",
      slug: "region-expert",
      title: "Знаток областей",
      description: "Найди 100 областей",
      icon: "compass",
      unlocked: true,
      progress: 100,
      goal: 100,
    },
    {
      id: "a2",
      slug: "geo-pro",
      title: "Географ-профессионал",
      description: "Набери 5000 очков",
      icon: "award",
      unlocked: true,
      progress: 5000,
      goal: 5000,
    },
    {
      id: "a3",
      slug: "streak-7",
      title: "Серия 7 дней",
      description: "Учись 7 дней подряд",
      icon: "flame",
      unlocked: true,
      progress: 7,
      goal: 7,
    },
    {
      id: "a4",
      slug: "fast-answer",
      title: "Быстрый ответ",
      description: "Ответь за 5 секунд",
      icon: "zap",
      unlocked: true,
      progress: 1,
      goal: 1,
    },
    {
      id: "a5",
      slug: "map-master",
      title: "Мастер карты",
      description: "Пройди 1000 объектов",
      icon: "map",
      unlocked: false,
      progress: 640,
      goal: 1000,
    },
    {
      id: "a6",
      slug: "encyclopedist",
      title: "Энциклопедист",
      description: "Пройди все категории",
      icon: "book-open",
      unlocked: false,
      progress: 3,
      goal: 5,
    },
    {
      id: "a7",
      slug: "perfect-accuracy",
      title: "Идеальная точность",
      description: "100% точность в тесте",
      icon: "target",
      unlocked: false,
      progress: 0,
      goal: 1,
    },
    {
      id: "a8",
      slug: "night-owl",
      title: "Ночные совы",
      description: "Учись после полуночи",
      icon: "moon",
      unlocked: false,
      progress: 0,
      goal: 1,
    },
  ];
}

export function getMockFavoriteTopics(): Category[] {
  return [
    { id: "regions", slug: "regions", name: "Области", icon: "compass", totalQuestions: 60 },
    { id: "cities", slug: "cities", name: "Города", icon: "landmark", totalQuestions: 40 },
    { id: "rivers", slug: "rivers", name: "Реки", icon: "waves", totalQuestions: 25 },
    { id: "lakes", slug: "lakes", name: "Озёра", icon: "map-pin", totalQuestions: 20 },
    { id: "mountains", slug: "mountains", name: "Горы", icon: "mountain", totalQuestions: 22 },
  ];
}
