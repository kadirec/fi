"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxWork = {
  id: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
};

export function WorkLightbox({
  works,
  index,
  onClose,
  onChange,
}: {
  works: LightboxWork[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % works.length);
      if (e.key === "ArrowLeft")
        onChange((index - 1 + works.length) % works.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, works.length, onClose, onChange]);

  return (
    <AnimatePresence>
      {index !== null && works[index] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
        >
          <button
            className="absolute top-5 right-5 text-bone/70 hover:text-bone"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={26} />
          </button>
          {works.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 text-bone/70 hover:text-bone"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange((index - 1 + works.length) % works.length);
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 md:right-8 text-bone/70 hover:text-bone"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange((index + 1) % works.length);
                }}
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <motion.div
            key={works[index].id}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={works[index].imageUrl}
              alt={works[index].title}
              width={works[index].width}
              height={works[index].height}
              sizes="(max-width: 768px) 90vw, 70vw"
              className="max-h-[78vh] w-auto object-contain"
              priority
            />
            <div className="mt-4 text-center">
              <div className="font-display text-2xl text-bone">{works[index].title}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone/40 mt-1">
                {index + 1} / {works.length}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
