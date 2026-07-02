"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { WorkLightbox, LightboxWork } from "./work-lightbox";

export function Works() {
  const [works, setWorks] = useState<LightboxWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/works")
      .then((r) => r.json())
      .then((d) => setWorks((d.works ?? []).slice(0, 9)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="works" className="relative py-28 md:py-40 border-t border-ink-line bg-ink-soft/40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeading
            eyebrow=".works"
            title="Unique Stories Inspire: Custom Tattoo Designs"
          />
          <Link
            href="/works"
            className="group inline-flex items-center gap-2 text-bone hover:text-gold transition-colors self-start md:self-end"
          >
            <span className="text-[12px] uppercase tracking-widest2">view all .works</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="mt-12 md:mt-16">
          {loading ? (
            <div className="masonry">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bone/5"
                  style={{ aspectRatio: i % 2 === 0 ? "4/5" : "3/4" }}
                />
              ))}
            </div>
          ) : (
            <div className="masonry">
              {works.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.8,
                    delay: Math.min(i * 0.04, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    onClick={() => setActive(i)}
                    className="group relative block w-full overflow-hidden text-left"
                  >
                    <Image
                      src={w.imageUrl}
                      alt={w.title}
                      width={w.width}
                      height={w.height}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-auto object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                      <div className="font-display text-2xl">{w.title}</div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
