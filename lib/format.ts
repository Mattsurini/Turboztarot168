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

/** Convert a datetime-local input (Bangkok wall time, no offset) to a Notion ISO string with +07:00. Pure string logic: no Date, no server timezone. */
export function localInputToBangkokISO(v: string): string | null {
  const s = v.trim();
  if (!s) return null;
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) return s; // already has offset/timezone
  const m = s.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(:\d{2})?$/);
  if (!m) return null;
  return m[2] ? `${m[1]}${m[2]}+07:00` : `${m[1]}:00+07:00`;
}

/** Service price for display: "299" -> "299 บาท"; an already-labelled value passes through. */
export function formatPrice(price: string | null | undefined): string {
  const p = (price ?? "").trim();
  if (!p) return "";
  return /^[\d,]+(\.\d+)?$/.test(p) ? `${p} บาท` : p;
}
