"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Input, Tabs } from "@/components/ui";
import type { LeaderboardEntry } from "@/lib/repositories";
import { LEADERBOARD_PAGE_SIZE } from "@/lib/repositories";

import { PlayerRow } from "./player-row";

type Metric = "global" | "weekly" | "monthly" | "friends" | "accuracy" | "streak";

const TABS: { value: Metric; label: string }[] = [
  { value: "global", label: "Глобальный" },
  { value: "weekly", label: "Неделя" },
  { value: "monthly", label: "Месяц" },
  { value: "friends", label: "Друзья" },
  { value: "accuracy", label: "Точность" },
  { value: "streak", label: "Серия" },
];

const UNITS: Record<Metric, string> = {
  global: "XP",
  weekly: "XP",
  monthly: "XP",
  friends: "",
  accuracy: "%",
  streak: "дней",
};

export function LeaderboardExplorer({
  currentUserId,
  initialEntries,
  initialTotalCount,
}: {
  currentUserId: string;
  initialEntries: LeaderboardEntry[];
  initialTotalCount: number;
}) {
  const [metric, setMetric] = useState<Metric>("global");
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState(initialEntries);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (metric === "friends") return;

    const trimmed = query.trim();
    const controller = new AbortController();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.set("metric", metric);
      params.set("page", String(page));
    }

    const timeout = setTimeout(
      () => {
        fetch(`/api/leaderboard?${params.toString()}`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then((data: { entries: LeaderboardEntry[]; totalCount: number }) => {
            setEntries(data.entries);
            setTotalCount(data.totalCount);
          })
          .catch(() => null)
          .finally(() => setIsLoading(false));
      },
      trimmed ? 300 : 0,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [metric, page, query]);

  const totalPages = Math.max(1, Math.ceil(totalCount / LEADERBOARD_PAGE_SIZE));
  const showPagination = !query.trim() && metric !== "friends";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          items={TABS}
          value={metric}
          onChange={(value) => {
            setMetric(value as Metric);
            setPage(0);
            setQuery("");
          }}
        />
        <div className="sm:w-64">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Найти игрока..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {metric === "friends" && !query.trim() ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-elevated/60 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary">
            <Users className="h-5 w-5" />
          </span>
          <p className="font-medium">Рейтинг друзей скоро появится</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Добавление друзей будет доступно в одном из следующих обновлений.
          </p>
        </div>
      ) : (
        <div
          className={
            isLoading ? "opacity-60 transition-opacity" : "transition-opacity"
          }
        >
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <PlayerRow
                  key={entry.userId}
                  entry={entry}
                  unit={UNITS[metric]}
                  isCurrentUser={entry.userId === currentUserId}
                />
              ))}
            </AnimatePresence>

            {entries.length === 0 && (
              <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
                Ничего не найдено.
              </div>
            )}
          </div>

          {showPagination && totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-label="Предыдущая страница"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                Страница {page + 1} из {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-label="Следующая страница"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
