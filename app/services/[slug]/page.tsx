import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/data";
import { lineOaUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { siteCanonical } from "@/lib/site";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

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
        กลับไปบริการทั้งหมด
      </Link>
      <div className="mt-6 rounded-2xl border border-gold/25 bg-panel p-8 shadow-sm">
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
        {service.price ? (
          <p className="mt-3 text-2xl font-bold text-newsred">{formatPrice(service.price)}</p>
        ) : null}
        <div className="mt-6 space-y-4 leading-relaxed text-foreground/80">
          {service.description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 rounded-full bg-violet-50 px-6 py-4 text-sm text-black">
          การเลือกบริการบนเว็บไซต์นี้เป็นเพียงการแจ้งความสนใจ
          การจองจะสำเร็จเมื่อพี่หมอยืนยันผ่าน LINE แล้วเท่านั้น
        </div>
        <a
          href={lineOaUrl(lineMsg)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-line px-6 py-3 font-semibold text-white transition-[filter] hover:brightness-95"
        >
          จองคิวดูดวงผ่าน LINE
        </a>
      </div>
    </section>
  );
}
