import { contentSupabase } from "./supabase";
import { seedArticles, seedCategories, seedServices } from "./seed";
import type { Article, Category, Service } from "./types";

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  short_desc: string | null;
  description: string | null;
  price: string | null;
  duration_min: number | null;
  order: number | null;
  active: boolean | null;
};

function mapService(r: ServiceRow): Service {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    short_desc: r.short_desc ?? "",
    description: r.description ?? "",
    price: r.price ?? "",
    duration_min: r.duration_min ?? 45,
    order: r.order ?? 0,
    active: r.active ?? true,
  };
}

export async function getServices(): Promise<Service[]> {
  const db = contentSupabase();
  if (!db) return seedServices.filter((s) => s.active);
  const { data, error } = await db
    .from("services")
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });
  if (error || !data) return seedServices.filter((s) => s.active);
  return (data as ServiceRow[]).map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  for (const s of await getServices()) if (s.slug === slug) return s;
  return null;
}

export async function getCategories(): Promise<Category[]> {
  const db = contentSupabase();
  if (!db) return seedCategories;
  const { data, error } = await db.from("categories").select("*").order("name");
  if (error || !data || data.length === 0) return seedCategories;
  return data as Category[];
}

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published_at: string | null;
  category_id: string | null;
  categories: { id: string; name: string; slug: string } | null;
};

function mapArticle(r: ArticleRow): Article {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    cover_image: r.cover_image,
    published_at: r.published_at ?? new Date().toISOString(),
    category: r.categories
      ? { id: r.categories.id, name: r.categories.name, slug: r.categories.slug }
      : null,
  };
}

export async function getArticles(): Promise<Article[]> {
  const db = contentSupabase();
  if (!db) return seedArticles;
  const { data, error } = await db
    .from("articles")
    .select("*, categories(id, name, slug)")
    .order("published_at", { ascending: false });
  if (error || !data) return seedArticles;
  return (data as ArticleRow[]).map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = contentSupabase();
  if (!db) {
    return seedArticles.find((a) => a.slug === slug) ?? null;
  }
  const { data, error } = await db
    .from("articles")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    const fallback = seedArticles.find((a) => a.slug === slug);
    if (fallback) return fallback;
    return null;
  }
  return mapArticle(data as ArticleRow);
}
