import type { Metadata } from "next";

import { QuestionsManager } from "@/components/admin";
import { adminListQuestions, listCategories } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Вопросы — Админ",
};

export default async function AdminQuestionsPage() {
  const supabase = createClient();
  const [categories, questionsResult] = await Promise.all([
    listCategories(supabase).catch(() => []),
    adminListQuestions(supabase).catch(() => ({ questions: [], totalCount: 0 })),
  ]);

  return (
    <QuestionsManager
      categories={categories}
      initialQuestions={questionsResult.questions}
      initialTotalCount={questionsResult.totalCount}
    />
  );
}
