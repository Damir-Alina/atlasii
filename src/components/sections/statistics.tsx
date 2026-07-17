"use client";

import { motion } from "framer-motion";

import { SparklineChart } from "@/components/charts";
import { Card, CardContent } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HERO_STATS } from "@/lib/constants";

const ACCURACY_TREND = [20, 35, 30, 48, 42, 60, 55, 72, 68, 85, 80, 96];

export function Statistics() {
  return (
    <section id="stats" className="container py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Результаты, которым доверяют
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Тысячи учеников уже используют AtlasIQ для подготовки к ЕНТ — вот
            что показывает статистика платформы.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-10 grid grid-cols-2 gap-5"
          >
            {HERO_STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <Card className="p-5">
                  <p className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Card className="overflow-hidden p-6">
          <CardContent className="p-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Средняя точность за 12 недель
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-success">
                  +40%
                </p>
              </div>
              <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                Растёт каждую неделю
              </span>
            </div>
            <SparklineChart data={ACCURACY_TREND} color="success" height={128} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
