import type { Metadata } from "next";
import { lineOaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "เกี่ยวกับพี่หมอ",
  description: "รู้จักพี่หมอ Turboztarot แนวทางและความตั้งใจในการให้บริการดูดวง",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">เกี่ยวกับพี่หมอ</h1>
      <p className="mt-4 leading-relaxed text-foreground/80">
        พี่หมอ Turboztarot เป็นผู้ให้บริการดูดวงออนไลน์ที่เชื่อว่าดวงชะตาไม่ใช่เรื่องลิขิตตายตัว
        แต่เป็นการอ่านแนวโน้มและโอกาส เพื่อให้เราเตรียมตัวและตัดสินใจได้อย่างมั่นใจ
      </p>
      <p className="mt-4 leading-relaxed text-foreground/80">
        เราให้บริการผ่านไพ่ยิปซีแบบตัวต่อตัว ดูแลทุกคำถามด้วยความจริงใจและเป็นกันเอง
        พร้อมคำแนะนำที่นำไปใช้ได้จริงในชีวิตประจำวัน
      </p>
      <div className="mt-8 rounded-2xl border border-gold/25 bg-panel p-6">
        <h2 className="text-xl font-bold">ติดต่อพี่หมอ</h2>
        <p className="mt-2 text-sm text-foreground/70">
          สะดวกที่สุดผ่าน LINE Official Account พี่หมอจะตอบกลับโดยตรง
        </p>
        <a
          href={lineOaUrl("สวัสดีครับ/ค่ะ พี่หมอคะ อยากสอบถามเรื่องดูดวงค่ะ")}
          className="mt-4 inline-block rounded-full bg-line px-5 py-2.5 font-semibold text-white"
        >
          เพิ่มเพื่อนและทัก LINE
        </a>
      </div>
    </section>
  );
}
