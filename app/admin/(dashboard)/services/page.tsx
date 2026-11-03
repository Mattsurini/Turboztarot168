import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getServicesAll } from "@/lib/notion-data";
import ServicesManager, { type ServiceRow } from "../ServicesManager";

export default async function AdminServicesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const services = (await getServicesAll()) as ServiceRow[];
  return <ServicesManager services={services} />;
}
