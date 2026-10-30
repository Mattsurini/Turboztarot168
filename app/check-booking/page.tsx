"use client";

import { useState } from "react";
import { formatThaiDate } from "@/lib/format";

type BookingRow = {
  name: string;
  service_name: string | null;
  scheduled_at: string | null;
  status: string;
};

export default function CheckBookingPage() {
  const [name, setName] = useState("");
  const [rows, setRows] = useState<BookingRow[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRows(null);
    try {
      const r = await fetch("/api/booking/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const d = await r.json();
      if (!d.ok) {
        setError(d.error || "เกิดข้อผิดพลาด");
        return;
      }
      setRows(d.rows);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-black text-newsred">เช็คคิวของฉัน</h1>
      <p className="mt-3 text-foreground/70">
        กรอกชื่อหรือชื่อเล่นที่ใช้ตอนจอง เพื่อดูว่าคิวของพี่หมอได้วันไหน
      </p>

      <form onSubmit={submit} className="mt-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น มะลิ"
          className="w-full border border-ink/40 bg-card px-3 py-2 text-sm focus:border-newsred focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-sm bg-newsred px-5 py-2 font-semibold text-paper disabled:opacity-60"
        >
          {loading ? "กำลังค้นหา..." : "ค้นหา"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm font-bold text-newsred">{error}</p>}

      {rows && rows.length === 0 && (
        <p className="mt-6 text-foreground/70">
          ไม่พบคิวในชื่อนี้ ถ้ายังไม่ถูกบันทึก รอพี่หมอยืนยันผ่าน LINE ก่อนนะคะ
        </p>
      )}

      {rows && rows.length > 0 && (
        <ul className="mt-6 space-y-3">
          {rows.map((r, i) => (
            <li
              key={i}
              className="rounded-2xl border border-gold/25 bg-panel p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold">{r.service_name || "บริการ"}</p>
                <span className="text-xs text-foreground/60">สถานะ: {r.status}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/80">
                วันที่ได้นัดหมายส่งตำทำนาย:{" "}
                {r.scheduled_at
                  ? formatThaiDate(r.scheduled_at)
                  : "ยังไม่ได้นัดวัน (ติดต่อผ่าน LINE)"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
