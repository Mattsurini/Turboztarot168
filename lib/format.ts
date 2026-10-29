const TZ = "Asia/Bangkok";

function fmt(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("th-TH", { timeZone: TZ, ...options }).format(date);
}

/** YYYY-MM-DD in Bangkok time. */
export function toDateKey(iso: string): string {
  return fmt(new Date(iso), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replaceAll("/", "-");
}

/** dd/MM/yyyy for display. */
export function formatDate(iso: string): string {
  return fmt(new Date(iso), { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** HH:mm 24h in Bangkok time. */
export function formatTime(iso: string): string {
  return fmt(new Date(iso), { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Long Thai date, e.g. "29 ตุลาคม 2026". */
export function formatThaiDate(iso: string): string {
  return fmt(new Date(iso), { day: "numeric", month: "long", year: "numeric" });
}
