"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Dialog, Input } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

import { SettingsSection } from "./settings-section";

export function DangerZone() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    const res = await fetch("/api/account/delete", { method: "POST" }).catch(
      () => null,
    );

    if (!res?.ok) {
      setError("Не удалось удалить аккаунт. Попробуйте позже.");
      setIsDeleting(false);
      return;
    }

    router.push(ROUTES.home);
    router.refresh();
  }

  return (
    <SettingsSection
      title="Удаление аккаунта"
      description="Это действие необратимо — все данные, прогресс и достижения будут удалены."
      danger
    >
      <Button variant="destructive" onClick={() => setDialogOpen(true)}>
        Удалить аккаунт
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Вы уверены?"
        description='Введите "DELETE", чтобы подтвердить безвозвратное удаление аккаунта.'
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== "DELETE"}
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Удалить навсегда
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>
      </Dialog>
    </SettingsSection>
  );
}
