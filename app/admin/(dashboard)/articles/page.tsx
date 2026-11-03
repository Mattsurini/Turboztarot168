import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getArticlesAll, getCategoriesAll } from "@/lib/notion-data";
import ArticlesManager, { type ArticleRow } from "../ArticlesManager";
import type { CategoryRow } from "../CategoriesManager";

export default async function AdminArticlesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const [arts, cats] = await Promise.all([
    getArticlesAll(),
    getCategoriesAll(),
  ]);
  return (
    <ArticlesManager
      articles={arts as ArticleRow[]}
      categories={cats as CategoryRow[]}
    />
  );
}
