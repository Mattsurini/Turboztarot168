import type { Metadata } from "next";
import { lineOaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "เกี่ยวกับพี่หมอ",
  description: "รู้จักพี่หมอ Turboztarot แนวทางและความตั้งใจในการให้บริการดูดวง",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero hero--page">
        <div className="halo"></div>
        <p className="hero__eyebrow">รู้จักก่อนจอง</p>
        <h1 className="display-latin" style={{ fontSize: 64 }}>
          เกี่ยวกับพี่หมอ
        </h1>
        <p className="hero__sub" style={{ maxWidth: 720 }}>
          ดูดวงรายบุคคลโดยพี่หมอ Turboztarot — ความจริงใจและเป็นกันเองบนทุกคำถาม
        </p>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="info">
            <div className="info__card">
              <h2>แนวทางของพี่หมอ</h2>
              <p>
                พี่หมอ Turboztarot เป็นผู้ให้บริการดูดวงออนไลน์ที่เชื่อว่าดวงชะตาไม่ใช่เรื่องลิขิตตายตัว
                แต่เป็นการอ่านแนวโน้มและโอกาส เพื่อให้เราเตรียมตัวและตัดสินใจได้อย่างมั่นใจ
              </p>
              <p>
                เราให้บริการผ่านไพ่ยิปซีแบบตัวต่อตัว ดูแลทุกคำถามด้วยความจริงใจและเป็นกันเอง
                พร้อมคำแนะนำที่นำไปใช้ได้จริงในชีวิตประจำวัน
              </p>
              <div className="info__rule"></div>
              <h2 style={{ fontSize: 24 }}>ติดต่อพี่หมอ</h2>
              <p>สะดวกที่สุดผ่าน LINE Official Account พี่หมอจะตอบกลับโดยตรง</p>
              <div style={{ marginTop: 24 }}>
                <a
                  href={lineOaUrl("สวัสดีครับ/ค่ะ พี่หมอคะ อยากสอบถามเรื่องดูดวงค่ะ")}
                  className="btn btn--line"
                >
                  เพิ่มเพื่อนและทัก LINE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
