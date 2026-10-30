import { NextResponse } from "next/server";
import { serviceRoleSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Customer checks their own booking: look up by name, return only minimal fields. */
export async function POST(request: Request) {
  let body: { name?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* ignore malformed body */
  }
  const q = String(body.name || "").trim();
  if (!q) return NextResponse.json({ ok: false, error: "ต้องกรอกชื่อ" });
  const db = serviceRoleSupabase();
  if (!db) return NextResponse.json({ ok: false, error: "ยังไม่ได้ตั้งค่า Supabase" });
  const { data, error } = await db
    .from("bookings")
    .select("name, service_name, scheduled_at, status")
    .ilike("name", `%${q}%`)
    .neq("status", "ยกเลิก")
    .order("scheduled_at", { ascending: true });
  if (error) return NextResponse.json({ ok: false, error: "ไม่พบข้อมูล" });
  return NextResponse.json({ ok: true, rows: data || [] });
}
