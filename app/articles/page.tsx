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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">บทความ</h1>
      <p className="mt-3 max-w-2xl text-foreground/60">
        ความรู้เรื่องดวง ไพ่ยิปซี และแนวทางสู่การใช้ชีวิตอย่างมั่นใจ
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c.id}
            className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700"
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/articles/${a.slug}`}
            className="flex flex-col rounded-2xl border border-gold/25 bg-[#121212] p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>{formatThaiDate(a.published_at)}</span>
              {a.category && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                  {a.category.name}
                </span>
              )}
            </div>
            <h2 className="mt-3 text-lg font-bold hover:text-violet-700">{a.title}</h2>
            <p className="mt-2 flex-1 text-sm text-foreground/60">{a.excerpt}</p>
            <span className="mt-4 text-sm font-medium text-violet-700">
              อ่านต่อ →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
