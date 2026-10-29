import type { Article, Category, Service } from "./types";

// Seed content so the site is usable and fully renderable before real
// Supabase credentials are supplied. Replace by rows in the database.
export const seedServices: Service[] = [
  {
    id: "s1",
    slug: "qa-package",
    name: "Q & A Package",
    short_desc: "เป็นการดูดวงจากสถานการณ์ที่เจาะจง",
    description:
      "เป็นการดูดวงจากสถานการณ์ที่เจาะจง — ตอบคำถามที่คุณกังวลตรงจุด ตามเหตุการณ์หรือสถานการณ์ที่ต้องการความชัดเจน โดยพี่หมอจะตีความและให้คำแนะนำที่นำไปใช้ได้จริง",
    price: "590 บาท", // shortcut: placeholder — set real value in admin
    duration_min: 45,
    order: 1,
    active: true,
  },
  {
    id: "s2",
    slug: "relationship-package",
    name: "Relationship Package",
    short_desc: "แพคเกจเกี่ยวกับความรักและความสัมพันธ์",
    description:
      "เป็นแพคเกจเกี่ยวกับความรักและความสัมพันธ์ — เจาะลึกเรื่องความรัก ความสัมพันธ์ คู่เก่า คู่ใหม่ เกณฑ์และอุปสรรค พร้อมแนวทางรับมือกับช่วงเวลาที่ต้องตัดสินใจ",
    price: "690 บาท", // shortcut: placeholder — set real value in admin
    duration_min: 60,
    order: 2,
    active: true,
  },
  {
    id: "s3",
    slug: "special-package",
    name: "Special Package",
    short_desc: "แพคเกจพิเศษเฉพาะตัวของพี่หมอ",
    description:
      "เป็นแพคเกจพิเศษเฉพาะตัวของพี่หมอ — สำหรับผู้ที่ต้องการบทอ่านที่ลงลึกและเฉพาะบุคคลมากยิ่งขึ้น เหมาะกับคำถามซับซ้อนหรือต้องการรายละเอียดแบบเต็มรูปแบบ",
    price: "990 บาท", // shortcut: placeholder — set real value in admin
    duration_min: 60,
    order: 3,
    active: true,
  },
  {
    id: "s4",
    slug: "calling-package",
    name: "Calling Package",
    short_desc: "แพคเกจ Call และ Vdo Call ถามได้ไม่จำกัดตามเวลาที่ตกลงกันไว้",
    description:
      "เป็นแพคเกจ Call และ Vdo Call — ปรึกษากับพี่หมอแบบสด ถามได้ไม่จำกัดตามเวลาที่ตกลงกันไว้ เหมาะสำหรับผู้ที่ต้องการพูดคุยและซักถามอย่างละเอียดแบบตัวต่อตัว",
    price: "1290 บาท", // shortcut: placeholder — set real value in admin
    duration_min: 60,
    order: 4,
    active: true,
  },
];

export const seedCategories: Category[] = [
  { id: "c1", name: "บทความทั่วไป", slug: "general" },
  { id: "c2", name: "ตำราไพ่ยิปซี", slug: "tarot-guide" },
];

export const seedArticles: Article[] = [
  {
    id: "a1",
    slug: "tarot-for-beginners",
    title: "เริ่มต้นดูไพ่ยิปซี ฉบับมือใหม่",
    excerpt: "ทำความรู้จักสำรับไพ่ยิปซี ความหมายของเมเจอร์อาร์คานา และวิธีเริ่มอ่านไพ่ด้วยตัวเอง",
    content:
      "ไพ่ยิปซีเป็นเครื่องมือสะท้อนจิตใจมากกว่าการทำนายอนาคตแบบตายตัว ...\n\nเมเจอร์อาร์คานา 22 ใบ สื่อถึงบทเรียนใหญ่ของชีวิต เริ่มจากการตั้งคำถามที่ชัดเจน แล้วเลือกไพ่ด้วยสัญชาตญาณของตัวเอง สิ่งสำคัญคือการเปิดใจฟังเสียงภายใน",
    cover_image: null,
    published_at: "2026-10-20",
    category: { id: "c2", name: "ตำราไพ่ยิปซี", slug: "tarot-guide" },
  },
  {
    id: "a2",
    slug: "love-in-tarot",
    title: "ไพ่ความรัก: เมื่อ 'คู่รัก' ปรากฏขึ้นแปลว่าอะไร",
    excerpt: "ความหมายของไพ่ The Lovers ในบริบทความรักและการตัดสินใจ",
    content:
      "ไพ่ The Lovers ไม่ได้แปลว่าคู่แท้เสมอไป แต่พูดถึงการเลือกและการเชื่อมโยงที่ลึกซึ้ง ...\n\nในเรื่องความรัก ไพ่นี้บ่งบอกถึงความปรองดองและความผูกพัน แต่ก็เตือนให้ตัดสินใจด้วยหัวใจและเหตุผลที่สมดุล",
    cover_image: null,
    published_at: "2026-10-12",
    category: { id: "c1", name: "บทความทั่วไป", slug: "general" },
  },
];

