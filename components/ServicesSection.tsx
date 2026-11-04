"use client";

import * as React from "react";
import { Sparkles, Heart, Star, Phone } from "lucide-react";
import { formatPrice } from "@/lib/format";
import {
  ServiceCarousel,
  type Service as CardService,
} from "@/components/ui/services-card";

// Icons/gradients are component refs / class strings that cannot cross the
// server->client boundary, so the server passes serializable service fields
// here and we attach the brand mapping on the client.
const ICONS: Record<string, React.ElementType> = {
  "qa-package": Sparkles,
  "relationship-package": Heart,
  "special-package": Star,
  "calling-package": Phone,
};

const GRADIENTS: Record<string, string> = {
  "qa-package": "from-[#3a2a12] to-[#1a1208]",
  "relationship-package": "from-[#3a1a2a] to-[#1a0f16]",
  "special-package": "from-[#2a1a3a] to-[#160f1f]",
  "calling-package": "from-[#1a3a2a] to-[#0f1f16]",
};

export default function ServicesSection({
  items,
}: {
  items: { slug: string; name: string; short_desc: string; price: string }[];
}) {
  const services: CardService[] = items.map((s, i) => ({
    number: String(i + 1).padStart(3, "0"),
    title: s.name,
    description: s.short_desc,
    price: formatPrice(s.price),
    icon: ICONS[s.slug] ?? Sparkles,
    gradient: GRADIENTS[s.slug] ?? "from-[#3a2508] to-[#211405]",
    href: `/services/${s.slug}`,
  }));

  return <ServiceCarousel services={services} />;
}
