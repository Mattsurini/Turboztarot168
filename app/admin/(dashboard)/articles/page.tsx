import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";
import ArticlesManager, { type ArticleRow } from "../ArticlesManager";
import type { CategoryRow } from "../CategoriesManager";

export default async function AdminArticlesPage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");
  const [arts, cats] = await Promise.all([
    db.from("articles").select("*").order("published_at", { ascending: false }),
    db.from("categories").select("*").order("name"),
  ]);
  return <ArticlesManager articles={(arts.data as ArticleRow[]) || []} categories={(cats.data as CategoryRow[]) || []} />;
}
