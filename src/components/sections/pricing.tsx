"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

import { Badge, Button, Card } from "@/components/ui";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { PRICING_PLANS, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="container py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Тарифы
        </h2>
        <p className="mt-4 text-muted-foreground">
          Выберите план, который подходит именно вам.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2"
      >
        {PRICING_PLANS.map((plan) => (
          <motion.div key={plan.id} variants={fadeUp}>
            <Card
              className={cn(
                "flex h-full flex-col p-7",
                plan.highlighted &&
                  "border-primary/40 shadow-glow-primary ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {plan.name}
                </h3>
                {plan.highlighted && <Badge variant="premium">Popular</Badge>}
              </div>

              <p className="mt-4">
                <span className="font-display text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={ROUTES.register} className="mt-8">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "primary" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
