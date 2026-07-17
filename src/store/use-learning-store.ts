import { create } from "zustand";

import { XP_REWARDS } from "@/lib/constants";
import { getObjectsForCategories } from "@/lib/map/geo-objects";
import type { LearningModeId } from "@/lib/learning";
import type { GeoObject, GeoObjectCategory } from "@/types";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

type SessionStatus = "idle" | "active" | "answered" | "finished";

export interface StartSessionConfig {
  mode: LearningModeId;
  categories: GeoObjectCategory[];
  sessionLength: number;
  questionTimeSeconds: number;
  hintsAllowed: boolean;
  /** XP multiplier applied on top of the base per-question reward (modes like Exam/Time Attack pay more). */
  xpMultiplier: number;
}

interface LearningState {
  status: SessionStatus;
  mode: LearningModeId | null;
  categories: GeoObjectCategory[];
  /** Every candidate shown as a clickable marker for the active categories. */
  pool: GeoObject[];
  /** The shuffled question order for this session (subset of `pool`). */
  queue: GeoObject[];
  currentIndex: number;
  selectedAnswerId: string | null;
  lastResult: "correct" | "incorrect" | null;
  score: number;
  correctCount: number;
  totalCount: number;
  combo: number;
  bestCombo: number;
  timeLeft: number;
  hintUsed: boolean;

  // Per-session config, fixed for the duration of the session.
  questionTimeSeconds: number;
  hintsAllowed: boolean;
  xpMultiplier: number;

  startSession: (config: StartSessionConfig) => void;
  restartSession: () => void;
  selectAnswer: (pointId: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  useHint: () => void;
  tick: () => void;
  resetSession: () => void;
}

const initialCounters = {
  currentIndex: 0,
  selectedAnswerId: null as string | null,
  lastResult: null as "correct" | "incorrect" | null,
  score: 0,
  correctCount: 0,
  totalCount: 0,
  combo: 0,
  bestCombo: 0,
  hintUsed: false,
};

export const useLearningStore = create<LearningState>((set, get) => ({
  status: "idle",
  mode: null,
  categories: [],
  pool: [],
  queue: [],
  questionTimeSeconds: 20,
  hintsAllowed: true,
  xpMultiplier: 1,
  timeLeft: 20,
  ...initialCounters,

  startSession: (config) => {
    const pool = getObjectsForCategories(config.categories);
    const queue = shuffle(pool).slice(
      0,
      Math.min(config.sessionLength, pool.length),
    );

    set({
      status: "active",
      mode: config.mode,
      categories: config.categories,
      pool,
      queue,
      questionTimeSeconds: config.questionTimeSeconds,
      hintsAllowed: config.hintsAllowed,
      xpMultiplier: config.xpMultiplier,
      timeLeft: config.questionTimeSeconds,
      ...initialCounters,
    });
  },

  restartSession: () => {
    const state = get();
    get().startSession({
      mode: state.mode ?? "practice",
      categories: state.categories,
      sessionLength: state.queue.length,
      questionTimeSeconds: state.questionTimeSeconds,
      hintsAllowed: state.hintsAllowed,
      xpMultiplier: state.xpMultiplier,
    });
  },

  selectAnswer: (pointId) => {
    if (get().status !== "active") return;
    set({ selectedAnswerId: pointId });
  },

  submitAnswer: () => {
    const state = get();
    if (state.status !== "active") return;
    const current = state.queue[state.currentIndex];
    if (!current) return;

    const isCorrect = state.selectedAnswerId === current.id;
    const nextCombo = isCorrect ? state.combo + 1 : 0;
    const comboMultiplier = 1 + nextCombo * XP_REWARDS.comboMultiplierStep;
    const speedBonus =
      state.timeLeft > state.questionTimeSeconds * 0.6
        ? XP_REWARDS.fastAnswerBonus
        : 0;
    const earned = isCorrect
      ? Math.round(
          (XP_REWARDS.correctAnswer + speedBonus) *
            comboMultiplier *
            state.xpMultiplier,
        )
      : 0;

    set({
      status: "answered",
      lastResult: isCorrect ? "correct" : "incorrect",
      score: state.score + earned,
      correctCount: state.correctCount + (isCorrect ? 1 : 0),
      totalCount: state.totalCount + 1,
      combo: nextCombo,
      bestCombo: Math.max(state.bestCombo, nextCombo),
    });
  },

  nextQuestion: () => {
    const state = get();
    const isLast = state.currentIndex >= state.queue.length - 1;

    if (isLast) {
      set({ status: "finished" });
      return;
    }

    set({
      status: "active",
      currentIndex: state.currentIndex + 1,
      selectedAnswerId: null,
      lastResult: null,
      timeLeft: state.questionTimeSeconds,
      hintUsed: false,
    });
  },

  useHint: () => set({ hintUsed: true }),

  tick: () => {
    const state = get();
    if (state.status !== "active") return;

    if (state.timeLeft <= 1) {
      get().submitAnswer();
      return;
    }

    set({ timeLeft: state.timeLeft - 1 });
  },

  resetSession: () =>
    set({
      status: "idle",
      mode: null,
      categories: [],
      pool: [],
      queue: [],
      ...initialCounters,
    }),
}));
