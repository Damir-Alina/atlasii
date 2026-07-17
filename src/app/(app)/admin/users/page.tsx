import type { Metadata } from "next";

import { UsersTable } from "@/components/admin";
import { adminListUsers } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Пользователи — Админ",
};

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { users, totalCount } = await adminListUsers(supabase).catch(() => ({
    users: [],
    totalCount: 0,
  }));

  return <UsersTable initialUsers={users} initialTotalCount={totalCount} />;
}
