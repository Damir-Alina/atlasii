import type { Metadata } from "next";

import {
  AccountSection,
  AppearanceSection,
  DangerZone,
  LanguageSection,
  NotificationsSection,
  PrivacySection,
  SecuritySection,
} from "@/components/settings";
import { getCurrentProfile } from "@/lib/auth";
import { getProfileSettings } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Настройки",
};

export default async function SettingsPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();
  const settings = await getProfileSettings(supabase, profile.id);

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Настройки
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Управляйте аккаунтом, внешним видом и приватностью.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <AccountSection
          userId={profile.id}
          initialFullName={profile.fullName}
          email={profile.email}
        />
        <AppearanceSection userId={profile.id} />
        <LanguageSection userId={profile.id} initialLanguage={settings.language} />
        <NotificationsSection
          userId={profile.id}
          initialNotifications={settings.notifications}
        />
        <PrivacySection userId={profile.id} initialPrivacy={settings.privacy} />
        <SecuritySection />
        <DangerZone />
      </div>
    </div>
  );
}
