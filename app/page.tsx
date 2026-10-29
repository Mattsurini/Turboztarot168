import Link from "next/link";
import { getArticles, getServices } from "@/lib/data";
import { siteCanonical, lineOaUrl } from "@/lib/site";
import { formatThaiDate } from "@/lib/format";
import BookingWidget from "@/components/BookingWidget";
import ServicesSection from "@/components/ServicesSection";
import JsonLd from "@/components/JsonLd";

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#221100] via-[#1a1a1a] to-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            เปิดใจ รับคำตอบ
            <br />
            ผ่าน <span className="text-amber-300">ไพ่ยิปซี</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            บริการดูดวงรายบุคคล ทั้งความรัก การงาน การเงิน พร้อมคำแนะนำที่นำไปใช้
            ได้จริง จองคิวดูดวงและติดต่อผ่าน LINE ง่าย ๆ ได้เลย
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              เลือกบริการดูดวง
            </Link>
            <a
              href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}
              className="rounded-full bg-[#121212]/10 px-6 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-[#121212]/20"
            >
              สอบถามผ่าน LINE
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">บริการดูดวง</h2>
            <p className="mt-2 text-foreground/60">
              เลือกบริการที่ตรงกับคำถามของคุณ
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-violet-700"
          >
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-8">
          <ServicesSection
            items={services.map((s) => ({
              slug: s.slug,
              name: s.name,
              short_desc: s.short_desc,
            }))}
          />
        </div>
      </section>

      {/* Booking / availability */}
      <section className="bg-gradient-to-br from-amber-50 to-violet-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">เช็คคิวดูดวง</h2>
            <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
              เลือกบริการและช่วงเวลาที่สะดวก จากนั้นกด{" "}
              “ติดต่อจองคิวดูดวงผ่าน LINE” เพื่อยืนยันกับพี่หมอโดยตรง คิวจะยืนยันเมื่อ
              พี่หมอตอบกลับเท่านั้น
            </p>
          </div>
          <div className="mt-8">
            <BookingWidget services={services} />
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">บทความล่าสุด</h2>
            <p className="mt-2 text-foreground/60">
              ความรู้และแนวทางจากพี่หมอ
            </p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-medium text-violet-700"
          >
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="rounded-2xl border border-gold/25 bg-[#121212] p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs text-foreground/50">
                {formatThaiDate(a.published_at)}
              </p>
              <h3 className="mt-2 text-lg font-bold hover:text-violet-700">
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
