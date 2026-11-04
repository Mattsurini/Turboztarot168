import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getServicesAll } from "@/lib/notion-data";
import ServicesManager, { type ServiceRow } from "../ServicesManager";
import ConfigBanner from "../ConfigBanner";

export default async function AdminServicesPage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const services = (await getServicesAll()) as ServiceRow[];
  return (
    <>
      <ConfigBanner label="บริการ" configured={Boolean(process.env.NOTION_API_KEY)} />
      <ServicesManager services={services} />
    </>
  );
}
