import Link from "next/link";
import { getArticles, getServices } from "@/lib/data";
import { siteCanonical, lineOaUrl } from "@/lib/site";
import { formatThaiDate } from "@/lib/format";
import JsonLd from "@/components/JsonLd";
import QueueCalendar from "@/components/QueueCalendar";
import CarsCarousel from "@/components/CarsCarousel";

export const dynamic = "force-dynamic";

// SVG symbol defs shared by the fanned hero tarot spread (from design/v2/home.html).
function SpreadDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="grad-face" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2a1f14" />
          <stop offset="55%" stopColor="#17110b" />
          <stop offset="100%" stopColor="#0d0b09" />
        </radialGradient>
        <g id="frm">
          <rect x="6" y="6" width="176" height="280" rx="12" fill="url(#grad-face)" className="sg-gold" strokeWidth="2" />
          <rect x="15" y="15" width="158" height="262" rx="8" className="sg-gold-soft" fill="none" strokeWidth="1.3" />
          <g className="sg-gold-soft" fill="none" strokeWidth="0.8">
            <path d="M30 36 h128" /><path d="M30 41 h128" />
            <path d="M30 246 h128" /><path d="M30 251 h128" />
          </g>
          <g className="sg-gold-soft" fill="none" strokeWidth="1.2">
            <path d="M22 22 Q22 14 30 14" /><path d="M166 22 Q166 14 158 14" />
            <path d="M22 270 Q22 278 30 278" /><path d="M166 270 Q166 278 158 278" />
            <path d="M24 22 Q24 18 28 14" /><path d="M168 24 Q164 18 160 14" />
            <path d="M24 270 Q24 274 28 278" /><path d="M168 270 Q164 276 160 278" />
          </g>
          <g className="sg-gold-soft" fill="none" strokeWidth="1.1">
            <path d="M15 40 L20 45 L15 50 L10 45 Z" /><path d="M173 40 L168 45 L173 50 L178 45 Z" />
            <path d="M15 244 L20 249 L15 254 L10 249 Z" /><path d="M173 244 L168 249 L173 254 L178 249 Z" />
          </g>
          <g className="f-gold" opacity="0.7">
            <circle cx="20" cy="34" r="1.4" /><circle cx="168" cy="34" r="1.4" />
            <circle cx="20" cy="252" r="1.4" /><circle cx="168" cy="252" r="1.4" />
          </g>
          <rect x="26" y="26" width="136" height="240" rx="6" fill="none" className="sg-gold" strokeWidth="0.6" />
          <g className="sg-gold-soft" fill="none">
            <circle cx="94" cy="130" r="58" strokeWidth="1.1" />
            <circle cx="94" cy="130" r="50" strokeWidth="0.7" strokeDasharray="1.5 5" />
            <circle cx="94" cy="130" r="24" strokeWidth="0.6" />
            <path d="M94 66 L98 75 L107 76 L100 83 L102 92 L94 88 L86 92 L88 83 L81 76 L90 75 Z" className="f-gold" opacity="0.5" />
            <path d="M94 194 L98 185 L107 184 L100 177 L102 168 L94 172 L86 168 L88 177 L81 184 L90 185 Z" className="f-gold" opacity="0.5" />
          </g>
        </g>
        <g id="em-eye">
          <path d="M-24 0 Q0 -30 24 0 Q0 30 -24 0 Z" className="sg-gold" fill="none" strokeWidth="1.6" />
          <circle r="7" className="f-amber" /><circle r="2.6" className="f-obsidian" />
        </g>
        <g id="em-love">
          <path d="M0 -16 C -13 -26 -27 -12 -21 2 C -16 14 0 24 0 24 C 0 24 16 14 21 2 C 27 -12 13 -26 0 -16 Z" className="sg-gold" fill="none" strokeWidth="1.6" />
          <circle cx="15" cy="-18" r="7" className="sg-gold-soft" fill="none" strokeWidth="1.2" />
        </g>
        <g id="em-star">
          <path d="M0 -26 L5 -8 L24 -8 L8 3 L14 22 L0 12 L-14 22 L-8 3 L-24 -8 L-5 -8 Z" className="f-gold" />
        </g>
        <g id="em-fool">
          <circle r="10" className="f-amber" />
          <g className="sg-gold" strokeWidth="1.6" fill="none">
            <path d="M0 -17 L0 -24 M17 0 L24 0 M0 17 L0 24 M-17 0 L-24 0 M12 -12 L17 -17 M12 12 L17 17 M-12 12 L-17 17 M-12 -12 L-17 -17" />
          </g>
        </g>
        <g id="em-vesica">
          <circle cx="-11" cy="0" r="15" className="sg-gold" fill="none" strokeWidth="1.5" />
          <circle cx="11" cy="0" r="15" className="sg-gold" fill="none" strokeWidth="1.5" />
          <path d="M0 -7 L6 0 L0 7 L-6 0 Z" className="f-crimson" />
        </g>
      </defs>
    </svg>
  );
}

