import { getBookingsForCalendar } from "@/lib/data";
import { toDateKey } from "@/lib/format";

/**
 * Public queue calendar. Shows unfinished bookings (รับคิวแล้ว / กำลังทำนาย)
 * as name chips with a status-coloured bar on a month grid. Finished
 * (ส่งคำทำนายแล้ว) bookings are admin-only: they are excluded here so the
 * public noise stays at "who's still waiting". Server component reads from
 * Notion via lib/data.ts.
 */

// Inline hex: the dark "ember" theme remaps Tailwind red-500/blue-500 to the
// same dark amber, so status bars must not rely on theme color tokens.
const STATUS_COLORS: Record<string, string> = {
  "รับคิวแล้ว": "#ef4444",
  "กำลังทำนาย": "#3b82f6",
};

/** Build the 6-row month calendar grid (weeks start Sunday) for a given month. */
function monthCells(year: number, month: number): Date[] {
  // month is 1-based here
  const start = new Date(year, month - 1, 1 - new Date(year, month - 1, 1).getDay());
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

/** shortcut: Thailand has no DST; a +7h shift on the instant gives the Bangkok wall clock. */
const bkk = (d: Date) => new Date(d.getTime() + 7 * 60 * 60 * 1000);

export default async function QueueCalendar() {
  const bookings = await getBookingsForCalendar();

  // current month (Bangkok) → build grid
  const bkkNow = bkk(new Date());
  const year = bkkNow.getFullYear();
  const month = bkkNow.getMonth() + 1; // 1-based
  const cells = monthCells(year, month);

  const byDay = new Map<string, typeof bookings>();
  for (const b of bookings) {
    if (!b.scheduled_at) continue;
    const key = toDateKey(b.scheduled_at);
    const arr = byDay.get(key) ?? [];
    arr.push(b);
    byDay.set(key, arr);
  }

  const monthName = new Intl.DateTimeFormat("th-TH", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(year, month - 1, 1));

  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between border-b-2 border-ink pb-3">
        <div>
          <h2 className="font-display text-3xl font-bold">คิวดูดวง</h2>
          <p className="mt-1 text-foreground/60">
            แดง = รับคิวแล้ว ยังไม่ได้ทำนาย · ฟ้า = กำลังทำนาย
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-center font-display text-lg font-bold">{monthName}</p>
        <div className="mt-3 grid grid-cols-7 gap-px border border-ink/15 bg-ink/10 text-center">
          {daysOfWeek.map((d) => (
            <div key={d} className="bg-paper py-1 text-xs font-bold text-foreground/60">
              {d}
            </div>
          ))}
          {cells.map((date) => {
            const key = toDateKey(date.toISOString());
            const dayBookings = byDay.get(key);
            const inMonth = bkk(date).getMonth() + 1 === month;
            return (
              <div
                key={key}
                className={`min-h-20 bg-paper p-1.5 text-left align-top ${
                  inMonth ? "" : "opacity-40"
                }`}
              >
                <p className="text-xs font-semibold text-foreground/70">
                  {bkk(date).getDate()}
                </p>
                <div className="mt-1 space-y-1">
                  {dayBookings?.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      style={{
                        borderLeft: `4px solid ${STATUS_COLORS[b.status] ?? "#9ca3af"}`,
                      }}
                      className="bg-card px-1.5 py-0.5 text-[11px] font-bold text-white"
                    >
                      <span className="truncate">{b.name}</span>
                    </div>
                  ))}
                  {dayBookings && dayBookings.length > 3 && (
                    <p className="text-[11px] font-semibold text-foreground/60">
                      +{dayBookings.length - 3} คน
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
