import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * AtlasIQ type scale (all sizes are Tailwind defaults, listed here so the
 * whole team uses the same steps instead of picking arbitrary values):
 *
 *   display  → text-5xl/6xl  font-display  — hero headlines only
 *   h1       → text-4xl      font-display  — page titles
 *   h2       → text-2xl      font-display  — section titles
 *   h3       → text-lg       font-display  — card titles
 *   body     → text-base     font-sans     — default copy
 *   small    → text-sm       font-sans     — secondary copy, labels
 *   caption  → text-xs       font-sans     — timestamps, meta
 *   mono     → text-sm       font-mono     — XP, timers, coordinates
 */
type HeadingLevel = "display" | "h1" | "h2" | "h3";

const HEADING_CLASSES: Record<HeadingLevel, string> = {
  display:
    "font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05]",
  h1: "font-display text-4xl font-semibold tracking-tight leading-tight",
  h2: "font-display text-2xl font-semibold tracking-tight leading-tight",
  h3: "font-display text-lg font-semibold tracking-tight leading-snug",
};

const HEADING_TAGS: Record<HeadingLevel, "h1" | "h2" | "h3"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = "h1", className, ...props }, ref) => {
    const Tag = HEADING_TAGS[level];
    return (
      <Tag
        ref={ref}
        className={cn(HEADING_CLASSES[level], className)}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

type TextVariant = "body" | "small" | "caption" | "mono";

const TEXT_CLASSES: Record<TextVariant, string> = {
  body: "font-sans text-base leading-relaxed",
  small: "font-sans text-sm leading-relaxed",
  caption: "font-sans text-xs text-muted-foreground",
  mono: "font-mono text-sm tabular-nums",
};

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  muted?: boolean;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = "body", muted = false, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        TEXT_CLASSES[variant],
        muted && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Text.displayName = "Text";
