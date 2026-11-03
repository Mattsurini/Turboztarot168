import { requireNotion } from "./notion";
import type {
  CreatePageParameters,
  PageObjectResponse,
  RichTextItemResponse,
  UpdatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";

/**
 * Notion data-access layer: maps Notion data-source pages to the app's row
 * shapes (ServiceRow, CategoryRow, ArticleRow, BookingRow) and does the CRUD
 * the admin + public pages need. Column names below must match property names
 * set up in the Notion databases (see README / env). Fallback to seed is
 * handled by lib/data.ts, not here.
 */

const DB = {
  services: process.env.NOTION_SERVICES_DB || "",
  categories: process.env.NOTION_CATEGORIES_DB || "",
  articles: process.env.NOTION_ARTICLES_DB || "",
  bookings: process.env.NOTION_BOOKINGS_DB || "",
};

const SVC = {
  name: "Name",
  slug: "slug",
  shortDesc: "short_desc",
  description: "description",
  price: "price",
  duration: "duration_min",
  order: "order",
  active: "active",
} as const;

const CAT = { name: "Name", slug: "slug" } as const;

const ART = {
  title: "Title",
  slug: "slug",
  excerpt: "excerpt",
  content: "content",
  cover: "cover_image",
  category: "Category",
  publishedAt: "published_at",
} as const;

const BK = {
  name: "Name",
  service: "service_name",
  scheduledAt: "scheduled_at",
  status: "status",
} as const;

/** Legacy values (รอ/ยืนยันแล้ว/เสร็จสิ้น) are mapped on read in getBookingsAll. */
const LEGACY_STATUS: Record<string, string> = {
  รอ: "รับคิวแล้ว",
  "ยืนยันแล้ว": "รับคิวแล้ว",
  เสร็จสิ้น: "ส่งคำทำนายแล้ว",
};

type Row = Record<string, unknown>;

const rt = (v: RichTextItemResponse[] | undefined): string =>
  v?.[0]?.plain_text ?? "";

/** Notion property names are case-sensitive keys in p.properties. */
function q<T>(p: PageObjectResponse, name: string): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (p.properties as any)[name];
}

function qnum(p: PageObjectResponse, name: string): number | null {
  const c = q<{ number?: number | null }>(p, name);
  return c?.number ?? null;
}

function qbool(p: PageObjectResponse, name: string): boolean {
  const c = q<{ checkbox?: boolean }>(p, name);
  return c?.checkbox ?? false;
}

function qdate(p: PageObjectResponse, name: string): string | null {
  const c = q<{ date?: { start?: string | null } | null }>(p, name);
  return c?.date?.start ?? null;
}

function qselect(p: PageObjectResponse, name: string): string {
  const c = q<{ select?: { name?: string } | null }>(p, name);
  return c?.select?.name ?? "";
}

function qrel(p: PageObjectResponse, name: string): string | null {
  const c = q<{ relation?: { id: string }[] }>(p, name);
  return c?.relation?.[0]?.id ?? null;
}

function qrich(p: PageObjectResponse, name: string): string {
  const c = q<{ rich_text?: RichTextItemResponse[] }>(p, name);
  return rt(c?.rich_text);
}

function qtitle(p: PageObjectResponse, name: string): string {
  const c = q<{ title?: RichTextItemResponse[] }>(p, name);
  return rt(c?.title);
}

function qurl(p: PageObjectResponse, name: string): string {
  const c = q<{ url?: string | null }>(p, name);
  return c?.url ?? "";
}

/** Query all rows of a data source. shortcut: single page of 100, grows with next_cursor when the site ever exceeds 100 rows. */
async function queryAll(
  dbId: string,
  opts: {
    sorts?: { property: string; direction: "ascending" | "descending" }[];
  } = {}
): Promise<PageObjectResponse[]> {
  const notion = requireNotion();
  if (!dbId) throw new Error("ยังไม่ได้ตั้งค่า Notion database ID");
  const res = await notion.dataSources.query({
    data_source_id: dbId,
    page_size: 100,
    sorts: opts.sorts,
  });
  return res.results.filter(
    (r): r is PageObjectResponse =>
      r.object === "page" && "properties" in r
  );
}

// ---------- Read: public content ----------

export async function getServicesAll(): Promise<Row[]> {
  try {
    const pages = await queryAll(DB.services, {
      sorts: [{ property: SVC.order, direction: "ascending" }],
    });
    return pages.map((p) => ({
      id: p.id,
      slug: qrich(p, SVC.slug),
      name: qtitle(p, SVC.name),
      short_desc: qrich(p, SVC.shortDesc),
      description: qrich(p, SVC.description),
      price: qrich(p, SVC.price),
      duration_min: qnum(p, SVC.duration),
      order: qnum(p, SVC.order),
      active: qbool(p, SVC.active),
    }));
  } catch {
    return [];
  }
}

