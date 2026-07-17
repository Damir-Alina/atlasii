"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button, Card, Dialog, Input } from "@/components/ui";

interface AchievementRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
}

interface FormState {
  id?: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
}

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  description: "",
  icon: "",
  goal: 1,
};

export function AchievementsManager({
  initialAchievements,
}: {
  initialAchievements: AchievementRow[];
}) {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(a: AchievementRow) {
    setForm({ ...a });
    setDialogOpen(true);
  }

  async function handleSave() {
    setIsSaving(true);
    if (form.id) {
      await fetch("/api/admin/achievements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null);
      setAchievements((prev) =>
        prev.map((a) => (a.id === form.id ? { ...a, ...form } : a)),
      );
    } else {
      await fetch("/api/admin/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null);
      // No id is returned by the create endpoint's minimal {ok} response;
      // a full refresh (or Stage 18 polish) would sync the new row's id.
    }
    setIsSaving(false);
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить достижение?")) return;
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/admin/achievements?id=${id}`, { method: "DELETE" }).catch(
      () => null,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Добавить достижение
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <Card key={a.id} className="flex items-start justify-between p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {a.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Цель: {a.goal}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => openEdit(a)}
                aria-label={`Редактировать ${a.title}`}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(a.id)}
                aria-label={`Удалить ${a.title}`}
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
        title={form.id ? "Редактировать достижение" : "Новое достижение"}
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
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Описание</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Цель</label>
              <Input
                type="number"
                value={form.goal}
                onChange={(e) =>
                  setForm({ ...form, goal: Number(e.target.value) || 1 })
                }
              />
            </div>
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
