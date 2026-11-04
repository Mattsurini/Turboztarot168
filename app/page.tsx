import Link from "next/link";
import { getArticles, getServices } from "@/lib/data";
import { siteCanonical, lineOaUrl } from "@/lib/site";
import { formatThaiDate } from "@/lib/format";
import ServicesSection from "@/components/ServicesSection";
import JsonLd from "@/components/JsonLd";
import QueueCalendar from "@/components/QueueCalendar";

export const dynamic = "force-dynamic";

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

      {/* Hero — AetherOS ember front page */}
      <section className="relative overflow-hidden border-b-2 border-gold/30 bg-paper">
        <div className="pointer-events-none absolute inset-0 bg-[var(--hero-glow)]" />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h1 className="font-display text-5xl font-black text-ink sm:text-7xl [text-shadow:var(--wordmark-glow)]">
              Turboz<span className="text-newsred">tarot</span>168
            </h1>
            <div className="mx-auto mt-5 max-w-xl border-y border-gold/25 py-2 text-xs text-inksoft">
              ฉบับดูดวงออนไลน์ โดย พี่หมอเทอร์โบ
            </div>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink/85">
              การเล่าเรื่องของคุณมีผลต่อคำทำนายของเทอร์โบ
              <br />
              ยิ่งคุณเล่าเท่าไหร่ เทอร์โบยิ่งให้คุณเท่านั้น
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/services"
                className="bg-newsred px-7 py-3 font-bold text-paper shadow-[0_3px_0_var(--understep)] transition-[filter,transform] hover:brightness-110"
              >
                เลือกบริการดูดวง
              </Link>
              <a
                href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}
                className="border border-gold/50 bg-paper px-7 py-3 font-bold text-gold transition-[background-color,color] hover:bg-gold hover:text-paper"
              >
                สอบถามผ่าน LINE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services — the day's columns */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between border-b-2 border-ink pb-3">
          <div>
            <h2 className="font-display text-3xl font-bold">บริการดูดวง</h2>
            <p className="mt-1 text-foreground/60">
              เลือกบริการที่ตรงกับคำถามของคุณ
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-bold text-newsred hover:text-violet-800"
          >
            อ่านต่อ
          </Link>
        </div>
        <div className="mt-8">
          <ServicesSection
            items={services.map((s) => ({
              slug: s.slug,
              name: s.name,
              short_desc: s.short_desc,
              price: s.price,
            }))}
          />
        </div>
      </section>

      {/* Queue calendar — the day's bookings, public */}
      <QueueCalendar />

      {/* Latest articles — the features pages */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between border-b-2 border-ink pb-3">
          <div>
            <h2 className="font-display text-3xl font-bold">บทความล่าสุด</h2>
            <p className="mt-1 text-foreground/60">ความรู้และแนวทางจากพี่หมอ</p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-bold text-newsred hover:text-violet-800"
          >
            อ่านต่อ
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group border border-gold/25 bg-card p-6 transition hover:border-newsred"
            >
              <p className="text-xs font-semibold text-brass">
                {formatThaiDate(a.published_at)}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink group-hover:text-newsred">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
