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

export type ServiceOption = { name: string; table: string };

const STATUSES = ["รับคิวแล้ว", "กำลังทำนาย", "ส่งคำทำนายแล้ว"];

export default function QueueManager({
  bookings,
  services,
}: {
  bookings: BookingRow[];
  services?: ServiceOption[];
}) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  // Distinct tables in first-seen order, for the grouped service optgroups.
  const tables = services ? [...new Set(services.map((s) => s.table))] : [];

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

      <section className="queue-form" aria-label="เพิ่มคิว">
        <h2>เพิ่มคิว</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="q-name">ชื่อลูกค้า</label>
            <input id="q-name" name="name" type="text" required placeholder="ชื่อลูกค้า" disabled={pending} />
          </div>
          <div className="field">
            <label htmlFor="q-service">บริการ</label>
            <div className="select-wrap">
              <select id="q-service" name="service_name" disabled={pending}>
                <option value="">เลือกบริการ</option>
                {tables.map((t) => (
                  <optgroup key={t} label={t}>
                    {(services ?? []).filter((s) => s.table === t).map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="q-time">วันเวลา</label>
            <input id="q-time" name="scheduled_at" type="datetime-local" disabled={pending} />
          </div>
          <div className="field">
            <label htmlFor="q-status">สถานะ</label>
            <div className="select-wrap">
              <select id="q-status" name="status" defaultValue="รับคิวแล้ว" disabled={pending}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn--gold" disabled={pending}>+ เพิ่มคิว</button>
        </form>
      </section>

      <div className="table-wrap">
        <table className="table" aria-label="รายการคิว">
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>บริการ</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5}>ยังไม่มีคิว</td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id}>
                <td data-label="ลูกค้า">{b.name || "ไม่ระบุชื่อ"}</td>
                <td data-label="บริการ">{b.service_name}</td>
                <td data-label="วันที่">
                  {b.scheduled_at ? `${formatDate(b.scheduled_at)} ${formatTime(b.scheduled_at)}` : "ยังไม่ระบุเวลา"}
                </td>
                <td data-label="สถานะ">
                  <div className="select-wrap">
                    <select
                      aria-label="สถานะ"
                      value={b.status}
                      onChange={(e) => changeStatus(b, e.target.value)}
                      disabled={pending}
                    >
                      {[...new Set([...STATUSES, b.status])].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td data-label="จัดการ">
                  <button type="button" className="btn--del" onClick={() => remove(b)} disabled={pending}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
