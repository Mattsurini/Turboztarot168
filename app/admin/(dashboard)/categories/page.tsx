import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";
import CategoriesManager, { type CategoryRow } from "../CategoriesManager";

export default async function AdminCategoriesPage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");
  const { data } = await db.from("categories").select("*").order("name");
  return <CategoriesManager categories={(data as CategoryRow[]) || []} />;
}
