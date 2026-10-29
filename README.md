# Turboztarot

เว็บไซต์ดูดวงโดยพี่หมอ — Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Google Calendar API + LINE handoff.

ดูดวงจริงบนเว็บ + บทความ SEO + ปฏิทินเปิดรับคิว + จองผ่าน LINE + Admin Dashboard.

> หลักการสำคัญ: การเลือกบริการบนเว็บ **ไม่ใช่การจองที่สำเร็จ** คิวจะยืนยันต่อเมื่อพี่หมอตอบกลับผ่าน LINE เท่านั้น ไม่มีการยืนยันอัตโนมัติ และไม่มีระบบชำระเงินออนไลน์

## Stack

- Next.js 16.4 (App Router, Turbopack)
- React 19, TypeScript 5, Tailwind CSS v4
- Supabase (Auth + Postgres + RLS) — เนื้อหาและคิว
- Google Calendar API (Service Account, Server-side เท่านั้น)
- LINE Official Account (handoff ผ่าน URL ที่เปิดพร้อมข้อความสำเร็จรูป)

## เริ่มต้น

```bash
npm install
cp .env.example .env.local   # แล้วกรอกค่าจริง
npm run dev                  # http://localhost:3000
```

### Environment Variables

| ตัวแปร | จำเป็น | รายละเอียด |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ใช่ | URL หน้าแรกสำหรับ canonical/sitemap/OG |
| `NEXT_PUBLIC_SUPABASE_URL` | ใช่* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ใช่* | anon key (ปลอดภัยให้เปิดเผยบน client ได้) |
| `SUPABASE_SERVICE_ROLE_KEY` | ใช่* | service role key — **ห้าม**เปิดเผย เล่น **server เท่านั้น** |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | ใช่* | อีเมล Service Account |
| `GOOGLE_PRIVATE_KEY` | ใช่* | private key (เก็บ `\n` ไว้ถ้าคัดจาก JSON) |
| `GOOGLE_CALENDAR_ID` | ใช่* | ปฏิทินที่ใช้ (มักเป็น email ของ calendar) |
| `GOOGLE_OPEN_TITLE` | ไม่ | ชื่อกิจกรรมที่กำหนด "ช่วงเปิดรับคิว" (default `เปิดรับคิว`) |
| `AVAILABILITY_SLOT_MIN` | ไม่ | ความยาวคิวต่อช่วงในหน่วยนาที (default 60) |
| `NEXT_PUBLIC_LINE_OA_ID` | ใช่* | LINE OA ID (หลัง `@`) |
| `ADMIN_EMAIL` | ไม่ | จำกัด admin ให้เฉพาะอีเมลนี้ |

\* ถ้ายังไม่กรอก เว็บจะยังรันได้โดยใช้ **ข้อมูลตัวอย่าง** แต่ Google Calendar / Supabase / Admin / LINE จะยังไม่ทำงานจริง (แสดงข้อความ "ไม่พร้อมใช้งาน")

## วิธีตั้งค่าที่ต้องทำด้วยตนเอง (manual steps)

### 1. Supabase
1. สร้างโปรเจกต์ที่ https://supabase.com
2. เปิด **SQL Editor** → รัน `supabase/schema.sql` ทั้งไฟล์
3. **Authentication > Users > Add user** สร้างผู้ดูแล (อีเมลต้องตรงกับ `ADMIN_EMAIL`)
4. ไปที่ **Settings > API** คัดลอก `URL`, `anon key`, `service_role key` ลง `.env.local`
5. เข้าสู่ระบบที่ `/admin/login`

### 2. Google Cloud + Calendar
1. (Google Cloud Console) สร้าง Service Account → สร้าง key (JSON) → ใส่ email + private key ลง env
2. แชร์ Google Calendar ให้ Service Account ด้วยสิทธิ์ **ดูรายการ** (reader)
3. กำหนดคิวในปฏิทินด้วยหลักการ:
   - **ช่วงเปิดรับคิว** = สร้างกิจกรรม ชื่อตรงกับ `GOOGLE_OPEN_TITLE` (default: `เปิดรับคิว`) กำหนดเวลา เช่น 09:00–12:00 และ 13:00–17:00
   - **คิวที่จองแล้ว/ไม่ว่าง** = สร้างกิจกรรมชื่ออื่นใดก็ได้ ครอบช่วงเวลานั้น ระบบจะถือว่าไม่ว่าง
