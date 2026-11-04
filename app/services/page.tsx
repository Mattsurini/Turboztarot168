import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "บริการดูดวง",
  description: "บริการดูดวงรายบุคคลโดยพี่หมอ Turboztarot: ไพ่ยิปซี ดวงความรัก การงาน การเงิน",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">บริการดูดวง</h1>
      <p className="mt-3 max-w-2xl text-foreground/60">
        เลือกบริการที่ตรงกับคำถามของคุณ จากนั้นจองคิวดูดวงผ่าน LINE เพื่อยืนยันกับพี่หมอ
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className="group flex flex-col rounded-2xl border border-gold/25 bg-panel p-6 shadow-sm transition-[box-shadow] hover:shadow-md"
          >
            <h2 className="mt-4 text-xl font-bold group-hover:text-violet-700">
              {s.name}
            </h2>
            {s.price ? (
              <p className="mt-1 text-base font-bold text-violet-700">{formatPrice(s.price)}</p>
            ) : null}
            <p className="mt-2 flex-1 text-sm text-foreground/60">{s.short_desc}</p>
            <span className="mt-4 text-sm font-medium text-violet-700">
              ดูรายละเอียด
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
