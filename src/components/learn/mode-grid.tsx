"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Shuffle,
  Target,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  DIFFICULTIES,
  LEARNING_MODES,
  estimateMinutes,
  type LearningModeId,
} from "@/lib/learning";

const MODE_ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  timer: Timer,
  shuffle: Shuffle,
  target: Target,
  heart: Heart,
};

const MEDIUM_DIFFICULTY = DIFFICULTIES.find((d) => d.id === "medium")!;

export function ModeGrid({
  onSelectMode,
}: {
  onSelectMode: (modeId: LearningModeId) => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Выберите режим обучения
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          От спокойной практики до экзаменационного стресс-теста.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {LEARNING_MODES.map((mode) => {
          const Icon = MODE_ICONS[mode.icon] ?? BookOpen;
          const minutes = estimateMinutes(mode, MEDIUM_DIFFICULTY);

          return (
            <motion.button
              key={mode.id}
              type="button"
              variants={fadeUp}
              onClick={() => onSelectMode(mode.id)}
              className="text-left"
            >
              <Card hoverable className="flex h-full flex-col gap-4 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-muted text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {mode.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {mode.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">~{minutes} мин</Badge>
                  <Badge variant="primary">{mode.xpRewardHint}</Badge>
                  {!mode.hintsAllowed && (
                    <Badge variant="warning">Без подсказок</Badge>
                  )}
                </div>
              </Card>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
