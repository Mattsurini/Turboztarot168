import type { Metadata } from "next";
import { lineOaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ติดต่อ",
  description: "ช่องทางการติดต่อและสอบถามบริการดูดวง Turboztarot",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">ติดต่อ</h1>
      <p className="mt-4 text-foreground/70">
        ช่องทางหลักในการติดต่อและจองคิวดูดวงคือ LINE Official Account
      </p>
      <div className="mt-8 rounded-2xl border border-gold/25 bg-panel p-6">
        <h2 className="text-lg font-bold">ช่องทางติดต่อ</h2>
        <ul className="mt-4 space-y-3 text-foreground/80">
          <li className="flex items-center justify-between rounded-xl bg-panel2 px-4 py-3">
            <span>LINE Official Account</span>
            <a
              href={lineOaUrl("สวัสดีครับ/ค่ะ ต้องการสอบถามเรื่องดูดวงค่ะ")}
              className="rounded-full bg-line px-4 py-1.5 text-sm font-medium text-white"
            >
              ทัก LINE
            </a>
          </li>
        </ul>
        <p className="mt-4 text-sm text-foreground/50">
          เวลาทำการ: รับคิวทุกวัน นัดวัน/เวลาแน่นอนผ่าน LINE
        </p>
      </div>
    </section>
  );
}
