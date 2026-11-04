import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { getBookingsAll } from "@/lib/notion-data";
import QueueManager, { type BookingRow } from "../QueueManager";
import ConfigBanner from "../ConfigBanner";

export default async function AdminQueuePage() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const bookings = (await getBookingsAll()) as BookingRow[];
  return (
    <>
      <ConfigBanner label="คิว" configured={Boolean(process.env.NOTION_BOOKINGS_DB)} />
      <QueueManager bookings={bookings} />
    </>
  );
}
