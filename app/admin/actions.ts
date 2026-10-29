"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin";
import { serviceRoleSupabase } from "@/lib/supabase";

/*
 * Admin mutations. The service-role key lives ONLY on the server; every
 * action re-verifies an admin session before touching the database. RLS on
 * the tables is the second layer of defense.
 */

type Result = { ok: boolean; error?: string };

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = serviceRoleSupabase();
  if (!db) return { ok: false, error: "ยังไม่ได้ตั้งค่า Supabase (SUPABASE_SERVICE_ROLE_KEY)" };
  const user = await getAdminUser();
  if (!user) return { ok: false, error: "ไม่มีสิทธิ์เข้าถึง ต้องเข้าสู่ระบบเป็นผู้ดูแล" };
  return { ok: true };
}

// ---------- Services ----------

export async function upsertService(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const id = formData.get("id") as string | null;
  const row = {
    slug: String(formData.get("slug") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    short_desc: String(formData.get("short_desc") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    duration_min: Number(formData.get("duration_min") || 45),
    order: Number(formData.get("order") || 0),
    active: formData.get("active") === "on",
  };
  if (!row.slug || !row.name) return { ok: false, error: "ต้องกรอกชื่อและ slug" };
  const { error } = id
    ? await db.from("services").update(row).eq("id", id)
    : await db.from("services").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/services");
  return { ok: true };
}

export async function deleteService(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db.from("services").delete().eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/services");
  return { ok: true };
}

// ---------- Categories ----------

export async function upsertCategory(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const id = formData.get("id") as string | null;
  const row = {
    name: String(formData.get("name") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
  };
  if (!row.slug || !row.name) return { ok: false, error: "ต้องกรอกชื่อและ slug" };
  const { error } = id
    ? await db.from("categories").update(row).eq("id", id)
    : await db.from("categories").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/articles");
  return { ok: true };
}

export async function deleteCategory(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db.from("categories").delete().eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/articles");
  return { ok: true };
}

// ---------- Articles ----------

export async function upsertArticle(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const id = formData.get("id") as string | null;
  const row = {
    slug: String(formData.get("slug") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    cover_image: String(formData.get("cover_image") || "").trim() || null,
    category_id: (String(formData.get("category_id") || "") || null) as string | null,
  };
  if (!row.slug || !row.title) return { ok: false, error: "ต้องกรอกชื่อและ slug" };
  const { error } = id
    ? await db.from("articles").update(row).eq("id", id)
    : await db.from("articles").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/articles");
  revalidatePath(`/articles/${row.slug}`);
  return { ok: true };
}

export async function deleteArticle(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db.from("articles").delete().eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/articles");
  return { ok: true };
}

// ---------- Queue / bookings (admin appointment log) ----------

export async function addBooking(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const row = {
    name: String(formData.get("name") || "").trim(),
    service_name: String(formData.get("service_name") || "").trim(),
    scheduled_at: (String(formData.get("scheduled_at") || "") || null) as string | null,
    status: String(formData.get("status") || "รอ"),
  };
  if (!row.name) return { ok: false, error: "ต้องกรอกชื่อลูกค้า" };
  const { error } = await db.from("bookings").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/queue");
  return { ok: true };
}

export async function setBookingStatus(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db
    .from("bookings")
    .update({ status: String(formData.get("status") || "รอ") })
    .eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/queue");
  return { ok: true };
}

export async function deleteBooking(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db.from("bookings").delete().eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/queue");
  return { ok: true };
}

// ---------- Availability windows (public booking calendar) ----------

export async function addAvailabilitySlot(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  // datetime-local values are Bangkok-local; pin them to +07:00 so weekdays match
  const start = String(formData.get("start_at") || "");
  const end = String(formData.get("end_at") || "");
  if (!start || !end) return { ok: false, error: "ต้องระบุเวลาเริ่มและสิ้นสุด" };
  const startIso = new Date(start + "+07:00");
  const endIso = new Date(end + "+07:00");
  if (!Number.isFinite(startIso.getTime()) || !Number.isFinite(endIso.getTime()))
    return { ok: false, error: "รูปแบบเวลาไม่ถูกต้อง" };
  if (endIso <= startIso) return { ok: false, error: "เวลาสิ้นสุดต้องมาหลังเวลาเริ่ม" };
  const open = formData.get("open") === "on";
  const { error } = await db.from("availability_slots").insert({
    start_at: startIso.toISOString(),
    end_at: endIso.toISOString(),
    open,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/slots");
  return { ok: true };
}

export async function deleteAvailabilitySlot(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const db = serviceRoleSupabase()!;
  const { error } = await db
    .from("availability_slots")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/slots");
  return { ok: true };
}
