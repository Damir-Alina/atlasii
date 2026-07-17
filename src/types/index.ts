export type { Database } from "./database";

/** A single UNT Geography topic/category, e.g. "Regions", "Rivers". */
export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  totalQuestions: number;
}

/** Minimal public profile shape shared by dashboard, profile and leaderboard. */
export interface Profile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  xpToNextLevel: number;
  accuracy: number;
  streakDays: number;
  isPremium: boolean;
  role: "user" | "admin";
}

/** A single recently-completed test/session result. */
export interface TestResult {
  id: string;
  categoryName: string;
  accuracy: number;
  xpEarned: number;
  completedAt: string;
  durationSeconds?: number;
}

/** An unlockable achievement definition plus the user's progress toward it. */
export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  goal: number;
}

export type ThemeMode = "dark" | "light" | "system";

export type AppLanguage = "ru" | "kk" | "en";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  achievements: boolean;
}

export interface PrivacySettings {
  showOnLeaderboard: boolean;
  publicProfile: boolean;
}

export interface ProfileSettings {
  theme: ThemeMode;
  language: AppLanguage;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

/** Minimal shape the map component needs to plot and select any point. */
export interface MapPoint {
  id: string;
  name: string;
  lng: number;
  lat: number;
}

/** A Kazakhstan administrative region shown as an interactive map marker. */
export interface Region extends MapPoint {
  /** Administrative center / capital city, shown in the detail panel. */
  capital: string;
  /** Short fact used as filler content until Stage 7 wires up real questions/content. */
  fact: string;
}

export type GeoObjectCategory =
  | "region"
  | "city"
  | "river"
  | "lake"
  | "mountain";

/** A generic learnable map target — regions, cities, rivers, lakes, mountains. */
export interface GeoObject extends MapPoint {
  category: GeoObjectCategory;
  fact: string;
}

/** Aggregate test-taking stats shown on the profile page. */
export interface ProfileTestStats {
  testsCompleted: number;
  averageAccuracy: number;
  bestStreak: number;
}
