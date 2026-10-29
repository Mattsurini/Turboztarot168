import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";
import QueueManager, { type BookingRow } from "../QueueManager";

export default async function AdminQueuePage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");
  const { data } = await db.from("bookings").select("*").order("scheduled_at", { ascending: true, nullsFirst: true });
  return <QueueManager bookings={(data as BookingRow[]) || []} />;
}
