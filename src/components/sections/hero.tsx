"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HERO_STATS, ROUTES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

/**
 * Decorative "constellation" graphic — a loose network of nodes and edges
 * that reads as "a map you explore," without claiming to be an accurate
 * outline of Kazakhstan (the real boundary data belongs to the MapLibre
 * integration in Stage 6).
 */
function HeroGraphic() {
  const nodes = [
    { x: 60, y: 90, r: 5 },
    { x: 140, y: 40, r: 4 },
    { x: 230, y: 70, r: 6 },
    { x: 320, y: 30, r: 4 },
    { x: 380, y: 110, r: 5 },
    { x: 300, y: 150, r: 4 },
    { x: 200, y: 180, r: 7 },
    { x: 110, y: 170, r: 4 },
    { x: 40, y: 210, r: 4 },
    { x: 260, y: 230, r: 4 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [6, 2],
    [6, 9],
    [1, 7],
  ];

  return (
    <svg
      viewBox="0 0 420 260"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const from = nodes[a];
        const to = nodes[b];
        if (!from || !to) return null;
        return (
          <motion.line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="hsl(var(--primary))"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.06 }}
          />
        );
      })}
      {nodes.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r * 4}
            fill="url(#nodeGlow)"
            opacity={0.5}
          />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
          />
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[length:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="container relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
          >
            🇰🇿 Подготовка к ЕНТ по географии
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Изучай географию умнее с{" "}
            <span className="text-primary">AtlasIQ</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg text-lg text-muted-foreground"
          >
            Интерактивная платформа для подготовки к ЕНТ по географии. Изучай
            карту Казахстана, тренируйся и достигай лучших результатов.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link href={ROUTES.register}>
              <Button size="lg">Начать обучение</Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="secondary">
                Подробнее
              </Button>
            </Link>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto aspect-[420/260] w-full max-w-xl rounded-2xl border border-border bg-surface-elevated/40 p-6 shadow-card backdrop-blur-xl"
        >
          <HeroGraphic />
          <div className="pointer-events-none absolute -bottom-4 -right-4 rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-card-hover">
            <p className="text-xs text-muted-foreground">Точность</p>
            <p className="font-mono text-lg font-semibold text-success">
              {formatNumber(92)}%
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
