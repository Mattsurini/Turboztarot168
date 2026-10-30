"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { lineOaUrl, isLineConfigured } from "@/lib/site";

export default function BookingWidget({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (checking) return;
    if (!selectedService) {
      setMessage("กรุณาเลือกบริการ");
      return;
    }
    const msg = `สวัสดีครับ/ค่ะ ขอจองคิวดูดวง "${selectedService.name}"${
      name ? ` ชื่อ ${name}` : ""
    } ค่ะ`;
    window.location.href = lineOaUrl(msg);
  }

  if (!services.length) {
    return <p className="text-foreground/60">ยังไม่มีบริการให้เลือกในขณะนี้</p>;
  }

  return (
    <div className="border-2 border-ink bg-paper p-6 sm:p-8">
      <h2 className="font-display text-2xl font-black text-newsred">จองคิวดูดวง</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-bold">บริการ</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-2 w-full border border-ink/40 bg-card px-3 py-2 text-sm focus:border-newsred focus:outline-none"
          >
            <option value="">— เลือกบริการ —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold">ชื่อหรือชื่อเล่นของคุณ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น มะลิ"
            className="mt-2 w-full border border-ink/40 bg-card px-3 py-2 text-sm focus:border-newsred focus:outline-none"
          />
        </div>

        <div className="border border-ink/30 bg-card p-4 text-sm">
          <p className="font-display font-bold text-newsred">สรุปการจองของคุณ</p>
          <ul className="mt-2 space-y-1 text-foreground/80">
            <li>บริการ: {selectedService?.name || "—"}</li>
            <li>ชื่อ: {name || "—"}</li>
            <li>วัน/เวลา: นัดผ่าน LINE กับพี่หมอโดยตรง</li>
          </ul>
        </div>

        {message && <p className="text-sm font-bold text-newsred">{message}</p>}

        <button
            type="submit"
            disabled={checking}
            className="w-full bg-[#06c755] px-6 py-3 font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            จองคิวดูดวงผ่าน LINE
          </button>
        <p className="text-xs text-foreground/50">
          การกดปุ่มจะเปิด LINE พร้อมข้อความสำเร็จรูปให้คุณตรวจสอบและกดส่งเอง
          พี่หมอจะนัดวัน/เวลาที่แน่นอนผ่าน LINE และบันทึกลงคิว
        </p>
      </form>

    </div>
  );
}
