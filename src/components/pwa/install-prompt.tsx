"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "atlasiq-install-dismissed";

export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setVisible(false);
    setDeferredEvent(null);
  }

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-4 bottom-4 z-[80] mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-card-hover backdrop-blur-xl sm:inset-x-auto sm:right-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
            <Download className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Установить AtlasIQ</p>
            <p className="text-xs text-muted-foreground">
              Быстрый доступ с главного экрана
            </p>
          </div>
          <Button size="sm" onClick={handleInstall}>
            Установить
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Закрыть"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-overlay hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
