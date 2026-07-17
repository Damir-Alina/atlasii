"use client";

import { useState } from "react";

import { Select } from "@/components/ui";
import { LANGUAGE_OPTIONS } from "@/lib/constants";
import { updateProfileSettings } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";
import type { AppLanguage } from "@/types";

import { SettingsSection } from "./settings-section";

export function LanguageSection({
  userId,
  initialLanguage,
}: {
  userId: string;
  initialLanguage: AppLanguage;
}) {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage);
  const [saved, setSaved] = useState(false);

  async function handleChange(value: string) {
    const next = value as AppLanguage;
    setLanguage(next);
    const supabase = createClient();
    await updateProfileSettings(supabase, userId, { language: next });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SettingsSection
      title="Язык"
      description="Выбранный язык будет использован в будущих обновлениях интерфейса."
    >
      <div className="flex items-center gap-3">
        <div className="w-56">
          <Select options={LANGUAGE_OPTIONS} value={language} onChange={handleChange} />
        </div>
        {saved && <span className="text-sm text-success">Сохранено</span>}
      </div>
    </SettingsSection>
  );
}
