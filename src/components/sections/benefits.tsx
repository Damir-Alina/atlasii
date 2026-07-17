"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { fadeUp, staggerContainer } from "@/lib/animations";
import { BENEFITS } from "@/lib/constants";

export function Benefits() {
  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="container grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Почему AtlasIQ работает лучше
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Мы построили платформу вокруг того, как на самом деле запоминается
            география — через практику и визуальную память, а не пересказ
            учебника.
          </p>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-5"
        >
          {BENEFITS.map((benefit) => (
            <motion.li
              key={benefit.title}
              variants={fadeUp}
              className="flex gap-4 rounded-xl border border-border bg-surface-elevated/60 p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
