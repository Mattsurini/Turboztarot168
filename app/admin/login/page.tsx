"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";
import "../admin.css";

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
    <div className="admin-root">
      <div className="grain" aria-hidden="true" />
      <main className="login__card">
        <p className="login__brand">AETHEROS</p>
        <div className="login__rule" aria-hidden="true" />
        <h1 className="login__title">เข้าสู่ระบบ</h1>

        <form className="login__form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="login__note">{error}</p>}
          <button className="btn btn--gold" type="submit" disabled={pending}>
            {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </main>
    </div>
  );
}
