"use client";

import * as React from "react";
import { Sparkles, Heart, Star, Phone } from "lucide-react";
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
  "qa-package": "from-[#3a2508] to-[#211405]",
  "relationship-package": "from-[#45121c] to-[#250a10]",
  "special-package": "from-[#2b1a4a] to-[#150a26]",
  "calling-package": "from-[#0f3a2e] to-[#071f18]",
};

export default function ServicesSection({
  items,
}: {
  items: { slug: string; name: string; short_desc: string }[];
}) {
  const services: CardService[] = items.map((s, i) => ({
    number: String(i + 1).padStart(3, "0"),
    title: s.name,
    description: s.short_desc,
    icon: ICONS[s.slug] ?? Sparkles,
    gradient: GRADIENTS[s.slug] ?? "from-[#3a2508] to-[#211405]",
    href: `/services/${s.slug}`,
  }));

  return <ServiceCarousel services={services} />;
}
