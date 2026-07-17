"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Dialog, Input } from "@/components/ui";
import { updateProfileName } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";
import { editProfileSchema, type EditProfileInput } from "@/lib/validations";
import type { Profile } from "@/types";

export function EditProfileDialog({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { fullName: profile.fullName },
  });

  async function onSubmit(data: EditProfileInput) {
    setFormError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFormError("Не удалось определить пользователя. Войдите заново.");
      return;
    }

    try {
      await updateProfileName(supabase, user.id, data.fullName);
    } catch {
      setFormError(
        "Не удалось сохранить изменения. Проверьте, что миграции базы данных применены.",
      );
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Редактировать профиль"
      description="Изменения сохраняются в вашем аккаунте AtlasIQ."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
            Имя
          </label>
          <Input
            id="fullName"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input value={profile.email} disabled readOnly />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Смена email пока недоступна.
          </p>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Сохранить
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
