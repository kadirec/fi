"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Props {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, align = "left", className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-gold/90 font-mono">
        <span className="h-px w-8 bg-gold/60" />
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl md:text-6xl tracking-tight text-balance max-w-3xl">
        {title}
      </h2>
    </motion.div>
  );
}