const SPREAD_CARDS = [
  { cls: "card--0", emblem: "em-vesica" },
  { cls: "card--1", emblem: "em-eye" },
  { cls: "card--2", emblem: "em-fool" },
  { cls: "card--3", emblem: "em-love" },
  { cls: "card--4", emblem: "em-star" },
];

export default async function HomePage() {
  const services = await getServices();
  const articles = (await getArticles()).slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Turboztarot",
          url: siteCanonical("/"),
          description: "บริการดูดวงออนไลน์โดยพี่หมอ Turboztarot",
        }}
      />
      <SpreadDefs />

      {/* Hero */}
      <section className="hero">
        <div className="halo"></div>
        <div className="ring" aria-hidden="true">
          <svg viewBox="0 0 640 380" preserveAspectRatio="xMidYMid meet">
            <g fill="none" className="sg-gold-soft" strokeWidth="1">
              <circle cx="320" cy="120" r="190" />
              <circle cx="320" cy="120" r="170" strokeDasharray="1 7" />
              <circle cx="320" cy="120" r="130" />
              <circle cx="320" cy="120" r="210" strokeDasharray="1 11" />
            </g>
            <g fill="#c58e3b">
              <circle cx="320" cy="-60" r="3" /><circle cx="470" cy="60" r="2" /><circle cx="150" cy="40" r="2" />
              <circle cx="540" cy="150" r="2" /><circle cx="80" cy="170" r="2.4" />
            </g>
          </svg>
        </div>

        <svg className="hero__star" viewBox="0 0 64 64" aria-hidden="true">
          <use href="#em-star" transform="translate(32 36) scale(1.25)" />
        </svg>
        <p className="hero__eyebrow">ฉบับดูดวงออนไลน์ โดย พี่หมอเทอร์โบ</p>
        <h1 className="display-latin">
          Turboz<span className="crim">tarot</span>168
        </h1>
        <p className="hero__sub">
          การเล่าเรื่องของคุณมีผลต่อคำทำนายของเทอร์โบ<br />
          <strong>ยิ่งคุณเล่าเท่าไหร่ เทอร์โบยิ่งให้คุณเท่านั้น</strong>
        </p>
        <div className="hero__acts">
          <Link className="btn btn--gold" href="/services">
            เลือกบริการดูดวง
          </Link>
          <a className="btn btn--ghost" href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}>
            สอบถามผ่าน LINE
          </a>
        </div>

        <div className="spread" role="img" aria-label="การแจกไพ่ทาโรต์ห้าใบพัด">
          {SPREAD_CARDS.map((c) => (
            <svg key={c.cls} className={`card ${c.cls}`} viewBox="0 0 188 292">
              <use href="#frm" />
              <use href={`#${c.emblem}`} transform="translate(94 128)" />
            </svg>
          ))}
        </div>
      </section>

      {/* Services carousel */}
      <section className="section">
        <div className="wrap">
          <div className="cars-head">
            <div className="cars-head__l">
              <h2>บริการดูดวง</h2>
              <p className="cars-sub">เลือกบริการที่ตรงกับคำถามของคุณ</p>
            </div>
            <Link className="cars-more" href="/services">
              อ่านต่อ
            </Link>
          </div>
          <div className="cars-rail">
            <CarsCarousel services={services} />
          </div>
        </div>
      </section>

      {/* Queue band */}
      <QueueCalendar />

      {/* Latest articles */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <p className="kicker">ความรู้และแนวทางจากพี่หมอ</p>
            <h2>บทความล่าสุด</h2>
            <div className="rule"></div>
          </div>
          <div className="mag">
            {articles.length === 0 && (
              <p className="kicker" style={{ color: "var(--muted)" }}>
                ยังไม่มีบทความในตอนนี้ — เร็วๆ นี้พี่หมอเทอร์โบจะมาเล่าเรื่องดวงให้ฟังนะคะ
              </p>
            )}
            {articles.map((a) => (
              <article className="art" key={a.slug}>
                <div className="art__meta">
                  <span>{formatThaiDate(a.published_at)}</span>
                  {a.category && <span className="cat">{a.category.name}</span>}
                </div>
                <h3>{a.title}</h3>
                <p className="excerpt">{a.excerpt}</p>
                <Link className="more" href={`/articles/${a.slug}`}>
                  อ่านต่อ
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
