import { getServices } from "@/lib/data";
import { siteCanonical } from "@/lib/site";
import BookingWidget from "@/components/BookingWidget";
import JsonLd from "@/components/JsonLd";

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Turboztarot",
          url: siteCanonical("/"),
          description: "บริการดูดวงออนไลน์โดยพี่หมอ Turboztarot",
        }}
      />
      {/* Booking */}
      <section className="bg-gradient-to-br from-amber-50 to-violet-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">เช็คตารางคิว</h2>
          </div>
          <div className="mt-8">
            <BookingWidget services={services} />
          </div>
        </div>
      </section>
    </>
  );
}
