"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-full border border-gold/30 px-4 py-1.5 text-sm text-foreground/70 hover:bg-[#1f1f1f]"
    >
      ออกจากระบบ
    </button>
  );
}
