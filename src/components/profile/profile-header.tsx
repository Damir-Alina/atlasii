"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Avatar, Badge, Button, Card } from "@/components/ui";
import type { Profile } from "@/types";

import { EditProfileDialog } from "./edit-profile-dialog";

export function ProfileHeader({ profile }: { profile: Profile }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar
          name={profile.fullName}
          src={profile.avatarUrl}
          size="xl"
          ring
        />

        <div className="flex-1">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {profile.fullName}
            </h1>
            {profile.isPremium && <Badge variant="premium">Premium</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.email}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
            <Badge variant="primary">Уровень {profile.level}</Badge>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Редактировать профиль
        </Button>
      </div>

      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
      />
    </Card>
  );
}
