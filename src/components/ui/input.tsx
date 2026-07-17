import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, endAdornment, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors duration-200 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
              icon && "pl-10",
              endAdornment && "pr-10",
              error && "border-destructive focus-visible:ring-destructive/30",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endAdornment}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
