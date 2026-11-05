import type { Metadata } from "next";
import { lineOaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ติดต่อ",
  description: "ช่องทางการติดต่อและสอบถามบริการดูดวง Turboztarot",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="halo"></div>
        <p className="hero__eyebrow">ช่องทางติดต่อ</p>
        <h1 className="display-latin" style={{ fontSize: 64 }}>
          ติดต่อ
        </h1>
        <p className="hero__sub" style={{ maxWidth: 720 }}>
          ช่องทางหลักในการติดต่อและจองคิวดูดวงคือ LINE Official Account
        </p>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="info">
            <div className="info__card">
              <h2>ช่องทางติดต่อ</h2>
              <div className="svc__list" style={{ marginTop: 8 }}>
                <div className="svc__row" style={{ alignItems: "center" }}>
                  <span className="svc__row-name" style={{ fontFamily: "var(--font-thai)" }}>
                    LINE Official Account
                    <span className="svc__due">ตอบกลับโดยตรงจากพี่หมอ</span>
                  </span>
                  <a
                    href={lineOaUrl("สวัสดีครับ/ค่ะ ต้องการสอบถามเรื่องดูดวงค่ะ")}
                    className="btn btn--line"
                    style={{ minHeight: 44, padding: "0 22px", fontSize: 15, flexShrink: 0 }}
                  >
                    ทัก LINE
                  </a>
                </div>
              </div>
              <div className="info__rule"></div>
              <p style={{ fontSize: 14, color: "var(--ink-faint)" }}>
                เวลาทำการ: รับคิวทุกวัน นัดวัน/เวลาแน่นอนผ่าน LINE
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
