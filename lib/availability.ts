import type { AvailableSlot, RawEvent } from "./types";
import { serviceRoleSupabase } from "./supabase";

/** Bangkok's fixed UTC+7 offset in ms. */
const TZ_OFFSET = 7 * 60 * 60 * 1000;

export function defaultSlotMin(): number {
  const n = Number(process.env.AVAILABILITY_SLOT_MIN);
  return Number.isFinite(n) && n > 0 ? n : 60;
}

function overlaps(aS: number, aE: number, bS: number, bE: number): boolean {
  return aS < bE && bS < aE;
}

/**
 * Compute free slots: slot candidates carved out of "open for bookings"
 * windows, minus any time covered by busy (non-open) events, minus slots
 * already passed in Bangkok time. Only {start,end} are returned — event
 * titles/descriptions/attendees never reach the client.
 */
export function computeAvailableSlots(
  events: RawEvent[],
  slotMin = defaultSlotMin(),
  now = Date.now()
): AvailableSlot[] {
  const windows = events
    .filter((e) => e.open && e.end > e.start)
    .map((e) => ({ start: e.start.getTime(), end: e.end.getTime() }));
  const busy = events
    .filter((e) => !e.open && e.end > e.start)
    .map((e) => ({ start: e.start.getTime(), end: e.end.getTime() }));

  const seen = new Set<string>();
  const slots: AvailableSlot[] = [];

  for (const w of windows) {
    // Round window start up to the next slot boundary for tidy times.
    let t = Math.ceil(w.start / (slotMin * 60_000)) * (slotMin * 60_000);
    const step = slotMin * 60_000;
    for (; t + step <= w.end + 1000; t += step) {
      if (t < now) continue; // slot already past in Bangkok
      if (busy.some((b) => overlaps(t, t + step, b.start, b.end))) continue;
      const key = new Date(t).toISOString();
      if (seen.has(key)) continue;
      seen.add(key);
      slots.push({
        start: new Date(t).toISOString(),
        end: new Date(t + step).toISOString(),
      });
    }
  }

  slots.sort((a, b) => a.start.localeCompare(b.start));
  return slots;
}

export type MonthSlots = {
  available: boolean;
  message?: string;
  days?: Record<string, AvailableSlot[]>;
};

/**
 * Load availability windows from the database. Slots are carved from every
 * open window, and any busy (open=false) window blocks the slots it overlaps,
 * regardless of read order.
 */
export async function fetchAvailabilitySlots(start: Date, end: Date): Promise<RawEvent[]> {
  const db = serviceRoleSupabase();
  if (!db) throw new Error("Supabase not configured");
  const { data, error } = await db
    .from("availability_slots")
    .select("start_at, end_at, open")
    .gte("start_at", start.toISOString())
    .lt("start_at", end.toISOString())
    .order("start_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({
    start: new Date(r.start_at),
    end: new Date(r.end_at),
    open: !!r.open,
  }));
}

/**
 * Fetch and compute availability for a whole month.
 * Returns available:false instead of throwing when the calendar is
 * unconfigured or the Google API fails, so the UI can degrade gracefully.
 */
export async function getMonthAvailability(
  year: number,
  month: number // 0-11
): Promise<MonthSlots> {
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0) - TZ_OFFSET); // Bangkok midnight, 1st
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0) - TZ_OFFSET);
  try {
    const events = await fetchAvailabilitySlots(start, end);
    const slots = computeAvailableSlots(events);
    const days: Record<string, AvailableSlot[]> = {};
    for (const s of slots) {
      const key = new Date(new Date(s.start).getTime() + TZ_OFFSET)
        .toISOString()
        .slice(0, 10);
      (days[key] ||= []).push(s);
    }
    return { available: true, days };
  } catch {
    return { available: false, message: "ปฏิทินไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่ภายหลัง" };
  }
}
