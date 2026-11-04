"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/services", label: "บริการดูดวง" },
  { href: "/queue", label: "คิวดูดวง" },
  { href: "/articles", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับพี่หมอ" },
  { href: "/terms", label: "ข้อตกลง" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="หลัก">
        <Link className="wordmark" href="/">
          <b>Turboz</b>
          <i>tarot</i>
          <b>168</b>
        </Link>
        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn btn--ghost nav__cta" href="/queue">
          จองคิวดูดวง
        </Link>
        <button
          className="nav__burger"
          aria-label="เปิดเมนู"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </nav>
      <div className={`nav__panel${open ? " open" : ""}`}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="btn btn--gold"
              href="/queue"
              style={{ marginTop: 14, justifyContent: "center" }}
            >
              จองคิวดูดวง
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
