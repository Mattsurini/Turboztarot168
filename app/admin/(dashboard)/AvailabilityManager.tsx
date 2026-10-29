"use client";

import { useState, useTransition } from "react";
import { addAvailabilitySlot, deleteAvailabilitySlot } from "../actions";
import { formatDate, formatTime } from "@/lib/format";

export type AvailabilityRow = {
  id: string;
  start_at: string;
  end_at: string;
  open: boolean;
};

export default function AvailabilityManager({ slots, slotMin }: { slots: AvailabilityRow[]; slotMin: number }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const r = await addAvailabilitySlot(fd);
      setMessage(r.ok ? "เพิ่มช่วงเวลาแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
      if (r.ok) (e.currentTarget as HTMLFormElement).reset();
    });
  }

  function remove(b: AvailabilityRow) {
    if (!confirm(`ลบช่วงเวลานี้?`)) return;
    const fd = new FormData();
    fd.set("id", b.id);
    startTransition(async () => {
      const r = await deleteAvailabilitySlot(fd);
      setMessage(r.ok ? "ลบแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  const sorted = [...slots].sort((a, b) => a.start_at.localeCompare(b.start_at));

  return (
    <div>
      <h2 className="text-2xl font-bold">จัดการช่วงเปิดคิว</h2>
      <p className="mt-1 text-sm text-foreground/60">
        ช่วงที่ติ๊ก "เปิดรับคิว" จะกลายเป็นคิวให้จอง (ตัดเป็นช่วงละ {slotMin} นาที) ส่วนช่วงที่
        ไม่ติ๊กจะถือว่าไม่ว่างและถูกกันออกจากหน้าจอง
      </p>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border border-gold/25 bg-[#121212] p-6 md:grid-cols-5">
        <label className="text-sm font-medium">
          เริ่ม
          <input name="start_at" type="datetime-local" required
            className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
        </label>
        <label className="text-sm font-medium">
          สิ้นสุด
          <input name="end_at" type="datetime-local" required
            className="mt-1 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
          <input name="open" type="checkbox" defaultChecked className="h-4 w-4" />
          เปิดรับคิว
        </label>
        <button type="submit" disabled={pending}
          className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-black disabled:opacity-60 md:col-span-2 md:self-end">
          + เพิ่มช่วงเวลา
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {sorted.length === 0 && <p className="text-foreground/50">ยังไม่มีช่วงเวลา</p>}
        {sorted.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/25 bg-[#121212] px-4 py-3">
            <div>
              <p className="font-semibold">
                {formatDate(b.start_at)} {formatTime(b.start_at)} – {formatTime(b.end_at)}
              </p>
              <p className="text-sm text-foreground/50">
                {b.open ? "เปิดรับคิว" : "ไม่ว่าง"}
              </p>
            </div>
            <button onClick={() => remove(b)}
              className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">ลบ</button>
          </div>
        ))}
      </div>
    </div>
  );
}