export async function getCategoriesAll(): Promise<Row[]> {
  try {
    const pages = await queryAll(DB.categories, {
      sorts: [{ property: CAT.name, direction: "ascending" }],
    });
    return pages.map((p) => ({
      id: p.id,
      name: qtitle(p, CAT.name),
      slug: qrich(p, CAT.slug),
    }));
  } catch {
    return [];
  }
}

export async function getArticlesAll(): Promise<Row[]> {
  try {
    const pages = await queryAll(DB.articles, {
      sorts: [{ property: ART.publishedAt, direction: "descending" }],
    });
    return pages.map((p) => ({
      id: p.id,
      slug: qrich(p, ART.slug),
      title: qtitle(p, ART.title),
      excerpt: qrich(p, ART.excerpt),
      content: qrich(p, ART.content),
      cover_image: qurl(p, ART.cover) || null,
      category_id: qrel(p, ART.category),
      published_at: qdate(p, ART.publishedAt),
    }));
  } catch {
    return [];
  }
}

export async function getBookingsAll(): Promise<Row[]> {
  try {
    const pages = await queryAll(DB.bookings, {
      sorts: [{ property: BK.scheduledAt, direction: "ascending" }],
    });
    return pages.map((p) => ({
      id: p.id,
      name: qtitle(p, BK.name),
      service_name: qrich(p, BK.service),
      scheduled_at: qdate(p, BK.scheduledAt),
      status: LEGACY_STATUS[qselect(p, BK.status)] ?? qselect(p, BK.status),
      created_at: null,
    }));
  } catch {
    return [];
  }
}

// ---------- Write: admin CRUD ----------

/** Build a properties payload; only keys present in `row` are set (partial update friendly). */
function propsFor(table: "services" | "categories" | "articles" | "bookings", row: Row): Record<string, unknown> {
  const rt = (v: unknown) => [{ text: { content: String(v ?? "") } }];
  const num = (v: unknown) => Number(v ?? 0);
  const p: Record<string, unknown> = {};
  const set = (name: string, val: unknown) => {
    if (row[name] !== undefined) p[name] = val;
  };
  switch (table) {
    case "services":
      set(SVC.name, { title: rt(row.name) });
      set(SVC.slug, { rich_text: rt(row.slug) });
      set(SVC.shortDesc, { rich_text: rt(row.short_desc) });
      set(SVC.description, { rich_text: rt(row.description) });
      set(SVC.price, { rich_text: rt(row.price) });
      set(SVC.duration, { number: num(row.duration_min) });
      set(SVC.order, { number: num(row.order) });
      set(SVC.active, { checkbox: Boolean(row.active) });
      break;
    case "categories":
      set(CAT.name, { title: rt(row.name) });
      set(CAT.slug, { rich_text: rt(row.slug) });
      break;
    case "articles":
      set(ART.title, { title: rt(row.title) });
      set(ART.slug, { rich_text: rt(row.slug) });
      set(ART.excerpt, { rich_text: rt(row.excerpt) });
      set(ART.content, { rich_text: rt(row.content) });
      set(ART.cover, { url: String(row.cover_image ?? "") });
      set(ART.category, {
        relation: row.category_id ? [{ id: String(row.category_id) }] : [],
      });
      break;
    case "bookings":
      set(BK.name, { title: rt(row.name) });
      set(BK.service, { rich_text: rt(row.service_name) });
      set(BK.scheduledAt, {
        date: row.scheduled_at ? { start: String(row.scheduled_at) } : null,
      });
      set(BK.status, { select: { name: String(row.status ?? "รับคิวแล้ว") } });
      break;
  }
  return p;
}

export async function createRow(
  table: "services" | "categories" | "articles" | "bookings",
  row: Row
): Promise<void> {
  // env values are data-source ids (read path uses dataSources.query too);
  // pages must be created under the data source, not a database.
  await requireNotion().pages.create({
    parent: { data_source_id: DB[table] },
    properties: propsFor(table, row) as NonNullable<
      CreatePageParameters["properties"]
    >,
  });
}

export async function updateRow(
  table: "services" | "categories" | "articles" | "bookings",
  pageId: string,
  row: Row
): Promise<void> {
  await requireNotion().pages.update({
    page_id: pageId,
    properties: propsFor(table, row) as NonNullable<
      UpdatePageParameters["properties"]
    >,
  } as UpdatePageParameters);
}

/** Notion delete = move to trash (kept internally, hidden from API reads). */
export async function deleteRow(pageId: string): Promise<void> {
  await requireNotion().pages.update({
    page_id: pageId,
    in_trash: true,
  } as UpdatePageParameters);
}
