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
    <>
      <section className="stats" aria-label="ภาพรวม">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="stat">
            <span className="stat__label">{c.label}</span>
            <div className="stat__num">{c.value}</div>
          </Link>
        ))}
      </section>
      <p className="note">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#06c755"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18v9H8l-5 4V6z" />
        </svg>
        การจองเข้ามาทาง LINE และผู้ดูแลบันทึกด้วยตนเอง
      </p>
    </>
  );
}
