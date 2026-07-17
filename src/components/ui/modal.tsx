"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { overlayVariants, modalVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-w-md rounded-2xl border border-border bg-surface-elevated shadow-card-hover",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
