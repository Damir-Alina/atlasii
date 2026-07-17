"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Card, Dialog, Input, Select } from "@/components/ui";
import type { AdminQuestionRow } from "@/lib/repositories";
import { ADMIN_PAGE_SIZE } from "@/lib/repositories";
import type { Category } from "@/types";

interface FormState {
  id?: string;
  categoryId: string;
  type: string;
  targetName: string;
  lng: number;
  lat: number;
  fact: string;
}

function emptyForm(defaultCategoryId: string): FormState {
  return {
    categoryId: defaultCategoryId,
    type: "find_region",
    targetName: "",
    lng: 0,
    lat: 0,
    fact: "",
  };
}

export function QuestionsManager({
  categories,
  initialQuestions,
  initialTotalCount,
}: {
  categories: Category[];
  initialQuestions: AdminQuestionRow[];
  initialTotalCount: number;
}) {
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [questions, setQuestions] = useState(initialQuestions);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(categories[0]?.id ?? ""));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => {
        const params = new URLSearchParams({ search, page: String(page) });
        if (categoryFilter) params.set("categoryId", categoryFilter);

        fetch(`/api/admin/questions?${params.toString()}`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then(
            (data: { questions: AdminQuestionRow[]; totalCount: number }) => {
              setQuestions(data.questions);
              setTotalCount(data.totalCount);
            },
          )
          .catch(() => null);
      },
      search ? 300 : 0,
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [categoryFilter, search, page]);

  function openCreate() {
    setForm(emptyForm(categoryFilter || categories[0]?.id || ""));
    setDialogOpen(true);
  }

  function openEdit(q: AdminQuestionRow) {
    setForm({
      id: q.id,
      categoryId: q.categoryId,
      type: q.type,
      targetName: q.targetName,
      lng: q.lng,
      lat: q.lat,
      fact: q.fact ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setIsSaving(true);
    const method = form.id ? "PATCH" : "POST";
    await fetch("/api/admin/questions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);

    setQuestions((prev) => {
      if (!form.id) return prev; // full list refresh needed to see new id — kept simple for this stage
      const category = categories.find((c) => c.id === form.categoryId);
      return prev.map((q) =>
        q.id === form.id
          ? { ...q, ...form, categoryName: category?.name ?? q.categoryName }
          : q,
      );
    });

    setIsSaving(false);
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить вопрос?")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" }).catch(
      () => null,
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="sm:w-56">
            <Select
              options={[{ value: "", label: "Все категории" }, ...categoryOptions]}
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setPage(0);
              }}
            />
          </div>
          <div className="sm:w-64">
            <Input
              icon={<Search className="h-4 w-4" />}
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Добавить вопрос
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <Card
            key={q.id}
            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{q.targetName}</p>
              <p className="text-xs text-muted-foreground">
                {q.categoryName} · {q.lng.toFixed(2)}, {q.lat.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openEdit(q)}
                aria-label={`Редактировать ${q.targetName}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(q.id)}
                aria-label={`Удалить ${q.targetName}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}

        {questions.length === 0 && (
          <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
            Вопросы не найдены.
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={form.id ? "Редактировать вопрос" : "Новый вопрос"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              Сохранить
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Категория</label>
            <Select
              options={categoryOptions}
              value={form.categoryId}
              onChange={(value) => setForm({ ...form, categoryId: value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Название</label>
            <Input
              value={form.targetName}
              onChange={(e) => setForm({ ...form, targetName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Долгота (lng)
              </label>
              <Input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) =>
                  setForm({ ...form, lng: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Широта (lat)
              </label>
              <Input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) =>
                  setForm({ ...form, lat: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Факт</label>
            <Input
              value={form.fact}
              onChange={(e) => setForm({ ...form, fact: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
