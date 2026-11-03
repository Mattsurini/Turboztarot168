"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "../actions";

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-full border border-gold/30 px-4 py-1.5 text-sm text-foreground/70 hover:bg-panel2"
    >
      ออกจากระบบ
    </button>
  );
}
