"use client";

import { SectionHeader } from "./section-header";

export function ShopPanel() {
  return (
    <div>
      <SectionHeader title="Shop" hint="Inventory, prints and studio objects." />

      <div className="border border-ink-line p-8 md:p-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-gold/70 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-gold" />
          </span>
          <span className="text-[10px] uppercase tracking-widest2 text-gold/80 font-mono">
            in planning
          </span>
        </div>
        <h2 className="font-display text-3xl tracking-tight">Shop inventory — soon.</h2>
        <p className="mt-3 text-bone/60 max-w-md mx-auto text-sm">
          A product model, stock counters and order tracking will arrive here. Designed to
          plug into the same one-tap upload flow used for works and designs.
        </p>
      </div>
    </div>
  );
}
