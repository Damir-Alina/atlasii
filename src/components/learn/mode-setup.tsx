"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";
import { FREE_CATEGORIES } from "@/lib/billing";
import { ROUTES } from "@/lib/constants";
import {
  CATEGORY_LABELS,
  getObjectsForCategories,
} from "@/lib/map/geo-objects";
import {
  DIFFICULTIES,
  FAVORITE_CATEGORIES,
  estimateMinutes,
  type DifficultyId,
  type LearningModeConfig,
} from "@/lib/learning";
import type { StartSessionConfig } from "@/store";
import type { GeoObjectCategory } from "@/types";

import { CategoryPicker } from "./category-picker";
import { DifficultySelector } from "./difficulty-selector";

function shuffleCategories(categories: GeoObjectCategory[]): GeoObjectCategory[] {
  const copy = [...categories];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

const ALL_CATEGORIES: GeoObjectCategory[] = [
  "region",
  "city",
  "river",
  "lake",
  "mountain",
];

export function ModeSetup({
  mode,
  isPremium,
  onStart,
  onBack,
}: {
  mode: LearningModeConfig;
  isPremium: boolean;
  onStart: (config: StartSessionConfig) => void;
  onBack: () => void;
}) {
  const [difficultyId, setDifficultyId] = useState<DifficultyId>("medium");
  const difficulty = DIFFICULTIES.find((d) => d.id === difficultyId)!;

  function buildConfig(categories: GeoObjectCategory[]): StartSessionConfig {
    const sessionLength = Math.max(
      3,
      Math.round(mode.baseSessionLength * difficulty.lengthMultiplier),
    );
    const questionTimeSeconds = Math.max(
      5,
      Math.round(mode.baseQuestionTimeSeconds * difficulty.timeMultiplier),
    );

    return {
      mode: mode.id,
      categories,
      sessionLength,
      questionTimeSeconds,
      hintsAllowed: mode.hintsAllowed,
      xpMultiplier: mode.xpMultiplier,
    };
  }

  function handleStartWithoutPicker() {
    let categories: GeoObjectCategory[] = mode.fixedCategories ?? ALL_CATEGORIES;

    if (mode.randomCategories) {
      const pool = isPremium ? ALL_CATEGORIES : FREE_CATEGORIES;
      const count = Math.max(1, Math.floor(Math.random() * pool.length) + 1);
      categories = shuffleCategories(pool).slice(0, count);
    } else if (mode.useFavoriteCategories) {
      categories = isPremium
        ? FAVORITE_CATEGORIES
        : FAVORITE_CATEGORIES.filter((c) => FREE_CATEGORIES.includes(c));
    } else if (!isPremium) {
      categories = categories.filter((c) => FREE_CATEGORIES.includes(c));
    }

    onStart(buildConfig(categories));
  }

  if (mode.requiresCategoryPicker) {
    return (
      <div>
        <ModeSetupHeader mode={mode} onBack={onBack} />
        {mode.allowDifficultySelector && (
          <Card className="mb-6 p-5">
            <DifficultySelector value={difficultyId} onChange={setDifficultyId} />
          </Card>
        )}
        <CategoryPicker
          multiple={mode.allowMultipleCategories}
          startLabel="Начать"
          isPremium={isPremium}
          onStart={(categories) => onStart(buildConfig(categories))}
        />
      </div>
    );
  }

  const previewCategories = mode.useFavoriteCategories
    ? FAVORITE_CATEGORIES
    : mode.fixedCategories ?? ALL_CATEGORIES;
  const visibleCategories = isPremium
    ? previewCategories
    : previewCategories.filter((c) => FREE_CATEGORIES.includes(c));
  const minutes = estimateMinutes(mode, difficulty);
  const totalObjects = getObjectsForCategories(
    mode.randomCategories ? previewCategories : visibleCategories,
  ).length;

  return (
    <div className="mx-auto max-w-lg">
      <ModeSetupHeader mode={mode} onBack={onBack} />

      <Card className="p-6">
        <p className="text-sm font-medium">
          {mode.randomCategories ? "Категории" : "Темы"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {mode.randomCategories ? (
            <Badge variant="default">
              {isPremium
                ? "Случайный выбор при старте"
                : "Случайный выбор среди бесплатных тем"}
            </Badge>
          ) : (
            visibleCategories.map((category) => (
              <Badge key={category} variant="primary">
                {CATEGORY_LABELS[category]}
              </Badge>
            ))
          )}
        </div>
        {!isPremium && !mode.randomCategories && (
          <p className="mt-2 text-xs text-muted-foreground">
            На бесплатном плане доступны только эти темы.{" "}
            <Link href={ROUTES.pricing} className="text-primary hover:underline">
              Открыть все с Premium
            </Link>
          </p>
        )}
        {!mode.randomCategories && (
          <p className="mt-2 text-xs text-muted-foreground">
            {totalObjects} объектов в пуле
          </p>
        )}

        {mode.allowDifficultySelector && (
          <div className="mt-5">
            <DifficultySelector value={difficultyId} onChange={setDifficultyId} />
          </div>
        )}

        <p className="mt-5 text-sm text-muted-foreground">
          Примерно ~{minutes} мин · {mode.xpRewardHint}
        </p>

        <Button size="lg" className="mt-5 w-full" onClick={handleStartWithoutPicker}>
          Начать
        </Button>
      </Card>
    </div>
  );
}

function ModeSetupHeader({
  mode,
  onBack,
}: {
  mode: LearningModeConfig;
  onBack: () => void;
}) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад к режимам
      </button>
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {mode.title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{mode.description}</p>
    </div>
  );
}
