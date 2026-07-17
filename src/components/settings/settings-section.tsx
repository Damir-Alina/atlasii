import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <Card className={danger ? "border-destructive/30" : undefined}>
      <CardHeader>
        <CardTitle className={danger ? "text-destructive" : undefined}>
          {title}
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}
