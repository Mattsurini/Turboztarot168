"use client";

import { useState, useTransition } from "react";
import { addBooking, deleteBooking, setBookingStatus } from "../actions";
import { formatDate, formatTime } from "@/lib/format";

export type BookingRow = {
  id: string;
  name: string;
  service_name: string | null;
  scheduled_at: string | null;
  status: string;
  created_at: string | null;
};

const STATUSES = ["รับคิวแล้ว", "กำลังทำนาย", "ส่งคำทำนายแล้ว"];

export default function QueueManager({ bookings }: { bookings: BookingRow[] }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const r = await addBooking(fd);
      setMessage(r.ok ? "เพิ่มคิวแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  function changeStatus(b: BookingRow, status: string) {
    const fd = new FormData();
    fd.set("id", b.id);
    fd.set("status", status);
    startTransition(async () => {
      const r = await setBookingStatus(fd);
      setMessage(r.ok ? "อัปเดตแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  function remove(b: BookingRow) {
    if (!confirm(`ลบคิว "${b.name}"?`)) return;
    const fd = new FormData();
    fd.set("id", b.id);
    startTransition(async () => {
      const r = await deleteBooking(fd);
      setMessage(r.ok ? "ลบแล้ว ✓" : `ข้อผิดพลาด: ${r.error}`);
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">จัดการคิว</h2>
      <p className="mt-1 text-sm text-foreground/60">
        คิวมาจาก LINE ผู้ดูแลบันทึกและเปลี่ยนสถานะเอง ไม่มีการยืนยันอัตโนมัติ
      </p>
      {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border border-gold/25 bg-panel p-6 sm:grid-cols-4">
        <input name="name" required placeholder="ชื่อลูกค้า" className="rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
        <input name="service_name" placeholder="บริการ" className="rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
        <input name="scheduled_at" type="datetime-local" className="rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none" />
        <select name="status" defaultValue="รับคิวแล้ว" className="rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" disabled={pending} className="rounded-full bg-violet-700 px-5 py-2 text-sm font-semibold text-black disabled:opacity-60 sm:col-span-4 sm:justify-self-start">
          + เพิ่มคิว
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 && <p className="text-foreground/50">ยังไม่มีคิว</p>}
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/25 bg-panel px-4 py-3">
            <div>
              <p className="font-semibold">{(b.name || "ไม่ระบุชื่อ")}{b.service_name ? <span className="text-violet-700">: {b.service_name}</span> : null}</p>
              <p className="text-sm text-foreground/50">
                {b.scheduled_at ? `${formatDate(b.scheduled_at)} ${formatTime(b.scheduled_at)}` : "ยังไม่ระบุเวลา"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select value={b.status} onChange={(e) => changeStatus(b, e.target.value)}
                className="rounded-lg border border-gold/30 px-3 py-1.5 text-sm focus:border-violet-500 focus:outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => remove(b)} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
