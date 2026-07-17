/** XP required to go from level N to N+1 grows linearly to keep early levels fast and later levels aspirational. */
export const BASE_XP_PER_LEVEL = 600;
export const XP_LEVEL_GROWTH = 150;

export function xpRequiredForLevel(level: number): number {
  return BASE_XP_PER_LEVEL + (level - 1) * XP_LEVEL_GROWTH;
}

export const XP_REWARDS = {
  correctAnswer: 10,
  fastAnswerBonus: 5,
  comboMultiplierStep: 0.1,
  dailyStreakBonus: 20,
} as const;
