# Turboztarot

เว็บไซต์ดูดวงโดยพี่หมอ — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Notion (data store) + LINE OA handoff + Admin Dashboard.

ดูดวงจริงบนเว็บ + บทความ SEO + ปฏิทินเปิดรับคิว + จองผ่าน LINE + Admin Dashboard

> หลักการสำคัญ: การเลือกบริการบนเว็บ **ไม่ใช่การจองที่สำเร็จ** คิวจะยืนยันต่อเมื่อพี่หมอตอบกลับผ่าน LINE เท่านั้น ไม่มีการยืนยันอัตโนมัติ และไม่มีระบบชำระเงินออนไลน์

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5
- Tailwind CSS v4
- Notion (databases/data sources) — เนื้อหา + คิว ฝั่ง server; fallback เป็น seed data เมื่อยังไม่ตั้งค่า key
- Admin auth: sha256 hash ของรหัสผ่านใน env + HMAC-signed HttpOnly cookie (ไม่มี Supabase)
- LINE Official Account (handoff ผ่าน URL ที่เปิดพร้อมข้อความสำเร็จรูป)

## เริ่มต้น

```bash
npm install
cp .env.example .env.local   # แล้วกรอกค่าจริง (ดูด้านล่าง)
npm run dev                  # http://localhost:3000
```

npm scripts (`package.json`):

| Script | คำสั่ง |
|---|---|
| `npm run dev` | เปิด dev server |
| `npm run build` | build production (`next build`) |
| `npm start` | เปิด production server (`next start`) |
| `npm run lint` | ตรวจ lint (eslint) |
| `npm run preview` / `deploy` / `upload` | build + preview/deploy/upload ผ่าน OpenNext Cloudflare |
| `npm run cf-typegen` | สร้าง CloudflareEnv type (`wrangler types`) |

### Environment Variables

รายการจาก `lib/notion.ts`, `lib/notion-data.ts`, `lib/site.ts`, `lib/admin.ts` (+ `app/admin/actions.ts`) — ดูตัวอย่างใน `.env.example`

| ตัวแปร | จำเป็น | รายละเอียด |
|---|---|---|
| `NOTION_API_KEY` | ใช่* | integration token — **ห้าม**เปิดเผย, ใช้ฝั่ง **server เท่านั้น** |
| `NOTION_SERVICES_DB` | ไม่ | ไม่ใช้แล้ว — บริการอ่าน/เขียนจากชุด data source แบบ built-in 5 ชุด (ดูหัวข้อ Notion data sources) |
| `NOTION_CATEGORIES_DB` | ใช่* | data source ID ของหมวดหมู่บทความ |
| `NOTION_ARTICLES_DB` | ใช่* | data source ID ของบทความ |
| `NOTION_BOOKINGS_DB` | ใช่* | data source ID ของคิว |
| `ADMIN_PASSWORD_HASH` | ใช่* | sha256 hex ของรหัสผ่าน admin — **ห้าม**เปิดเผย |
| `ADMIN_COOKIE_SECRET` | ใช่* | string สุ่มยาว ใช้เซ็น cookie เซสชัน admin |
| `NEXT_PUBLIC_SITE_URL` | ใช่ | URL หน้าแรกสำหรับ canonical/sitemap/OG (default `http://localhost:3000`) |
| `NEXT_PUBLIC_LINE_OA_ID` | ใช่* | LINE OA Basic ID (หลัง `@`) |
| `NEXT_PUBLIC_LINE_OA_URL` | ไม่ | lin.ee หรือ short link ของ OA — ถ้าตั้งไว้จะใช้แทน deep link (ไม่รองรับข้อความสำเร็จรูป) |
| `NEXT_PUBLIC_ADMIN_USERNAME` | ไม่ | ชื่อผู้ใช้ admin สำหรับหน้า login (default `turboz`) |

\* ถ้ายังไม่กรอกเว็บจะยังรันได้โดยใช้ **ข้อมูลตัวอย่าง** (seed) แต่ Notion / Admin / LINE จะยังไม่ทำงานจริง

หมายเหตุ: ตัวแปร `NEXT_PUBLIC_*` ถูก bundle เข้า client bundle — อย่าใส่ความลับลงไป มีแต่ `NOTION_*`, `ADMIN_*` เท่านั้นที่เป็น server-only

## การตั้งค่า

### 1. Notion

