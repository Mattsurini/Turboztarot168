import { Client } from "@notionhq/client";

/**
 * Notion is the data store. Public content + admin CRUD go to Notion data
 * sources (databases). When NOTION_API_KEY and the NOTION_*_DATABASE_ID vars
 * are unset the site falls back to lib/seed.ts on the read path — same
 * "runnable without keys" design the codebase had with Supabase.
 *
 * The Notion integration must be connected to each database (database ... ->
 * Connect to -> the integration), else the API returns 404 for it.
 */
const key = process.env.NOTION_API_KEY || "";

export function isNotionConfigured(): boolean {
  return Boolean(key);
}

export function notion(): Client | null {
  return key ? new Client({ auth: key, notionVersion: "2025-09-03" }) : null;
}

/** Throw-safe guard for code paths that must not continue without Notion. */
export function requireNotion(): Client {
  const c = notion();
  if (!c) throw new Error("ยังไม่ได้ตั้งค่า Notion (NOTION_API_KEY)");
  return c;
}
