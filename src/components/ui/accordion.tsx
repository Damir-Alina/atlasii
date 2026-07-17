"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
  /** Allow more than one item open at once. Defaults to false (single-open FAQ style). */
  allowMultiple?: boolean;
}

export function Accordion({
  items,
  className,
  allowMultiple = false,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) return prev.filter((openId) => openId !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-surface-elevated/60"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-foreground">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180 text-primary",
                )}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
