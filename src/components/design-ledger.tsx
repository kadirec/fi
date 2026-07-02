"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Copy, Instagram, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { ReservationModal } from "./reservation-modal";

type Design = {
  id: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  status: "available" | "sold" | string;
  order: number;
};

const TABS = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "sold", label: "Sold" },
] as const;

type FilterKey = (typeof TABS)[number]["key"];

export function DesignLedger() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [active, setActive] = useState<number | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [dmDesign, setDmDesign] = useState<Design | null>(null);
  const [dmCopied, setDmCopied] = useState(false);

  useEffect(() => {
    fetch("/api/designs")
      .then((r) => r.json())
      .then((d) => setDesigns(d.designs ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? designs : designs.filter((d) => d.status === filter);

  const counts = {
    all: designs.length,
    available: designs.filter((d) => d.status === "available").length,
    sold: designs.filter((d) => d.status === "sold").length,
  };

  const dmMessage = dmDesign
    ? `Hi! I'm interested in #${String(dmDesign.order).padStart(2, "0")} "${dmDesign.title}" design.`
    : "";

  const copyAndOpen = useCallback(async () => {
    if (!dmDesign) return;
    try {
      await navigator.clipboard.writeText(dmMessage);
      setDmCopied(true);
    } catch {
      setDmCopied(false);
    }
    window.open(SITE.instagramDM, "_blank", "noopener,noreferrer");
  }, [dmDesign, dmMessage]);

  const justCopy = useCallback(async () => {
    if (!dmDesign) return;
    try {
      await navigator.clipboard.writeText(dmMessage);
      setDmCopied(true);
      setTimeout(() => setDmCopied(false), 2000);
    } catch {
      // ignored
    }
  }, [dmDesign, dmMessage]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => ((i ?? 0) + 1) % filtered.length);
      if (e.key === "ArrowLeft")
        setActive((i) => ((i ?? 0) - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, filtered.length]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "px-4 py-2 text-[11px] uppercase tracking-widest2 border transition-colors inline-flex items-center gap-2",
              filter === t.key
                ? "border-gold text-gold"
                : "border-bone/15 text-bone/60 hover:text-bone hover:border-bone/40"
            )}
          >
            {t.label}
            <span
              className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded",
                filter === t.key ? "bg-gold/15 text-gold" : "bg-bone/10 text-bone/60"
              )}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-bone/5 aspect-[4/5]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-line py-20 text-center">
          <p className="font-display text-2xl text-bone/70">The ledger is empty</p>
          <p className="mt-2 text-bone/40 text-sm">Designs will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => setActive(i)}
              className="group relative aspect-[4/5] overflow-hidden text-left bg-ink-soft"
            >
              <div
                className={cn(
                  "absolute inset-0",
                  d.status === "sold" && "grayscale"
                )}
              >
                <Image
                  src={d.imageUrl}
                  alt={d.title}
                  width={d.width}
                  height={d.height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                />
              </div>
              <span
                className={cn(
                  "absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-widest2 font-mono bg-ink/70 backdrop-blur-md border text-bone z-10",
                  d.status === "sold" ? "border-red-500/30" : "border-emerald-400/30"
                )}
              >
                {d.status === "sold" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                ) : (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                )}
                {d.status}
              </span>
              <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest2 font-mono text-bone/70 bg-ink/60 px-2 py-1 z-10">
                #{String(d.order).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="font-display text-lg">{d.title}</div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active !== null && filtered[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-5 right-5 text-bone/70 hover:text-bone"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X size={26} />
            </button>
            <button
              className="absolute left-4 md:left-8 text-bone/70 hover:text-bone"
              onClick={(e) => {
                e.stopPropagation();
                setActive((i) => ((i ?? 0) - 1 + filtered.length) % filtered.length);
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-4 md:right-8 text-bone/70 hover:text-bone"
              onClick={(e) => {
                e.stopPropagation();
                setActive((i) => ((i ?? 0) + 1) % filtered.length);
              }}
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={filtered[active].id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  filtered[active].status === "sold" && "grayscale"
                )}
                style={{
                  height: "min(78vh, 95vw * 800 / 566)",
                  aspectRatio: "566 / 800",
                }}
              >
                <Image
                  src={filtered[active].imageUrl}
                  alt={filtered[active].title}
                  fill
                  sizes="(max-width: 768px) 95vw, 60vh"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="mt-5 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone/40 mb-1">
                  #{String(filtered[active].order).padStart(2, "0")}
                </div>
                <div className="font-display text-3xl">{filtered[active].title}</div>
                {filtered[active].status === "sold" ? (
                  <p className="mt-3 text-bone/50 text-sm italic">
                    This piece has already found its place.
                  </p>
                ) : (
                  <>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => setReserveOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink hover:bg-bone text-[11px] uppercase tracking-widest2 transition-colors"
                      >
                        <Sparkles size={14} /> reserve on web
                      </button>
                      <button
                        onClick={() => {
                          setDmDesign(filtered[active]);
                          setDmCopied(false);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-widest2 text-white transition-opacity hover:opacity-90"
                        style={{
                          background:
                            "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        }}
                      >
                        <Instagram size={14} /> reserve on dm
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReservationModal
        design={active !== null ? filtered[active] ?? null : null}
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
      />

      <AnimatePresence>
        {dmDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setDmDesign(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md bg-ink border border-ink-line p-6 md:p-8 rounded-t-2xl md:rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest2 text-gold/80 font-mono mb-1">
                    reserve via dm
                  </div>
                  <h3 className="font-display text-2xl">{dmDesign.title}</h3>
                </div>
                <button
                  onClick={() => setDmDesign(null)}
                  aria-label="Close"
                  className="text-bone/60 hover:text-bone"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-2 relative">
                <pre className="bg-ink-soft border border-ink-line p-4 pr-12 text-sm text-bone whitespace-pre-wrap font-sans">
                  {dmMessage}
                </pre>
                <button
                  onClick={justCopy}
                  className={cn(
                    "absolute top-3 right-3 p-2 transition-colors",
                    dmCopied ? "text-emerald-400" : "text-bone/50 hover:text-gold"
                  )}
                  aria-label="copy message"
                >
                  {dmCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 justify-end">
                <button
                  onClick={() => setDmDesign(null)}
                  className="px-4 py-3 text-[11px] uppercase tracking-widest2 text-bone/60"
                >
                  cancel
                </button>
                <button
                  onClick={copyAndOpen}
                  className="inline-flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-widest2 text-white transition-opacity hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                >
                  <Instagram size={14} /> copy & open instagram
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
