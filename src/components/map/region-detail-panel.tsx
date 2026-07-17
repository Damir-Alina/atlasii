"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import Link from "next/link";

import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import type { Region } from "@/types";

export function RegionDetailPanel({
  region,
  onClose,
}: {
  region: Region | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {region ? (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {region.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {region.capital}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-overlay hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {region.fact}
            </p>

            <Link href={ROUTES.learn} className="mt-6 block">
              <Button className="w-full">Тренироваться по этой области</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Кликните на область на карте или найдите её через поиск, чтобы
              увидеть подробности.
            </p>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
