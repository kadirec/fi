"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { WorkLightbox, LightboxWork } from "./work-lightbox";

export function WorksCarousel() {
  const [works, setWorks] = useState<LightboxWork[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages] = useState(1);
  const railRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    fetch("/api/works?featured=true")
      .then((r) => r.json())
      .then(async (d) => {
        const items: LightboxWork[] = d.works ?? [];
        if (items.length) {
          setWorks(items);
        } else {
          const r2 = await fetch("/api/works").then((x) => x.json());
          setWorks((r2.works ?? []).slice(0, 8));
        }
      });
  }, []);

  const recompute = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const total = el.scrollWidth - el.clientWidth;
    if (total <= 0) {
      setPages(1);
      setActivePage(0);
      return;
    }
    const pageCount = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPages(pageCount);
    const p = Math.round((el.scrollLeft / total) * (pageCount - 1));
    setActivePage(p);
  }, []);

  useEffect(() => {
    recompute();
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => recompute();
    const onResize = () => recompute();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [recompute, works.length]);

  useEffect(() => {
    if (pages <= 1) return;
    const id = setInterval(() => {
      if (hoverRef.current) return;
      const el = railRef.current;
      if (!el) return;
      const total = el.scrollWidth - el.clientWidth;
      const next = activePage + 1 >= pages ? 0 : activePage + 1;
      el.scrollTo({
        left: (total / Math.max(1, pages - 1)) * next,
        behavior: "smooth",
      });
    }, 5000);
    return () => clearInterval(id);
  }, [pages, activePage]);

  function goTo(page: number) {
    const el = railRef.current;
    if (!el) return;
    const total = el.scrollWidth - el.clientWidth;
    el.scrollTo({
      left: (total / Math.max(1, pages - 1)) * page,
      behavior: "smooth",
    });
  }

  function nudge(dir: -1 | 1) {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  if (works.length === 0) return null;

  return (
    <section
      className="relative bg-bone text-ink pb-16 md:pb-24"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="relative">
          {/* arrows (desktop) */}
          <button
            aria-label="Previous"
            onClick={() => nudge(-1)}
            className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-ink/85 hover:bg-ink text-bone hover:text-gold border border-ink/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next"
            onClick={() => nudge(1)}
            className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-ink/85 hover:bg-ink text-bone hover:text-gold border border-ink/20"
          >
            <ChevronRight size={20} />
          </button>

          {/* rail */}
          <div
            ref={railRef}
            className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {works.map((w, i) => (
              <button
                key={w.id}
                onClick={() => setActive(i)}
                className="group relative shrink-0 snap-start basis-[70%] sm:basis-[44%] md:basis-[30%] lg:basis-[22%] aspect-[3/4] overflow-hidden bg-ink/5"
              >
                <Image
                  src={w.imageUrl}
                  alt={w.title}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 70vw"
                  className="object-cover transition-transform duration-[1.4s] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div className="font-display text-lg leading-none text-bone">{w.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* dots */}
        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activePage ? "bg-ink w-6" : "bg-ink/25 w-1.5 hover:bg-ink/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <WorkLightbox
        works={works}
        index={active}
        onClose={() => setActive(null)}
        onChange={setActive}
      />
    </section>
  );
}
