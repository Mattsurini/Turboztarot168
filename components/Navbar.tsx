import Link from "next/link";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/services", label: "บริการดูดวง" },
  { href: "/articles", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับพี่หมอ" },
  { href: "/terms", label: "ข้อตกลง" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-[#0a0a0a]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-crimson ring-1 ring-gold text-sm font-bold text-amber-300">
            ★
          </span>
          <span className="text-lg font-bold tracking-tight">
            Turboz<span className="text-violet-700">tarot</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-violet-700">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/services"
              className="rounded-full bg-violet-700 px-4 py-2 text-black transition hover:bg-violet-800"
            >
              จองคิวดูดวง
            </Link>
          </li>
        </ul>

        {/* Mobile */}
        <details className="group md:hidden">
          <summary className="list-none cursor-pointer p-2 text-foreground/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </summary>
          <ul className="absolute right-0 top-full w-56 rounded-xl border border-gold/25 bg-[#121212] p-2 shadow-lg">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-4 py-2 text-sm hover:bg-gold/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </nav>
    </header>
  );
}
