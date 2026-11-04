"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkAdminPassword,
  createAdminSession,
  destroyAdminSession,
  getAdminUser,
} from "@/lib/admin";
import {
  createRow,
  deleteRow,
  updateRow,
} from "@/lib/notion-data";

/*
 * Admin mutations. Every action re-verifies the admin session cookie before
 * touching Notion; the service-role key / database writes are server-only.
 */

type Result = { ok: boolean; error?: string };

/** Map Notion API bloat to a short, actionable Thai message for the reader. */
function friendlyError(e: unknown): string {
  const msg = String((e as Error)?.message ?? e);
  if (msg.includes("ยังไม่ได้ตั้งค่า Notion database ID"))
    return "ระบบยังไม่ได้ตั้งค่าฐานข้อมูล — แจ้งผู้ดูแล";
  if (msg.includes("failed validation") || msg.includes("should be defined"))
    return "บันทึกไม่สำเร็จ — ติดต่อผู้ดูแลว่าฐานข้อมูลยังตั้งค่าไม่ครบ";
  if (msg.includes("Unauthorized") || msg.includes("401"))
    return "ไม่ได้รับอนุญาตให้เข้าถึงฐานข้อมูล — แจ้งผู้ดูแล";
  return msg;
}

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getAdminUser();
  if (!user) return { ok: false, error: "ไม่มีสิทธิ์เข้าถึง ต้องเข้าสู่ระบบเป็นผู้ดูแล" };
  return { ok: true };
}

// ---------- Auth ----------

export async function loginAction(formData: FormData): Promise<Result> {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  if (username !== (process.env.NEXT_PUBLIC_ADMIN_USERNAME || "turboz")) {
    return { ok: false, error: "ชื่อผู้ใช้ไม่ถูกต้อง" };
  }
  if (!checkAdminPassword(password)) {
    return { ok: false, error: "รหัสผ่านไม่ถูกต้อง" };
  }
  try {
    await createAdminSession();
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<Result> {
  await destroyAdminSession();
  redirect("/admin/login");
}

// ---------- Services ----------

export async function upsertService(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
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
  try {
    if (id) await updateRow("services", id, row);
    else await createRow("services", row);
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/");
  revalidatePath("/services");
  return { ok: true };
}

export async function deleteService(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  try {
    await deleteRow(String(formData.get("id")));
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/services");
  return { ok: true };
}

// ---------- Categories ----------

export async function upsertCategory(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const id = formData.get("id") as string | null;
  const row = {
    name: String(formData.get("name") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
  };
  if (!row.slug || !row.name) return { ok: false, error: "ต้องกรอกชื่อและ slug" };
  try {
    if (id) await updateRow("categories", id, row);
    else await createRow("categories", row);
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/articles");
  return { ok: true };
}

export async function deleteCategory(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  try {
    await deleteRow(String(formData.get("id")));
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/articles");
  return { ok: true };
}

// ---------- Articles ----------

export async function upsertArticle(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
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
  try {
    if (id) await updateRow("articles", id, row);
    else await createRow("articles", row);
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/articles");
  revalidatePath(`/articles/${row.slug}`);
  return { ok: true };
}

export async function deleteArticle(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  try {
    await deleteRow(String(formData.get("id")));
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/articles");
  return { ok: true };
}

// ---------- Queue / bookings ----------

export async function addBooking(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  const row = {
    name: String(formData.get("name") || "").trim(),
    service_name: String(formData.get("service_name") || "").trim(),
    scheduled_at: (String(formData.get("scheduled_at") || "") || null) as string | null,
    status: String(formData.get("status") || "รับคิวแล้ว"),
  };
  if (!row.name) return { ok: false, error: "ต้องกรอกชื่อลูกค้า" };
  try {
    await createRow("bookings", row);
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/admin/queue");
  return { ok: true };
}

export async function setBookingStatus(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  try {
    await updateRow("bookings", String(formData.get("id")), {
      status: String(formData.get("status") || "รับคิวแล้ว"),
    });
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/admin/queue");
  return { ok: true };
}

export async function deleteBooking(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;
  try {
    await deleteRow(String(formData.get("id")));
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath("/admin/queue");
  return { ok: true };
}
