import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import AdminLogout from "./AdminLogout";
import AdminNav from "./AdminNav";
import "../admin.css";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-root">
      <div className="grain" aria-hidden="true" />
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-side__brand">AETHEROS</div>
          <AdminNav variant="side" />
        </aside>
        <main className="admin-main">
          <header className="admin-head">
            <h1>ผู้ดูแล Turboztarot</h1>
            <div className="admin-head__links">
              <Link href="/">ดูเว็บไซต์</Link>
              <AdminLogout />
            </div>
          </header>
          {children}
        </main>
      </div>
      <AdminNav variant="bar" />
    </div>
  );
}
