"use client";

import { ReactNode } from "react";

export function SectionHeader({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <div className="text-[10px] uppercase tracking-widest2 text-gold/80 font-mono">
          .admin /
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight">{title}</h1>
        {hint && <p className="text-bone/50 text-sm mt-1">{hint}</p>}
      </div>
      {right}
    </div>
  );
}