1. สร้าง integration ที่ https://www.notion.so/my-integrations → คัดลอก token ใส่ `NOTION_API_KEY`
2. สร้าง data source (database) 4 อัน: Services / Categories / Articles / Bookings
3. แต่ละ data source: คอลัมน์ต้องชื่อตรงตามที่ `lib/notion-data.ts` อ่าน (ดูด้านล่าง) แล้ว **Connect to** integration (ถ้าไม่เชื่อม API จะ 404)
4. คัดลอก data source ID ของแต่ละอันใส่ `NOTION_*_DB`
5. ตั้งค่า admin: `ADMIN_PASSWORD_HASH` = sha256 hex ของรหัสผ่าน, `ADMIN_COOKIE_SECRET` = string สุ่มยาว
6. เข้าสู่ระบบที่ `/admin/login` (username จาก `NEXT_PUBLIC_ADMIN_USERNAME` หรือ default `turboz`)

**คอลัมน์ที่จำเป็นในแต่ละ data source** (ชนิดตามโค้ด `lib/notion-data.ts`):

- **Services**: `Name` (title), `slug` (rich_text), `short_desc` (rich_text), `description` (rich_text), `price` (rich_text), `duration_min` (number), `order` (number), `active` (checkbox)
- **Categories**: `Name` (title), `slug` (rich_text)
- **Articles**: `Title` (title), `slug` (rich_text), `excerpt` (rich_text), `content` (rich_text), `cover_image` (url), `Category` (relation → Categories), `published_at` (date)
- **Bookings**: `Name` (title, ชื่อลูกค้า), `service_name` (rich_text), `scheduled_at` (date), `status` (select: `รอ`/`ยืนยันแล้ว`/`เสร็จสิ้น` — เมืิ่ออ่านค่าเก่าจะ map เป็น `รับคิวแล้ว`/`ส่งคำทำนายแล้ว`)

### 2. LINE Official Account

1. สร้าง OA ที่ LINE Official Account Manager
2. คัดลอก Basic ID (หลัง `@`) ใส่ `NEXT_PUBLIC_LINE_OA_ID`
3. ปุ่ม "ติดต่อจองคิวผ่าน LINE" จะเปิดแชทพร้อมข้อความสำเร็จรูปให้ลูกค้ากดส่งเอง (ถ้าตั้ง `NEXT_PUBLIC_LINE_OA_URL` จะเปิด short link แทน)

### 3. Deploy

- ลำดับปกติ: build ด้วย `next build` → รัน `next start` (หรือ Dockerfile)
- สำหรับ Cloudflare Workers: `npm run deploy` (OpenNext Cloudflare)
- ตั้ง env ทั้งหมดเป็น **Server Environment Variable** โดยเฉพาะ `ADMIN_PASSWORD_HASH`, `ADMIN_COOKIE_SECRET`, `NOTION_API_KEY` — อย่าเปิดเป็น public

## Notion data sources ที่ใช้กับบริการ

- **หน้าบริการสาธารณะ** (`/services`) อ่านจาก **5 data source IDs แบบ hardcode** ใน `lib/notion-data.ts` (`SERVICE_DBS`): Q and A, Relationship Package, Special Pack, Call Pack, Deep Reading — บริการจะ map ผ่านชื่อใน `lib/service-slugs.ts`
- **Admin เขียนบริการ** ไปที่ data source ใดใน 5 ชุดนั้นตามที่เลือกในฟอร์ม (`table`) — ไม่ใช้ `NOTION_SERVICES_DB` อีกต่อไป
- **Categories / Articles / Bookings** อ่าน–เขียนจาก data source ตาม env `NOTION_CATEGORIES_DB`, `NOTION_ARTICLES_DB`, `NOTION_BOOKINGS_DB`

Public อ่านผ่าน token เดียวกัน (server-side); admin เขียนผ่าน server action ที่ตรวจ session ก่อนเสมอ ไม่มี key ไปถึง client

## เส้นทางหลัก

| เส้นทาง | คำอธิบาย |
|---|---|
| `/` | หน้าแรก + ปฏิทินคิว |
| `/queue` | ปฏิทินคิว (แสดงชื่อลูกค้า + สถานะ) |
| `/services`, `/services/[slug]` | บริการดูดวง |
| `/articles`, `/articles/[slug]` | บทความ SEO + JSON-LD |
| `/about`, `/contact`, `/privacy`, `/terms` | ข้อมูล |
| `/admin/*` | ผู้ดูแล (auth แบบ env password + session cookie, guard ฝั่ง server) |

## งานที่ข้าม (deferred)

- OG image ยังไม่ได้สร้าง asset ไว้
- ไม่ได้ติดตั้ง PWA / analytics

สำหรับพี่หมอ: เมื่อกรอก env และตั้งค่าเสร็จ ให้รัน `npm run build && npm start` แล้วลองจองคิวจริง + เข้า `/admin` เพื่อยืนยันการทำงานกับของจริงก่อนเปิดใช้งาน
