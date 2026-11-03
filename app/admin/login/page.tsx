"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    setError("");
    startTransition(async () => {
      const r = await loginAction(fd);
      if (!r.ok) setError(r.error ?? "");
      else router.push("/admin");
    });
  }

  return (
    <div className="mx-auto flex max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">เข้าสู่ระบบผู้ดูแล</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">ชื่อผู้ใช้</label>
          <input
            type="text"
            name="username"
            required
            className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium">รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-violet-700 px-6 py-3 font-semibold text-black hover:bg-violet-800 disabled:opacity-60"
        >
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
