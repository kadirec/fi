"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronsRight } from "lucide-react";

export function Shop() {
  return (
    <section
      id="shop"
      className="relative py-28 md:py-40 border-t border-black/10 bg-bone"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10 text-center flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic tracking-tight leading-[0.95] text-balance text-6xl md:text-8xl lg:text-9xl"
        >
          <span className="text-ink/15">coming</span>{" "}
          <span className="text-ink">soon</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 md:mt-14 max-w-3xl text-ink/75 text-lg leading-relaxed text-balance"
        >
          Hello! Our eagerly anticipated update is coming soon! We are excited to announce the
          upcoming launch of our shop section, filled with unique custom-designed products.
          Stay tuned, as we’ll be activating the shop section in the near future. Don’t miss
          out on exploring our latest offerings!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-ink/75 text-lg"
        >
          Thank you!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-12 md:mt-16"
        >
          <Link
            href="mailto:hello@fiartistry.com"
            className="group inline-flex items-center gap-2 text-ink text-lg border-b border-ink/60 pb-1 hover:text-gold hover:border-gold transition-colors"
          >
            learn more
            <ChevronsRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
