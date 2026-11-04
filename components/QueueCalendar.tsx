import { getBookingsForCalendar } from "@/lib/data";
import { toDateKey } from "@/lib/format";
import { lineOaUrl } from "@/lib/site";

/**
 * Public queue calendar. Shows unfinished bookings (รับคิวแล้ว / กำลังทำนาย)
 * as name chips with a status-coloured bar on a month grid. Finished
 * (ส่งคำทำนายแล้ว) bookings are admin-only: they are excluded here so the
 * public noise stays at "who's still waiting". Server component reads from
 * Notion via lib/data.ts.
 */

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

  // การทำนายในคิว: กำลังทำนาย highlighted amber, the rest (waiting) crimson.
  const chipClass = (status: string) =>
    status === "กำลังทำนาย" ? "chip chip--doing" : "chip chip--wait";

  return (
    <section className="section section--dim">
      <div className="wrap">
        <div className="shead">
          <p className="kicker">ดูว่าวันนี้ใครยังรออยู่บ้าง · จองผ่าน LINE โดยตรง</p>
          <h2>คิวดูดวง</h2>
          <div className="rule"></div>
        </div>
        <div className="panel">
          <div className="panel__head">
            <div className="glyph-line">✦ ✧ ✦</div>
            <h3>{monthName}</h3>
            <p>แถบสีแดง: รอคำทำนาย · แถบสีเหลือง: กำลังทำนาย</p>
          </div>
          <table className="cal" aria-label="ปฏิทินคิวดูดวงประจำเดือน">
            <thead>
              <tr>
                {daysOfWeek.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, r) => (
                <tr key={r}>
                  {cells.slice(r * 7, r * 7 + 7).map((date) => {
                    const key = toDateKey(date.toISOString());
                    const dayBookings = byDay.get(key);
                    const inMonth = bkk(date).getMonth() + 1 === month;
                    return (
                      <td key={key} className={inMonth ? "" : "out"}>
                        <span className="dow">{bkk(date).getDate()}</span>
                        {dayBookings?.map((b) => (
                          <span key={b.id} className={chipClass(b.status)}>
                            {b.name || "ไม่ระบุชื่อ"}
                          </span>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="legend">
            <span><span className="dot dot--wait"></span>รอคำทำนาย</span>
            <span><span className="dot dot--doing"></span>กำลังทำนาย</span>
          </div>
        </div>
        <div className="join">
          <div className="glyph-line">✦ จองคิวดูดวงผ่าน LINE โดยตรง ✦</div>
          <p>พี่หมอจะนัดวัน/เวลาที่แน่นอนผ่าน LINE และบันทึกลงคิวให้คุณ</p>
          <a className="btn btn--line" href={lineOaUrl("สวัสดีครับ/ค่ะ ขอจองคิวดูดวงค่ะ")}>
            จองคิวดูดวงผ่าน LINE
          </a>
        </div>
      </div>
    </section>
  );
}
