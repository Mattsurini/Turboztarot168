import { isNotionConfigured } from "./notion";
import {
  getArticlesAll,
  getBookingsAll,
  getCategoriesAll,
  getServicesAll,
} from "./notion-data";
import { seedArticles, seedCategories, seedServices } from "./seed";
import type { Article, Category, Service } from "./types";

/**
 * Public content getters. Reads live from Notion when configured; falls back
 * to seed data otherwise (same "runnable without keys" behavior as Supabase).
 */

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
  if (!isNotionConfigured()) return seedServices.filter((s) => s.active);
  const rows = (await getServicesAll()) as ServiceRow[];
  // Real rows only when Notion is configured: seed fallback here would show
  // demo content on the live site and hide a broken/empty data source.
  return rows.map(mapService).filter((s) => s.active);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  for (const s of await getServices()) if (s.slug === slug) return s;
  return null;
}

export async function getCategories(): Promise<Category[]> {
  if (!isNotionConfigured()) return seedCategories;
  return (await getCategoriesAll()) as Category[];
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
};

function mapArticle(r: ArticleRow, categories: Category[]): Article {
  const c = categories.find((x) => x.id === r.category_id);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    cover_image: r.cover_image,
    published_at: r.published_at ?? new Date().toISOString(),
    category: c ?? null,
  };
}

export async function getArticles(): Promise<Article[]> {
  if (!isNotionConfigured()) return seedArticles;
  const [rows, categories] = await Promise.all([
    getArticlesAll(),
    getCategories(),
  ]);
  return (rows as ArticleRow[]).map((r) => mapArticle(r, categories));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  for (const a of await getArticles()) if (a.slug === slug) return a;
  return null;
}

export type CalendarBooking = {
  id: string;
  name: string;
  status: string;
  scheduled_at: string | null;
};

/** Public queue calendar rows: unfinished bookings with a set date. Empty seed when unconfigured. */
export async function getBookingsForCalendar(): Promise<CalendarBooking[]> {
  if (!isNotionConfigured()) return [];
  const rows = (await getBookingsAll()) as CalendarBooking[];
  return rows
    .filter(
      (b) => b.scheduled_at && b.status !== "ส่งคำทำนายแล้ว" && b.status !== "ยกเลิก"
    )
    .map(({ id, name, status, scheduled_at }) => ({ id, name, status, scheduled_at }));
}
