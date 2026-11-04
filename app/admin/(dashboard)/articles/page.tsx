import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getArticlesAll, getCategoriesAll } from "@/lib/notion-data";
import ArticlesManager, { type ArticleRow } from "../ArticlesManager";
import type { CategoryRow } from "../CategoriesManager";
import ConfigBanner from "../ConfigBanner";

export default async function AdminArticlesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const [arts, cats] = await Promise.all([
    getArticlesAll(),
    getCategoriesAll(),
  ]);
  return (
    <>
      <ConfigBanner
        label="บทความ/หมวดหมู่"
        configured={Boolean(process.env.NOTION_ARTICLES_DB) && Boolean(process.env.NOTION_CATEGORIES_DB)}
      />
      <ArticlesManager
        articles={arts as ArticleRow[]}
        categories={cats as CategoryRow[]}
      />
    </>
  );
}
