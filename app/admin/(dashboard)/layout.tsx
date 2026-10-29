import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import AdminLogout from "./AdminLogout";

const nav = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/queue", label: "คิว" },
  { href: "/admin/slots", label: "เปิดคิว" },
  { href: "/admin/services", label: "บริการ" },
  { href: "/admin/articles", label: "บทความ" },
  { href: "/admin/categories", label: "หมวดหมู่" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">ผู้ดูแล Turboztarot</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-violet-700">
            ดูเว็บไซต์ →
          </Link>
          <AdminLogout />
        </div>
      </div>
      <nav className="mt-4 flex flex-wrap gap-2">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-full border border-gold/30 px-4 py-1.5 text-sm hover:border-violet-400 hover:text-violet-700"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
