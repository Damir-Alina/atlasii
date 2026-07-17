"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button, Card, Dialog, Input } from "@/components/ui";
import type { Category } from "@/types";

interface FormState {
  id?: string;
  slug: string;
  name: string;
  icon: string;
}

const EMPTY_FORM: FormState = { slug: "", name: "", icon: "" };

export function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setForm({
      id: category.id,
      slug: category.slug,
      name: category.name,
      icon: category.icon,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setIsSaving(true);
    if (form.id) {
      await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null);
      setCategories((prev) =>
        prev.map((c) => (c.id === form.id ? { ...c, ...form } : c)),
      );
    } else {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null);
      const data = await res?.json().catch(() => null);
      if (data?.category) setCategories((prev) => [...prev, data.category]);
    }
    setIsSaving(false);
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить категорию? Связанные вопросы также будут удалены.")) {
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" }).catch(
      () => null,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Добавить категорию
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                {category.slug} · {category.totalQuestions} вопросов
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openEdit(category)}
                aria-label={`Редактировать ${category.name}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                aria-label={`Удалить ${category.name}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={form.id ? "Редактировать категорию" : "Новая категория"}
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
            <label className="mb-1.5 block text-sm font-medium">Название</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug</label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Иконка (lucide, kebab-case)
            </label>
            <Input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