4. เว็บแสดงเฉพาะช่วงที่ว่าง และ **ไม่** เปิดเผยชื่อ/รายละเอียดกิจกรรม/ข้อมูลลูกค้า

### 3. LINE Official Account
1. สร้าง OA ที่ LINE Official Account Manager
2. คัดลอก Basic ID (หลัง `@`) ใส่ `NEXT_PUBLIC_LINE_OA_ID`
3. ปุ่ม "ติดต่อจองคิวผ่าน LINE" จะเปิดแชทพร้อมข้อความสำเร็จรูปให้ลูกค้ากดส่งเอง

### 4. Deploy (Vercel)
- กด Import จาก Git repo → ตั้ง env ทั้งหมดใน Project Settings
- ตรวจว่า `SUPABASE_SERVICE_ROLE_KEY` / `GOOGLE_PRIVATE_KEY` ถูกตั้งเป็น **Server Environment Variable** (ไม่ใช่ Public)

## ตารางฐานข้อมูล (ย่อ)

- `services` — บริการดูดวง (public read, admin write)
- `categories` / `articles` — เนื้อหาบล็อก (public read, admin write)
- `bookings` — คิวที่พี่หมอบันทึกเองจาก LINE (ไม่ public)

RLS: ทุกตาราง enable RLS; public อ่านได้เฉพาะเนื้อหา เขียนได้เฉพาะผ่าน server (service role) ซึ่งไม่ถูกเปิดเผย

## เส้นทางหลัก

| เส้นทาง | คำอธิบาย |
|---|---|
| `/` | หน้าแรก + ปฏิทินจองคิว |
| `/services`, `/services/[slug]` | บริการดูดวง |
| `/articles`, `/articles/[slug]` | บทความ SEO + JSON-LD |
| `/about`, `/contact`, `/privacy` | ข้อมูล |
| `/api/availability` | API ตรวจเวลาว่าง (server-side, dynamic) |
| `/admin/*` | ผู้ดูแล (Supabase Auth + guard ฝั่ง server) |

## การทดสอบ — สถานะ

การทดสอบที่ **ผ่านจริง** ในเครื่องนี้:
- `npm run lint` ✓, `npx tsc --noEmit` ✓, `npm run build` ✓ (17 routes)
- หน้า `/`, `/services`, `/services/[slug]`, `/articles`, `/articles/[slug]`, `/about`, `/contact`, `/privacy` → 200
- `/api/availability` เมื่อยังไม่ตั้งค่า Google → คืน `{available:false,...}` (ไม่ crash) ✓
- `/admin/**` เมื่อยังไม่ล็อกอิน → redirect 307 ไป `/admin/login` ✓
- slug ที่ไม่มีอยู่ → 404 ✓
- Unit test ตรรกะหาช่องว่าง (`computeAvailableSlots`): กันเวลาผ่านไป, กันคิวซ้อน, dedup → ผ่าน 4/4

การทดสอบที่ **ต้องทำหลังตั้งค่า credential จริง** (ยังไม่ได้ทำ เพราะไม่มี key):
- เรียก Google Calendar API จริง / ตรวจเวลาว่าง/คิวซ้อนกับปฏิทินจริง
- เข้าสู่ระบบ admin จริง + CRUD บริการ/บทความ/หมวดหมู่/คิว
- LINE handoff เปิดข้อความสำเร็จรูปจริง
- กรณี API ล้มเหลว / ข้อมูลไม่ครบ / คิวเปลี่ยนระหว่างเลือก (มีโค้ดครอบไว้แล้ว ต้องยืนยันกับของจริง)

## งานที่ข้าม (deferred)
- สี/brand: ใช้ธีมม่วง–ทอง default ยังไม่ได้ทำเอกสารแบรนด์
- OG image ยังไม่ได้สร้าง asset ไว้
- ไม่ได้ติดตั้ง PWA / analytics

สำหรับพี่หมอ: เมื่อกรอก env และตั้งค่าเสร็จ ให้รัน `npm run build && npm start` แล้วลองจองคิวจริง + เข้า `/admin` เพื่อยืนยันการทำงานกับของจริงก่อนเปิดใช้งาน
