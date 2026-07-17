"use client";

import { motion } from "framer-motion";
import { BarChart3, Flame, Map, Target, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { FEATURES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  map: Map,
  zap: Zap,
  target: Target,
  flame: Flame,
  trophy: Trophy,
  "bar-chart": BarChart3,
};

export function Features() {
  return (
    <section id="features" className="container py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Всё, что нужно для подготовки к ЕНТ
        </h2>
        <p className="mt-4 text-muted-foreground">
          Не просто тесты — целая система обучения через карту, прогресс и
          мотивацию.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((feature) => {
          const Icon = ICONS[feature.icon] ?? Map;
          return (
            <motion.div key={feature.title} variants={fadeUp}>
              <Card hoverable className="h-full">
                <CardContent className="flex h-full flex-col gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-muted text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
