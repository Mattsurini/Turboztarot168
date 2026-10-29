import { google } from "googleapis";
import { JWT } from "google-auth-library";

export const CAL_TZ = "Asia/Bangkok";

export type RawEvent = {
  start: Date;
  end: Date;
  /** true when this event carries the "open for bookings" marker title. */
  open: boolean;
};

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID
  );
}

/** Bangkok is fixed UTC+7 (no DST): day start in Bangkok = prev-day 17:00 UTC. */
function bangkokDayStart(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1, 17, 0, 0));
}

/**
 * Fetch all events in [start, end) from the calendar via a Service Account.
 * Throws if the API call fails (caller decides how to degrade).
 */
export async function fetchCalendarEvents(start: Date, end: Date): Promise<RawEvent[]> {
  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  const calendar = google.calendar({ version: "v3", auth: jwt });
  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    timeZone: CAL_TZ,
  });

  const openTitle = process.env.GOOGLE_OPEN_TITLE || "เปิดรับคิว";
  const items = (res.data.items || []).map((e) => {
    let startD: Date;
    let endD: Date;
    if (e.start?.dateTime && e.end?.dateTime) {
      startD = new Date(e.start.dateTime);
      endD = new Date(e.end.dateTime);
    } else if (e.start?.date && e.end?.date) {
      // all-day: block the whole Bangkok day
      startD = bangkokDayStart(e.start.date);
      endD = bangkokDayStart(e.end.date);
    } else {
      return null;
    }
    return {
      start: startD,
      end: endD,
      open: (e.summary || "").trim() === openTitle,
    } as RawEvent;
  });

  return items.filter((e): e is RawEvent => e !== null);
}
