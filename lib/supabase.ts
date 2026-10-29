import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** True when Supabase env vars are present. When false the site uses seed data. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon && url.startsWith("http"));
}

/** Public content reads. Requires anon key; RLS grants public SELECT. */
export function contentSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(url, anon);
}

/** Server-side session-aware client for admin auth (reads the session cookie). */
export async function serverSupabase() {
  const cookieStore = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        // Server components cannot set cookies; admin mutations run in server
        // actions / route handlers where a Response is available instead.
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // ignore — called from a read path
        }
      },
    },
  });
}

/** Privileged client used ONLY in server actions / route handlers behind admin auth. */
export function serviceRoleSupabase() {
  if (!serviceRole) return null;
  return createSupabaseClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
