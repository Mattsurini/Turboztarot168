"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/queue", label: "คิว" },
  { href: "/admin/services", label: "บริการ" },
  { href: "/admin/articles", label: "บทความ" },
  { href: "/admin/categories", label: "หมวดหมู่" },
];

export default function AdminNav({ variant }: { variant: "side" | "bar" }) {
  const pathname = usePathname();

  const links = nav.map((n) => {
    const active =
      n.href === "/admin" ? pathname === n.href : pathname.startsWith(n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        className={active ? "is-active" : undefined}
        aria-current={active ? "page" : undefined}
      >
        {n.label}
      </Link>
    );
  });

  if (variant === "bar") {
    return (
      <nav className="admin-bar" aria-label="เมนูหลัก">
        <div className="admin-bar__nav">{links}</div>
      </nav>
    );
  }

  return (
    <nav className="admin-side__nav" aria-label="เมนูหลัก">
      {links}
    </nav>
  );
}
