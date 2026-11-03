import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import {
  getArticlesAll,
  getBookingsAll,
  getServicesAll,
} from "@/lib/notion-data";
import type { ArticleRow } from "./ArticlesManager";
import type { BookingRow } from "./QueueManager";
import type { ServiceRow } from "./ServicesManager";

export default async function AdminDashboardPage() {
  if (!(await getAdminUser())) redirect("/admin/login");

  const [svc, arts, bks] = await Promise.all([
    getServicesAll(),
    getArticlesAll(),
    getBookingsAll(),
  ]);
  const pending = (bks as BookingRow[]).filter(
    (b) => b.status !== "ส่งคำทำนายแล้ว" && b.status !== "ยกเลิก"
  ).length;

  const cards = [
    { href: "/admin/queue", label: "คิวรอ", value: pending },
    { href: "/admin/services", label: "บริการ", value: (svc as ServiceRow[]).length },
    { href: "/admin/articles", label: "บทความ", value: (arts as ArticleRow[]).length },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">แดชบอร์ด</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-gold/25 bg-panel p-6 shadow-sm"
          >
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="mt-1 text-foreground/60">{c.label}</p>
          </Link>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm text-foreground/60">
        คิวจะถูกจองผ่าน LINE ผู้ดูแลจะใช้หน้านี้บันทึกและเปลี่ยนสถานะการนัดหมายเอง
        ไม่มีการยืนยันอัตโนมัติ
      </p>
    </div>
  );
}
