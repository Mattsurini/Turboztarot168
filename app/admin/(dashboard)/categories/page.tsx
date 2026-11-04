import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getCategoriesAll } from "@/lib/notion-data";
import CategoriesManager, { type CategoryRow } from "../CategoriesManager";
import ConfigBanner from "../ConfigBanner";

export default async function AdminCategoriesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const categories = (await getCategoriesAll()) as CategoryRow[];
  return (
    <>
      <ConfigBanner label="หมวดหมู่" configured={Boolean(process.env.NOTION_CATEGORIES_DB)} />
      <CategoriesManager categories={categories} />
    </>
  );
}
