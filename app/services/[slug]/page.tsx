import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/data";
import { lineOaUrl, siteCanonical } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import JsonLd from "@/components/JsonLd";

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
    <>
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
      <section className="section section--dim">
        <div className="halo"></div>
        <div className="wrap">
          <Link className="detail-back" href="/services">
            กลับไปบริการทั้งหมด
          </Link>
          <div className="detail">
            <h1 className="detail__name">{service.name}</h1>
            {service.price ? <p className="detail__price">{formatPrice(service.price)}</p> : null}
            <div className="detail__rule" aria-hidden="true"></div>
            <div className="detail__body">
              {service.description
                .split("\n")
                .map((p, i) => (p ? <p key={i}>{p}</p> : <br key={i} />))}
            </div>
            {service.due ? <p className="detail__due">{service.due}</p> : null}
            <div className="detail__notice" role="note">
              การเลือกบริการบนเว็บไซต์นี้เป็นเพียงการแจ้งความสนใจ
              การจองจะสำเร็จเมื่อพี่หมอยืนยันผ่าน LINE แล้วเท่านั้น
            </div>
            <a
              className="btn btn--line detail__cta"
              href={lineOaUrl(lineMsg)}
            >
              จองคิวดูดวงผ่าน LINE
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
