"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";

import { Button } from "@/components/ui";
import { KazakhstanMap } from "@/components/map";
import { CATEGORY_QUESTION_PROMPTS } from "@/lib/map/geo-objects";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store";
import type { MapPoint } from "@/types";

export function QuestionPanel() {
  const status = useLearningStore((s) => s.status);
  const pool = useLearningStore((s) => s.pool);
  const queue = useLearningStore((s) => s.queue);
  const currentIndex = useLearningStore((s) => s.currentIndex);
  const selectedAnswerId = useLearningStore((s) => s.selectedAnswerId);
  const lastResult = useLearningStore((s) => s.lastResult);
  const hintUsed = useLearningStore((s) => s.hintUsed);
  const hintsAllowed = useLearningStore((s) => s.hintsAllowed);
  const selectAnswer = useLearningStore((s) => s.selectAnswer);
  const submitAnswer = useLearningStore((s) => s.submitAnswer);
  const nextQuestion = useLearningStore((s) => s.nextQuestion);
  const useHint = useLearningStore((s) => s.useHint);

  const current = queue[currentIndex];
  if (!current) return null;

  const isAnswered = status === "answered";
  const isCorrect = lastResult === "correct";

  function handleSelectPoint(point: MapPoint) {
    if (status !== "active") return;
    selectAnswer(point.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {CATEGORY_QUESTION_PROMPTS[current.category]}
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {current.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Нажмите на правильный объект на карте
        </p>
        <AnimatePresence>
          {hintUsed && !isAnswered && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-start gap-1.5 rounded-lg bg-primary-muted px-3 py-2 text-sm text-primary"
            >
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {current.fact}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="h-[45vh] overflow-hidden rounded-2xl border border-border shadow-card sm:h-[50vh]">
        <KazakhstanMap
          points={pool}
          selectedId={selectedAnswerId}
          correctId={isAnswered ? current.id : null}
          incorrectId={isAnswered && !isCorrect ? selectedAnswerId : null}
          disabled={isAnswered}
          onSelectPoint={handleSelectPoint}
          className="h-full w-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4",
              isCorrect
                ? "border-success/30 bg-success/10"
                : "border-destructive/30 bg-destructive/10",
            )}
          >
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            )}
            <div>
              <p
                className={cn(
                  "font-medium",
                  isCorrect ? "text-success" : "text-destructive",
                )}
              >
                {isCorrect ? "Верно!" : `Неверно — это ${current.name}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {current.fact}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        {hintsAllowed ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={hintUsed || isAnswered}
            onClick={useHint}
            className="gap-1.5"
          >
            <Lightbulb className="h-4 w-4" />
            Подсказка
          </Button>
        ) : (
          <span />
        )}

        {isAnswered ? (
          <Button onClick={nextQuestion}>Далее</Button>
        ) : (
          <Button disabled={!selectedAnswerId} onClick={submitAnswer}>
            Проверить ответ
          </Button>
        )}
      </div>
    </div>
  );
}
