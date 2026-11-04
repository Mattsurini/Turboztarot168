"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function CarsCarousel({ services }: { services: Service[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const update = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".car");
    const w = card ? card.offsetWidth : el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (w + gap), behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="cars-rail">
      <div className="cars" ref={rail}>
        {services.map((s, i) => (
          <article className="car" key={s.id}>
            <span className="car__num">( {String(i + 1).padStart(3, "0")} )</span>
            <svg className="car__star" viewBox="0 0 64 64" aria-hidden="true">
              <use href="#em-star" transform="translate(32 34) scale(1.45)" />
            </svg>
            <h3 className="car__name">{s.name}</h3>
            <p className="car__detail">{s.short_desc}</p>
            <span className="car__price">{formatPrice(s.price)}</span>
            <Link className="car__btn" href={`/services/${s.slug}`}>
              รายละเอียด
            </Link>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="cars-arrow cars-arrow--prev"
        aria-label="เลื่อนก่อนหน้า"
        onClick={() => scrollByCard(-1)}
        disabled={atStart}
      >
        ←
      </button>
      <button
        type="button"
        className="cars-arrow cars-arrow--next"
        aria-label="เลื่อนถัดไป"
        onClick={() => scrollByCard(1)}
        disabled={atEnd}
      >
        →
      </button>
    </div>
  );
}
