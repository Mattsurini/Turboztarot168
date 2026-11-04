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
  return <button onClick={logout}>ออกจากระบบ</button>;
}
