import type { MetadataRoute } from "next";
import { getArticles, getServices } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [services, articles] = await Promise.all([getServices(), getArticles()]);

  for (const s of services) {
    pages.push({ url: `${base}/services/${s.slug}`, changeFrequency: "monthly", priority: 0.6 });
  }
  for (const a of articles) {
    pages.push({
      url: `${base}/articles/${a.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date(a.published_at),
    });
  }
  return pages;
}
