"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { updateProfileName } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";

import { SettingsSection } from "./settings-section";

export function AccountSection({
  userId,
  initialFullName,
  email,
}: {
  userId: string;
  initialFullName: string;
  email: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    const supabase = createClient();
    await updateProfileName(supabase, userId, fullName);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SettingsSection title="Аккаунт" description="Основная информация профиля.">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Имя</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input value={email} disabled readOnly />
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={fullName === initialFullName}
          >
            Сохранить
          </Button>
          {saved && <span className="text-sm text-success">Сохранено</span>}
        </div>
      </div>
    </SettingsSection>
  );
}
