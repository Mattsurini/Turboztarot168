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
          type="button"
          onClick={() => {
            setEditing({ ...empty });
            setOpen((o) => !o);
          }}
          className="btn btn--gold"
        >
          + เพิ่มบริการ
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      {open && (
        <section className="form-card mt-6" aria-label="แบบฟอร์มบริการ">
          <form ref={formRef} onSubmit={submit}>
            <input type="hidden" name="id" value={editing.id} />

            <div className="field">
              <label htmlFor="svc-table">ตาราง</label>
              <div className="select-wrap">
                <select
                  id="svc-table"
                  name="table"
                  value={editing.table ?? ""}
                  onChange={(e) => setEditing({ ...editing, table: e.target.value })}
                  disabled={pending}
                >
                  <option value="" disabled>เลือกตารางบริการ</option>
                  {SERVICE_TABLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="svc-name">ชื่อบริการ</label>
              <input
                id="svc-name"
                name="name"
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
                placeholder="ชื่อบริการ"
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-short">คำอธิบายสั้น</label>
              <input
                id="svc-short"
                name="short_desc"
                type="text"
                value={editing.short_desc ?? ""}
                onChange={(e) => setEditing({ ...editing, short_desc: e.target.value })}
                placeholder="คำอธิบายสั้น"
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-due">Due</label>
              <input
                id="svc-due"
                name="due"
                type="text"
                value={editing.due ?? ""}
                onChange={(e) => setEditing({ ...editing, due: e.target.value })}
                placeholder="ตัวอย่าง เช่น 3 วัน"
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-detail">รายละเอียด</label>
              <textarea
                id="svc-detail"
                name="description"
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="ตัวอย่างรายละเอียดของบริการ"
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-price">ราคา (บาท)</label>
              <input
                id="svc-price"
                name="price"
                type="number"
                min={0}
                step={1}
                value={editing.price ?? ""}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                placeholder="เช่น 300"
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-min">นาที/ครั้ง</label>
              <input
                id="svc-min"
                name="duration_min"
                type="number"
                value={String(editing.duration_min ?? "")}
                onChange={(e) => setEditing({ ...editing, duration_min: Number(e.target.value) })}
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-order">ลำดับ</label>
              <input
                id="svc-order"
                name="order"
                type="number"
                value={String(editing.order ?? "")}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                disabled={pending}
              />
            </div>

            <div className="field">
              <label htmlFor="svc-active" className="flex min-h-[44px] items-center gap-2">
                <input
                  id="svc-active"
                  type="checkbox"
                  name="active"
                  checked={!!editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  disabled={pending}
                />
                ใช้งานอยู่
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--gold" disabled={pending}>
                {editing.id ? "บันทึก" : "เพิ่ม"}
              </button>
              <button type="button" className="btn" onClick={() => setOpen(false)}>
                ยกเลิก
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="table-wrap mt-6">
        <table className="table" aria-label="รายการบริการ">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>ราคา</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={4}>ยังไม่มีบริการ</td>
              </tr>
            )}
            {services.map((s) => (
              <tr key={s.id}>
                <td data-label="ชื่อ">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-foreground/50"> /{s.slug}</span>
                </td>
                <td data-label="ราคา">{s.price || "ยังไม่ตั้งราคา"}</td>
                <td data-label="สถานะ">
                  <span className={`chip ${s.active ? "chip--green" : "chip--crimson"}`}>
                    {s.active ? "ใช้งาน" : "ปิด"}
                  </span>
                </td>
                <td data-label="จัดการ">
                  <button type="button" className="btn" onClick={() => { setEditing(s); setOpen(true); }} disabled={pending}>
                    แก้ไข
                  </button>
                  <button type="button" className="btn--del" onClick={() => remove(s)} disabled={pending}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
