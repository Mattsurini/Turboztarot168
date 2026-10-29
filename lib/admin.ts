import { isSupabaseConfigured, serverSupabase, serviceRoleSupabase } from "./supabase";

/**
 * Server-only check: is there a valid admin session?
 * Requires a logged-in Supabase user whose email matches ADMIN_EMAIL (when set).
 */
export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await serverSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const allow = process.env.ADMIN_EMAIL;
  if (allow && data.user.email && data.user.email !== allow) return null;
  return data.user;
}

/** Service-role DB client, but only if the caller is a confirmed admin. */
export async function adminDb() {
  const user = await getAdminUser();
  if (!user) return null;
  return serviceRoleSupabase();
}
