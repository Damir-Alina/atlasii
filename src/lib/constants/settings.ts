import type { ProfileSettings } from "@/types";

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  theme: "dark",
  language: "ru",
  notifications: {
    email: true,
    push: true,
    achievements: true,
  },
  privacy: {
    showOnLeaderboard: true,
    publicProfile: true,
  },
};

export const LANGUAGE_OPTIONS: { value: ProfileSettings["language"]; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақша" },
  { value: "en", label: "English" },
];
