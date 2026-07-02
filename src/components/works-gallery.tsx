"use client";

import { useState } from "react";
import Image from "next/image";
import { WorkLightbox, LightboxWork } from "./work-lightbox";

export function WorksGallery({ works }: { works: LightboxWork[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="masonry-4">
        {works.map((w, i) => (
          <button
            key={w.id}
            onClick={() => setActive(i)}
            className="group relative block w-full overflow-hidden text-left"
          >
            <Image
              src={w.imageUrl}
              alt={w.title}
              width={w.width}
              height={w.height}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-auto object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
              <div className="font-display text-2xl text-bone">{w.title}</div>
            </div>
          </button>
        ))}
      </div>

      <WorkLightbox
        works={works}
        index={active}
        onClose={() => setActive(null)}
        onChange={setActive}
      />
    </>
  );
}
