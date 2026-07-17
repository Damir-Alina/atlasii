"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Modal } from "./modal";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  return (
    <Modal open={open} onClose={onClose} className={className}>
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className={cn(
            "shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-overlay hover:text-foreground",
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {children && <div className="p-6">{children}</div>}

      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          {footer}
        </div>
      )}
    </Modal>
  );
}
