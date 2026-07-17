import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full resize-y rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors duration-200 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
            error && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
