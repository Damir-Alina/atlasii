"use client";

import { motion } from "framer-motion";
import { Award, RotateCcw, Target, Zap } from "lucide-react";
import Link from "next/link";

import { Button, Card } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ROUTES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { useLearningStore } from "@/store";

export function SessionSummary({
  onRestart,
  onChooseAnotherMode,
}: {
  onRestart: () => void;
  onChooseAnotherMode: () => void;
}) {
  const score = useLearningStore((s) => s.score);
  const correctCount = useLearningStore((s) => s.correctCount);
  const totalCount = useLearningStore((s) => s.totalCount);
  const bestCombo = useLearningStore((s) => s.bestCombo);
  const categories = useLearningStore((s) => s.categories);

  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-lg text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-premium/15 text-premium"
      >
        <Award className="h-8 w-8" />
      </motion.div>

      <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        Сессия завершена!
      </h2>
      <p className="mt-2 text-muted-foreground">
        Вы ответили на {totalCount} {totalCount === 1 ? "вопрос" : "вопросов"}
        {" "}из категорий: {categories.length}.
      </p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <Zap className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
              {formatNumber(score)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">XP</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <Target className="mx-auto h-5 w-5 text-success" />
            <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
              {accuracy}%
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Точность</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <RotateCcw className="mx-auto h-5 w-5 text-premium" />
            <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
              {bestCombo}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Лучшая серия</p>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={onRestart}>Пройти ещё раз</Button>
        <Button variant="secondary" onClick={onChooseAnotherMode}>
          Выбрать другой режим
        </Button>
        <Link href={ROUTES.dashboard}>
          <Button variant="ghost" className="w-full sm:w-auto">
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
