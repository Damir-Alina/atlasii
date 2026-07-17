import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

const VARIANT_CLASSES = {
  primary:
    "bg-primary text-primary-foreground shadow-glow-primary hover:brightness-110 active:brightness-95",
  secondary:
    "bg-surface-elevated text-foreground border border-border-strong hover:bg-surface-overlay",
  outline:
    "border border-border-strong bg-transparent text-foreground hover:bg-surface-elevated",
  ghost: "bg-transparent text-foreground hover:bg-surface-elevated",
  destructive:
    "bg-destructive text-destructive-foreground hover:brightness-110",
  premium:
    "bg-premium text-premium-foreground shadow-glow-premium hover:brightness-105",
} as const;

const SIZE_CLASSES = {
  sm: "h-9 rounded-md px-3.5 text-sm gap-1.5",
  md: "h-11 rounded-lg px-5 text-sm gap-2",
  lg: "h-12 rounded-xl px-7 text-base gap-2.5",
  icon: "h-11 w-11 rounded-lg",
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;
export type ButtonSize = keyof typeof SIZE_CLASSES;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? isLoading}
        className={cn(
          "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-smooth",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
