"use client";

import { Moon, Monitor, Sun } from "lucide-react";
import { useState } from "react";

import { useTheme } from "@/components/providers/theme-provider";
import { updateProfileSettings } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types";

import { SettingsSection } from "./settings-section";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
];

export function AppearanceSection({ userId }: { userId: string }) {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSelect(next: ThemeMode) {
    setTheme(next);
    setIsSaving(true);
    const supabase = createClient();
    await updateProfileSettings(supabase, userId, { theme: next });
    setIsSaving(false);
  }

  return (
    <SettingsSection
      title="Внешний вид"
      description="AtlasIQ создан в тёмной теме, но вы можете переключиться в любой момент."
    >
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isSaving}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/50 bg-primary-muted text-primary"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {option.label}
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
