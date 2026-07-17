"use client";

import { useState } from "react";

import { updateProfileSettings } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";
import type { NotificationSettings } from "@/types";

import { SettingsSection } from "./settings-section";
import { ToggleRow } from "./toggle-row";

export function NotificationsSection({
  userId,
  initialNotifications,
}: {
  userId: string;
  initialNotifications: NotificationSettings;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pendingKey, setPendingKey] = useState<keyof NotificationSettings | null>(
    null,
  );

  async function handleChange(key: keyof NotificationSettings, value: boolean) {
    setPendingKey(key);
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    const supabase = createClient();
    await updateProfileSettings(supabase, userId, { notifications: next });
    setPendingKey(null);
  }

  return (
    <SettingsSection
      title="Уведомления"
      description="Какие письма и push-уведомления вы хотите получать."
    >
      <div className="flex flex-col divide-y divide-border/60">
        <ToggleRow
          label="Email-уведомления"
          description="Напоминания о занятиях и итоги недели."
          checked={notifications.email}
          disabled={pendingKey === "email"}
          onChange={(v) => handleChange("email", v)}
        />
        <ToggleRow
          label="Push-уведомления"
          description="Мгновенные уведомления в браузере."
          checked={notifications.push}
          disabled={pendingKey === "push"}
          onChange={(v) => handleChange("push", v)}
        />
        <ToggleRow
          label="Достижения"
          description="Уведомлять при разблокировке новых наград."
          checked={notifications.achievements}
          disabled={pendingKey === "achievements"}
          onChange={(v) => handleChange("achievements", v)}
        />
      </div>
    </SettingsSection>
  );
}
