"use client";

import { motion } from "framer-motion";

import { fadeUp, staggerContainer } from "@/lib/animations";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/60 bg-surface/40">
      <div className="container py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Как это работает
          </h2>
          <p className="mt-4 text-muted-foreground">
            От первого клика по карте до уверенной сдачи ЕНТ — четыре простых
            шага.
          </p>
        </div>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
          />
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              variants={fadeUp}
              className="relative flex flex-col items-start gap-4"
            >
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-surface-elevated font-display text-lg font-semibold text-primary">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
