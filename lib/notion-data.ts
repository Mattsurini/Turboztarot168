import { requireNotion } from "./notion";
import { SERVICE_SLUGS } from "./service-slugs";
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
  price: "Price",
  detail: "Detail",
  due: "Due",
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
      r.object === "page" &&
      "properties" in r &&
      !r.archived &&
      !r.in_trash
  );
}

// ---------- Read: public content ----------

/** The 5 service data sources, in map-overwrite order (Deep Reading last so
 *  its "เจาะลึกแบบจุกๆ" copy wins over the duplicate in Q and A). `name` is
 *  the admin-facing table choice; createRow targets these instead of the env. */
const SERVICE_DBS: { id: string; name: string }[] = [
  { id: "37d60f08-01b5-808d-8cab-000b326872a3", name: "Q and A" },
  { id: "37d60f08-01b5-81db-ab71-000b6f3650b1", name: "Relationship Package" },
  { id: "37d60f08-01b5-8124-94ae-000b8909ffd6", name: "Special Pack" },
  { id: "37d60f08-01b5-81b7-8c3b-000b9e7244d7", name: "Call Pack" },
  { id: "2719f48c-6de7-4237-accf-d4631836de18", name: "Deep Reading" },
];

/** Tablenames the admin form offers for a new service (mirrors SERVICE_DBS names). */
export const SERVICE_TABLES = SERVICE_DBS.map((d) => d.name);

/** Pure helper: pick the data source a service row must be created under, from
 *  the row's `table` (the admin-chosen SERVICE_TABLES name). Null => no match. */
export function resolveServiceDataSource(row: Row): string | null {
  const t = row["table"];
  if (typeof t !== "string") return null;
  return SERVICE_DBS.find((d) => d.name === t)?.id ?? null;
}

/** Strip HTML tags ("<p>…</p>", "<br>") from Notion rich text. */
const stripHtml = (s: string): string =>
  s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export async function getServicesAll(): Promise<Row[]> {
  try {
    const pages = (
      await Promise.all(SERVICE_DBS.map((d) => queryAll(d.id)))
    ).flat();

    // Dedupe by slug, later DB overwriting earlier (Deep Reading's
    // "เจาะลึกแบบจุกๆ" replaces the Q and A copy); drop rows not in the map.
    const bySlug = new Map<string, Row>();
    for (const p of pages) {
      const name = qtitle(p, "Name").replace(/\s+/g, " ").trim();
      const spec = SERVICE_SLUGS[name];
      if (!spec) continue;
      const due = stripHtml(qrich(p, "Due"));
      const detail = stripHtml(qrich(p, "Detail"));
      bySlug.set(spec.slug, {
        id: p.id,
        slug: spec.slug,
        name,
        short_desc: detail,
        description: due ? `${detail}\n\n${due}` : detail,
        due,
        price: qnum(p, "Price")?.toString() ?? "",
        duration_min: null,
        order: spec.order,
        active: true,
      });
    }
    return [...bySlug.values()].sort((a, b) => (a.order as number) - (b.order as number));
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
  // Guard on the ROW source key, not the Notion column name: column names
  // ("Name", "Title") differ from row keys ("name", "title"), so checking
  // row[columnName] silently dropped every title on create (bookings had
  // nameless rows; services/articles/categories lost their titles too).
  const set = (rowKey: string, col: string, val: unknown) => {
    if (row[rowKey] !== undefined) p[col] = val;
  };
  switch (table) {
    case "services":
      // Services live in the 5 shared tables (SERVICE_DBS): Name / Price /
      // Detail / Due — not the legacy Services DB columns.
      set("name", SVC.name, { title: rt(row.name) });
      set("price", SVC.price, { number: num(row.price) });
      set("description", SVC.detail, { rich_text: rt(row.description) });
      set("due", SVC.due, { rich_text: rt(row.due) });
      break;
    case "categories":
      set("name", CAT.name, { title: rt(row.name) });
      set("slug", CAT.slug, { rich_text: rt(row.slug) });
      break;
    case "articles":
      set("title", ART.title, { title: rt(row.title) });
      set("slug", ART.slug, { rich_text: rt(row.slug) });
      set("excerpt", ART.excerpt, { rich_text: rt(row.excerpt) });
      set("content", ART.content, { rich_text: rt(row.content) });
      // Notion rejects an empty string for a url property; pass null to clear it.
      set("cover_image", ART.cover, { url: row.cover_image ? String(row.cover_image) : null });
      set("category_id", ART.category, {
        relation: row.category_id ? [{ id: String(row.category_id) }] : [],
      });
      break;
    case "bookings":
      set("name", BK.name, { title: rt(row.name) });
      set("service_name", BK.service, { rich_text: rt(row.service_name) });
      set("scheduled_at", BK.scheduledAt, {
        date: row.scheduled_at ? { start: String(row.scheduled_at) } : null,
      });
      set("status", BK.status, { select: { name: String(row.status ?? "รับคิวแล้ว") } });
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
  let ds: string;
  if (table === "services") {
    const id = resolveServiceDataSource(row);
    if (!id) throw new Error("กรุณาเลือกตารางบริการ");
    ds = id;
  } else {
    ds = DB[table];
  }
  await requireNotion().pages.create({
    parent: { data_source_id: ds },
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
