"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Compass, Landmark, Lock, Mountain, Waves, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge, Button, Card } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { FREE_CATEGORIES } from "@/lib/billing";
import { ROUTES } from "@/lib/constants";
import { CATEGORY_LABELS, GEO_OBJECTS_BY_CATEGORY } from "@/lib/map/geo-objects";
import { cn } from "@/lib/utils";
import type { GeoObjectCategory } from "@/types";

const CATEGORY_ICONS: Record<GeoObjectCategory, LucideIcon> = {
  region: Compass,
  city: Landmark,
  river: Waves,
  lake: MapPin,
  mountain: Mountain,
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as GeoObjectCategory[];

export function CategoryPicker({
  onStart,
  onBack,
  multiple = true,
  startLabel = "Начать обучение",
  isPremium = true,
}: {
  onStart: (categories: GeoObjectCategory[]) => void;
  onBack?: () => void;
  /** false = single-select (used by Category Challenge mode). */
  multiple?: boolean;
  startLabel?: string;
  /** Free accounts can only select FREE_CATEGORIES — others render locked. */
  isPremium?: boolean;
}) {
  const [selected, setSelected] = useState<GeoObjectCategory[]>(["region"]);

  function isLocked(category: GeoObjectCategory): boolean {
    return !isPremium && !FREE_CATEGORIES.includes(category);
  }

  function toggle(category: GeoObjectCategory) {
    if (isLocked(category)) return;

    if (!multiple) {
      setSelected([category]);
      return;
    }
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад к режимам
        </button>
      )}

      {!isPremium && (
        <p className="mb-4 text-sm text-muted-foreground">
          На бесплатном плане доступно {FREE_CATEGORIES.length} темы.{" "}
          <Link href={ROUTES.pricing} className="text-primary hover:underline">
            Открыть все с Premium
          </Link>
        </p>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ALL_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const isSelected = selected.includes(category);
          const locked = isLocked(category);
          const count = GEO_OBJECTS_BY_CATEGORY[category].length;

          return (
            <motion.button
              key={category}
              type="button"
              variants={fadeUp}
              onClick={() => toggle(category)}
              disabled={locked}
              className={cn("text-left", locked && "cursor-not-allowed")}
            >
              <Card
                hoverable={!locked}
                className={cn(
                  "flex items-center gap-4 p-5",
                  isSelected && "border-primary/50 ring-1 ring-primary/30",
                  locked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary-muted text-primary",
                  )}
                >
                  {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{CATEGORY_LABELS[category]}</p>
                  <p className="text-xs text-muted-foreground">
                    {count} объектов
                  </p>
                </div>
                {locked && <Badge variant="premium">Premium</Badge>}
              </Card>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          disabled={selected.length === 0}
          onClick={() => onStart(selected)}
        >
          {startLabel}
        </Button>
      </div>
    </div>
  );
}
