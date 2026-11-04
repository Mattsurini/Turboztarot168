"use client";

import { useState, useTransition } from "react";
import { deleteCategory, upsertCategory } from "../actions";

export type CategoryRow = { id: string; name: string; slug: string };

export default function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const r = await upsertCategory(fd);
      setMessage(r.ok ? "บันทึกแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  function remove(row: CategoryRow) {
    if (!confirm(`ลบหมวดหมู่ "${row.name}"?`)) return;
    const fd = new FormData();
    fd.set("id", row.id);
    startTransition(async () => {
      const r = await deleteCategory(fd);
      setMessage(r.ok ? "ลบแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">จัดการหมวดหมู่บทความ</h2>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      <form onSubmit={submit} className="add-row mt-6 max-w-md">
        <input
          name="name"
          required
          placeholder="ชื่อหมวดหมู่"
        />
        <input
          name="slug"
          required
          placeholder="slug"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn btn--gold btn--add"
        >
          เพิ่ม
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-gold/25 bg-panel px-4 py-3">
            <p className="font-semibold">{c.name} <span className="text-sm font-normal text-foreground/50">/{c.slug}</span></p>
            <button onClick={() => remove(c)} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">ลบ</button>
          </div>
        ))}
      </div>
    </div>
  );
}
