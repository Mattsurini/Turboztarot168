export const SITE = {
  name: "Turboztarot",
  title: "Turboztarot | ดูดวงโดยพี่หมอ",
  description:
    "บริการดูดวงรายบุคคลโดยพี่หมอ Turboztarot — ไพ่ยิปซี ดวงความรัก การงาน การเงิน บทความทำนาย และการเปิดรับคิวผ่าน LINE",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

const OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID || "";

/** Opens the LINE Official Account chat with a pre-filled message. */
export function lineOaUrl(message: string): string {
  return `https://line.me/R/oaMessage/${OA_ID}/?${encodeURIComponent(message)}`;
}

export function isLineConfigured(): boolean {
  return OA_ID.length > 0;
}

/** Absolute canonical URL for a given app path. */
export function siteCanonical(path = "/"): string {
  const p = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}
