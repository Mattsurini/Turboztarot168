import Link from "next/link";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const db = await adminDb();
  if (!db) redirect("/admin/login");

  const [svc, arts, bks] = await Promise.all([
    db.from("services").select("id", { count: "exact", head: true }),
    db.from("articles").select("id", { count: "exact", head: true }),
    db
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "รอ"),
  ]);

  const cards = [
    { href: "/admin/queue", label: "คิวรอ", value: bks.count ?? 0 },
    { href: "/admin/services", label: "บริการ", value: svc.count ?? 0 },
    { href: "/admin/articles", label: "บทความ", value: arts.count ?? 0 },
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
