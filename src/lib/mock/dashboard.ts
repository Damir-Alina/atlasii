import type { Achievement, Category, Profile } from "@/types";

/**
 * PLACEHOLDER DATA — Stage 5 builds the dashboard UI against realistic
 * shapes before the database exists. Every function here is replaced in
 * Stage 9 (Database Integration) with a Supabase query that returns the
 * same shape, so the UI components in src/components/dashboard/ should
 * need zero changes once real data lands.
 */

export function getMockProfile(): Profile {
  return {
    id: "mock-user",
    fullName: "Асан Асанов",
    email: "asan@example.com",
    avatarUrl: null,
    level: 12,
    xp: 650,
    xpToNextLevel: 1200,
    accuracy: 0.92,
    streakDays: 7,
    isPremium: true,
    role: "user",
  };
}

export function getMockContinueLearning(): {
  category: Category;
  progressPercent: number;
} {
  return {
    category: {
      id: "regions",
      slug: "regions",
      name: "Области Казахстана",
      icon: "map",
      totalQuestions: 60,
    },
    progressPercent: 35,
  };
}

export function getMockRecentAchievements(): Achievement[] {
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
  ];
}
