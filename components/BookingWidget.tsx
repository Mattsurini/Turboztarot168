"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Service } from "@/lib/types";
import { lineOaUrl, isLineConfigured } from "@/lib/site";
import { formatDate, formatTime } from "@/lib/format";

const TZ = 7 * 60 * 60 * 1000;
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_DAY_HEADERS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

type DayMap = Record<string, { start: string; end: string }[]>;

function bangkokMonthKey(): string {
  const d = new Date(Date.now() + TZ);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(key: string, delta: number): string {
  let [y, m] = key.split("-").map(Number);
  m += delta;
  y += Math.floor((m - 1) / 12);
  m = ((m - 1) % 12 + 12) % 12 + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

export default function BookingWidget({ services }: { services: Service[] }) {
  const [month, setMonth] = useState(bangkokMonthKey);
  const [days, setDays] = useState<DayMap | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  const [selKey, setSelKey] = useState<string | null>(null);
  const [sel, setSel] = useState<{ start: string; end: string } | null>(null);
  const [serviceId, setServiceId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?month=${month}`)
      .then((r) => r.json())
      .then((d: { available: boolean; message?: string; days?: DayMap }) => {
        if (cancelled) return;
        setAvailable(d.available);
        setMessage(d.message || "");
        setDays(d.days || {});
        setSelKey(null);
        setSel(null);
        setSlotTaken(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAvailable(false);
        setMessage("เกิดข้อผิดพลาดในการโหลดคิว กรุณาลองใหม่ภายหลัง");
        setDays({});
      });
    return () => {
      cancelled = true;
    };
  }, [month]);

  const grid = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const mi = m - 1;
    const startMs = Date.UTC(y, mi, 1) - TZ; // Bangkok midnight 1st
    const nextMs = Date.UTC(y, mi + 1, 1) - TZ;
    const daysInMonth = Math.round((nextMs - startMs) / 86400000);
    const firstWeekday = (new Date(startMs).getUTCDay() + 6) % 7; // Mon-first
    const cells: ({ key: string; d: number; has: boolean; isToday: boolean } | null)[] =
      [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    const todayKey = bangkokMonthKey().slice(0, 10);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${String(mi + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        key,
        d,
        has: !!days?.[key]?.length,
        isToday: key === todayKey,
      });
    }
    return cells;
  }, [month, days]);

  const selectedDaySlots = selKey ? (days?.[selKey] || []) : [];
  const selectedService = services.find((s) => s.id === serviceId);

  const handleConfirm = useCallback(async () => {
    if (!sel || slotTaken) return;
    setChecking(true);
    setSlotTaken(false);
    try {
      const r = await fetch(`/api/availability?start=${encodeURIComponent(sel.start)}`);
      const d = await r.json();
      setChecking(false);
      if (!d.free) {
        setSlotTaken(true);
        return;
      }
      const msg = `สวัสดีครับ/ค่ะ ขอจองคิวดูดวง${selectedService ? ` "${selectedService.name}"` : ""} วันที่ ${formatDate(sel.start)} เวลา ${formatTime(sel.start)} ชื่อ${name ? ` ${name}` : ""} ค่ะ`;
      window.location.href = lineOaUrl(msg);
    } catch {
      setChecking(false);
      setSlotTaken(true);
    }
  }, [sel, slotTaken, selectedService, name]);

  const bkkIso = (iso: string) => new Date(new Date(iso).getTime() + TZ);
  const thaiDateFor = (iso: string) => {
    const d = bkkIso(iso);
    return `${d.getUTCDate()} ${THAI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`;
  };

  if (!services.length) {
    return (
      <p className="text-foreground/60">ยังไม่มีบริการให้เลือกในขณะนี้</p>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/25 bg-[#121212] p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold">เช็คตารางคิว</h2>


      {/* Month navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => shiftMonth(m, -1))}
          aria-label="เดือนก่อนหน้า"
          className="rounded-full border border-gold/30 px-3 py-1 text-sm hover:bg-[#1f1f1f]"
        >
          ←
        </button>
        <span className="font-semibold">
          {(() => {
            const [y, m] = month.split("-").map(Number);
            return `${THAI_MONTHS[m - 1]} ${y + 543}`;
          })()}
        </span>
        <button
          type="button"
          onClick={() => setMonth((m) => shiftMonth(m, 1))}
          aria-label="เดือนถัดไป"
          className="rounded-full border border-gold/30 px-3 py-1 text-sm hover:bg-[#1f1f1f]"
        >
          →
        </button>
      </div>

      {/* Status */}
      {available === false && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          {message || "ขณะนี้ยังไม่เปิดรับคิว กรุณากลับมาภายหลัง"}
        </p>
      )}
      {available === null && (
        <p className="mt-4 text-sm text-foreground/50">กำลังโหลดคิว...</p>
      )}

      {/* Calendar grid */}
      {available && (
        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {THAI_DAY_HEADERS.map((h) => (
            <div key={h} className="py-1 text-xs font-medium text-foreground/50">
              {h}
            </div>
          ))}
          {grid.map((cell, i) =>
            cell === null ? (
              <div key={`e${i}`} />
            ) : (
              <button
                key={cell.key}
                type="button"
                disabled={!cell.has}
                onClick={() => {
                  setSelKey(cell.key);
                  setSel(null);
                  setSlotTaken(false);
                }}
                className={`relative flex h-10 items-center justify-center rounded-lg text-sm transition ${
                  cell.isToday ? "font-bold text-violet-700" : ""
                } ${
                  cell.has
                    ? selKey === cell.key
                      ? "bg-violet-700 text-black"
                      : "bg-violet-100 text-violet-800 hover:bg-violet-200"
                    : "text-foreground/30"
                }`}
              >
                {cell.d}
              </button>
            )
          )}
        </div>
      )}

      {/* Slot list */}
      {available && selKey && (
        <div className="mt-6">
          <p className="text-sm font-medium">
            วันที่ {thaiDateFor(`${selKey}T00:00:00+07:00`)}
          </p>
          {selectedDaySlots.length === 0 ? (
            <p className="mt-2 text-sm text-foreground/60">
              วันนี้ไม่มีช่วงเวลาว่างเหลือแล้ว
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedDaySlots.map((s) => (
                <button
                  key={s.start}
                  type="button"
                  onClick={() => {
                    setSel({ start: s.start, end: s.end });
                    setSlotTaken(false);
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    sel?.start === s.start
                      ? "border-violet-700 bg-violet-700 text-black"
                      : "border-gold/30 bg-[#121212] hover:border-violet-300"
                  }`}
                >
                  {formatTime(s.start)} – {formatTime(s.end)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Name + summary + LINE */}
      {available && sel && (
        <div className="mt-6 rounded-xl border border-gold/30 p-4">
          <label className="text-sm font-medium">
            ชื่อหรือชื่อเล่นของคุณ
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น มะลิ"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />

          <div className="mt-4 rounded-lg bg-violet-50 p-4 text-sm">
            <p className="font-semibold text-violet-800">สรุปการจองของคุณ</p>
            <ul className="mt-2 space-y-1 text-foreground/80">
              <li>บริการ: {selectedService?.name || "—"}</li>
              <li>วันที่: {thaiDateFor(sel.start)}</li>
              <li>เวลา: {formatTime(sel.start)} – {formatTime(sel.end)}</li>
              <li>ชื่อ: {name || "—"}</li>
            </ul>
          </div>

          {slotTaken && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              ขออภัย คิวที่เลือกถูกจองแล้ว กรุณาเลือกช่วงเวลาอื่น
            </p>
          )}

          {!isLineConfigured() ? (
            <p className="mt-3 text-sm text-foreground/50">
              ยังไม่ได้ตั้งค่า LINE Official Account
            </p>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={checking || slotTaken}
              className="mt-4 w-full rounded-full bg-[#06c755] px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              {checking ? "กำลังตรวจสอบคิว..." : "ติดต่อจองคิวผ่าน LINE"}
            </button>
          )}
          <p className="mt-3 text-xs text-foreground/50">
            การกดปุ่มนี้จะเปิด LINE พร้อมข้อความสำเร็จรูปให้คุณตรวจสอบและกดส่งเอง
            คิวจะยืนยันเมื่อพี่หมอตอบกลับเท่านั้น
          </p>
        </div>
      )}
    </div>
  );
}
