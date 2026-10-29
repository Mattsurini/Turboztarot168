import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";
import ServicesManager, { type ServiceRow } from "../ServicesManager";

export default async function AdminServicesPage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");
  const { data } = await db.from("services").select("*").order("order");
  return <ServicesManager services={(data as ServiceRow[]) || []} />;
}
