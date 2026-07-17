import { WifiOff } from "lucide-react";

import { SITE_CONFIG } from "@/lib/constants";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground">
        <WifiOff className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Нет подключения к интернету
      </h1>
      <p className="max-w-sm text-muted-foreground">
        {SITE_CONFIG.name} требует подключение для загрузки карты и вопросов.
        Проверьте соединение и попробуйте снова.
      </p>
    </main>
  );
}
