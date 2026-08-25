"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { OPEN_SPOTS } from "@/lib/guest";

export function Guest() {
  return (
    <section id="guest" className="relative py-28 md:py-40 border-t border-ink-line overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading
          eyebrow=".guest"
          title="On the road — bringing the studio to four cities."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-px bg-ink-line">
          {OPEN_SPOTS.map((spot, i) => (
            <motion.article
              key={spot.city}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="bg-ink p-8 md:p-12 group hover:bg-ink-soft transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-gold/90 mb-3">
                    <MapPin size={12} /> {spot.country}
                  </div>
                  <h3 className="font-display text-5xl md:text-6xl tracking-tight">
                    {spot.city}
                  </h3>
                  {spot.window && (
                    <p className="text-bone/60 text-sm mt-3">{spot.window}</p>
                  )}
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-bone/80">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inset-0 rounded-full bg-gold opacity-70" />
                      <span className="relative rounded-full h-2 w-2 bg-gold" />
                    </span>
                    Bookings are Open
                  </span>
                </div>
              </div>

              <a
                href="/booking"
                className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-bone/70 hover:text-gold transition-colors"
              >
                Reserve a slot →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
