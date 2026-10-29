import Link from "next/link";
import { lineOaUrl, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/25 bg-[#121212]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/" className="text-lg font-bold">
            Turboz<span className="text-violet-700">tarot</span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-foreground/60">
            {SITE.description}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">เมนู</h4>
          <ul className="mt-2 space-y-2 text-sm text-foreground/70">
            <li><Link href="/services" className="hover:text-violet-700">บริการดูดวง</Link></li>
            <li><Link href="/articles" className="hover:text-violet-700">บทความ</Link></li>
            <li><Link href="/contact" className="hover:text-violet-700">ติดต่อ</Link></li>
            <li><Link href="/terms" className="hover:text-violet-700">ข้อตกลง</Link></li>
            <li><Link href="/privacy" className="hover:text-violet-700">นโยบายความเป็นส่วนตัว</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">จองคิวดูดวงผ่าน LINE</h4>
          <a
            href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}
            className="mt-2 inline-block rounded-full bg-[#06c755] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
          >
            LINE Official Account
          </a>
        </div>
      </div>
      <div className="border-t border-gold/25 py-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} {SITE.name} — ดูดวงเพื่อความบันเทิงและแนวทาง
      </div>
    </footer>
  );
}
