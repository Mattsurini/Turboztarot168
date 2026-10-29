import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";
import { defaultSlotMin } from "@/lib/availability";
import AvailabilityManager, { type AvailabilityRow } from "../AvailabilityManager";

export default async function AdminSlotsPage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");
  const { data } = await db.from("availability_slots").select("*").order("start_at", { ascending: true });
  return <AvailabilityManager slots={(data as AvailabilityRow[]) || []} slotMin={defaultSlotMin()} />;
}
