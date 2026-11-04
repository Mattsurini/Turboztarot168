"use client";

import { useRef, useState, useTransition } from "react";
import { deleteService, upsertService } from "../actions";
import { SERVICE_TABLES } from "@/lib/notion-data";

export type ServiceRow = {
  id: string;
  table: string | null;
  slug: string;
  name: string;
  short_desc: string | null;
  description: string | null;
  due: string | null;
  price: string | null;
  duration_min: number | null;
  order: number | null;
  active: boolean | null;
};

const empty = {
  id: "",
  table: "",
  slug: "",
  name: "",
  short_desc: "",
  description: "",
  due: "",
  price: "",
  duration_min: 45,
  order: 0,
  active: true,
};

export default function ServicesManager({ services }: { services: ServiceRow[] }) {
  const [editing, setEditing] = useState<ServiceRow>({ ...empty });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const r = await upsertService(fd);
      setMessage(r.ok ? "บันทึกแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
      if (r.ok) {
        setOpen(false);
        setEditing({ ...empty });
      }
    });
  }

  function remove(row: ServiceRow) {
    if (!confirm(`ลบบริการ "${row.name}"?`)) return;
    const fd = new FormData();
    fd.set("id", row.id);
    startTransition(async () => {
      const r = await deleteService(fd);
      setMessage(r.ok ? "ลบแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">จัดการบริการ</h2>
        <button
          onClick={() => {
            setEditing({ ...empty });
            setOpen((o) => !o);
          }}
          className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-black"
        >
          + เพิ่มบริการ
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      {open && (
        <form ref={formRef} onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border border-gold/25 bg-panel p-6">
          <input type="hidden" name="id" value={editing.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ชื่อบริการ" name="name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required />
            <label className="block text-sm">
              <span className="font-medium">ตารางบริการ</span>
              <select
                name="table"
                value={editing.table ?? ""}
                onChange={(e) => setEditing({ ...editing, table: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
              >
                <option value="" disabled>เลือกตารางบริการ</option>
                {SERVICE_TABLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="คำอธิบายสั้น" name="short_desc" value={editing.short_desc ?? ""} onChange={(v) => setEditing({ ...editing, short_desc: v })} />
            <Field label="Due" name="due" value={editing.due ?? ""} onChange={(v) => setEditing({ ...editing, due: v })} />
          </div>
          <label className="block text-sm">
            <span className="font-medium">รายละเอียด</span>
            <textarea
              name="description"
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="ราคา" name="price" value={editing.price ?? ""} onChange={(v) => setEditing({ ...editing, price: v })} />
            <Field label="นาที/ครั้ง" name="duration_min" type="number" value={String(editing.duration_min ?? "")} onChange={(v) => setEditing({ ...editing, duration_min: Number(v) })} />
            <Field label="ลำดับ" name="order" type="number" value={String(editing.order ?? "")} onChange={(v) => setEditing({ ...editing, order: Number(v) })} />
            <label className="flex items-end gap-2 pb-2 text-sm font-medium">
              <input
                type="checkbox"
                name="active"
                checked={!!editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                className="h-4 w-4"
              />
              ใช้งานอยู่
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {editing.id ? "บันทึก" : "เพิ่ม"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-gold/30 px-5 py-2 text-sm">
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border border-gold/25 bg-panel px-4 py-3">
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-foreground/50">
                /{s.slug} · {s.price || "ยังไม่ตั้งราคา"} · {s.active ? "ใช้งาน" : "ปิด"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(s); setOpen(true); }} className="rounded-full border border-gold/30 px-3 py-1 text-sm">แก้ไข</button>
              <button onClick={() => remove(s)} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label, name, value, onChange, type = "text", required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
      />
    </label>
  );
}
