import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data";
import { formatThaiDate } from "@/lib/format";
import JsonLd from "@/components/JsonLd";
import { siteCanonical } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "หน้าแรก", item: siteCanonical("/") },
            { "@type": "ListItem", position: 2, name: "บทความ", item: siteCanonical("/articles") },
            { "@type": "ListItem", position: 3, name: article.title },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.published_at,
          author: { "@type": "Person", name: "พี่หมอ Turboztarot" },
          mainEntityOfPage: siteCanonical(`/articles/${slug}`),
        }}
      />
      <Link href="/articles" className="text-sm text-violet-700">
        ← กลับไปบทความทั้งหมด
      </Link>
      <div className="mt-6">
        <div className="flex items-center gap-3 text-sm text-foreground/50">
          <span>{formatThaiDate(article.published_at)}</span>
          {article.category && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
              {article.category.name}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight">{article.title}</h1>
        <p className="mt-4 text-lg text-foreground/60">{article.excerpt}</p>
        <div className="mt-8 space-y-5 leading-relaxed text-foreground/85">
          {article.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-violet-50 p-6">
          <p className="font-semibold text-violet-800">อยากรู้เรื่องราวของคุณลึกขึ้น?</p>
          <p className="mt-1 text-sm text-foreground/70">
            ปรึกษาพี่หมอแบบตัวต่อตัวผ่านบริการดูดวง
          </p>
          <Link
            href="/services"
            className="mt-4 inline-block rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-black"
          >
            ดูบริการดูดวง →
          </Link>
        </div>
      </div>
    </article>
  );
}
