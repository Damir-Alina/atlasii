"use client";

import { useEffect, useRef, useState } from "react";

import { CATEGORY_LABELS } from "@/lib/map/geo-objects";
import { getLearningMode, type LearningModeId } from "@/lib/learning";
import { useLearningStore } from "@/store";
import type { GeoObjectCategory } from "@/types";

import { DailyLimitUpsell } from "./daily-limit-upsell";
import { ModeGrid } from "./mode-grid";
import { ModeSetup } from "./mode-setup";
import { QuestionPanel } from "./question-panel";
import { SessionHeader } from "./session-header";
import { SessionSummary } from "./session-summary";
import { StatsSidebar } from "./stats-sidebar";

export function LearnSession({
  isPremium,
  dailyLimitReached,
}: {
  isPremium: boolean;
  dailyLimitReached: boolean;
}) {
  const status = useLearningStore((s) => s.status);
  const categories = useLearningStore((s) => s.categories);
  const startSession = useLearningStore((s) => s.startSession);
  const restartSession = useLearningStore((s) => s.restartSession);
  const resetSession = useLearningStore((s) => s.resetSession);
  const hasSubmittedRef = useRef(false);
  const sessionStartedAtRef = useRef<number | null>(null);

  // Local, UI-only: which mode is being configured before a session
  // actually starts. Independent of the store's `status`, since both the
  // mode grid and the mode setup screen happen while status is still "idle".
  const [selectedModeId, setSelectedModeId] = useState<LearningModeId | null>(
    null,
  );

  // Own the countdown interval here so the store stays free of side effects.
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      useLearningStore.getState().tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Mark the session start the first time it goes active (not on every
  // question — sessionStartedAtRef persists across question transitions).
  useEffect(() => {
    if (status === "active" && sessionStartedAtRef.current === null) {
      sessionStartedAtRef.current = Date.now();
    }
  }, [status]);

  // Persist the session once it finishes (Stage 9/10). Silently no-ops if
  // the request fails (e.g. migrations not applied) — the local session
  // summary already rendered from client-side state either way.
  useEffect(() => {
    if (status !== "finished" || hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    const { score, correctCount, totalCount } = useLearningStore.getState();
    const categoryName = categories
      .map((category: GeoObjectCategory) => CATEGORY_LABELS[category])
      .join(", ");
    const durationSeconds = sessionStartedAtRef.current
      ? Math.round((Date.now() - sessionStartedAtRef.current) / 1000)
      : 0;

    fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryName,
        accuracy: totalCount > 0 ? correctCount / totalCount : 0,
        xpEarned: score,
        correctCount,
        totalCount,
        durationSeconds,
      }),
    }).catch(() => null);
  }, [status, categories]);

  // A fresh session (idle→active, or finished→active on "restart") should
  // be eligible to submit again once it finishes.
  useEffect(() => {
    if (status === "active") hasSubmittedRef.current = false;
  }, [status]);

  // Null the start-time ref once a session ends, so the "mark start" effect
  // above captures a brand-new timestamp for the next session rather than
  // reusing a stale one.
  useEffect(() => {
    if (status === "finished" || status === "idle") {
      sessionStartedAtRef.current = null;
    }
  }, [status]);

  function handleChooseAnotherMode() {
    resetSession();
    setSelectedModeId(null);
  }

  if (status === "finished") {
    return (
      <SessionSummary
        onRestart={restartSession}
        onChooseAnotherMode={handleChooseAnotherMode}
      />
    );
  }

  if (status === "idle") {
    if (!selectedModeId) {
      if (dailyLimitReached) {
        return <DailyLimitUpsell />;
      }
      return <ModeGrid onSelectMode={setSelectedModeId} />;
    }

    return (
      <ModeSetup
        mode={getLearningMode(selectedModeId)}
        isPremium={isPremium}
        onStart={startSession}
        onBack={() => setSelectedModeId(null)}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-5">
        <SessionHeader onExit={handleChooseAnotherMode} />
        <QuestionPanel />
      </div>
      <StatsSidebar />
    </div>
  );
}
