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
          <h1 className="font-display text-3xl font-bold">คิวดูดวง</h1>
          <p className="mt-1 text-foreground/60">
            แถบสีแดง: รอคำทำนาย · แถบสีน้ำเงิน: กำลังทำนาย
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
                className={`relative min-h-[108px] bg-paper p-1.5 text-left align-top ${
                  inMonth ? "" : "opacity-40"
                }`}
              >
                <p className="text-xs font-semibold text-foreground/70">
                  {bkk(date).getDate()}
                </p>
                <div className="mt-1 space-y-1">
                  {dayBookings?.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      title={b.name || "ไม่ระบุชื่อ"}
                      style={{
                        borderLeft: `4px solid ${STATUS_COLORS[b.status] ?? "#9ca3af"}`,
                      }}
                      className="bg-card px-1.5 py-1 text-xs font-bold leading-tight text-white"
                    >
                      <span className="block truncate">{b.name || "ไม่ระบุชื่อ"}</span>
                    </div>
                  ))}
                  {dayBookings && dayBookings.length > 2 && (
                    // Ties the row height to the 2 visible chips; the rest open
                    // as an absolute popover so a busy day never stretches the row.
                    <details className="group relative">
                      <summary className="list-none cursor-pointer text-[11px] font-semibold text-foreground/60 hover:text-foreground">
                        +{dayBookings.length - 2} คน
                      </summary>
                      <div
                        className={`absolute top-full z-10 mt-1 max-h-48 w-44 space-y-1 overflow-y-auto rounded-sm border border-rule bg-panel/95 p-1.5 shadow-lg ${
                          bkk(date).getDay() >= 4 ? "right-0" : "left-0"
                        }`}
                      >
                        {dayBookings.slice(2).map((b) => (
                          <div
                            key={b.id}
                            title={b.name || "ไม่ระบุชื่อ"}
                            style={{
                              borderLeft: `4px solid ${STATUS_COLORS[b.status] ?? "#9ca3af"}`,
                            }}
                            className="bg-card px-1.5 py-1 text-xs font-bold leading-tight text-white"
                          >
                            <span className="block truncate">{b.name || "ไม่ระบุชื่อ"}</span>
                          </div>
                        ))}
                      </div>
                    </details>
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
