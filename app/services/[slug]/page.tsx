import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, MessageCircle, Moon, Phone, Sparkles, Target, Video, type LucideIcon } from "lucide-react";
import { getServiceBySlug } from "@/lib/data";
import { lineOaUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { siteCanonical } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const DELIVERY = "ใช้สินค้าทำนายภายใน 1-2 วันนับจากที่สั่งซื้อ";

const QA_PACKAGES = [
  { icon: MessageCircle, name: "1 คำถาม", desc: "เปิดไพ่ในสถานการณ์ที่เจาะจง", price: "THB 49.00" },
  { icon: MessageCircle, name: "2 คำถาม", desc: "เปิดไพ่ในสถานการณ์ที่เจาะจง", price: "THB 89.00" },
  { icon: MessageCircle, name: "5 คำถาม", desc: "เปิดไพ่ในสถานการณ์ที่เจาะจง", price: "THB 159.00" },
  { icon: MessageCircle, name: "3 คำถาม", desc: "เปิดไพ่ในสถานการณ์ที่เจาะจง", price: "THB 109.00" },
  {
    icon: Target,
    name: "เจาะลึกแบบบุคคล",
    desc: "เปิดไพ่เจาะลึกเรื่องที่ต้องการ 1 เรื่องแบบบุคคล แบบไม่มีที่กัก พร้อมคำทำนายละเอียดเกี่ยวกับเรื่องที่จะเจาะ 3-5 คำถาม",
    price: "THB 169.00",
  },
  {
    icon: Sparkles,
    name: "Horary Astrology 5 คำถาม",
    desc: "ตอบคำถามที่ชัดเจนและเจาะจงด้วย Astrology ไม่เหมาะกับการทายใจทุกแบบ สามารถถามเรื่องเวลาได้ ระบุเวลาที่เป็นการเล่า เรื่องให้หมดไม่ควรนึกเล่าไว้",
    price: "THB 299.00",
  },
  {
    icon: Sparkles,
    name: "Horary Astrology 3 คำถาม",
    desc: "ตอบคำถามที่ชัดเจนและเจาะจงด้วย Astrology ไม่เหมาะกับการทายใจทุกแบบ สามารถถามเรื่องเวลาได้ ระบุเวลาที่เป็นการเล่า เรื่องให้หมดไม่ควรนึกเล่าไว้",
    price: "THB 210.00",
  },
  {
    icon: Sparkles,
    name: "Horary Astrology 1 คำถาม",
    desc: "ตอบคำถามที่ชัดเจนและเจาะจงด้วย Astrology ไม่เหมาะกับการทายใจทุกแบบ สามารถถามเรื่องเวลาได้ ระบุเวลาที่เป็นการเล่า เรื่องให้หมดไม่ควรนึกเล่าไว้",
    price: "THB 89.00",
  },
  {
    icon: Moon,
    name: "โหราศาสตร์ และการเสี่ยงทาย",
    desc: "เช่น โหราศาสตร์ การเสี่ยงดวง การขาลง หรือ พบเห็นฝัน อะไรที่เกี่ยวกับการสมรภพคิด",
    price: "THB 99.00",
  },
];

const RELATIONSHIP_PACKAGES = [
  {
    icon: Heart,
    name: "About Soulmate",
    desc: "เปิดไพ่ถามตอบ คำถามเกี่ยวกับเนื้อคู่",
    delivery: "ได้รับคำทำนายภายใน 1-2 วันนับจากที่ลงคิว",
    price: "THB 99.00",
  },
  {
    icon: Heart,
    name: "แฟนคนถัดไป",
    desc: "เปิดไพ่เจาะลึกแฟนคนถัดไปของคุณ\nที่คุณควรจะรู้",
    delivery: "ได้รับคำทำนายภายใน 2-3 วันนับจากที่ลงคิว",
    price: "THB 199.00",
  },
  {
    icon: Heart,
    name: "เนื้อคู่ของคุณ",
    desc: "เปิดไพ่เจาะลึกเนื้อคู่ของคุณ\nที่คุณควรจะรู้",
    delivery: "ได้รับคำทำนายภายใน 2-3 วันนับจากที่ลงคิว",
    price: "THB 299.00",
  },
  {
    icon: Heart,
    name: "4 คำถามความรัก",
    desc: "เปิดไพ่ 4 คำถามเจาะจงกับสถานการณ์ในเรื่องความรัก",
    delivery: "ได้รับคำทำนายภายใน 1-2 วันนับจากที่ลงคิว",
    price: "THB 109.00",
  },
];

const SPECIAL_PACKAGES = [
  {
    icon: Sparkles,
    name: "พื้นดวงแบบปังๆ",
    desc: "พื้นดวงด้วยไพ่ทาโรต์ ระยะเวลา 1 ปี ทั้งหมด 10 ด้าน (ตัวตน, เพื่อน, ลูกน้อง หรือลูก, คู่ครอง หรือเนื้อคู่, ฐานดวง, ฐานนิสัย, พ่อ, แม่, อาจารย์ หรือเจ้านาย) รับรองจุกแทบร้องไห้แน่นอน",
    delivery: "ได้รับคำทำนายภายใน 1-2 วันนับจากที่ลงคิว",
    price: "THB 222.00",
  },
  {
    icon: Sparkles,
    name: "อยากรู้แต่ไม่อยากถาม",
    desc: "ให้ไพ่บอกพลังงานโดยรวม (1-3 เดือนนี้) และวิธีแก้ไขยังไงให้ปังๆ ในช่วงนี้",
    delivery: "ได้รับคำทำนายภายใน 2-3 วันนับจากที่ลงคิว",
    price: "THB 139.00",
  },
  {
    icon: Sparkles,
    name: "ไพ่เล่าเรื่อง",
    desc: "เปิดไพ่เล่าเรื่องตามใจคุณ อยากให้พี่หมอเล่าเรื่องอะไร จัดมา",
    delivery: "ได้รับคำทำนายภายใน 2-3 วันนับจากที่ลงคิว",
    price: "THB 169.00",
  },
];

const CALLING_PACKAGES = [
  {
    icon: Video,
    name: "Video Call (Face) 30 Min",
    desc: "ดูดวงไม่จำกัด 30 นาทีแบบ Video Call เห็นไพ่ได้ เห็นไพ่อะไรพลาดไม่ได้เลย แบบจุกๆ เลยค่ะ",
    delivery: "",
    price: "THB 999.00",
  },
  {
    icon: Video,
    name: "Video Call (Card) 30 Min",
    desc: "ดูดวงไม่จำกัด 30 นาทีแบบ Video Call เห็นไพ่ได้ เห็นไพ่อะไรพลาดไม่ได้เลย แบบจุกๆ เลยค่ะ",
    delivery: "",
    price: "THB 666.00",
  },
  {
    icon: Phone,
    name: "Voice Call (No Face) 30 Min",
    desc: "ดูดวงไม่จำกัด 30 นาทีแบบโทร ดูจนกว่าจะจุกกันไปข้างนึง",
    delivery: "",
    price: "THB 333.00",
  },
  {
    icon: Phone,
    name: "Voice Call (No Face) 10 Min",
    desc: "ดูดวงไม่จำกัด 10 นาทีแบบโทร ดูจนกว่าจะจุกกันไปข้างนึง",
    delivery: "",
    price: "THB 222.00",
  },
];

type PackageCard = { icon: LucideIcon; name: string; desc: string; price: string; delivery?: string };

const SLUG_PACKAGES: Record<string, PackageCard[]> = {
  "qa-package": QA_PACKAGES,
  "relationship-package": RELATIONSHIP_PACKAGES,
  "special-package": SPECIAL_PACKAGES,
  "calling-package": CALLING_PACKAGES,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.short_desc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const lineMsg = `สวัสดีครับ/ค่ะ ขอจองคิวดูดวง "${service.name}" ค่ะ`;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/services" className="text-sm text-violet-700">
        ← กลับไปบริการทั้งหมด
      </Link>
      <div className="mt-6 rounded-2xl border border-gold/25 bg-[#121212] p-8 shadow-sm">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "หน้าแรก", item: siteCanonical("/") },
              { "@type": "ListItem", position: 2, name: "บริการดูดวง", item: siteCanonical("/services") },
              { "@type": "ListItem", position: 3, name: service.name },
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.short_desc,
            provider: { "@type": "Person", name: "พี่หมอ Turboztarot" },
          }}
        />
        <h1 className="mt-4 text-4xl font-bold">{service.name}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-foreground/80">
          {service.description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {SLUG_PACKAGES[slug] && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SLUG_PACKAGES[slug].map((p) => (
              <div
                key={p.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#1c1c1c] p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
                  <p.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-bold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-foreground/60">{p.desc}</p>
                {p.delivery === "" ? null : (
                  <p className="mt-2 text-xs text-foreground/50">{p.delivery ?? DELIVERY}</p>
                )}
                <p className="mt-auto pt-3 text-sm font-semibold text-foreground/90">{p.price}</p>
                <a
                  href={lineOaUrl(`สวัสดีครับ/ค่ะ ขอสอบถามรายละเอียดแพคเกจ "${p.name}" ครับ/ค่ะ`)}
                  className="mt-3 inline-flex items-center justify-center rounded-full border border-violet-300/50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                >
                  รายละเอียด
                </a>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 rounded-xl bg-violet-50 p-5 text-sm text-foreground/70">
          💡 การเลือกบริการบนเว็บไซต์นี้เป็นเพียงการแจ้งความสนใจ
          การจองจะสำเร็จเมื่อพี่หมอยืนยันผ่าน LINE แล้วเท่านั้น
        </div>
        <a
          href={lineOaUrl(lineMsg)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#06c755] px-6 py-3 font-semibold text-white transition hover:brightness-95"
        >
          จองคิวบริการนี้ผ่าน LINE
        </a>
      </div>
    </section>
  );
}
