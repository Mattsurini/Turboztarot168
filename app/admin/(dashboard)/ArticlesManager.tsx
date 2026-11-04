"use client";

import { useState, useTransition } from "react";
import { deleteArticle, upsertArticle } from "../actions";
import type { CategoryRow } from "./CategoriesManager";

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category_id: string | null;
};

const empty: ArticleRow = {
  id: "", slug: "", title: "", excerpt: "", content: "", cover_image: "", category_id: null,
};

export default function ArticlesManager({
  articles, categories,
}: {
  articles: ArticleRow[];
  categories: CategoryRow[];
}) {
  const [editing, setEditing] = useState<ArticleRow>({ ...empty });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const r = await upsertArticle(fd);
      setMessage(r.ok ? "บันทึกแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
      if (r.ok) { setOpen(false); setEditing({ ...empty }); }
    });
  }

  function remove(row: ArticleRow) {
    if (!confirm(`ลบบทความ "${row.title}"?`)) return;
    const fd = new FormData();
    fd.set("id", row.id);
    startTransition(async () => {
      const r = await deleteArticle(fd);
      setMessage(r.ok ? "ลบแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">จัดการบทความ</h2>
        <button
          onClick={() => { setEditing({ ...empty }); setOpen((o) => !o); }}
          className="btn btn--gold btn--add"
        >
          + เพิ่มบทความ
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      {open && (
        <form onSubmit={submit} className="add-form rounded-2xl border border-gold/25 bg-panel">
          <input type="hidden" name="id" value={editing.id} />
          <div className="add-form__row">
            <label className="field">
              <span className="font-medium">ชื่อเรื่อง</span>
              <input name="title" required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label className="field">
              <span className="font-medium">slug</span>
              <input name="slug" required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </label>
            <label className="field">
              <span className="font-medium">หมวดหมู่</span>
              <select name="category_id" value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
                <option value="">ไม่มีหมวดหมู่</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span className="font-medium">URL ภาพปก (ไม่บังคับ)</span>
            <input name="cover_image" value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} />
          </label>
          <label className="field">
            <span className="font-medium">บทสรุป (excerpt)</span>
            <textarea name="excerpt" rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          </label>
          <label className="field">
            <span className="font-medium">เนื้อหา</span>
            <textarea name="content" rows={8} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={pending} className="btn btn--gold">
              {editing.id ? "บันทึก" : "เพิ่ม"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn--ghost">ยกเลิก</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl border border-gold/25 bg-panel px-4 py-3">
            <div>
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-foreground/50">/{a.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(a); setOpen(true); }} className="rounded-full border border-gold/30 px-3 py-1 text-sm">แก้ไข</button>
              <button onClick={() => remove(a)} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
