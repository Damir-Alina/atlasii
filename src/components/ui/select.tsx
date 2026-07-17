"use client";

import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Select({
  options,
  value,
  placeholder = "Выберите...",
  onChange,
  error,
  className,
  disabled,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
    }
    if (!open && ["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      setOpen(true);
      setActiveIndex(
        options.findIndex((option) => option.value === value) || 0,
      );
      return;
    }
    if (open) {
      if (event.key === "ArrowDown") {
        setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
      } else if (event.key === "ArrowUp") {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter" || event.key === " ") {
        const option = options[activeIndex];
        if (option) {
          onChange(option.value);
          setOpen(false);
        }
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground",
          "transition-colors duration-200 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:opacity-50",
          error && "border-destructive",
        )}
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-in absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-border bg-surface-elevated p-1.5 shadow-card-hover"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer rounded-md px-3 py-2 text-sm text-foreground",
                index === activeIndex && "bg-surface-overlay",
                option.value === value && "text-primary",
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
