"use client";

import { useState } from "react";

import { updateProfileSettings } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";
import type { PrivacySettings } from "@/types";

import { SettingsSection } from "./settings-section";
import { ToggleRow } from "./toggle-row";

export function PrivacySection({
  userId,
  initialPrivacy,
}: {
  userId: string;
  initialPrivacy: PrivacySettings;
}) {
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [pendingKey, setPendingKey] = useState<keyof PrivacySettings | null>(null);

  async function handleChange(key: keyof PrivacySettings, value: boolean) {
    setPendingKey(key);
    const next = { ...privacy, [key]: value };
    setPrivacy(next);
    const supabase = createClient();
    await updateProfileSettings(supabase, userId, { privacy: next });
    setPendingKey(null);
  }

  return (
    <SettingsSection
      title="Приватность"
      description="Что видят другие пользователи AtlasIQ."
    >
      <div className="flex flex-col divide-y divide-border/60">
        <ToggleRow
          label="Показывать в рейтинге"
          description="Ваше имя будет видно в общем и недельном рейтинге."
          checked={privacy.showOnLeaderboard}
          disabled={pendingKey === "showOnLeaderboard"}
          onChange={(v) => handleChange("showOnLeaderboard", v)}
        />
        <ToggleRow
          label="Публичный профиль"
          description="Другие ученики смогут видеть ваши достижения."
          checked={privacy.publicProfile}
          disabled={pendingKey === "publicProfile"}
          onChange={(v) => handleChange("publicProfile", v)}
        />
      </div>
    </SettingsSection>
  );
}
