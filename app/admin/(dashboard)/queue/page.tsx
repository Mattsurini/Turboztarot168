import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getBookingsAll, getServicesAll } from "@/lib/notion-data";
import QueueManager, { type BookingRow } from "../QueueManager";
import ConfigBanner from "../ConfigBanner";

export default async function AdminQueuePage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const [bookings, services] = await Promise.all([
    getBookingsAll(),
    getServicesAll(),
  ]);
  return (
    <>
      <ConfigBanner label="คิว" configured={Boolean(process.env.NOTION_BOOKINGS_DB)} />
      <QueueManager
        bookings={bookings as BookingRow[]}
        services={services.map((s) => ({
          name: String(s.name),
          table: String(s.table ?? ""),
        }))}
      />
    </>
  );
}
