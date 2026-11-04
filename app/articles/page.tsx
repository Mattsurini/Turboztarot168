import type { Metadata } from "next";
import Link from "next/link";
import { getArticles, getCategories } from "@/lib/data";
import { formatThaiDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความดูดวงและตำราไพ่ยิปซีจากพี่หมอ Turboztarot",
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);
  return (
    <>
      <section className="hero hero--page">
        <div className="halo"></div>
        <p className="hero__eyebrow">
          ความรู้เรื่องดวง ไพ่ยิปซี และแนวทางสู่การใช้ชีวิตอย่างมั่นใจ
        </p>
        <h1 className="display-latin" style={{ fontSize: 64 }}>
          บทความ
        </h1>
        <div className="moonrow" aria-hidden="true">
          <svg viewBox="0 0 340 46" style={{ width: 220 }}>
            <g fill="none" stroke="rgba(210,180,140,0.6)" strokeWidth="1.4">
              <circle cx="60" cy="23" r="9" />
              <circle cx="120" cy="23" r="9" fill="rgba(255,179,71,0.35)" stroke="rgba(255,179,71,0.9)" />
              <path d="M180 23 a9 9 0 1 1 18 0 a7 7 0 0 0 -18 0" />
              <circle cx="280" cy="23" r="9" />
            </g>
          </svg>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead">
            <p className="kicker">คอลัมน์จากพี่หมอ</p>
            <h2>รวมบทความ</h2>
            <div className="rule"></div>
          </div>

          <div className="cats" aria-label="หมวดหมู่บทความ">
            <span className="cat cat--on">ทั้งหมด</span>
            {categories.map((c) => (
              <span key={c.id} className="cat">
                {c.name}
              </span>
            ))}
          </div>

          <div className="mag">
            {articles.map((a) => (
              <article key={a.id} className="art art--feature">
                <div className="art__content">
                  <div className="art__meta">
                    <span>{formatThaiDate(a.published_at)}</span>
                    {a.category && (
                      <span className="chip-cat">{a.category.name}</span>
                    )}
                  </div>
                  <h3>
                    <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                  </h3>
                  <p className="excerpt">{a.excerpt}</p>
                  <Link className="more" href="/queue">
                    อยากปรึกษาแบบตัวต่อตัว จองคิวผ่าน LINE
                  </Link>
                </div>
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
              การกดปุ่มจะเปิด LINE พร้อมข้อความสำเร็จรูปให้คุณตรวจสอบและกดส่งเอง
              พี่หมอจะนัดวัน/เวลาที่แน่นอนผ่าน LINE และบันทึกลงคิว
            </p>
            <Link className="btn btn--line" href="/queue">
              จองคิวดูดวงผ่าน LINE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
