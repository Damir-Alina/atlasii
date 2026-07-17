import type { GeoObjectCategory } from "@/types";

export type LearningModeId =
  | "practice"
  | "exam"
  | "time-attack"
  | "random-challenge"
  | "category-challenge"
  | "favorites";

export type DifficultyId = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  /** Multiplies the mode's base session length. */
  lengthMultiplier: number;
  /** Multiplies the mode's base per-question time. */
  timeMultiplier: number;
}

export const DIFFICULTIES: DifficultyConfig[] = [
  { id: "easy", label: "Лёгкий", lengthMultiplier: 0.8, timeMultiplier: 1.4 },
  { id: "medium", label: "Средний", lengthMultiplier: 1, timeMultiplier: 1 },
  { id: "hard", label: "Сложный", lengthMultiplier: 1.4, timeMultiplier: 0.6 },
];

export interface LearningModeConfig {
  id: LearningModeId;
  title: string;
  description: string;
  icon: string;
  baseSessionLength: number;
  baseQuestionTimeSeconds: number;
  hintsAllowed: boolean;
  xpRewardHint: string;
  xpMultiplier: number;
  /** Whether the player chooses categories themselves before starting. */
  requiresCategoryPicker: boolean;
  allowMultipleCategories: boolean;
  /** Categories used when the player doesn't pick their own. */
  fixedCategories?: GeoObjectCategory[];
  /** Pick a random subset of all categories at start time. */
  randomCategories?: boolean;
  /** Use the player's favorite categories (Profile page) instead of a picker. */
  useFavoriteCategories?: boolean;
  allowDifficultySelector: boolean;
}

const ALL_CATEGORIES: GeoObjectCategory[] = [
  "region",
  "city",
  "river",
  "lake",
  "mountain",
];

/**
 * Placeholder "favorites" until a real per-user preference exists (natural
 * fit for Stage 14 Settings or Stage 15 Premium). Favorites mode reads this
 * instead of an empty picker so the mode is fully usable today.
 */
export const FAVORITE_CATEGORIES: GeoObjectCategory[] = ["region", "lake"];

export const LEARNING_MODES: LearningModeConfig[] = [
  {
    id: "practice",
    title: "Практика",
    description:
      "Обучайтесь в своём темпе — подсказки доступны, время не поджимает.",
    icon: "book-open",
    baseSessionLength: 10,
    baseQuestionTimeSeconds: 25,
    hintsAllowed: true,
    xpRewardHint: "x1 XP",
    xpMultiplier: 1,
    requiresCategoryPicker: true,
    allowMultipleCategories: true,
    allowDifficultySelector: true,
  },
  {
    id: "exam",
    title: "Экзаменационный режим",
    description:
      "Полная симуляция ЕНТ: все категории вперемешку, без подсказок.",
    icon: "graduation-cap",
    baseSessionLength: 20,
    baseQuestionTimeSeconds: 20,
    hintsAllowed: false,
    xpRewardHint: "x1.5 XP",
    xpMultiplier: 1.5,
    requiresCategoryPicker: false,
    allowMultipleCategories: true,
    fixedCategories: ALL_CATEGORIES,
    allowDifficultySelector: true,
  },
  {
    id: "time-attack",
    title: "Игра на время",
    description: "Отвечайте как можно быстрее — таймер совсем короткий.",
    icon: "timer",
    baseSessionLength: 15,
    baseQuestionTimeSeconds: 8,
    hintsAllowed: false,
    xpRewardHint: "x2 XP за скорость",
    xpMultiplier: 2,
    requiresCategoryPicker: false,
    allowMultipleCategories: true,
    fixedCategories: ALL_CATEGORIES,
    allowDifficultySelector: false,
  },
  {
    id: "random-challenge",
    title: "Случайный вызов",
    description: "Случайный набор категорий — для разнообразия и сюрприза.",
    icon: "shuffle",
    baseSessionLength: 10,
    baseQuestionTimeSeconds: 18,
    hintsAllowed: true,
    xpRewardHint: "x1.2 XP",
    xpMultiplier: 1.2,
    requiresCategoryPicker: false,
    allowMultipleCategories: true,
    randomCategories: true,
    allowDifficultySelector: true,
  },
  {
    id: "category-challenge",
    title: "Испытание по теме",
    description: "Углублённая практика одной выбранной категории.",
    icon: "target",
    baseSessionLength: 12,
    baseQuestionTimeSeconds: 18,
    hintsAllowed: true,
    xpRewardHint: "x1.3 XP",
    xpMultiplier: 1.3,
    requiresCategoryPicker: true,
    allowMultipleCategories: false,
    allowDifficultySelector: true,
  },
  {
    id: "favorites",
    title: "Избранное",
    description: "Тренировка по темам, отмеченным как любимые в профиле.",
    icon: "heart",
    baseSessionLength: 10,
    baseQuestionTimeSeconds: 20,
    hintsAllowed: true,
    xpRewardHint: "x1 XP",
    xpMultiplier: 1,
    requiresCategoryPicker: false,
    allowMultipleCategories: true,
    useFavoriteCategories: true,
    allowDifficultySelector: true,
  },
];

export function getLearningMode(id: LearningModeId): LearningModeConfig {
  const mode = LEARNING_MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown learning mode: ${id}`);
  return mode;
}

export function estimateMinutes(
  mode: LearningModeConfig,
  difficulty: DifficultyConfig,
): number {
  const sessionLength = Math.round(
    mode.baseSessionLength * difficulty.lengthMultiplier,
  );
  const questionTime = mode.baseQuestionTimeSeconds * difficulty.timeMultiplier;
  // Rough estimate: question time + ~4s to read/react, per question.
  return Math.max(1, Math.round((sessionLength * (questionTime + 4)) / 60));
}
