import type { Metadata } from "next";

import { CategoriesManager } from "@/components/admin";
import { listCategories } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Категории — Админ",
};

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const categories = await listCategories(supabase).catch(() => []);

  return <CategoriesManager initialCategories={categories} />;
}
