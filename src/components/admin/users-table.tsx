"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, Badge, Button, Input, Select } from "@/components/ui";
import type { AdminUserRow } from "@/lib/repositories";
import { ADMIN_PAGE_SIZE } from "@/lib/repositories";
import { formatNumber } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "user", label: "Пользователь" },
  { value: "admin", label: "Админ" },
];

export function UsersTable({
  initialUsers,
  initialTotalCount,
}: {
  initialUsers: AdminUserRow[];
  initialTotalCount: number;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState(initialUsers);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => {
        const params = new URLSearchParams({
          search,
          page: String(page),
        });
        fetch(`/api/admin/users?${params.toString()}`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then((data: { users: AdminUserRow[]; totalCount: number }) => {
            setUsers(data.users);
            setTotalCount(data.totalCount);
          })
          .catch(() => null);
      },
      search ? 300 : 0,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, page]);

  async function updateUser(userId: string, patch: Record<string, unknown>) {
    setPendingId(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...patch }),
    }).catch(() => null);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              ...("role" in patch ? { role: patch.role as "user" | "admin" } : {}),
              ...("isPremium" in patch
                ? { isPremium: patch.isPremium as boolean }
                : {}),
            }
          : u,
      ),
    );
    setPendingId(null);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <div className="sm:w-72">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Поиск по имени..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
              <div>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Уровень {user.level} · {formatNumber(user.totalXp)} XP
                </p>
              </div>
              {user.role === "admin" && <Badge variant="primary">Admin</Badge>}
              {user.isPremium && <Badge variant="premium">Premium</Badge>}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-40">
                <Select
                  options={ROLE_OPTIONS}
                  value={user.role}
                  disabled={pendingId === user.id}
                  onChange={(value) =>
                    updateUser(user.id, { role: value as "user" | "admin" })
                  }
                />
              </div>
              <Button
                size="sm"
                variant="secondary"
                disabled={pendingId === user.id}
                onClick={() =>
                  updateUser(user.id, { isPremium: !user.isPremium })
                }
              >
                {user.isPremium ? "Убрать Premium" : "Дать Premium"}
              </Button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
            Пользователи не найдены.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Назад
          </Button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  );
}
