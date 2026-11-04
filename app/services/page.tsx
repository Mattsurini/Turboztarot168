import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/data";
import { lineOaUrl } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "บริการดูดวง",
  description: "บริการดูดวงรายบุคคลโดยพี่หมอ Turboztarot: ไพ่ยิปซี ดวงความรัก การงาน การเงิน",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="hero hero--page">
        <div className="halo"></div>
        <p className="hero__eyebrow">เลือกบริการที่ตรงกับคำถามของคุณ</p>
        <h1 className="display-latin" style={{ fontSize: 64 }}>
          บริการดูดวง
        </h1>
        <p className="hero__sub" style={{ maxWidth: 720 }}>
          เลือกบริการที่ตรงกับคำถามของคุณ จากนั้นจองคิวดูดวงผ่าน LINE เพื่อยืนยันกับพี่หมอ
        </p>
        <div className="moonrow" aria-hidden="true">
          <svg viewBox="0 0 340 46">
            <g fill="none" stroke="rgba(210,180,140,0.6)" strokeWidth="1.4">
              <circle cx="30" cy="23" r="9" />
              <path d="M70 23 a9 9 0 1 0 18 0 a7 7 0 0 1 -18 0" />
              <circle cx="120" cy="23" r="9" fill="rgba(255,179,71,0.35)" stroke="rgba(255,179,71,0.9)" />
              <path d="M170 23 a9 9 0 1 1 18 0 a7 7 0 0 0 -18 0" />
              <circle cx="220" cy="23" r="9" fill="rgba(197,142,59,0.4)" stroke="rgba(197,142,59,0.9)" />
              <circle cx="270" cy="23" r="9" />
              <path d="M315 23 a9 9 0 1 0 -18 0 a7 7 0 0 1 18 0" fill="rgba(139,0,0,0.45)" stroke="rgba(139,0,0,0.8)" />
            </g>
          </svg>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="svcgrid">
            {services.map((s) => (
              <article className="svccard" key={s.id}>
                <h3 className="svccard__name">{s.name}</h3>
                <p className="svccard__price">{formatPrice(s.price)}</p>
                <p className="svccard__detail">{s.short_desc}</p>
                <Link className="svccard__link" href={`/services/${s.slug}`}>
                  ดูรายละเอียด
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dim">
        <div className="wrap">
          <div className="join">
            <div className="glyph-line">✦ จองคิวดูดวงผ่าน LINE ✦</div>
            <p>
              การกดปุ่มจะเปิด LINE พร้อมข้อความสำเร็จรูปให้คุณตรวจสอบและกดส่งเอง พี่หมอจะนัดวัน/เวลาที่แน่นอนผ่าน LINE และบันทึกลงคิว
            </p>
            <a className="btn btn--line" href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}>
              จองคิวดูดวงผ่าน LINE
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
