"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.value,
  );
  const active = value ?? internalValue;

  function handleSelect(next: string) {
    setInternalValue(next);
    onChange?.(next);
  }

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => handleSelect(item.value)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tabs-active-indicator"
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
